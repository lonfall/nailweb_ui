<template>
  <el-aside class="i-el-aside" width="230px">
    <el-menu mode="vertical" unique-opened router :default-active="active" background-color="#fff0" text-color="#ffffff"
             active-text-color="#40b4ff" class="i-el-aside-menu-vertical" @select="menuSelect">
      <template v-for="node in treeData">
        <template v-if="node.data.type === 0 && !node.data.hide">
          <Submenu :node="node" :key="node.id"></Submenu>
        </template>

        <template v-if="node.data.type === 1 && !node.data.hide">
          <el-menu-item class="i-el-aside-submenu" :index="node.data.url" :key="node.id">
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
  computed: {
    pathList: {
      get: function () {
        return this.$store.getters.getPathList
      },
      set: function (newValue) {
        this.$store.commit('setPathList', newValue)
      }
    }
  },
  components: {
    Submenu
  },
  methods: {
    menuIndexPathListFind (index, pathList, treeData) {
      let list = []
      for (let i = 0; i < treeData.length; i++) {
        let td = treeData[i]
        if (td.data.type === 1) {
          if (td.data.url === index) {
            list.push.apply(list, pathList)
            list.push({
              id: td.data.id,
              type: 1,
              name: td.data.name,
              url: td.data.url
            })
            return list
          }
        } else if (td.data.type === 0 && td.hasChildren === true) {
          list.push({
            id: td.data.id,
            type: 0,
            name: td.data.name,
            url: td.data.url
          })
          return this.menuIndexPathListFind(index, list, td.children)
        }
      }
      return []
    },
    menuSelect (index, indexPath) {
      this.pathList = this.menuIndexPathListFind(index, [], this.treeData)
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
