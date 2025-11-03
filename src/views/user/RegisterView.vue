<template>
  <RegisterForm :loading="loading" :server-error="serverError" @submit="handleRegister" />
</template>

<script lang="ts">
import RegisterForm from '@/components/forms/user/RegisterForm.vue'
import { useAuthStore } from '@/stores/auth'

export default {
  components: { RegisterForm },
  name: 'RegisterView',
  data() {
    return {
      loading: false,
      serverError: '',
    }
  },
  methods: {
    async handleRegister(credentials) {
      this.loading = true
      this.serverError = ''

      try {
        const authStore = useAuthStore()
        await authStore.register(credentials)

        this.$router.push({
          name: 'verify-email',
          query: { email: credentials.email },
        })
      } catch (error) {
        console.error('Registration failed:', error)

        console.error('Registration failed:', error)

        if (error.response?.status === 409) {
          this.serverError = 'Этот email уже зарегистрирован'
        } else if (error.response?.data?.error) {
          this.serverError = error.response.data.error
        } else {
          this.serverError = 'Не удалось зарегистрироваться. Попробуйте позже.'
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped></style>
