import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_BASE = 'placeholder'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') ?? '')
  const user  = ref(JSON.parse(localStorage.getItem('user') ?? 'null'))

  function authHeaders() {
    return { 'x-token': token.value, 'Content-Type': 'application/json' }
  }

  async function login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ username, password })
    })
    if (!res.ok) throw new Error((await res.json()).message ?? 'Login failed')
    const data = await res.json()
    token.value = data.token
    user.value  = data.user
    localStorage.setItem('token', data.token)
    localStorage.setItem('user',  JSON.stringify(data.user))
  }

  async function logout() {
    await fetch(`${API_BASE}/auth/logout`, { headers: authHeaders() }).catch(() => {})
    token.value = ''
    user.value  = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  async function changePassword(username, currentPassword, newPassword) {
    const res = await fetch(`${API_BASE}/auth/password_reset`, {
      method:  'POST',
      headers: authHeaders(),
      body:    JSON.stringify({ username, password: newPassword, token: token.value })
    })
    if (!res.ok) throw new Error((await res.json()).message ?? 'Password change failed')
  }

  return { token, user, login, logout, changePassword, authHeaders }
})