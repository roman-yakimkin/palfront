<template>
  <v-responsive class="border rounded">
    <v-app>
      <v-app-bar title="App bar"></v-app-bar>

      <v-navigation-drawer permanent width="300">
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
          <component :is="views[currentView]" />
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>

<script setup lang="ts">
import { defineAsyncComponent, markRaw, ref } from 'vue'

const views = {
  countries: markRaw(defineAsyncComponent(() => import('@/components/admin/CountryList.vue'))),
  regions: markRaw(defineAsyncComponent(() => import('@/components/admin/RegionList.vue'))),
  users: markRaw(defineAsyncComponent(() => import('@/components/admin/UserList.vue'))),
}

const currentView = ref('countries')

const menuItems = [
  { key: 'countries', title: 'Страны' },
  { key: 'regions', title: 'Регионы' },
  { key: 'users', title: 'Пользователи' },
]
</script>

<style scoped></style>
