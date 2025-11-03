<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="4" rounded="lg">
          <v-card-title class="text-h5 text-center"> Подтверждение email </v-card-title>

          <v-card-text>
            <div class="text-body-1 text-center mb-4">
              <template v-if="status === 'idle'"> Подтверждаем ваш email... </template>
              <template v-else-if="status === 'loading'">
                <v-progress-circular indeterminate color="primary" class="mb-2" />
                <div>Отправляем запрос...</div>
              </template>
              <template v-else-if="status === 'success'">
                <v-icon color="success" size="x-large">mdi-check-circle-outline</v-icon>
                <div class="font-weight-bold mt-2">Email успешно подтверждён!</div>
                <div class="text-grey mt-1">Теперь вы можете войти в аккаунт.</div>
              </template>
              <template v-else-if="status === 'error'">
                <v-icon color="error" size="x-large">mdi-alert-circle-outline</v-icon>
                <div class="font-weight-bold mt-2">Ошибка подтверждения</div>
                <div class="text-error mt-1">{{ errorMessage }}</div>
              </template>
            </div>

            <v-alert v-if="status === 'success'" type="info" variant="tonal" class="mt-4">
              Если вы не видите автоматического перехода, нажмите кнопку ниже.
            </v-alert>
          </v-card-text>

          <v-card-actions>
            <v-spacer />

            <v-btn v-if="status === 'success'" color="primary" @click="goToLogin"> Войти </v-btn>

            <v-btn v-else-if="status === 'error'" color="secondary" @click="retry">
              Повторить
            </v-btn>

            <v-btn
              v-else-if="status === 'idle'"
              color="primary"
              @click="verifyEmail"
              :disabled="!token"
            >
              Подтвердить
            </v-btn>

            <v-btn outlined @click="$router.push('/')"> На главную </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { useAuthStore } from '@/stores/auth'
export default {
  name: 'ConfirmEmailView',
  data() {
    return {
      token: null,
      status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
      errorMessage: '',
    }
  },
  created() {
    this.token = this.$route.query.token
    if (this.token) {
      // Автоматически запускаем подтверждение при загрузке
      this.verifyEmail()
    } else {
      this.status = 'error'
      this.errorMessage = 'Токен не указан. Проверьте ссылку из письма.'
    }
  },
  methods: {
    async verifyEmail() {
      if (!this.token) return

      this.status = 'loading'
      this.errorMessage = ''

      try {
        const authStore = useAuthStore()
        await authStore.verifyEmail(this.token)

        this.status = 'success'
        this.errorMessage = ''

        // Автоматический переход через 2 секунды
        setTimeout(() => {
          this.goToLogin()
        }, 2000)
      } catch (error) {
        this.status = 'error'
        if (error.response?.status === 400) {
          this.errorMessage = 'Неверный или просроченный токен.'
        } else if (error.response?.status === 409) {
          this.errorMessage = 'Этот email уже подтверждён.'
        } else {
          this.errorMessage = 'Не удалось подтвердить email. Попробуйте позже.'
        }
      }
    },

    retry() {
      this.verifyEmail()
    },

    goToLogin() {
      this.$router.push({ name: 'login' })
    },
  },
}
</script>

<style scoped></style>
