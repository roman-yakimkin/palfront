<template>
  <v-form @submit.prevent="onSubmit" ref="form">
    <v-text-field
      v-model="username"
      label="Имя пользователя"
      :rules="[rules.required, rules.username]"
      :disabled="loading"
      variant="outlined"
    />

    <v-text-field
      v-model="email"
      label="Email"
      type="email"
      :rules="[rules.required, rules.email]"
      :disabled="loading"
      variant="outlined"
    />

    <v-text-field
      v-model="password"
      label="Пароль"
      type="password"
      :rules="[rules.required, rules.passwordLength]"
      :disabled="loading"
      variant="outlined"
    />

    <v-text-field
      v-model="passwordConfirm"
      label="Подтверждение пароля"
      type="password"
      :rules="[rules.required, () => rules.passwordsMatch(password, passwordConfirm)]"
      :disabled="loading"
      variant="outlined"
    />

    <v-alert v-if="serverError" type="error" variant="tonal" class="mb-4">
      {{ serverError }}
    </v-alert>

    <v-btn type="submit" color="primary" :loading="loading" :disabled="loading" block size="large">
      Зарегистрироваться
    </v-btn>
  </v-form>
</template>

<script lang="ts">
import { validationRules } from '@/utils/validationRules'

export default {
  name: 'RegisterForm',
  props: {
    loading: { type: Boolean, default: false },
    serverError: { type: String, default: '' },
  },
  data() {
    return {
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
      rules: validationRules,
    }
  },
  methods: {
    onSubmit() {
      const { valid } = this.$refs.form.validate()
      if (!valid) return

      this.$emit('submit', {
        username: this.username,
        email: this.email,
        password: this.password,
      })
    },
  },
}
</script>

<style scoped></style>
