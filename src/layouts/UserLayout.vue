<template>
  <v-container>
    <v-row>
      <!-- Боковое или верхнее меню -->
      <v-col cols="12" md="3">
        <v-list>
          <v-list-item
            v-if="!isAuthenticated"
            :to="{ name: 'login' }"
            :class="{ 'font-weight-bold': $route.name === 'login' }"
          >
            <v-list-item-title>Войти</v-list-item-title>
          </v-list-item>

          <v-list-item
            v-if="!isAuthenticated"
            :to="{ name: 'register' }"
            :class="{ 'font-weight-bold': $route.name === 'register' }"
          >
            <v-list-item-title>Регистрация</v-list-item-title>
          </v-list-item>

          <v-list-item
            v-if="!isAuthenticated"
            :to="{ name: 'resend-confirmation' }"
            :class="{ 'font-weight-bold': $route.name === 'resend-confirmation' }"
          >
            <v-list-item-title>Повторить подтверждение</v-list-item-title>
          </v-list-item>

          <v-list-item
            v-if="isAuthenticated"
            :to="{ name: 'edit-profile' }"
            :class="{ 'font-weight-bold': $route.name === 'edit-profile' }"
          >
            <v-list-item-title>Редактировать профиль</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="isAuthenticated" @click="logout">
            <v-list-item-title>Выйти</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-col>

      <!-- Контент текущей страницы -->
      <v-col cols="12" md="9">
        <router-view />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { useAuthStore } from '@/stores/auth'
import { mapActions, mapState } from 'pinia'

export default {
  name: 'UserLayout',
  computed: {
    ...mapState(useAuthStore, ['isAuthenticated']),
  },
  methods: {
    ...mapActions(useAuthStore, ['logout']),
  },
}
</script>

<style scoped></style>
