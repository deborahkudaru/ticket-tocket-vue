const SESSION_KEY = "ticketapp_session";
const TICKETS_KEY = "ticketapp_tickets";
const USERS_KEY = "ticketapp_users";

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

function readTickets() {
  try {
    const raw = localStorage.getItem(TICKETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeTickets(list) {
  localStorage.setItem(TICKETS_KEY, JSON.stringify(list));
}

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeUsers(list) {
  localStorage.setItem(USERS_KEY, JSON.stringify(list));
}

export const AuthAPI = {
  async signup({ name, email, password }) {
    await delay();

    if (!email.includes("@")) throw { message: "Invalid credentials" };
    if (!password || password.length < 3) throw { message: "Password too short" };

    const users = readUsers();
    if (users.find((u) => u.email === email))
      throw { message: "Email already exists" };

    const token = "sess_" + Math.random().toString(36).slice(2);
    const user = { id: "u_" + Date.now(), name, email, password };
    users.push(user);
    writeUsers(users);

    const session = {
      token,
      user: { id: user.id, name, email },
      exp: Date.now() + 1000 * 60 * 60 * 24,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  async login({ email, password }) {
    await delay();

    if (!email.includes("@")) throw { message: "Invalid credentials" };

    const users = readUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) throw { message: "Invalid credentials" };

    const token = "sess_" + Math.random().toString(36).slice(2);
    const session = {
      token,
      user: { id: user.id, name: user.name, email },
      exp: Date.now() + 1000 * 60 * 60 * 24,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  async logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  getSession() {
    try {
      const s = localStorage.getItem(SESSION_KEY);
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  },
};

export const TicketAPI = {
  async list() {
    await delay();
    if (Math.random() < 0.02)
      throw { message: "Failed to load tickets. Please retry." };
    return readTickets();
  },

  async create(ticket) {
    await delay();

    if (!ticket.title || !ticket.status)
      throw { message: "Validation error" };

    const list = readTickets();
    const newTicket = {
      ...ticket,
      id: "t_" + Date.now(),
      createdAt: Date.now(),
    };
    list.unshift(newTicket);
    writeTickets(list);
    return newTicket;
  },

  async update(id, patch) {
    await delay();

    const list = readTickets();
    const i = list.findIndex((t) => t.id === id);
    if (i === -1) throw { message: "Ticket not found" };

    list[i] = { ...list[i], ...patch, updatedAt: Date.now() };
    writeTickets(list);
    return list[i];
  },

  async remove(id) {
    await delay();

    let list = readTickets();
    list = list.filter((t) => t.id !== id);
    writeTickets(list);
    return { success: true };
  },
};
