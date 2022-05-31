const demoRouter = [
  {
    path: '/demo',
    name: 'demo',
    component: () => import('@/views/demo/index.vue'),
  },
]

export default demoRouter
