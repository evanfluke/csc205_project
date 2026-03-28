<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter }    from 'vue-router'
import LoginModal          from './login.vue'
import ChangePasswordModal from './changepassword.vue'

const auth       = useAuthStore()
const router     = useRouter()
const showLogin  = ref(false)
const showChange = ref(false)

async function handleLogout() {
  await auth.logout()
  router.push('/')
}
</script>

<template>
  <header class="header">
    <span class="logo"><i class="fa-solid fa-bars"></i></span>

    <nav class="nav">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/students">Students</RouterLink>
      <a href="https://my.geneva.edu/ics/" target="_blank">MyGeneva</a>
      
    </nav>
    <!-- <nav class="nav">
      <RouterLink to="/"></RouterLink>
      <RouterLink to="/" v-if="auth.token"></RouterLink>
    </nav> -->





    <div class="auth-controls">
      <template v-if="auth.token">
        <span class="welcome">{{ auth.user?.name ?? 'Advisor' }}</span>
        <button class="btn-secondary" @click="showChange = true">Change Password</button>
        <button class="btn-primary"   @click="handleLogout">Logout</button>
      </template>
      <template v-else>
        <button class="btn-primary" @click="showLogin = true">Login</button>
      </template>
    </div>
  </header>

  <LoginModal          :isOpen="showLogin"  @close="showLogin = false" />
  <ChangePasswordModal :isOpen="showChange" @close="showChange = false" />
</template>

<style scoped>
.header {
  position: fixed; top: 0; left: 0; width: 100%;
  height: 70px;
  background: #000000;
  color: rgb(255, 255, 255);
  display: flex; align-items: center;
  padding: 0 32px; gap: 24px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.logo { font-size: 1.2rem; font-weight: 700; color: #d4a72a; white-space: nowrap; }

.nav { display: flex; gap: 20px; flex: 1; }
.nav a { color: #ccc; text-decoration: none; font-size: 0.95rem; }
.nav a.router-link-active { color: white; font-weight: 600; border-bottom: 2px solid #f0c040; }

.auth-controls { display: flex; align-items: center; gap: 12px; margin-left: auto; }

.welcome { font-size: 0.9rem; color: #ffffff; }

.btn-primary {
  padding: 6px 16px; border-radius: 6px; border: none; cursor: pointer;
  background: #f0c040; color: #000000; font-weight: 600;
}
.btn-secondary {
  padding: 6px 16px; border-radius: 6px; cursor: pointer;
  background: transparent; color: #000000; border: 1px solid #000000;
}
.btn-secondary:hover { border-color: #ffffff; color: white; }
</style>