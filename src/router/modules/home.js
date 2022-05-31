// 首页模块
const homeRouter = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
  },
]

export default homeRouter
