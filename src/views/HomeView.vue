<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth   = useAuthStore()
const router = useRouter()

if (auth.role === 'advisor') router.push('/students')

const student       = ref(null)
const semesters = ref([
  { name: 'Fall Year 1',   courses: [] },
  { name: 'Spring Year 1', courses: [] },
  { name: 'Fall Year 2',   courses: [] },
  { name: 'Spring Year 2', courses: [] },
  { name: 'Fall Year 3',   courses: [] },
  { name: 'Spring Year 3', courses: [] },
  { name: 'Fall Year 4',   courses: [] },
  { name: 'Spring Year 4', courses: [] },
])
const transferCourses = ref([])
const loading       = ref(true)
const error         = ref('')

onMounted(async () => {
  if (!auth.user?.student_id) {
    loading.value = false
    return
  }
  try {
    const res = await fetch(`https://checksheets.cscprof.com/studentcourses/${auth.user?.student_id}`, {
      headers: auth.authHeaders()
    })
    if (!res.ok) throw new Error('Failed to load checksheet')
    const data = await res.json()
    console.log('checksheet data:', data)
    student.value         = data.student ?? null
    transferCourses.value = (data.courses ?? []).filter(c => c.course_status === 'Transfer')
    const groups = {}
    for (const c of (data.courses ?? []).filter(c => c.course_status !== 'Transfer')) {
      const key = c.semester_name ?? 'Unassigned'
      if (!groups[key]) groups[key] = []
      groups[key].push(c)
    }
    semesters.value = Object.entries(groups).map(([name, courses]) => ({ name, courses }))
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

</script>

<template>
  <div class="home">
    <div class="layout">

      <!-- Student header -->
      <div class="student-header">
        <i class="fa-solid fa-circle-user fa-2x"></i>
        <div>
          <span class="student-name">
            {{ auth.user?.firstname }} {{ auth.user?.lastname }}
          </span>
          <span class="student-sub">
            {{ student?.major ?? '' }}
          </span>
        </div>
      </div>

      <div class="left-panel">

        <div v-if="loading" class="info">Loading...</div>
        <div v-if="error"   class="error">{{ error }}</div>

        <!-- Legend -->
        <div v-if="!loading" class="legend">
          <span class="legend-item type-major">● Major</span>
          <span class="legend-item type-minor">● Minor</span>
          <span class="legend-item type-core">● Core</span>
          <span class="legend-item type-elective">● Elective</span>
          <span class="legend-sep">|</span>
          <span class="badge status-passed">Passed</span>
          <span class="badge status-failed">Failed</span>
          <span class="badge status-progress">In Progress</span>
          <span class="badge status-scheduled">Scheduled</span>
          <span class="badge status-audit">Audit</span>
          <span class="badge status-transfer">Transfer</span>
          <span class="badge status-notstarted">Not Started</span>
        </div>

        <!-- Transfer semester -->
        <table v-if="transferCourses.length > 0" class="sem-table transfer-table">
          <thead><tr><th colspan="3">Transfer Credits</th></tr></thead>
          <tbody>
            <tr v-for="c in transferCourses" :key="c.course_id" :class="typeClass(c.type)">
              <td>{{ c.course_code }} — {{ c.course_name }}</td>
              <td class="credits">{{ c.credits }}</td>
              <td><span class="badge status-transfer">Transfer</span></td>
            </tr>
          </tbody>
        </table>

        <!-- Semester tables -->
        <div class="tables">
          <table v-for="sem in semesters" :key="sem.name" class="sem-table">
            <thead><tr><th colspan="3">{{ sem.name }}</th></tr></thead>
            <tbody>
              <tr v-for="c in sem.courses" :key="c.course_id" :class="typeClass(c.type)">
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

          <!-- <div v-if="!loading && semesters.length === 0" class="empty">
            No courses found.
          </div> -->
        </div>

      </div>

      <!-- Right panel -->
      <div class="right-panel">
        <div class="panel-top">
          <div class="panel-header">Student Resources</div>
          <table class="panel-table">
            <tbody>
              <tr><td><a href="https://www.geneva.edu/academics/registrar/pdf/4yr-plans/csc_web_tech-4yr-plan.pdf" target="_blank">Degree Plan</a></td></tr>
              <tr><td><a href="#">Completed Courses</a></td></tr>
              <tr><td><a href="#">Remaining Requirements</a></td></tr>
              <tr><td><a href="#">Add/Drop Major/Minor</a></td></tr>
            </tbody>
          </table>
        </div>
        <div class="panel-bottom">
          <div class="panel-header">General Resources</div>
          <table class="panel-table">
            <tbody>
              <tr><td><a href="https://www.geneva.edu/" target="_blank">Geneva College</a></td></tr>
              <tr><td><a href="https://www.geneva.edu/academics/registrar/pdf/gccatalog-2025-26-final.pdf" target="_blank">Course Catalogue</a></td></tr>
              <tr><td><a href="https://www.geneva.edu/academics/programs/" target="_blank">Degree Programs</a></td></tr>
              <tr><td><a href="https://my.geneva.edu/ICS/Registrar/" target="_blank">Registrar</a></td></tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.home { max-width: 1200px; margin: 0 auto; }

.layout { display: flex; flex-wrap: wrap; gap: 24px; }
.left-panel { flex: 3; overflow-y: auto; height: calc(100vh - 80px); }
.right-panel { flex: 1; position: sticky; top: 0; height: calc(100vh - 80px); overflow-y: auto; padding-top: 8px; }

.student-header { display: flex; align-items: center; gap: 12px; padding: 16px 24px; margin-bottom: 16px; border-bottom: 1px solid #ccc; flex-basis: 100%; }
.student-name { font-size: 1.2rem; font-weight: 700; display: block; }
.student-sub { font-size: 0.85rem; color: #666; }

.legend { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 16px; font-size: 0.85rem; }
.legend-item { font-weight: 700; }
.legend-sep { color: #ccc; }
.type-major    { color: #3b82f6; }
.type-minor    { color: #f97316; }
.type-core     { color: #22c55e; }
.type-elective { color: #9ca3af; }

.sem-table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); margin-bottom: 16px; }
.sem-table th { background: #000; color: white; padding: 10px 14px; text-align: left; font-size: 0.95rem; }
.sem-table td { padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 0.9rem; }
.sem-table tr:last-child td { border-bottom: none; }
.credits { text-align: center; width: 50px; }

.transfer-table th { background: #1a5276; }

tr.type-major    td:first-child { border-left: 4px solid #3b82f6; }
tr.type-minor    td:first-child { border-left: 4px solid #f97316; }
tr.type-core     td:first-child { border-left: 4px solid #22c55e; }
tr.type-elective td:first-child { border-left: 4px solid #9ca3af; }

.badge { padding: 3px 10px; border-radius: 12px; font-size: 0.78rem; font-weight: 600; }
.status-passed     { background: #d4edda; color: #155724; }
.status-failed     { background: #f8d7da; color: #721c24; }
.status-progress   { background: #cce5ff; color: #004085; }
.status-scheduled  { background: #fff3cd; color: #856404; }
.status-audit      { background: #e2e3e5; color: #383d41; }
.status-transfer   { background: #d1ecf1; color: #0c5460; }
.status-notstarted { background: #f5f5f5; color: #999; }

.panel-top { margin-bottom: 20px; }
.panel-header { background: #000; color: white; padding: 10px 14px; font-size: 0.95rem; font-weight: 600; border-radius: 8px 8px 0 0; }
.panel-table { width: 100%; border-collapse: collapse; background: white; border-radius: 0 0 8px 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.panel-table td { padding: 10px 14px; border-bottom: 1px solid #ccc; }
.panel-table tr:last-child td { border-bottom: none; }
.panel-table a { text-decoration: none; color: #333; font-size: 0.9rem; }
.panel-table a:hover { color: black; font-weight: 600; }

.info  { color: #555; margin-bottom: 16px; }
.error { color: #c0392b; margin-bottom: 16px; }
.empty { text-align: center; color: #999; padding: 40px; }
</style>