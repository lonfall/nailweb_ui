<template>
  <el-main class="i-el-main">
    <el-breadcrumb class="i-el-main-breadcrumb"
                   separator-class="el-icon-arrow-right">
      <template v-for="path in pathList">
        <template v-if="path.type == 1">
          <el-breadcrumb-item :key="'breadcrumb'+path.id" :to="{ path: path.url }">{{path.name}}</el-breadcrumb-item>
        </template>
        <template v-if="path.type == 0">
          <el-breadcrumb-item :key="'breadcrumb'+path.id">{{path.name}}</el-breadcrumb-item>
        </template>
      </template>
    </el-breadcrumb>
    <el-card class="i-el-main-content"
             :body-style="{ 'min-height': contentHeight + 'px' }"
             shadow="always">
      <router-view />
    </el-card>
  </el-main>
</template>

<script>
export default {
  props: {
    documentClientHeight: Number
  },
  computed: {
    pathList: {
      get: function () {
        return this.$store.getters.getPathList
      },
      set: function (newValue) {
        this.$store.commit('setPathList', newValue)
      }
    },
    contentHeight: function () {
      return this.documentClientHeight - 60 - 35 - 40 - 2
    }
  }
}
</script>

<style>
.i-el-main {
  background-color: #f5f7f9;
}
.i-el-main-content {
  background-color: #fff;
  min-height: 100%;
}
.i-el-main-breadcrumb {
  margin-bottom: 20px;
}
</style>
