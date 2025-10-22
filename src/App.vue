<template>
  <v-responsive class="border rounded">
    <v-app>
      <v-app-bar title="App bar"></v-app-bar>

      <v-navigation-drawer>
        <v-list>
          <v-list-item title="Navigation drawer"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <v-container>
          <country-list />
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>

<script setup lang="ts">
import CountryList from '@/components/admin/CountryList.vue'
</script>

<style scoped></style>
