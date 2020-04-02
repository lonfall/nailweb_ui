<template>
  <el-submenu v-if="node.data.type === 0 && !node.data.hide"
              :index="node.id"
              :disabled="!node.hasChildren">
    <template slot="title">
      <i :class="node.data.icon"></i>
      <span>{{node.data.name}}</span>
    </template>

    <template v-if="node.children && node.children.length">
      <template v-for="child_node in node.children">
        <template v-if="child_node.data.type === 0 && !child_node.data.hide">
          <Submenu :node="child_node"
                   :key="child_node.id"></Submenu>
        </template>

        <template v-if="child_node.data.type === 1 && !child_node.data.hide">
          <el-menu-item class="i-el-aside-submenu"
                        :index="child_node.data.url"
                        :key="child_node.id">
            <i :class="child_node.data.icon"></i>
            <span slot="title">{{child_node.data.name}}</span>
          </el-menu-item>
        </template>
      </template>
    </template>
  </el-submenu>
</template>

<script>
export default {
  name: 'Submenu',
  data () {
    return {}
  },
  props: {
    node: Object
  }
}
</script>

<style>
</style>
