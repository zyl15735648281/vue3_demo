import { router } from './routes'
import { AxiosCanceler } from '@/utils/http/axios/axiosCancel'

const axiosCanceler = new AxiosCanceler()

// * 路由拦截
router.beforeEach((_to, _from, next) => {
  // * 在跳转路由之前，清除所有的请求
  axiosCanceler.removeAllPending()
  next()
})

export default router
