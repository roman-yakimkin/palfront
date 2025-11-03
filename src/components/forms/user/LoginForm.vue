<template>
  <v-form @submit.prevent="onSubmit">
    <v-text-field
      v-model="email"
      label="Email"
      :error-messages="errors.email"
      @input="clearError('email')"
    />
    <v-text-field
      v-model="password"
      type="password"
      label="Пароль"
      :error-messages="errors.password"
    />
    <v-btn type="submit" :loading="loading">Войти</v-btn>
  </v-form>
</template>

<script lang="ts">
export default {
  name: 'LoginForm',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    errors: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    onSubmit() {
      // Локальная валидация
      const errors = {}
      if (!this.email) errors.email = 'Обязательно'
      if (!this.password) errors.password = 'Обязательно'

      if (Object.keys(errors).length > 0) {
        this.$emit('validation-error', errors)
        return
      }

      // Эмитим данные — больше ничего не делаем!
      this.$emit('submit', { email: this.email, password: this.password })
    },
    clearError(field) {
      this.$emit('clear-error', field)
    },
  },
}
</script>

<style scoped></style>
