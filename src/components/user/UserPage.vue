<template>
  <v-card>
    <v-card-title>Пользователь</v-card-title>
    <div v-if="authStore.isAuthenticated">
      Привет, {{ authStore.currentUser?.username }}
      <v-btn @click="authStore.logout()">Выйти</v-btn>
    </div>
    <LoginForm v-if="!authStore.isAuthenticated" />
    <RegisterForm v-if="!authStore.isAuthenticated" />
    <VerifyEmailForm v-if="!authStore.isAuthenticated" />
  </v-card>
</template>

<script setup lang="ts">
import LoginForm from '@/components/forms/user/LoginForm.vue'
import { useAuthStore } from '@/stores/auth'
import RegisterForm from '@/components/forms/user/RegisterForm.vue'
import VerifyEmailForm from '@/components/forms/user/VerifyEmailForm.vue'

const authStore = useAuthStore()
</script>

<style scoped></style>
