<template>
  <v-app>
    <!-- 頂部導航列 -->
    <v-app-bar color="primary" elevation="2">
      <v-app-bar-title class="font-weight-bold d-flex align-center">
        <v-icon icon="mdi-checkbox-marked-circle-outline" class="mr-2" />
        Vue 3 + Vuetify + NestJS + PostgreSQL Demo
      </v-app-bar-title>

      <v-spacer />

      <v-btn
        icon="mdi-theme-light-dark"
        variant="text"
        title="切換主題"
        @click="toggleTheme"
      />
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <v-container class="py-8" style="max-width: 900px;">
        <!-- 架構說明卡片 -->
        <v-card class="mb-6" elevation="2" border>
          <v-card-item>
            <template #prepend>
              <v-icon icon="mdi-server-network" color="primary" size="large" />
            </template>
            <v-card-title class="text-h6 font-weight-bold">系統架構狀態</v-card-title>
            <v-card-subtitle>全端即時整合展示</v-card-subtitle>
          </v-card-item>

          <v-divider />

          <v-card-text>
            <v-row dense>
              <v-col cols="12" sm="4">
                <v-chip color="success" variant="tonal" class="w-100 justify-start" size="large">
                  <v-icon icon="mdi-vuejs" start />
                  前端: Vue 3 + Vuetify
                </v-chip>
              </v-col>
              <v-col cols="12" sm="4">
                <v-chip color="info" variant="tonal" class="w-100 justify-start" size="large">
                  <v-icon icon="mdi-nodejs" start />
                  後端: NestJS (TypeScript)
                </v-chip>
              </v-col>
              <v-col cols="12" sm="4">
                <v-chip color="primary" variant="tonal" class="w-100 justify-start" size="large">
                  <v-icon icon="mdi-database" start />
                  DB: Docker PostgreSQL
                </v-chip>
              </v-col>
            </v-row>
            <div class="mt-3 text-caption text-medium-emphasis">
              🐳 容器映像: <code>postgres@sha256:266d3c25...</code>
            </div>
          </v-card-text>
        </v-card>

        <!-- 新增任務表單卡片 -->
        <v-card class="mb-6" elevation="2">
          <v-card-title class="d-flex align-center font-weight-bold">
            <v-icon icon="mdi-plus-circle" color="primary" class="mr-2" />
            新增任務 (Task)
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="createTask">
              <v-text-field
                v-model="newTask.title"
                label="任務標題 *"
                placeholder="例如：完成 NestJS 與 Vue 串接"
                variant="outlined"
                density="comfortable"
                :rules="[v => !!v || '標題不可為空']"
                required
                class="mb-2"
              />

              <v-textarea
                v-model="newTask.description"
                label="任務詳細描述 (選填)"
                placeholder="輸入詳細內容..."
                variant="outlined"
                density="comfortable"
                rows="2"
                auto-grow
                class="mb-2"
              />

              <div class="d-flex justify-end">
                <v-btn
                  type="submit"
                  color="primary"
                  prepend-icon="mdi-plus"
                  :loading="submitting"
                  :disabled="!newTask.title.trim()"
                >
                  新增任務
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- 任務列表清單 -->
        <v-card elevation="2">
          <v-card-title class="d-flex align-center justify-space-between">
            <div class="d-flex align-center font-weight-bold">
              <v-icon icon="mdi-format-list-checks" color="primary" class="mr-2" />
              任務清單 ({{ tasks.length }})
            </div>
            <v-btn
              variant="outlined"
              size="small"
              prepend-icon="mdi-refresh"
              :loading="loading"
              @click="fetchTasks"
            >
              重新整理
            </v-btn>
          </v-card-title>

          <v-divider />

          <!-- 載入中 -->
          <div v-if="loading" class="text-center py-8">
            <v-progress-circular indeterminate color="primary" size="48" />
            <div class="mt-3 text-medium-emphasis">讀取資料庫任務中...</div>
          </div>

          <!-- 無資料狀態 -->
          <div v-else-if="tasks.length === 0" class="text-center py-10">
            <v-icon icon="mdi-clipboard-text-outline" size="64" color="grey" />
            <div class="text-h6 text-grey mt-2">目前尚無任何任務</div>
            <div class="text-body-2 text-medium-emphasis">在上方表單新增第一筆任務吧！</div>
          </div>

          <!-- 任務列表 -->
          <v-list v-else lines="two">
            <template v-for="(task, index) in tasks" :key="task.id">
              <v-list-item :class="{ 'bg-grey-lighten-3 text-decoration-line-through': task.isCompleted }">
                <template #prepend>
                  <v-checkbox-btn
                    :model-value="task.isCompleted"
                    color="success"
                    @update:model-value="toggleTaskComplete(task)"
                  />
                </template>

                <v-list-item-title :class="{ 'text-grey': task.isCompleted, 'font-weight-medium': !task.isCompleted }">
                  {{ task.title }}
                </v-list-item-title>

                <v-list-item-subtitle v-if="task.description">
                  {{ task.description }}
                </v-list-item-subtitle>

                <v-list-item-subtitle class="text-caption text-disabled mt-1">
                  建立時間: {{ formatDate(task.createdAt) }}
                </v-list-item-subtitle>

                <template #append>
                  <div class="d-flex align-center">
                    <v-chip
                      size="small"
                      :color="task.isCompleted ? 'success' : 'warning'"
                      variant="tonal"
                      class="mr-2"
                    >
                      {{ task.isCompleted ? '已完成' : '進行中' }}
                    </v-chip>

                    <v-btn
                      icon="mdi-pencil-outline"
                      size="small"
                      variant="text"
                      color="primary"
                      @click="openEditDialog(task)"
                    />

                    <v-btn
                      icon="mdi-delete-outline"
                      size="small"
                      variant="text"
                      color="error"
                      @click="deleteTask(task.id)"
                    />
                  </div>
                </template>
              </v-list-item>
              <v-divider v-if="index < tasks.length - 1" />
            </template>
          </v-list>
        </v-card>
      </v-container>
    </v-main>

    <!-- 編輯任務對話框 -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title class="font-weight-bold">
          <v-icon icon="mdi-pencil" color="primary" class="mr-2" />
          編輯任務
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editingTask.title"
            label="任務標題 *"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          />
          <v-textarea
            v-model="editingTask.description"
            label="詳細描述"
            variant="outlined"
            density="comfortable"
            rows="3"
          />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="editDialog = false">取消</v-btn>
          <v-btn color="primary" variant="flat" :loading="savingEdit" @click="saveEditTask">儲存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 提示通知 Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" location="bottom right">
      {{ snackbar.text }}
      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">關閉</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import axios from 'axios'

