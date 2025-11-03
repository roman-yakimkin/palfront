<template>
  <v-form @submit.prevent="handleSubmit">
    <v-text-field
      v-model="form.email"
      label="Email"
      type="email"
      :rules="[rules.required, rules.email]"
      variant="outlined"
    ></v-text-field>

    <v-btn type="submit" color="primary" block :loading="loading">
      Прислать письмо с подтверждением
    </v-btn>
  </v-form>
</template>

<script lang="ts">
import { validationRules } from '@/utils/validationRules'
import { API_BASE_URL } from '@/config.ts'

export default {
  name: 'UserVerifyEmail',
  data() {
    return {
      form: {
        email: '',
      },
      loading: false,
      success: false,
      error: '',
    }
  },
  computed: {
    rules() {
      return {
        email: validationRules.email,
        required: validationRules.required,
      }
    },
  },
  methods: {
    async handleSubmit() {
      this.loading = true
      this.success = false

      try {
        const response = await fetch(`${API_BASE_URL}/users/resend-verification`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.form.email,
          }),
        })

        if (response.ok) {
          this.success = true
        } else {
          const data = await response.json().catch(() => ({}))
          this.error = data.message || 'Ссылка недействительна или устарела'
        }
      } catch (err) {
        this.error = 'Не удалось подключиться к серверу'
        console.error('Verify email error:', err)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped></style>
