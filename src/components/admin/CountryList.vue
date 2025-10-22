<template>
  <v-card>
    <v-card-title>
      Страны
      <v-spacer />
      <v-btn color="primary" @click="openCreateDialog">Добавить</v-btn>
    </v-card-title>

    <v-table>
      <thead>
        <tr>
          <th>Код</th>
          <th>Название</th>
          <th>Регионы</th>
          <th>Действия</th>
        </tr>
      </thead>
      <draggable
        v-model="countries"
        item-key="id"
        tag="tbody"
        handle=".drag-handle"
        :animation="150"
        @end="onDragEnd"
      >
        <template #item="{ element }">
          <tr>
            <td>
              <v-icon size="small" class="drag-handle mr-2">mdi-drag</v-icon>
              {{ element.id }}
            </td>
            <td>{{ element.name }}</td>
            <td>
              <v-icon v-if="element.has_regions" icon="mdi-check-bold" />
            </td>
            <td>
              <v-btn icon="mdi-pencil" @click="openEditDialog(element)" />
              <v-btn icon="mdi-delete" @click="confirmDelete(element)" />
            </td>
          </tr>
        </template>
      </draggable>
    </v-table>

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

    <v-snackbar
      v-model="snackbar"
      :timeout="2000"
      color="success"
      location="top"
      class="centered-snackbar"
    >
      {{ notifyMessage }}
    </v-snackbar>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import draggable from 'vuedraggable'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
const countries = ref([])
const loading = ref(false)
const dialog = ref(false)
const deleteDialog = ref(false)
const editing = ref(false)
const deletingItem = ref(null)
const errorMessage = ref('')
const snackbar = ref(false)
const notifyMessage = ref('')

const form = ref({
  id: '',
  name: '',
  has_regions: false,
  weight: 0,
})

const openCreateDialog = () => {
  editing.value = false
  form.value = { id: '', name: '', has_regions: false, weight: 0 }
  dialog.value = true
}

const openEditDialog = (item) => {
  editing.value = true
  form.value = { ...item }
  dialog.value = true
}

const save = async () => {
  loading.value = true
  const payload = {
    id: form.value.id,
    name: form.value.name,
    has_regions: form.value.has_regions,
    weight: form.value.weight,
  }

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
    clearError()
  } catch (err) {
    setError(err)
    countries.value = []
  } finally {
    loading.value = false
  }
}

const onDragEnd = () => {
  orderCountries()
}

const orderCountries = async () => {
  try {
    const order = countries.value.map((item) => item.id)
    const response = await axios.post(`${API_BASE_URL}/countries/order`, { order })
    await loadCountries()

    clearError()
    notifyMessage.value = response.data.message
    snackbar.value = true
  } catch (err) {
    setError(err)
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

<style scoped>
.drag-handle {
  cursor: move;
}
.centered-snackbar :deep(.v-snackbar__content) {
  text-align: center;
}
</style>
