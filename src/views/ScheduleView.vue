<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

import { useChecksheetStore } from '../stores/checksheet'
const checksheet = useChecksheetStore()

const auth    = useAuthStore()
const loading = ref(true)
const error   = ref('')

// const allSemesters = ref([
//   { name: 'Fall Year 1',   courses: [] },
//   { name: 'Spring Year 1', courses: [] },
//   { name: 'Fall Year 2',   courses: [] },
//   { name: 'Spring Year 2', courses: [] },
//   { name: 'Fall Year 3',   courses: [] },
//   { name: 'Spring Year 3', courses: [] },
//   { name: 'Fall Year 4',   courses: [] },
//   { name: 'Spring Year 4', courses: [] },
// ])

const semesters = checksheet.semesters

const selectedSemester = ref('Fall Year 1')

onMounted(async () => {
  try {
    if (auth.user?.student_id) {
      const res = await fetch(`https://checksheets.cscprof.com/studentcourses/${auth.user?.student_id}`, {
        headers: auth.authHeaders()
      })
      if (!res.ok) throw new Error('Failed to load schedule')
      const data = await res.json()
      console.log('schedule data:', data)

      const groups = {}
      for (const c of (data.courses ?? [])) {
        const key = c.semester_name ?? 'Unassigned'
        if (!groups[key]) groups[key] = []
        groups[key].push(c)
      }
      if (Object.keys(groups).length > 0) {
        allSemesters.value = Object.entries(groups).map(([name, courses]) => ({ name, courses }))
        selectedSemester.value = allSemesters.value[0].name
      }
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

const currentSemester = computed(() =>
  semesters.find(s => s.name === selectedSemester.value) ?? { name: '', courses: [] }
)

const totalCredits = computed(() =>
  currentSemester.value.courses.reduce((sum, c) => sum + (c.credits ?? 0), 0)
)

function statusClass(status) {
  const map = {
    'Passed':      'status-passed',
    'Failed':      'status-failed',
    'In-Progress': 'status-progress',
    'Scheduled':   'status-scheduled',
    'Audit':       'status-audit',
    'Transfer':    'status-transfer',
    'Not Started': 'status-notstarted',
  }
  return map[status] ?? ''
}
</script>

<template>
  <div class="schedule">
    <p>loading: {{ loading }}</p>
    <p>semesters: {{ semesters.length }}</p>

    <div class="toolbar">
      <h2 class="page-title">Schedule View</h2>

      <div class="selector">
        <label>Semester</label>
        <select v-model="selectedSemester">
          <option v-for="sem in semesters" :key="sem.name" :value="sem.name">
            {{ sem.name }}
          </option>
        </select>
      </div>

      <div class="btn-group">
        <button class = "btn=pdf" onclick="window.print()">
            <i class="fa-regular fa-file-pdf"></i>
        </button>
        <button class = "btn-print" onclick="window.print()">
            <i class="fa-solid fa-print"></i>
        </button>
      </div>

    </div>



    <div v-if="loading" class="info">Loading...</div>
    <div v-if="error"   class="error">{{ error }}</div>

    <div class="schedule-card">
      <div class="schedule-header">
        <div>
          <h3>{{ selectedSemester }}</h3>
          <span class="student-name">{{ auth.user?.firstname }} {{ auth.user?.lastname }}</span>
        </div>
        <div class="credit-summary">
          <span class="credit-label">Total Credits</span>
          <span class="credit-value">{{ totalCredits }}</span>
        </div>
      </div>

      <table class="schedule-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Credits</th>
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in currentSemester.courses" :key="c.course_id">
            <td>{{ c.course_code ?? '—' }}</td>
            <td>{{ c.course_name ?? '—' }}</td>
            <td class="center">{{ c.credits ?? '—' }}</td>
            <td>
              <span :class="['type-badge', c.type]">{{ c.type ?? '—' }}</span>
            </td>
            <td>
              <span :class="['badge', statusClass(c.course_status)]">
                {{ c.course_status ?? '—' }}
              </span>
            </td>
          </tr>
          <tr v-if="currentSemester.courses.length === 0">
            <td colspan="5" class="empty">No courses scheduled for this semester.</td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td colspan="2"><strong>Total</strong></td>
            <td class="center"><strong>{{ totalCredits }}</strong></td>
            <td colspan="2"></td>
          </tr>
        </tfoot>
      </table>
    </div>

  </div>
</template>

<style scoped>
.schedule { max-width: 900px; margin: 0 auto; }

.toolbar { display: flex; align-items: center; gap: 20px; margin-bottom: 24px; flex-wrap: wrap; }
.page-title { font-size: 1.6rem; color: #000; }

.selector { display: flex; align-items: center; gap: 8px; }
.selector label { font-size: 0.9rem; color: #555; }
.selector select { padding: 8px 12px; border: 1px solid #ccc; border-radius: 6px; font-size: 0.9rem; }

/* .btn-pdf {
  padding: 8px 16px; background: #000; color: white;
  border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem;
  margin-left: auto;
}
.btn-pdf:hover {
    background: #333; 
}

.btn-print {
  padding: 8px 16px; background: #000; color: white;
  border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem;
  margin-left: auto;
}
.btn-print:hover { background: #333; } */

.btn-group {
    display: flex; gap: 8px; margin-left: auto; 
    padding: 8px 16px; background: #000; color: white;
    border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem;
}

.btn-group:hover {
    background: #333;
}

.schedule-card { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }

.schedule-header {
  background: #000; color: white;
  padding: 20px 24px;
  display: flex; justify-content: space-between; align-items: center;
}
.schedule-header h3 { font-size: 1.2rem; margin: 0; color: white; }
.student-name { font-size: 0.85rem; color: #aaa; }

.credit-summary { text-align: right; }
.credit-label { font-size: 0.8rem; color: #aaa; display: block; }
.credit-value { font-size: 2rem; font-weight: 700; color: white; }

.schedule-table { width: 100%; border-collapse: collapse; }
.schedule-table th { background: #333; color: #ccc; padding: 10px 16px; text-align: left; font-size: 0.85rem; }
.schedule-table td { padding: 12px 16px; border-bottom: 1px solid #eee; font-size: 0.9rem; }
.schedule-table tr:last-child td { border-bottom: none; }
.center { text-align: center; }

.total-row td { background: #f5f5f5; border-top: 2px solid #000; }

.badge { padding: 3px 10px; border-radius: 12px; font-size: 0.78rem; font-weight: 600; }
.status-passed     { background: #d4edda; color: #155724; }
.status-failed     { background: #f8d7da; color: #721c24; }
.status-progress   { background: #cce5ff; color: #004085; }
.status-scheduled  { background: #fff3cd; color: #856404; }
.status-audit      { background: #e2e3e5; color: #383d41; }
.status-transfer   { background: #d1ecf1; color: #0c5460; }
.status-notstarted { background: #f5f5f5; color: #999; }

.type-badge { padding: 3px 10px; border-radius: 12px; font-size: 0.78rem; font-weight: 600; background: #f0f0f0; color: #333; text-transform: capitalize; }

.info  { color: #555; }
.error { color: #c0392b; }
.empty { text-align: center; color: #999; padding: 30px; }

@media print {
  .toolbar { display: none; }
  .schedule-card { box-shadow: none; }
}
</style>