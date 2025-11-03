import { defineStore } from 'pinia'
import { API_BASE_URL } from '@/config.ts'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    initialized: false, // чтобы знать, завершилась ли проверка сессии
  }),

  getters: {
    isAuthenticated: (state) => state.user !== null,
    currentUser: (state) => state.user,
  },

  actions: {
    async fetchUser() {
      try {
        const res = await fetch(`${API_BASE_URL}/users/me`, {
          credentials: 'include',
        })
        if (res.ok) {
          this.user = await res.json()
        } else {
          this.user = null
        }
      } catch {
        this.user = null
      } finally {
        this.initialized = true
      }
    },

    async register(credentials) {
      const res = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })
      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error.message || 'Ошибка регистрации')
      }
    },

    async login(credentials) {
      const res = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })
      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error.message || 'Ошибка входа')
      }
      await this.fetchUser() // обновляем данные пользователя
    },

    async logout() {
      await fetch(`${API_BASE_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      this.user = null
    },

    async verifyEmail(token) {
      const res = await fetch(`${API_BASE_URL}/users/verify-email`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token,
        }),
      })

      return res.data
    },
  },
})
