<template>
  <v-card>
    <v-card-title>
      Страны
      <v-spacer />
      <v-btn color="primary" @click="openCreateDialog">Добавить</v-btn>
    </v-card-title>

    <v-data-table :headers="headers" :items="countries" :loading="loading" hide-default-footer>
      <template v-slot:item.has_regions="{ item }">
        <v-icon v-if="item.has_regions" icon="mdi-check-bold" />
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon="mdi-pencil" @click="openEditDialog(item)" />
        <v-btn icon="mdi-delete" @click="confirmDelete(item)" />
      </template>
    </v-data-table>

    <!-- Dialog for Create/Edit -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>{{ editing ? 'Изменить страну' : 'Добавить страну' }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="form.id" label="Код" required />
          <v-text-field v-model="form.name" label="Название" required />
          <v-checkbox v-model="form.has_regions" label="Регионы" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog = false">Отмена</v-btn>
          <v-btn color="primary" @click="save">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete confirmation -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Удаление страны</v-card-title>
        <v-card-text>Вы действительно хотите удалить страну"{{ deletingItem?.name }}"?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteDialog = false">Нет</v-btn>
          <v-btn color="error" @click="deleteEntity">Да</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-alert
      v-if="errorMessage"
      type="error"
      class="mt-4"
      closable
      @click:close="errorMessage = ''"
    >
      {{ errorMessage }}
    </v-alert>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '../../config'

const headers = [
  { title: 'Код', key: 'id' },
  { title: 'Название', key: 'name' },
  { title: 'Регионы', key: 'has_regions' },
  { title: 'Действия', key: 'actions', sortable: false },
]

const countries = ref([])
const loading = ref(false)
const dialog = ref(false)
const deleteDialog = ref(false)
const editing = ref(false)
const deletingItem = ref(null)
const errorMessage = ref('')

const form = ref({
  id: '',
  name: '',
  has_regions: false,
})

const openCreateDialog = () => {
  editing.value = false
  form.value = { id: '', name: '', has_regions: false }
  dialog.value = true
}

const openEditDialog = (item) => {
  editing.value = true
  form.value = { ...item }
  dialog.value = true
}

const save = async () => {
  loading.value = true
  const payload = { id: form.value.id, name: form.value.name, has_regions: form.value.has_regions }

  try {
    if (editing.value) {
      await axios.put(`${API_BASE_URL}/countries/${form.value.id}`, payload)
    } else {
      await axios.post(`${API_BASE_URL}/countries`, payload)
    }
    await loadCountries()
    dialog.value = false
    clearError()
  } catch (err) {
    setError(err)
  } finally {
    loading.value = false
  }
}

const confirmDelete = (item) => {
  deletingItem.value = item
  deleteDialog.value = true
}

const deleteEntity = async () => {
  loading.value = true
  try {
    await axios.delete(`${API_BASE_URL}/countries/${deletingItem.value.id}`)
    await loadCountries()
    deleteDialog.value = false
    clearError()
  } catch (err) {
    setError(err)
  } finally {
    loading.value = false
  }
}

const loadCountries = async () => {
  loading.value = true
  try {
    const response = await axios.get(`${API_BASE_URL}/countries`)
    countries.value = response.data.items

    console.log(countries.value)
    clearError()
  } catch (err) {
    setError(err)
    countries.value = []
  } finally {
    loading.value = false
  }
}

const setError = (err) => {
  if (axios.isAxiosError(err)) {
    if (err.response) {
      // Сервер ответил с кодом вне 2xx
      errorMessage.value = `Ошибка ${err.response.status}: ${err.response.data?.message || err.response.statusText || 'Неизвестная ошибка'}`
    } else if (err.request) {
      // Запрос был сделан, но ответа нет (например, CORS, таймаут)
      errorMessage.value =
        'Нет ответа от сервера. Проверьте работу сервера на http://localhost:8080?'
    } else {
      // Ошибка при настройке запроса
      errorMessage.value = 'Ошибка при настройке запроса: ' + err.message
    }
  } else {
    // Не Axios ошибка
    errorMessage.value = 'Неожиданная ошибка: ' + (err.message || String(err))
  }
}

const clearError = () => {
  errorMessage.value = ''
}

onMounted(loadCountries)
</script>

<style scoped></style>
