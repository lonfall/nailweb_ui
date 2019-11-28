<template>
  <el-aside class="i-el-aside"
            width="230px">
    <el-menu mode="vertical"
             unique-opened
             router
             :default-active="active"
             background-color="#fff0"
             text-color="#ffffff"
             active-text-color="#40b4ff"
             class="i-el-aside-menu-vertical"
             @select="menuSelect">
      <template v-for="(node,key) in treeData">
        <template v-if="node.data.type === 0 && !node.data.hide">
          <Submenu :node="node"
                   :key="key"></Submenu>
        </template>

        <template v-if="node.data.type === 1 && !node.data.hide">
          <el-menu-item class="i-el-aside-submenu"
                        :index="node.data.url"
                        :key="key">
            <i :class="node.data.icon"></i>
            <span slot="title">{{node.data.name}}</span>
          </el-menu-item>
        </template>
      </template>

      <!-- <el-menu-item class="i-el-aside-submenu"
                    index="/home">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu index="/">
        <template slot="title">
          <i class="el-icon-s-tools"></i>
          <span>系统设置</span>
        </template>
        <el-menu-item class="i-el-aside-submenu"
                      index="/user">
          <i class="el-icon-user-solid"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>
        <el-menu-item class="i-el-aside-submenu"
                      index="/role">
          <i class="el-icon-user-solid"></i>
          <span slot="title">角色管理</span>
        </el-menu-item>
        <el-menu-item class="i-el-aside-submenu"
                      index="/menu">
          <i class="el-icon-menu"></i>
          <span slot="title">菜单管理</span>
        </el-menu-item>
      </el-submenu> -->

    </el-menu>
  </el-aside>
</template>

<script>
import Submenu from './submenu'

export default {
  data () {
    return {
      active: '/home',
      treeData: []
    }
  },
  components: {
    Submenu
  },
  methods: {
    menuSelect (index, indexPath) {
      // console.log('index:' + index + ',indexPath:' + indexPath)
    }
  },
  watch: {
    $route (to, from) {
      this.active = to.path
    }
  },
  created () {
    this.active = this.$route.path
    this.$axiox.get('/sys/menu/tree')
      .then((response) => {
        if (response.data.code === 200) {
          this.treeData = response.data.data
        } else if (response.data.msg) {
          this.$message.error(response.data.msg)
        }
      })
      .catch((error) => {
        console.log('error:' + error)
      })
  }
}
</script>

<style>
.i-el-aside {
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  z-index: 1020;
  overflow: hidden;
  background-color: #515a6e;
}
.i-el-aside-menu-vertical {
  border-right: 0;
}
.i-el-aside-menu-item > [class^="el-icon"] {
  color: #ffffff;
}
.i-el-aside-submenu [class^="el-icon"] {
  color: #ffffff;
}
</style>
