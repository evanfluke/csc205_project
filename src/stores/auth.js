import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_BASE = 'https://your-ec2-url-here.com'  // replace

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') ?? '')
  const user  = ref(JSON.parse(localStorage.getItem('user') ?? 'null'))

  function authHeaders() {
    return { 'Authorization': `Bearer ${token.value}`, 'Content-Type': 'application/json' }
  }

  async function login(username, password) {
    const res  = await fetch(`${API_BASE}/login`, {
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
    await fetch(`${API_BASE}/logout`, { headers: authHeaders() }).catch(() => {})
    token.value = ''
    user.value  = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  async function changePassword(username, currentPassword, newPassword) {
    const res = await fetch(`${API_BASE}/change-password`, {
      method:  'POST',
      headers: authHeaders(),
      body:    JSON.stringify({ username, currentPassword, newPassword })
    })
    if (!res.ok) throw new Error((await res.json()).message ?? 'Change failed')
  }

  return { token, user, login, logout, changePassword, authHeaders }
})