import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_BASE = 'https://checksheets.cscprof.com'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') ?? '')
  const user  = ref(JSON.parse(localStorage.getItem('user') ?? 'null'))

  function authHeaders() {
    return { 'x-token': token.value }
  }

  async function login(username, password) {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      body:   formData
    })
    if (!res.ok) throw new Error((await res.json()).message ?? 'Login failed')
    const data = await res.json()

    const userData = Array.isArray(data) ? data[0] : data

    token.value = userData.user_guid
    user.value  = userData
    localStorage.setItem('token', userData.user_guid)
    localStorage.setItem('user',  JSON.stringify(userData))
  }

  async function logout() {
    await fetch(`${API_BASE}/auth/logout`, { headers: authHeaders() }).catch(() => {})
    token.value = ''
    user.value  = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  async function changePassword(username, currentPassword, newPassword) {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', newPassword)

    const res = await fetch(`${API_BASE}/auth/password_reset`, {
      method:  'POST',
      headers: authHeaders(),
      body:    formData
    })
    if (!res.ok) throw new Error((await res.json()).message ?? 'Password change failed')
  }

  return { token, user, login, logout, changePassword, authHeaders }
})