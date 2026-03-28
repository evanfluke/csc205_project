<script setup>
import { ref, computed } from 'vue'

const showInactive = ref(false)
const sortKey  = ref('firstname')
const sortDir  = ref(1)
const loading  = ref(false)
const error    = ref('')
const search   = ref('')

const students = ref([
  { student_id: 1, firstname: 'John',  lastname: 'Smith',   major: 'Computer Science', is_Active: true },
  { student_id: 2, firstname: 'John', lastname: 'Johnson', major: 'Cybersecurity',     is_Active: true },
  { student_id: 3, firstname: 'John',  lastname: 'Smythe',   major: 'Computer Science', is_Active: false },
  { student_id: 4, firstname: 'John',  lastname: 'Smyth',  major: 'Philosophy',     is_Active: true },
  { student_id: 5, firstname: 'John', lastname: 'John',   major: 'Computer Science', is_Active: false },
])

function sortBy(key) {
  if (sortKey.value === key) sortDir.value *= -1
  else { sortKey.value = key; sortDir.value = 1 }
}

const displayed = computed(() => {
  return students.value
    .filter(s => showInactive.value || s.is_Active)
    .filter(s => {
      const q = search.value.toLowerCase()
      return (
        s.firstname.toLowerCase().includes(q) ||
        s.lastname.toLowerCase().includes(q)  ||
        s.major.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      const av = a[sortKey.value] ?? ''
      const bv = b[sortKey.value] ?? ''
      return av > bv ? sortDir.value : av < bv ? -sortDir.value : 0
    })
})

function toggleActive(student) {
  student.is_Active = !student.is_Active
}

function arrow(key) {
  return sortKey.value === key ? (sortDir.value === 1 ? ' ▲' : ' ▼') : ''
}
</script>

<template>
  <div class="students">
    <div class="toolbar">
      <h2 class="page-title">Students</h2>
      <div class="search-wrap">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input class="search" v-model="search" type="text" placeholder="Search students..." />
      </div>
      <label>
        <input type="checkbox" v-model="showInactive" /> Show Inactive
      </label>
    </div>

    <p v-if="loading" class="info">Loading…</p>
    <p v-if="error"   class="error">{{ error }}</p>

    <!-- <p>{{ displayed }}</p> -->

    <table v-if="!loading" class="student-table">
      <thead>
        <tr>
          <th @click="sortBy('firstname')" class="sortable">First Name{{ arrow('firstname') }}</th>
          <th @click="sortBy('lastname')"  class="sortable">Last Name{{ arrow('lastname') }}</th>
          <th @click="sortBy('major')"     class="sortable">Major{{ arrow('major') }}</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in displayed" :key="s.student_id" :class="{ inactive: !s.is_Active }">
          <td>
            <RouterLink :to="`/students/${s.student_id}`">{{ s.firstname }}</RouterLink>
          </td>
          <td>{{ s.lastname }}</td>
          <td>{{ s.major }}</td>
          <td>
            <span :class="s.is_Active ? 'badge-active' : 'badge-inactive'">
              {{ s.is_Active ? 'Active' : 'Inactive' }}
            </span>
          </td>
          <td>
            <button class="btn-toggle" @click="toggleActive(s)">
              {{ s.is_Active ? 'Deactivate' : 'Activate' }}
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
.page-title { font-size: 1.6rem; color: #000000; }

.student-table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.student-table th { background: #000000; color: white; padding: 12px 16px; text-align: left; }
.student-table td { padding: 12px 16px; border-bottom: 1px solid #ccc; background: white; color: black; }
.student-table tr:last-child td { border-bottom: none; }
.student-table tr.inactive td { color: #aaa; }

.sortable { cursor: pointer; user-select: none; }
.sortable:hover { background: #333; }

.badge-active   { background: #d4edda; color: #155724; padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; }
.badge-inactive { background: #f8d7da; color: #721c24; padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; }

.btn-toggle { padding: 5px 12px; border-radius: 6px; border: 1px solid #ccc; cursor: pointer; font-size: 0.85rem; background: white; }
.btn-toggle:hover { background: #f0f0f0; }

.info  { color: #555; }
.error { color: #c0392b; }
.empty { text-align: center; color: #999; padding: 20px; }

.search {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.9rem;
  width: 220px;
}

</style>