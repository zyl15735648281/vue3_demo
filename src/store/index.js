import { defineStore } from 'pinia'

const TOKEN_KEY = 'TOKEN_KEY'
const ROLES_KEY = 'ROLES_KEY'

export default defineStore({
  id: 'user',
  state: () => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Last fetch time
    lastUpdateTime: 0,
    clientId: 951128,
  }),
  getters: {
    getUserInfo() {
      return this.userInfo || {}
    },
    getToken() {
      return this.token || localStorage.getItem(TOKEN_KEY)
    },
    getRoleList() {
      return this.roleList.length > 0 ? this.roleList : JSON.parse(localStorage.getItem(ROLES_KEY))
    },
    getLastUpdateTime() {
      return this.lastUpdateTime
    },
    getClientId() {
      return this.clientId
    },
  },
  actions: {
    setToken(info) {
      this.token = info || '' // for null or undefined value
      localStorage.setItem(TOKEN_KEY, info)
    },
    setRoleList(roleList) {
      this.roleList = roleList
      localStorage.setItem(ROLES_KEY, JSON.stringify(roleList))
    },
    setUserInfo(info) {
      this.userInfo = info
      this.lastUpdateTime = new Date().getTime()
    },
    setClientId(flag) {
      this.clientId = flag
    },
    resetState() {
      this.userInfo = null
      this.token = ''
      this.roleList = []
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
    async afterLoginAction(goHome) {
      console.log(goHome)
      // if (!this.getToken) return null;
      // // get user info
      // const userInfo = await this.getUserInfoAction();
      //
      // const sessionTimeout = this.sessionTimeout;
      // if (sessionTimeout) {
      //   this.setSessionTimeout(false);
      // } else {
      //   const permissionStore = usePermissionStore();
      //   if (!permissionStore.isDynamicAddedRoute) {
      //     const routes = await permissionStore.buildRoutesAction();
      //     routes.forEach((route) => {
      //       router.addRoute(route as unknown as RouteRecordRaw);
      //     });
      //     router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
      //     permissionStore.setDynamicAddedRoute(true);
      //   }
      //   // goHome && (await router.replace(userInfo?.homePath || PageEnum.HOME));
      //   goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
      // }
      // return userInfo;
    },
    async getUserInfoAction() {
      // if (!this.getToken) return null;
      // const userInfo = await getUserInfo();
      // const { roles = [] } = userInfo;
      // if (isArray(roles)) {
      //   const roleList = roles.map((item) => item.value) as RoleEnum[];
      //   this.setRoleList(roleList);
      // } else {
      //   userInfo.roles = [];
      //   this.setRoleList([]);
      // }
      // this.setUserInfo(userInfo);
      // return userInfo;
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

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      // const { createConfirm } = useMessage();
      // const { t } = useI18n();
      // createConfirm({
      //   iconType: 'warning',
      //   title: () => h('span', t('sys.app.logoutTip')),
      //   content: () => h('span', t('sys.app.logoutMessage')),
      //   onOk: async () => {
      //     await this.logout(true);
      //   },
      // });
    },
  },
})
