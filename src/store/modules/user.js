import { defineStore } from 'pinia'

const TOKEN_KEY = 'TOKEN_KEY'

export default defineStore({
  id: 'user',
  state: () => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
  }),
  getters: {
    getUserInfo() {
      return this.userInfo || {}
    },
    getToken() {
      return this.token || localStorage.getItem(TOKEN_KEY)
    },
  },
  actions: {
    setToken(info) {
      this.token = info || '' // for null or undefined value
      localStorage.setItem(TOKEN_KEY, info)
    },
    setUserInfo(info) {
      this.userInfo = info
      this.lastUpdateTime = new Date().getTime()
    },
    resetState() {
      this.userInfo = null
      this.token = ''
      this.sessionTimeout = false
    },
    /**
     * @description: login
     */
    async login(params) {
      console.log(params)
      // try {
      //   const { goHome = true, mode, ...loginParams } = params;
      //   loginParams.password = md5(loginParams.password).toString();
      //   const data = await loginApi(loginParams, mode);
      //   const token = data.access_token;
      //   // save token
      //   this.setToken(token);
      //   return this.afterLoginAction(goHome);
      // } catch (error) {
      //   return Promise.reject(error);
      // }
    },
    /**
     * @description: logout
     */
    async logout(goLogin) {
      console.log(goLogin)
      // if (this.getToken) {
      //   try {
      //     await doLogout();
      //   } catch {
      //     console.log('注销Token失败');
      //   }
      // }
      // this.setToken(undefined);
      // this.setSessionTimeout(false);
      // this.setUserInfo(null);
      // goLogin && router.push(PageEnum.BASE_LOGIN);
    },
  },
})
