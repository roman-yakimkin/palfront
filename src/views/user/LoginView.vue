<template>
  <LoginForm
    :loading="loading"
    :errors="formErrors"
    @submit="handleLogin"
    @clear-error="clearErrors"
  />
</template>

<script lang="ts">
import LoginForm from '@/components/forms/user/LoginForm.vue'
import { useAuthStore } from '@/stores/auth'

export default {
  components: { LoginForm },
  name: 'LoginView',
  data() {
    return {
      loading: false,
      formErrors: {},
    }
  },
  methods: {
    async handleLogin(credentials) {
      this.loading = true
      const authStore = useAuthStore()
      try {
        await authStore.login(credentials)
        this.$router.push({
          name: 'home',
        })
      } catch (error) {
        if (error.code === 'INVALID_CREDENTIALS') {
          this.formErrors = { password: 'Неверный email или пароль' }
        } else {
          this.formErrors = { general: 'Ошибка сервера' }
        }
      } finally {
        this.loading = false
      }
    },
    clearErrors() {},
  },
  mounted() {},
}
</script>

<style scoped></style>
