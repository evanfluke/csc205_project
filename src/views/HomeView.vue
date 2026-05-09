<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { VueDraggable } from 'vue-draggable-plus'
import ChangeMajorModal from '../components/ChangeMajor.vue'

import { useChecksheetStore } from '../stores/checksheet'
const checksheet = useChecksheetStore()

const auth   = useAuthStore()
const router = useRouter()

const student         = ref(null)
const availableCourses = ref([])
const showChangeMajor = ref(false)
const currentMajor    = ref(null)
const loading         = ref(true)
const error           = ref('')
const searchCourses   = ref('')

// const semesters = ref([
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

const transferCourses = ref([])

const takenStatuses = ['Passed', 'In-Progress', 'Scheduled', 'Transfer']

onMounted(async () => {
  try {

    const [majorRes, coreRes, allRes] = await Promise.all([
      fetch('https://checksheets.cscprof.com/courses', { headers: auth.authHeaders() }),
      fetch('https://checksheets.cscprof.com/courses/core', { headers: auth.authHeaders() }),
    ])

    const allCourses  = majorRes.ok ? await majorRes.json() : []
    const coreCourses = coreRes.ok  ? await coreRes.json()  : []

    const tagged = [
      ...allCourses.map(c  => ({ ...c, type: 'major' })),
      ...coreCourses.map(c => ({ ...c, type: 'core' })),
    ]

    const seen = new Set()
    availableCourses.value = tagged.filter(c => {
      if (seen.has(c.course_id)) return false
      seen.add(c.course_id)
      return true
    })

    if (auth.user?.student_id) {
      const res = await fetch(`https://checksheets.cscprof.com/studentcourses/${auth.user.student_id}`, {
        headers: auth.authHeaders()
      })
      if (res.ok) {
        const data = await res.json()
        student.value         = data.student ?? null
        transferCourses.value = (data.courses ?? []).filter(c => c.course_status === 'Transfer')

        const groups = {}
        for (const c of (data.courses ?? []).filter(c => c.course_status !== 'Transfer')) {
          const key = c.semester_name ?? 'Unassigned'
          if (!groups[key]) groups[key] = []
          groups[key].push(c)
        }
        for (const sem of semesters.value) {
          if (groups[sem.name]) sem.courses = groups[sem.name]
        }

        const takenIds = new Set(
          (data.courses ?? [])
            .filter(c => takenStatuses.includes(c.course_status))
            .map(c => c.course_id)
        )
        availableCourses.value = availableCourses.value.filter(c => !takenIds.has(c.course_id))
      }
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

const filteredAvailable = computed(() => {
  const q = searchCourses.value.toLowerCase()
  return availableCourses.value.filter(c =>
    c.course_code?.toLowerCase().includes(q) ||
    c.course_name?.toLowerCase().includes(q)
  )
})

function handleMajorChange(major) {
  currentMajor.value = major
}

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

function typeClass(type) {
  const map = {
    'major':    'type-major',
    'minor':    'type-minor',
    'core':     'type-core',
    'elective': 'type-elective',
  }
  return map[type] ?? ''
}
</script>

<template>
  <div class="home">
    <div class="layout">

      <div class="student-header">
        <i class="fa-solid fa-circle-user fa-2x"></i>
        <div>
          <span class="student-name">{{ auth.user?.firstname }} {{ auth.user?.lastname }}</span>
          <span class="student-sub">{{ currentMajor?.major_name ?? student?.major ?? '' }}</span>
        </div>
      </div>

      <div class="left-panel">

        <div v-if="loading" class="info">Loading...</div>
        <div v-if="error"   class="error">{{ error }}</div>

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

        <div class="tables">
          <div v-for="sem in semesters" :key="sem.name" class="sem-block">
            <table class="sem-table">
              <thead><tr><th colspan="3">{{ sem.name }}</th></tr></thead>
            </table>
            <VueDraggable
              v-model="sem.courses"
              group="courses"
              class="drop-zone"
              :animation="150"
            >
              <div
                v-for="c in sem.courses"
                :key="c.course_id"
                :class="['course-row', typeClass(c.type)]"
              >
                <span class="drag-handle"><i class="fa-solid fa-grip-vertical"></i></span>
                <span class="course-code">{{ c.course_code }}</span>
                <span class="course-name">{{ c.course_name }}</span>
                <span class="credits">{{ c.credits }}</span>
                <span :class="['badge', statusClass(c.course_status)]">
                  {{ c.course_status ?? '—' }}
                </span>
              </div>
              <div v-if="sem.courses.length === 0" class="drop-hint">
                Drop courses here
              </div>
            </VueDraggable>
          </div>
        </div>
      </div>

      <div class="right-panel">

        <div class="panel-section">
          <div class="panel-header">Available Courses</div>
          <div class="course-search">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input v-model="searchCourses" placeholder="Search..." />
          </div>
          <VueDraggable
            v-model="availableCourses"
            group="courses"
            class="available-list"
            :animation="150"
          >
            <div
              v-for="c in filteredAvailable"
              :key="c.course_id"
              :class="['available-item', typeClass(c.type)]"
            >
              <span class="drag-handle"><i class="fa-solid fa-grip-vertical"></i></span>
              <div class="available-info">
                <span class="course-code">{{ c.course_code }}</span>
                <span class="available-name">{{ c.course_name }}</span>
              </div>
              <span class="credits">{{ c.credits }}cr</span>
            </div>
            <div v-if="filteredAvailable.length === 0" class="empty-list">
              No courses found.
            </div>
          </VueDraggable>
        </div>

        <div class="panel-section">
          <div class="panel-header">Student Resources</div>
          <table class="panel-table">
            <tbody>
              <tr><td><a href="https://www.geneva.edu/academics/registrar/pdf/4yr-plans/csc_web_tech-4yr-plan.pdf" target="_blank">Degree Plan</a></td></tr>
              <tr><td><RouterLink to="/metrics">Completed Courses</RouterLink></td></tr>
              <tr><td><a href="#" @click.prevent="showChangeMajor = true">Change Major</a></td></tr>
              <tr><td><a href="#">Add/Drop Major/Minor</a></td></tr>
            </tbody>
          </table>
        </div>

        <div class="panel-section">
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

  <ChangeMajorModal
    :isOpen="showChangeMajor"
    @close="showChangeMajor = false"
    @majorSelected="handleMajorChange"
  />
</template>

<style scoped>
.home { max-width: 1400px; margin: 0 auto; }

.layout { display: flex; flex-wrap: wrap; gap: 24px; }
.left-panel { flex: 3; overflow-y: auto; height: calc(100vh - 80px); }
.right-panel { flex: 1; min-width: 220px; position: sticky; top: 0; height: calc(100vh - 80px); overflow-y: auto; padding-top: 8px; display: flex; flex-direction: column; gap: 16px; }

.student-header { display: flex; align-items: center; gap: 12px; padding: 16px 24px; margin-bottom: 16px; border-bottom: 1px solid #ccc; flex-basis: 100%; }
.student-name { font-size: 1.2rem; font-weight: 700; display: block; }
.student-sub { font-size: 0.85rem; color: #666; }

.legend { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 16px; font-size: 0.85rem; }
.legend-item { font-weight: 700; }
.legend-sep { color: #ccc; }

.sem-block { margin-bottom: 16px; }
.sem-table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px 8px 0 0; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.sem-table th { background: #000; color: white; padding: 10px 14px; text-align: left; font-size: 0.95rem; }

.drop-zone { min-height: 60px; background: white; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; padding: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }

.course-row {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px; border-bottom: 1px solid #eee;
  cursor: grab; background: white; font-size: 0.9rem;
}
.course-row:last-child { border-bottom: none; }
.course-row:hover { background: #f9f9f9; }

.drop-hint { text-align: center; color: #bbb; padding: 16px; font-size: 0.85rem; }

.drag-handle { color: #ccc; cursor: grab; }
.course-code { font-weight: 600; min-width: 60px; }
.course-name { flex: 1; }
.credits { text-align: center; min-width: 30px; color: #666; font-size: 0.85rem; }

.type-major    { border-left: 4px solid #3b82f6; }
.type-minor    { border-left: 4px solid #f97316; }
.type-core     { border-left: 4px solid #22c55e; }
.type-elective { border-left: 4px solid #9ca3af; }

.panel-section { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.panel-header { background: #000; color: white; padding: 10px 14px; font-size: 0.95rem; font-weight: 600; }

.course-search { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-bottom: 1px solid #eee; }
.course-search input { border: none; outline: none; font-size: 0.85rem; width: 100%; }

.available-list { max-height: 300px; overflow-y: auto; }
.available-item {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 12px; border-bottom: 1px solid #eee;
  cursor: grab; font-size: 0.85rem;
}
.available-item:hover { background: #f9f9f9; }
.available-info { flex: 1; display: flex; flex-direction: column; }
.available-name { font-size: 0.75rem; color: #666; }
.empty-list { text-align: center; color: #bbb; padding: 16px; font-size: 0.85rem; }

.badge { padding: 3px 10px; border-radius: 12px; font-size: 0.78rem; font-weight: 600; white-space: nowrap; }
.status-passed     { background: #d4edda; color: #155724; }
.status-failed     { background: #f8d7da; color: #721c24; }
.status-progress   { background: #cce5ff; color: #004085; }
.status-scheduled  { background: #fff3cd; color: #856404; }
.status-audit      { background: #e2e3e5; color: #383d41; }
.status-transfer   { background: #d1ecf1; color: #0c5460; }
.status-notstarted { background: #f5f5f5; color: #999; }

.legend-item.type-major    { color: #3b82f6; }
.legend-item.type-minor    { color: #f97316; }
.legend-item.type-core     { color: #22c55e; }
.legend-item.type-elective { color: #9ca3af; }

.panel-table { width: 100%; border-collapse: collapse; }
.panel-table td { padding: 10px 14px; border-bottom: 1px solid #ccc; }
.panel-table tr:last-child td { border-bottom: none; }
.panel-table a { text-decoration: none; color: #333; font-size: 0.9rem; }
.panel-table a:hover { color: black; font-weight: 600; }

.transfer-table th { background: #1a5276; }

.info  { color: #555; margin-bottom: 16px; }
.error { color: #c0392b; margin-bottom: 16px; }
</style>