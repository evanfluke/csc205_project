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