<template>
  <v-responsive class="border rounded">
    <v-app>
      <v-app-bar title="Панель администратора"></v-app-bar>

      <v-navigation-drawer permanent width="300">
        <v-list>
          <template v-if="!isAuthenticated">
            <v-list-item :to="{ name: 'login' }" title="Войти" link prepend-icon="mdi-login" />
            <v-list-item
              :to="{ name: 'register' }"
              title="Зарегистрироваться"
              link
              prepend-icon="mdi-account-plus"
            />
          </template>
          <template v-else>
            <v-list-item
              :to="{ name: 'edit-profile' }"
              title="user?.name || 'Профиль'"
              link
              prepend-icon="mdi-account"
            />
            <v-list-item
              :to="{ name: 'logout' }"
              prepend-icon="mdi-logout"
              title="Выйти"
            ></v-list-item>
          </template>
        </v-list>
        <v-list>
          <v-list-item
            v-for="item in menuItems"
            :key="item.key"
            :title="item.title"
            @click="currentView = item.key"
            :variant="currentView === item.key ? 'tonal' : 'text'"
          />
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <v-container>
          <component :is="CurrentComponent" />
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>

<script lang="ts">
import { useAuthStore } from '@/stores/auth'
import { defineAsyncComponent } from 'vue'
import { mapState } from 'pinia'

const AsyncCountryList = defineAsyncComponent(() => import('@/components/admin/CountryList.vue'))
const AsyncRegionList = defineAsyncComponent(() => import('@/components/admin/RegionList.vue'))
const AsyncUserList = defineAsyncComponent(() => import('@/components/admin/UserList.vue'))

export default {
  name: 'MainLayout',
  data() {
    return {
      currentView: 'countries',
      menuItems: [
        { key: 'countries', title: 'Страны' },
        { key: 'regions', title: 'Регионы' },
        { key: 'users', title: 'Пользователи' },
      ],
    }
  },
  computed: {
    CurrentComponent() {
      switch (this.currentView) {
        case 'countries':
          return AsyncCountryList
        case 'regions':
          return AsyncRegionList
        case 'users':
          return AsyncUserList
        default:
          return AsyncCountryList
      }
    },
    ...mapState(useAuthStore, ['isAuthenticated', 'user']),
  },
  async mounted() {
    const authStore = useAuthStore()
    await authStore.fetchUser()
  },
}
</script>

<style scoped></style>
