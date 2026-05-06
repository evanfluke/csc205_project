import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '../stores/auth'
import HomeView from '../views/HomeView.vue'
import StudentsView from '../views/students.vue'
import StudentDetail from '../views/studentdetail.vue'
import ScheduleView from '../views/ScheduleView.vue'
import Detail from '../views/Detail.vue'
import MetricsView from '../views/MetricsView.vue'

//const router = createRouter({
  //history: createWebHistory(import.meta.env.BASE_URL),
  //routes: [],
//})

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/students', component: StudentsView },
    { path: '/students/id', component: StudentDetail },
    { path: '/metrics', component: MetricsView },
    { path: '/schedule', component: ScheduleView },
    { path: '/detail', component: Detail}
  ]
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.token) return '/'
})

export default router
