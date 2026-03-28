<script setup>
const semesters = [
  'Fall Year 1', 'Spring Year 1',
  'Fall Year 2', 'Spring Year 2',
  'Fall Year 3', 'Spring Year 3',
  'Fall Year 4', 'Spring Year 4',
]
</script>

<template>
  <div class="home">
    <div class="layout">
      <div class="student-header">
        <i class="fa-solid fa-circle-user fa-2x"></i>
        <div>
          <span class="student-name">John Smith</span>
          <span class="student-sub">Computer Science | Junior</span>
        </div>
      </div>
      <div class="left-panel">
        <div class="tables">
          <table v-for="sem in semesters" :key="sem" class="sem-table">
            <thead><tr><th colspan="2">{{ sem }}</th></tr></thead>
            <tbody>
              <tr><td>Course placeholder</td><td class="status">—</td></tr>
              <tr><td>Course placeholder</td><td class="status">—</td></tr>
              <tr><td>Course placeholder</td><td class="status">—</td></tr>
              <tr><td>Course placeholder</td><td class="status">—</td></tr>
              <tr><td>Course placeholder</td><td class="status">—</td></tr>
              <tr><td>Course placeholder</td><td class="status">—</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="right-panel">
        <div class="panel-top">
          <div class="panel-header">Student Resources</div>
          <table class="panel-table">
            <tbody>
              <tr><td><a href="#">Degree Plan</a></td></tr>
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

.student-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  margin-bottom: 16px;
  border-bottom: 1px solid #ccc;
  flex-basis: 100%;
}
.student-name { font-size: 1.2rem; font-weight: 700; display: block; }
.student-sub { font-size: 0.85rem; color: #666; }

.sem-table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); margin-bottom: 16px; }
.sem-table th { background: #000000; color: white; padding: 10px 14px; text-align: left; font-size: 0.95rem; }
.sem-table td { padding: 10px 14px; border-bottom: 1px solid #ccc; font-size: 0.9rem; }
.sem-table tr:last-child td { border-bottom: none; }
.status { color: #999; text-align: center; width: 80px; }

.panel-top { margin-bottom: 20px; }
.panel-bottom { }

.panel-header {
  background: #000000;
  color: white;
  padding: 10px 14px;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 8px 8px 0 0;
}

.panel-table { width: 100%; border-collapse: collapse; background: white; border-radius: 0 0 8px 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.panel-table td { padding: 10px 14px; border-bottom: 1px solid #ccc; }
.panel-table tr:last-child td { border-bottom: none; }
.panel-table a { text-decoration: none; color: #333; font-size: 0.9rem; }
.panel-table a:hover { color: black; font-weight: 600; }
</style>