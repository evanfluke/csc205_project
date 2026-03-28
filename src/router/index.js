import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '../stores/auth'
import HomeView from '../views/HomeView.vue'
import StudentsView from '../views/studentsview.vue'
import StudentDetail from '../views/studentdetail.vue'

//const router = createRouter({
  //history: createWebHistory(import.meta.env.BASE_URL),
  //routes: [],
//})

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/students', component: StudentsView, meta: { requiresAuth: true} },
    { path: '/students/id', component: StudentDetail, meta: { requiresAuth: true} },
  ]
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.token) return '/'
})

export default router
