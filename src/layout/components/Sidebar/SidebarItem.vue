<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}" :collapse="isCollapse">
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" class="headM" />
      </template>
      <!-- <div v-for="child in item.children" :key="child.path">
        <el-submenu ref="subMenu" :index="resolvePath(child.path)" popper-append-to-body>
          <template slot="title">
            <item v-if="child.meta" :icon="child.meta && child.meta.icon" :title="child.meta.title" class="headM" />
          </template>
          <div v-for="c in child.children" :key="c.path">
            <template>
              <app-link v-if="c.meta" :to="resolvePath(c.path)">
                <el-menu-item :index="resolvePath(c.path)" :class="{'submenu-title-noDropdown':!isNest}">
                  <item :title="c.meta.title" />
                </el-menu-item>
              </app-link>
            </template>
          </div>
        </el-submenu>
      </div> -->
      <!-- <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      /> -->
      <el-menu-item-group v-for="child in item.children" :key="child.path" class="el-menu-item-x">
        <span slot="title" style="cursor:pointer;display:block" @click="toRoute(child.name)">{{getTitle(child.name)}}</span>
        <el-menu-item v-for="c in child.children" :key="c.path" :index="resolvePath(c.path)" :class="{'submenu-title-noDropdown':!isNest}" class="el-menu-item-x-item" @click="toRoute(c.path)">
          <item :title="c.meta.title" />
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {
      isCollapse: false
    }
  },
  methods: {
    toRoute(r) {
      this.$router.push({ name: r })
    },
    getTitle(t) {
      switch (t) {
        case 'SELFRUN':
          return '自营'
        case 'FUND':
          return '产品'
        case 'BACKTEST':
          return '回测'
        default:
          return t
      }
    },
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
<style lang="scss">
.el-menu-item-x {

}
.el-menu-item-group__title {
    cursor: pointer;
    height: 50px !important;
    line-height: 36px !important;
    color: rgb(191, 203, 217);
    > span {
      font-weight: bold;
    }
    &:hover {
      background-color: #263445 !important;
    }
  }
#app .sidebar-container .nest-menu .el-submenu > .el-submenu__title, #app .sidebar-container .el-submenu .el-menu-item.el-menu-item-x-item {
  background-color: #304156 !important;
  padding-left: 60px !important;
  &:hover {
      background-color: #263445 !important;
    }
  > span {
    font-weight: normal;
  }
}
</style>
