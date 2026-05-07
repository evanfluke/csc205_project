<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth    = useAuthStore()
const majors  = ref([])
const selected = ref(null)
const loading = ref(true)
const error   = ref('')

defineProps({ isOpen: Boolean })
const emit = defineEmits(['close', 'majorSelected'])

onMounted(async () => {
  try {
    const res = await fetch('https://checksheets.cscprof.com/majors', {
      headers: auth.authHeaders()
    })
    if (!res.ok) throw new Error('Failed to load majors')
    const data = await res.json()
    majors.value = Array.isArray(data) ? data : []
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

function confirmChange() {
  if (!selected.value) return
  emit('majorSelected', selected.value)
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h3>Change Major</h3>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <div class="modal-body">
        <p class="hint">Select a new major.</p>

        <div v-if="loading" class="info">Loading majors...</div>
        <div v-if="error"   class="error">{{ error }}</div>

        <div v-if="!loading" class="major-list">
          <div
            v-for="m in majors" :key="m.major_id"
            :class="['major-item', { selected: selected?.major_id === m.major_id }]"
            @click="selected = m"
          >
            <span class="major-name">{{ m.major_name }}</span>
            <span class="major-abbr">{{ m.major_abbreviation }}</span>
          </div>
        </div>

        <div class="buttons">
          <button class="btn-primary" @click="confirmChange" :disabled="!selected">
            Confirm Change
          </button>
          <button class="btn-secondary" @click="$emit('close')">Cancel</button>
        </div>
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
  background: white; border-radius: 12px;
  width: 400px; max-height: 80vh;
  display: flex; flex-direction: column;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  overflow: hidden;
}
.modal-header {
  background: #000; color: white;
  padding: 14px 20px;
  display: flex; justify-content: space-between; align-items: center;
}
.modal-header h3 { margin: 0; color: white; font-size: 1rem; }
.close-btn { background: none; border: none; color: white; font-size: 1.1rem; cursor: pointer; }

.modal-body { padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
.hint { font-size: 0.85rem; color: #666; }

.major-list { display: flex; flex-direction: column; gap: 8px; }
.major-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 16px; border: 1px solid #ccc; border-radius: 8px;
  cursor: pointer; transition: all 0.15s;
}
.major-item:hover { background: #f5f5f5; border-color: #999; }
.major-item.selected { background: #000; color: white; border-color: #000; }
.major-name { font-weight: 600; font-size: 0.95rem; }
.major-abbr { font-size: 0.8rem; color: #999; }
.major-item.selected .major-abbr { color: #ccc; }

.buttons { display: flex; gap: 10px; margin-top: 8px; }
.btn-primary {
  flex: 1; padding: 9px; background: #000; color: white;
  border: none; border-radius: 6px; cursor: pointer; font-weight: 600;
}
.btn-primary:disabled { background: #ccc; cursor: not-allowed; }
.btn-secondary {
  flex: 1; padding: 9px; background: white; color: #555;
  border: 1px solid #ccc; border-radius: 6px; cursor: pointer;
}

.info  { color: #555; }
.error { color: #c0392b; }
</style>