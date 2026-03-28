<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth     = useAuthStore()
const students = ref([])
const showInactive = ref(false)
const sortKey  = ref('name')
const sortDir  = ref(1)   // 1 = asc, -1 = desc
const loading  = ref(true)
const error    = ref('')

// onMounted(async () => {
//   try {
//     const res = await fetch(, {  
//       headers: auth.authHeaders()
//     })
//     if (!res.ok) throw new Error('Failed to load students')
//     students.value = await res.json()
//   } catch (err: any) {
//     error.value = err.message
//   } finally {
//     loading.value = false
//   }
// })

function sortBy(key: string) {
  if (sortKey.value === key) sortDir.value *= -1
  else { sortKey.value = key; sortDir.value = 1 }
}

const displayed = computed(() => {
  return students.value
    .filter(s => showInactive.value || s.active)
    .sort((a, b) => {
      const av = a[sortKey.value] ?? ''
      const bv = b[sortKey.value] ?? ''
      return av > bv ? sortDir.value : av < bv ? -sortDir.value : 0
    })
})

async function toggleActive(student) {
  const updated = { ...student, active: !student.active }
  await fetch(`https://your-ec2-url-here.com/students/${student.id}`, {  // 🔁 replace
    method:  'POST',
    headers: auth.authHeaders(),
    body:    JSON.stringify(updated)
  })
  student.active = !student.active
}

function arrow(key: string) {
  return sortKey.value === key ? (sortDir.value === 1 ? ' ▲' : ' ▼') : ''
}
</script>

<template>
  <div class="students">
    <div class="toolbar">
      <h2 class="page-title">Students</h2>

      <label class="toggle-label">
        <input type="checkbox" v-model="showInactive" />
        Show inactive students
      </label>
    </div>

    <p v-if="loading" class="info">Loading…</p>
    <p v-if="error"   class="error">{{ error }}</p>

    <table v-if="!loading" class="student-table">
      <thead>
        <tr>
          <th @click="sortBy('name')"    class="sortable">Name{{ arrow('name') }}</th>
          <th @click="sortBy('major')"   class="sortable">Major{{ arrow('major') }}</th>
          <th @click="sortBy('credits')" class="sortable">Credits{{ arrow('credits') }}</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in displayed" :key="s.id" :class="{ inactive: !s.active }">
          <td>
            <RouterLink :to="`/students/${s.id}`">{{ s.name }}</RouterLink>
          </td>
          <td>{{ s.major }}</td>
          <td>{{ s.credits }}</td>
          <td>
            <span :class="s.active ? 'badge-active' : 'badge-inactive'">
              {{ s.active ? 'Active' : 'Inactive' }}
            </span>
          </td>
          <td>
            <button class="btn-toggle" @click="toggleActive(s)">
              {{ s.active ? 'Deactivate' : 'Activate' }}
            </button>
          </td>
        </tr>
        <tr v-if="displayed.length === 0">
          <td colspan="5" class="empty">No students found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.students { max-width: 900px; margin: 0 auto; }
.toolbar  { display: flex; align-items: center; gap: 24px; margin-bottom: 20px; }
.page-title { font-size: 1.6rem; color: #1a2a4a; }
.toggle-label { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; cursor: pointer; }

.student-table { width: 100%; border-collapse: collapse; background: rgb(0, 0, 0); border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.student-table th { background: #000000; color: #f0c040; padding: 12px 16px; text-align: left; }
.student-table td { padding: 12px 16px; border-bottom: 1px solid #000000; }
.student-table tr:last-child td { border-bottom: none; }
.student-table tr.inactive td { color: #aaa; }

.sortable { cursor: pointer; user-select: none; }
.sortable:hover { background: #243860; }

.badge-active   { background: #d4edda; color: #155724; padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; }
.badge-inactive { background: #f8d7da; color: #721c24; padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; }

.btn-toggle { padding: 5px 12px; border-radius: 6px; border: 1px solid #000000; cursor: pointer; font-size: 0.85rem; background: white; }
.btn-toggle:hover { background: #f0f0f0; }

.info  { color: #555; }
.error { color: #c0392b; }
.empty { text-align: center; color: #999; padding: 20px; }
</style>