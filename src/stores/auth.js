import { defineStore } from "pinia";
import { AuthAPI } from "../service/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    session: AuthAPI.getSession(),
  }),

  actions: {
    async signup(payload) {
      const session = await AuthAPI.signup(payload);
      this.session = session;
    },

    async login(payload) {
      const session = await AuthAPI.login(payload);
      this.session = session;
    },

    async logout() {
      await AuthAPI.logout();
      this.session = null;
    },
  },
});
