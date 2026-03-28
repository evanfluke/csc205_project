<script setup>
defineProps({
  isOpen: Boolean,
  title: String,
  fields: Array   // [{ label: 'Course', value: 'CS101' }, ...]
})
defineEmits(['close'])
</script>

<template>
  <div v-if="isOpen" class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>
      <div class="modal-body">
        <div v-for="field in fields" :key="field.label" class="field-row">
          <span class="field-label">{{ field.label }}</span>
          <span class="field-value">{{ field.value ?? '—' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 2000;
}
.modal {
  background: white; border-radius: 12px;
  width: 360px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  overflow: hidden;
}
.modal-header {
  background: #000000; color: white;
  padding: 14px 20px;
  display: flex; justify-content: space-between; align-items: center;
}
.modal-header h3 { margin: 0; font-size: 1rem; color: #f0c040; }
.close-btn {
  background: none; border: none; color: white;
  font-size: 1.1rem; cursor: pointer;
}
.modal-body { padding: 20px; display: flex; flex-direction: column; gap: 12px; }
.field-row { display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 8px; }
.field-label { font-size: 0.85rem; color: #777; }
.field-value { font-size: 0.9rem; font-weight: 600; color: #1a2a4a; }
</style>