<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route   = useRoute()
const auth    = useAuthStore()
const student = ref(null)
const courses = ref([])
const loading = ref(true)
const error   = ref('')

onMounted(async () => {
  try {
    const res = await fetch(`https://checksheets.cscprof.com/studentcourses/}`, {
      headers: auth.authHeaders()
    })
    if (!res.ok) throw new Error('Failed to load student data')
    const data = await res.json()
    console.log('studentcourses data:', data)

    student.value = data.student ?? data[0] ?? null
    courses.value = data.courses ?? data ?? []
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

// Group courses by semester
const bySemester = computed(() => {
  const groups = {}
  for (const c of courses.value) {
    const key = `${c.semester_name ?? 'Unknown'}`
    if (!groups[key]) groups[key] = []
    groups[key].push(c)
  }
  return groups
})

function statusClass(status) {
  const map = {
    'Passed':      'status-passed',
    'Failed':      'status-failed',
    'In-Progress': 'status-progress',
    'Scheduled':   'status-scheduled',
    'Audit':       'status-audit',
    'Transfer':    'status-transfer',
  }
  return map[status] ?? ''
}
</script>

<template>
  <div class="detail">

    <RouterLink to="/students" class="back-link">← Back to Students</RouterLink>

    <div v-if="loading" class="info">Loading...</div>
    <div v-if="error"   class="error">{{ error }}</div>

    <!--  header -->
    <div v-if="student" class="student-header">
      <i class="fa-solid fa-circle-user fa-3x"></i>
      <div>
        <h2>{{ student.firstname }} {{ student.lastname }}</h2>
        <span class="student-sub">{{ student.major ?? 'Undeclared' }}</span>
      </div>
    </div>

    <!-- legend -->
    <div class="legend">
      <span class="badge status-passed">Passed</span>
      <span class="badge status-failed">Failed</span>
      <span class="badge status-progress">In Progress</span>
      <span class="badge status-scheduled">Scheduled</span>
      <span class="badge status-audit">Audit</span>
      <span class="badge status-transfer">Transfer</span>
    </div>

    <!-- Semester tables -->
    <div v-if="!loading" class="semesters">
      <div v-for="(semCourses, semName) in bySemester" :key="semName" class="sem-block">
        <table class="sem-table">
          <thead>
            <tr><th colspan="3">{{ semName }}</th></tr>
            <tr class="col-headers">
              <th>Course</th>
              <th>Credits</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in semCourses" :key="c.course_id">
              <td>{{ c.course_code }} — {{ c.course_name }}</td>
              <td class="credits">{{ c.credits }}</td>
              <td>
                <span :class="['badge', statusClass(c.course_status)]">
                  {{ c.course_status ?? '—' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="Object.keys(bySemester).length === 0" class="empty">
        No courses found for this student.
      </div>
    </div>

  </div>
</template>

<style scoped>
.detail { max-width: 900px; margin: 0 auto; }

.back-link { font-size: 0.9rem; color: #555; text-decoration: none; display: inline-block; margin-bottom: 20px; }
.back-link:hover { color: black; }

.student-header {
  display: flex; align-items: center; gap: 16px;
  padding: 20px 0; border-bottom: 1px solid #ccc; margin-bottom: 24px;
}
.student-header h2 { font-size: 1.5rem; margin: 0; }
.student-sub { font-size: 0.9rem; color: #666; }

.legend { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }

.semesters { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

.sem-table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.sem-table thead tr:first-child th { background: #000; color: white; padding: 10px 14px; text-align: left; font-size: 0.95rem; }
.col-headers th { background: #333; color: #ccc; padding: 8px 14px; font-size: 0.8rem; text-align: left; }
.sem-table td { padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 0.9rem; }
.sem-table tr:last-child td { border-bottom: none; }
.credits { text-align: center; width: 60px; }

.badge { padding: 3px 10px; border-radius: 12px; font-size: 0.78rem; font-weight: 600; }
.status-passed    { background: #d4edda; color: #155724; }
.status-failed    { background: #f8d7da; color: #721c24; }
.status-progress  { background: #cce5ff; color: #004085; }
.status-scheduled { background: #fff3cd; color: #856404; }
.status-audit     { background: #e2e3e5; color: #383d41; }
.status-transfer  { background: #d1ecf1; color: #0c5460; }

.info  { color: #555; }
.error { color: #c0392b; }
.empty { text-align: center; color: #999; padding: 40px; grid-column: span 2; }
</style>