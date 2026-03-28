<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close'])

const auth        = useAuthStore()
const current     = ref('')
const newPass     = ref('')
const confirm     = ref('')
const error       = ref('')
const success     = ref(false)
const loading     = ref(false)

function close() { error.value = ''; success.value = false; emit('close') }

async function handleChange() {
  error.value   = ''
  success.value = false

  if (newPass.value !== confirm.value) return (error.value = 'Passwords do not match')
  if (newPass.value.length < 4)       return (error.value = 'Password too short')

  loading.value = true
  try {
    await auth.changePassword(auth.user?.username, current.value, newPass.value)
    success.value = true
    current.value = newPass.value = confirm.value = ''
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
      <h2>Change Password</h2>

      <label>Current Password</label>
      <input v-model="current" type="password" placeholder="Current password" />

      <label>New Password</label>
      <input v-model="newPass" type="password" placeholder="New password" />

      <label>Confirm New Password</label>
      <input v-model="confirm" type="password" placeholder="Confirm new password" />

      <p v-if="error"   class="error">{{ error }}</p>
      <p v-if="success" class="success">Password changed successfully!</p>

      <div class="buttons">
        <button class="btn-primary" @click="handleChange" :disabled="loading">
          <span v-if="loading" class="spinner" /><span v-else>Update</span>
        </button>
        <button class="btn-secondary" @click="close">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* same modal shell as LoginModal */
.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.55);
  display: flex; justify-content: center; align-items: center; z-index: 2000;
}
.modal {
  background: white; padding: 2rem; border-radius: 12px;
  width: 340px; display: flex; flex-direction: column; gap: 8px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}
h2 { color: #1a2a4a; }
label { font-size: 0.85rem; color: #555; }
input { padding: 9px 12px; border: 1px solid #ccc; border-radius: 6px; width: 100%; }
.error   { color: #c0392b; font-size: 0.85rem; }
.success { color: #27ae60; font-size: 0.85rem; }
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
@keyframes spin { to { transform: rotate(360deg); } }
</style>