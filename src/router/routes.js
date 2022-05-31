import { createRouter, createWebHashHistory } from 'vue-router'

const modules = import.meta.globEager('./modules/**/*.js')
const routeModuleList = []

Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routeModuleList.push(...modList)
})

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
  },
  { path: '/', redirect: { name: 'Home' } },
  ...routeModuleList,
  {
    path: '/:path(.*)*',
    name: 'PageNotFound',
    component: () => import('@/views/errorPage/404.vue'),
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})
