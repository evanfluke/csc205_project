<!-- 

<script setup>
import { ref } from 'vue'
import LoginModal from './components/LoginModal.vue'

const showLogin = ref(false)

function handleLogin(credentials) {
  console.log('Logging in with:', credentials)

  // replace
  showLogin.value = false
}
</script>

<template>
  <button @click="showLogin = true">Login</button>

    <LoginModal
      :isOpen="showLogin"
      @close="showLogin = false"
      @login="handleLogin"
    />

  <div class="app">
    <header class="header">
      <button class="hamburger">☰</button>
      <h1 class="header-title">Geneva Course Registration</h1>

      <nav class="header-nav">
       <a href="#">MyGeneva</a>
       <a href="#">Explore Degree Programs</a>
       <a href="#">Schedule</a>
       <a href="#">Change Major</a>
      </nav>
    </header>

    <main class="content">
      <table class="table1">
        <thead>
          <tr>
            <th colspan ="2">Semester</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
        </tbody>
      </table>
       <table class="table1">
        <thead>
          <tr>
            <th colspan ="2">Semester</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
        </tbody>
      </table>
       <table class="table1">
        <thead>
          <tr>
            <th colspan ="2">Semester</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
        </tbody>
      </table>
       <table class="table1">
        <thead>
          <tr>
            <th colspan ="2">Semester</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
        </tbody>
      </table>
       <table class="table1">
        <thead>
          <tr>
            <th colspan ="2">Semester</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
        </tbody>
      </table>
       <table class="table1">
        <thead>
          <tr>
            <th colspan ="2">Semester</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
        </tbody>
      </table>
       <table class="table1">
        <thead>
          <tr>
            <th colspan ="2">Semester</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
        </tbody>
      </table>
       <table class="table1">
        <thead>
          <tr>
            <th colspan ="2">Semester</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Status</td>
          </tr>
        </tbody>
      </table>
      <aside class="right-panel">
  <table class="side-table">
    <tr>
      <th>Search</th>
    </tr>
    <tr>
      <td>
        <select>
          <option>Search Courses</option>
          <option>CS101</option>
          <option>CS301</option>
          <option>CS420</option>
        </select>
      </td>
    </tr>
    <tr><td><a href="#">Degree Plan</a></td></tr>
    <tr><td><a href="#">Completed</a></td></tr>
    <tr><td><a href="#">Remaining</a></td></tr>
  </table>
</aside>
    </main>
    <footer class="footer">
    <p>Copyright Geneva College 2026</p>
    </footer>

  </div>
</template>

<style scoped>
.app 
    {
      background-color: #6b9bda;
      min-height: 100vh;
    }

.header,
.footer,
.degree-table,
.side-table {
  background-color: white;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.hamburger 
{
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
}

.content 
{
  margin-top: 160px;
  padding: 40px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.main-header {
  font-size: 3rem;
  margin-bottom: 100px;
}

.table1 {
  width: 33%;
  min-width: 300px;
  border-collapse: collapse;
  text-align: center;
}

.table1 th,
.table1 td {
  border: 1px solid #ccc;
  padding: 12px;
}

.table1 tr,
.table1 th {
  background-color: #f5f5f5;
}

.right-panel {
  position: fixed;
  right: 60px;
  top: 260px;
  width: 260px;
}

.side-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  background: white;
}

.side-table th,
.side-table td {
  border: 1px solid #ccc;
  padding: 10px;
}

.side-table select {
  width: 100%;
  padding: 5px;
}

.side-table a {
  text-decoration: none;
  color: #333;
}

.footer {
  width: 100%;
  padding: 20px;
  text-align: center;
  background: #f5f5f5;
  border-top: 1px solid #ddd;
  margin-top: 40px;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 120px;

  display: flex;
  align-items: center;

  padding: 0 40px;

  background: white;
  border-bottom: 1px solid #ddd;
  z-index: 1000;
}

.header-title 
{
  font-size: 1.8rem;
  font-weight: 600;
}

.header-nav 
{
  display: flex;
  gap: 30px;
  margin-left: auto;
}

</style> -->

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <div class="app">
    <AppHeader />
    <main class="content">
      <RouterView />
    </main>
    <footer class="footer">
      <p>Copyright Geneva College 2026</p>
    </footer>
  </div>
</template>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }

body { font-family: 'Segoe UI', sans-serif; }

.app { background-color: #e8edf5; min-height: 100vh; display: flex; flex-direction: column; }

.content { margin-top: 80px; padding: 40px; flex: 1; }

.footer {
  padding: 20px;
  text-align: center;
  background: #000000;
  color: #ccc;
  font-size: 0.85rem;
}
</style>