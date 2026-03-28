
<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
const role = ref('')

defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close'])

const auth     = useAuthStore()
const username = ref('')
const password = ref('')
const error    = ref('')
const loading  = ref(false)

function close() { if (!loading.value) { error.value = ''; emit('close') } }

async function handleLogin() {
  error.value   = ''
  loading.value = true
  try {
    await auth.login(username.value, password.value)
    close()
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="isOpen" class="overlay" @click.self="close">
    <div class="modal">

      <!-- role picker -->
      <div v-if="!role" class="role-picker">
        <h2>Login As</h2>
        <button class="role-btn" @click="role = 'advisor'">
          <i class="fa-solid fa-chalkboard-teacher"></i> Advisor
        </button>
        <button class="role-btn" @click="role = 'student'">
          <i class="fa-solid fa-user-graduate"></i> Student
        </button>
        <button class="btn-secondary" @click="close">Cancel</button>
      </div>

      <!--login form -->
      <div v-if="role">
        <h2>{{ role === 'advisor' ? 'Advisor Login' : 'Student Login' }}</h2>

        <label>Username</label>
        <input v-model="username" type="text" placeholder="Username" />

        <label>Password</label>
        <input v-model="password" type="password" placeholder="Password" @keyup.enter="handleLogin" />

        <p v-if="error" class="error">{{ error }}</p>

        <div class="buttons">
          <button class="btn-primary" @click="handleLogin" :disabled="loading">
            <span v-if="loading" class="spinner" /><span v-else>Login</span>
          </button>
          <button class="btn-secondary" @click="close" :disabled="loading">Cancel</button>
        </div>

        <p class="back-link" @click="role = ''">← Back</p>
      </div>

    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex; justify-content: center; align-items: center;
  z-index: 2000;
}
.modal {
  background: white; padding: 2rem; border-radius: 12px;
  width: 340px; display: flex; flex-direction: column; gap: 8px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}
h2 { color: #1a2a4a; margin-bottom: 4px; }
label { font-size: 0.85rem; color: #555; }
input { padding: 9px 12px; border: 1px solid #ccc; border-radius: 6px; width: 100%; }
.error { color: #c0392b; font-size: 0.85rem; }
.buttons { display: flex; gap: 10px; margin-top: 8px; }
.btn-primary {
  flex: 1; padding: 9px; background: #1a2a4a; color: white;
  border: none; border-radius: 6px; cursor: pointer; font-weight: 600;
}
.btn-secondary {
  flex: 1; padding: 9px; background: white; color: #555;
  border: 1px solid #ccc; border-radius: 6px; cursor: pointer;
}
.spinner {
  width: 14px; height: 14px; border: 2px solid #aaa;
  border-top-color: white; border-radius: 50%;
  display: inline-block; animation: spin 0.7s linear infinite;
}

.role-picker { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 12px 0; }
.role-picker h2 { margin-bottom: 8px; }
.role-btn {
  width: 100%; padding: 12px;
  border: 1px solid #ccc; border-radius: 8px;
  font-size: 1rem; cursor: pointer; background: white;
}
.role-btn:hover { background: #f0f0f0; }
.back-link { font-size: 0.8rem; color: #888; cursor: pointer; margin-top: 8px; text-align: center; }
.back-link:hover { color: black; }

@keyframes spin { to { transform: rotate(360deg); } }
</style>