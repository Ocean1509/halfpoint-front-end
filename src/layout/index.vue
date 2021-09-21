<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <el-card v-if="route === 'overview'" class="box-card total-container">
        <p class="box-card-title">
          <span>当前规模:  <span class="color-rise">{{ formate(total) }}</span></span>
          <span>今日盈亏:  <span class="color-rise">{{ formate(rReturn) }}</span></span>
        </p>
        <div class="box-card-container">
          <span>自营：<span class="color-rise">{{ formate(selfrunAccount) }}</span></span>
          <span>产品：<span class="color-rise">{{ formate(fundAccount) }}</span></span>
          <span>MOM：<span class="color-rise">{{ formate(momAccount) }}</span></span>
        </div>
      </el-card>

      <div v-else-if="route === 'config'">
        <strategy-config />
      </div>
      <div v-else-if="route === 'contract'">
        <contract-config />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { formatNumber } from 'accounting'
import StrategyConfig from '@/views/overview/strategyConfig.vue'
import ContractConfig from '@/views/overview/contractConfig.vue'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    StrategyConfig,
    ContractConfig
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    route() {
      return this.$route.name
    },
    accounts() {
      return this.$store.state.common.account
    },
    selfrunAccount() {
      return this.accounts['SELFRUN'].reduce((pre, current) => {
        return pre + (current.total || 0)
      }, 0)
    },
    selfrunReturn() {
      return this.accounts['SELFRUN'].reduce((pre, current) => {
        return pre + (current.r_return || 0)
      }, 0)
    },
    fundAccount() {
      return this.accounts['FUND'].reduce((pre, current) => {
        return pre + (current.total || 0)
      }, 0)
    },
    fundAccountReturn() {
      return this.accounts['FUND'].reduce((pre, current) => {
        return pre + (current.r_return || 0)
      }, 0)
    },
    momAccount() {
      return this.accounts['MOM'].reduce((pre, current) => {
        return pre + (current.total || 0)
      }, 0)
    },
    momAccountReturn() {
      return this.accounts['MOM'].reduce((pre, current) => {
        return pre + (current.r_return || 0)
      }, 0)
    },
    total() {
      return this.selfrunAccount + this.fundAccount + this.momAccount
    },
    rReturn() {
      return this.selfrunReturn + this.fundAccountReturn + this.momAccountReturn
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    formate(v) {
      return formatNumber(v)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }

  .total-container{
    position: absolute;
    width: 800px;
    font-size: 18px;
    top: 120px;
    left: 40px;
    // color: #606266;
    // border: 1px solid grey;
    // padding: 14px;
    // border-radius: 3px;
    .box-card-title {
      margin:0;
      padding: 30px 0;
      border-bottom: 1px solid #ddd;
      font-weight: bold;
      display: flex;
      justify-content: space-around;
    }
    .box-card-container{
      display: flex;
      flex-direction: row;
      padding: 30px 0;
      justify-content: space-around;
      font-weight: bold;
      font-size: 16px;
    }
  }
</style>
