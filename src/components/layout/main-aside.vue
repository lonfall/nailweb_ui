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
      <template v-for="node in treeData">
        <template v-if="node.data.type === 0 && !node.data.hide">
          <Submenu :node="node"
                   :key="node.id"></Submenu>
        </template>

        <template v-if="node.data.type === 1 && !node.data.hide">
          <el-menu-item class="i-el-aside-submenu"
                        :index="node.data.url"
                        :key="node.id">
            <i :class="node.data.icon"></i>
            <span slot="title">{{node.data.name}}</span>
          </el-menu-item>
        </template>
      </template>
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
      console.log('index:' + index + ',indexPath:' + indexPath + ',active:' + this.active)
    }
  },
  watch: {
    $route (to, from) {
      this.active = to.path
    }
  },
  created () {
    this.active = this.$route.path
    this.$axiox.get('/sys/menu/tree/current')
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