interface Task {
  id: number
  title: string
  description?: string
  isCompleted: boolean
  createdAt: string
  updatedAt: string
}

const theme = useTheme()
function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

const tasks = ref<Task[]>([])
const loading = ref(false)
const submitting = ref(false)
const savingEdit = ref(false)

const newTask = ref({
  title: '',
  description: '',
})

const editDialog = ref(false)
const editingTask = ref<{ id: number; title: string; description?: string }>({
  id: 0,
  title: '',
  description: '',
})

const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
})

function showMessage(text: string, color = 'success') {
  snackbar.value = {
    show: true,
    text,
    color,
  }
}

async function fetchTasks() {
  loading.value = true
  try {
    const res = await axios.get<Task[]>('/api/tasks')
    tasks.value = res.data
  } catch (err: any) {
    showMessage('讀取任務失敗：' + (err.response?.data?.message || err.message), 'error')
  } finally {
    loading.value = false
  }
}

async function createTask() {
  if (!newTask.value.title.trim()) return

  submitting.value = true
  try {
    const res = await axios.post<Task>('/api/tasks', {
      title: newTask.value.title.trim(),
      description: newTask.value.description.trim() || undefined,
    })
    tasks.value.unshift(res.data)
    newTask.value = { title: '', description: '' }
    showMessage('任務新增成功！')
  } catch (err: any) {
    showMessage('新增任務失敗：' + (err.response?.data?.message || err.message), 'error')
  } finally {
    submitting.value = false
  }
}

async function toggleTaskComplete(task: Task) {
  const updatedStatus = !task.isCompleted
  try {
    const res = await axios.patch<Task>(`/api/tasks/${task.id}`, {
      isCompleted: updatedStatus,
    })
    task.isCompleted = res.data.isCompleted
    showMessage(task.isCompleted ? '任務標記為已完成！' : '任務重啟為進行中！')
  } catch (err: any) {
    showMessage('更新狀態失敗：' + (err.response?.data?.message || err.message), 'error')
  }
}

function openEditDialog(task: Task) {
  editingTask.value = {
    id: task.id,
    title: task.title,
    description: task.description || '',
  }
  editDialog.value = true
}

async function saveEditTask() {
  if (!editingTask.value.title.trim()) return

  savingEdit.value = true
  try {
    const res = await axios.patch<Task>(`/api/tasks/${editingTask.value.id}`, {
      title: editingTask.value.title.trim(),
      description: editingTask.value.description?.trim() || undefined,
    })
    const index = tasks.value.findIndex(t => t.id === editingTask.value.id)
    if (index !== -1) {
      tasks.value[index] = res.data
    }
    editDialog.value = false
    showMessage('任務修改成功！')
  } catch (err: any) {
    showMessage('修改任務失敗：' + (err.response?.data?.message || err.message), 'error')
  } finally {
    savingEdit.value = false
  }
}

async function deleteTask(id: number) {
  try {
    await axios.delete(`/api/tasks/${id}`)
    tasks.value = tasks.value.filter(t => t.id !== id)
    showMessage('任務已刪除！')
  } catch (err: any) {
    showMessage('刪除失敗：' + (err.response?.data?.message || err.message), 'error')
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleString('zh-TW', { hour12: false })
}

onMounted(() => {
  fetchTasks()
})
</script>

<style scoped>
.v-list-item {
  transition: all 0.2s ease;
}
</style>
