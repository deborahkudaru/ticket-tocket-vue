import { ref, computed } from 'vue'
import { AuthAPI } from '../service/api'

const session = ref(AuthAPI.getSession())

export function useAuthProvider() {
  const setSession = (s) => {
    session.value = s
  }

  const login = async (creds) => {
    const s = await AuthAPI.login(creds)
    setSession(s)
    return s
  }

  const signup = async (data) => {
    const s = await AuthAPI.signup(data)
    setSession(s)
    return s
  }

  const logout = async () => {
    await AuthAPI.logout()
    session.value = null
  }

  const isAuthenticated = computed(() => !!session.value)

  return {
    session,
    login,
    signup,
    logout,
    isAuthenticated
  }
}
