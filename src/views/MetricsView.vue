<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth    = useAuthStore()
const loading = ref(true)
const error   = ref('')

// Declare each semester for the chart and table
const semesters = ref([
  { name: 'Transfer Credits', courses: []},
  { name: 'Fall Year 1',   courses: [] },
  { name: 'Spring Year 1', courses: [] },
  { name: 'Fall Year 2',   courses: [] },
  { name: 'Spring Year 2', courses: [] },
  { name: 'Fall Year 3',   courses: [] },
  { name: 'Spring Year 3', courses: [] },
  { name: 'Fall Year 4',   courses: [] },
  { name: 'Spring Year 4', courses: [] },
])

onMounted(async () => {
  if (!auth.user?.student_id) {
    loading.value = false
    return
  }
  try {
    const res = await fetch(`https://checksheets.cscprof.com/studentcourses/${auth.user?.student_id}`, {
      headers: auth.authHeaders()
    })
    if (!res.ok) throw new Error('Failed to load data')
    const data = await res.json()

    const groups = {}
    for (const c of (data.courses ?? [])) {
      const key = c.semester_name ?? 'Unassigned'
      if (!groups[key]) groups[key] = []
      groups[key].push(c)
    }
    if (Object.keys(groups).length > 0) {
      semesters.value = Object.entries(groups).map(([name, courses]) => ({ name, courses }))
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

const allCourses = computed(() => semesters.value.flatMap(s => s.courses))

const totalEarned     = computed(() => allCourses.value.filter(c => c.course_status === 'Passed').reduce((sum, c)   => sum + (c.credits ?? 0), 0))
const totalInProgress = computed(() => allCourses.value.filter(c => c.course_status === 'In-Progress').reduce((sum, c) => sum + (c.credits ?? 0), 0))
const totalScheduled  = computed(() => allCourses.value.filter(c => c.course_status === 'Scheduled').reduce((sum, c)  => sum + (c.credits ?? 0), 0))
const totalAll        = computed(() => allCourses.value.reduce((sum, c) => sum + (c.credits ?? 0), 0))

// Add credits together for the semesters
const semesterCredits = computed(() =>
  semesters.value.map(s => ({
    name:       s.name,
    earned:     s.courses.filter(c => c.course_status === 'Passed').reduce((sum, c)      => sum + (c.credits ?? 0), 0),
    inProgress: s.courses.filter(c => c.course_status === 'In-Progress').reduce((sum, c) => sum + (c.credits ?? 0), 0),
    scheduled:  s.courses.filter(c => c.course_status === 'Scheduled').reduce((sum, c)   => sum + (c.credits ?? 0), 0),
    total:      s.courses.reduce((sum, c) => sum + (c.credits ?? 0), 0),

    // ----------------------------------------------------------------------------------------------------------------------

    needed:     120
  }))
)

const maxCredits = computed(() => Math.max(...semesterCredits.value.map(s => s.total), 1))
</script>

<template>
  <div class="metrics">
    <h2 class="page-title">Metrics Dashboard</h2>

    <div v-if="loading" class="info">Loading...</div>
    <div v-if="error"   class="error">{{ error }}</div>

    <!-- Totals above teh Chart -->
    <div class="cards">
      <div class="card">
        <span class="card-label">Credits Earned</span>
        <span class="card-value earned">{{ totalEarned }}</span>
      </div>
      <div class="card">
        <span class="card-label">In Progress</span>
        <span class="card-value progress">{{ totalInProgress }}</span>
      </div>
      <div class="card">
        <span class="card-label">Future Credits</span>
        <span class="card-value scheduled">{{ totalScheduled }}</span>
      </div>
      <div class="card">
        <span class="card-label">Total Credits</span>
        <span class="card-value total">{{ totalAll }}</span>
      </div>
    </div>

    <!-- Bar Chart -->
    <div class="section">
      <h3>Credits Earned by Semester</h3>
      <div class="chart">
        <div v-for="s in semesterCredits" :key="s.name" class="bar-group">
          <div class="bar-wrap">
            <div class="bar bar-earned"     :style="{ height: (s.earned     / maxCredits * 150) + 'px' }"></div>
            <div class="bar bar-inprogress" :style="{ height: (s.inProgress / maxCredits * 150) + 'px' }"></div>
            <div class="bar bar-scheduled"  :style="{ height: (s.scheduled  / maxCredits * 150) + 'px' }"></div>
            <div class="bar bar-total"      :style="{ height: (s.total      / maxCredits * 150) + 'px' }"></div>
          </div>
          <span class="bar-label">{{ s.name.replace('Year ', 'Y') }}</span>
        </div>
      </div>
      <div class="chart-legend">
        <span class="cl bar-earned">● Earned</span>
        <span class="cl bar-inprogress">● In Progress</span>
        <span class="cl bar-scheduled">● Scheduled</span>
        <span class="cl bar-total">● Total</span>
      </div>
    </div>

    <!--  Table -->
    <div class="section">
      <h3>Credits Breakdown by Semester</h3>
      <table class="metrics-table">
        <thead>
          <tr>
            <th>Semester</th>
            <th>Earned</th>
            <th>In Progress</th>
            <th>Scheduled</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in semesterCredits" :key="s.name">
            <td>{{ s.name }}</td>
            <td>{{ s.earned }}</td>
            <td>{{ s.inProgress }}</td>
            <td>{{ s.scheduled }}</td>
            <td><strong>{{ s.total }}</strong></td>
          </tr>
          <tr class="totals-row">
            <td><strong>Total</strong></td>
            <td><strong>{{ totalEarned }}</strong></td>
            <td><strong>{{ totalInProgress }}</strong></td>
            <td><strong>{{ totalScheduled }}</strong></td>
            <td><strong>{{ totalAll }}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped>
.metrics { max-width: 1000px; margin: 0 auto; }
.page-title { font-size: 1.6rem; color: #000; margin-bottom: 24px; }
.section { margin-bottom: 40px; }
.section h3 { font-size: 1.1rem; margin-bottom: 16px; color: #000; }

.cards { display: flex; gap: 16px; margin-bottom: 40px; flex-wrap: wrap; }
.card { flex: 1; min-width: 150px; background: white; border-radius: 8px; padding: 20px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08); display: flex; flex-direction: column; gap: 8px; }
.card-label { font-size: 0.85rem; color: #666; }
.card-value { font-size: 2rem; font-weight: 700; }
.earned   { color: #22c55e; }
.progress { color: #3b82f6; }
.scheduled{ color: #f97316; }
.total    { color: #000; }

.chart { display: flex; align-items: flex-end; justify-content: center; gap: 12px; height: 180px; padding: 0 8px; border-bottom: 2px solid #000; margin-bottom: 8px; overflow-x: auto; }
.bar-group { display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 60px; }
.bar-wrap { display: flex; align-items: flex-end; gap: 3px; }
.bar { width: 14px; border-radius: 4px 4px 0 0; transition: height 0.3s; min-height: 2px; }
.bar-earned     { background: #22c55e; }
.bar-inprogress { background: #3b82f6; }
.bar-scheduled  { background: #f97316; }
.bar-total      { background: #e5e7eb; }
.bar-label { font-size: 0.65rem; text-align: center; color: #555; }
.chart-legend { display: flex; gap: 16px; font-size: 0.8rem; margin-top: 8px; flex-wrap: wrap; }
.cl { font-weight: 600; }

.metrics-table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.metrics-table th { background: #000; color: white; padding: 12px 16px; text-align: left; }
.metrics-table td { padding: 12px 16px; border-bottom: 1px solid #eee; }
.metrics-table tr:last-child td { border-bottom: none; }
.totals-row td { background: #f5f5f5; border-top: 2px solid #000; }

.info  { color: #555; margin-bottom: 16px; }
.error { color: #c0392b; margin-bottom: 16px; }

@media print {
  .metrics { max-width: 100%; }
  .cards { break-inside: avoid; }
  .section { break-inside: avoid; }
}
</style>