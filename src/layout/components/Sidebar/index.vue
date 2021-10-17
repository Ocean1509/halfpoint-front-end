<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        @open="open"
        @close="close"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path"/>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import { accountLists } from '@/api/common'
import accountDetail from '@/views/overview/accountDetail.vue'

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      routes: [],
      timer: null,
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    // routes() {
    //   return this.$router.options.routes
    // },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return false
      // return !this.sidebar.opened
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  async mounted() {
    try {
      const res = await accountLists()
      if (!res.length) return
      const routeAppend = {
        SELFRUN: [],
        FUND: [],
        MOM: [],
        BACKTEST: []
      }
      for (const account of res) {
        const type = account.type
        switch (type) {
          case 'SELFRUN':
            routeAppend['SELFRUN'].push({
              path: account.trade_id,
              component: accountDetail,
              name: account.trade_id,
              meta: { title: account.trade_id, icon: '', tradeId: true, parent: 'SELFRUN', alwaysShow: true }
            })
            break
          case 'FUND':
            routeAppend['FUND'].push({
              path: account.trade_id,
              component: accountDetail,
              name: account.trade_id,
              meta: { title: account.trade_id, icon: '', tradeId: true, parent: 'FUND' }
            })
            break
          case 'MOM':
            routeAppend['MOM'].push({
              path: account.trade_id,
              component: accountDetail,
              name: account.trade_id,
              meta: { title: account.trade_id, icon: '', tradeId: true, parent: 'MOM' }
            })
            break
          case 'BACKTEST':
            routeAppend['BACKTEST'].push({
              path: account.trade_id,
              component: accountDetail,
              name: account.trade_id,
              meta: { title: account.trade_id, icon: '', tradeId: true, parent: 'BACKTEST' }
            })
            break
          default:
            break
        }
      }
      this.routes = this.$router.options.routes
      const idx = this.routes.findIndex((p, c) => p.meta && p.meta.account)
      this.$router.options.routes[idx].children.forEach(element => {
        element.children = routeAppend[element.name]
      })
      this.$router.addRoutes(this.$router.options.routes)

      console.log(this.$router)
      // 定时轮询
      this.updateAccount()
      this.timer = setInterval(() => {
        this.updateAccount()
      }, 30000)
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    open(to) {
      this.$router.push({ path: to })
    },
    close(to) {
      this.$router.push({ path: to })
    },
    updateAccount() {
      accountLists().then(res => {
        const selfrun = []
        const fun = []
        const mom = []
        const backtest = []
        for (const account of res) {
          const type = account.type

          switch (type) {
            case 'SELFRUN':
              selfrun.push(account)
              break
            case 'FUND':
              fun.push(account)
              break
            case 'MOM':
              mom.push(account)
              break
            case 'BACKTEST':
              backtest.push(account)
              break
            default:
              break
          }
        }
        this.$store.commit('common/SET_ACCOUNT', { account: selfrun, type: 'SELFRUN' })
        this.$store.commit('common/SET_ACCOUNT', { account: fun, type: 'FUND' })
        this.$store.commit('common/SET_ACCOUNT', { account: mom, type: 'MOM' })
        this.$store.commit('common/SET_ACCOUNT', { account: backtest, type: 'BACKTEST' })
      })
    }
  }
}
</script>
