import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChecksheetStore = defineStore('checksheet', () => {
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

  return { semesters, transferCourses }
})