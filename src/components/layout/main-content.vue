<template>
  <el-main class="i-el-main">
    <el-breadcrumb class="i-el-main-breadcrumb"
                   separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
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
