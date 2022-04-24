import { createRouter, createWebHistory } from 'vue-router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

const router = createRouter({
  history: createWebHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes: [
    {
      path: '/calc',
      name: 'Calculator',
      component: () => import('@views/Calc.vue'),
    },
    {
      path: '/calc-search',
      name: 'Add',
      component: () => import('@views/Search.vue')
    },
    {
      path: '/calc-analysis',
      name: 'Diet Analysis',
      component: () => import('@views/DietAnalysis.vue')
    },
    {
      path: '/user',
      name: 'User Info',
      component: () => import('@views/User.vue'),
    },
    {
      path: '/about',
      name: 'About Us',
      component: () => import('@views/About.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/calc'
    }
  ]
})

router.beforeEach((to, from, next) => {
  nprogress.start()
  document.title = to.name as string + ' | Project'
  next()
})

router.afterEach(() => {
  nprogress.done()
})

export default router
