<template>
  <el-header class="i-el-header">
    <el-dropdown trigger="click"
                 class="i-el-header-dropdown">
      <span class="el-dropdown-link i-el-header-dropdown-link">
        <div class="i_avatar_div">
          <el-avatar :size='40'
                     src="https://empty"
                     @error="errorHandler">
            <img :src="error" />
          </el-avatar>
        </div>
        {{user.nickname}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="fa fa-cog">系统设置</el-dropdown-item>
        <el-dropdown-item icon="fa fa-sign-out">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-header>
</template>

<script>
import avatarError from '@/assets/img/avatar_error.png'

export default {
  data () {
    return {
      error: avatarError
    }
  },
  methods: {
    errorHandler () {
      return true
    }
  },
  props: {
    user: Object
  }
}
</script>

<style>
.i-el-header-submenu > .el-submenu__title:hover,
.i-el-header-submenu > .el-submenu__title:focus {
  background: #9dd7d42b !important;
}
.i-el-header-menu-item:hover,
.i-el-header-menu-item:focus {
  background: #9dd7d42b !important;
}
.i-el-header {
  background: #2d8cf0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1000;
}
.i-el-header-menu-horizontal {
  float: right;
}
.i-el-header-icon {
  color: #cbced4;
}
.i-el-header-dropdown {
  float: right;
  color: #fff;
  left: 20px;
}
.i-el-header-dropdown-link {
  height: 60px;
  padding: 0px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.i-el-header-dropdown-link:hover {
  background-color: #2286e2;
  cursor: pointer;
}

.i_avatar_div {
  padding-right: 5px;
}
</style>
