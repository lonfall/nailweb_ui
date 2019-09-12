<template>
  <div class="layout">
    <el-container class="is-vertical">
      <MainHeader :user="user" />
      <MainAside />
      <div class="content"
           :style="{ 'min-height': documentClientHeight + 'px' }">
        <MainContent :documentClientHeight="documentClientHeight" />
      </div>
    </el-container>
  </div>
</template>

<script>
import MainAside from './main-aside'
import MainHeader from './main-header'
import MainContent from './main-content'

export default {
  data () {
    return {
      documentClientHeight: 0,
      user: {
        nickname: '用户名'
      }
    }
  },
  name: 'Main',
  components: {
    MainAside,
    MainHeader,
    MainContent
  },
  created () {
    this.$axiox.get('/sys/user/current')
      .then((response) => {
        if (response.data.code === 200) {
          this.user = response.data.data
        } else if (response.data.msg) {
          this.$message.error(response.data.msg)
        }
      })
      .catch((error) => {
        console.log('error:' + error)
      })
  },
  mounted () {
    this.resetDocumentClientHeight()
  },
  methods: {
    // 重置窗口可视高度
    resetDocumentClientHeight () {
      this.documentClientHeight = document.documentElement['clientHeight']
      window.onresize = () => {
        this.documentClientHeight = document.documentElement['clientHeight']
      }
    }
  }
}
</script>

<style>
.layout {
  position: relative;
}
.content {
  position: relative;
  padding-top: 60px;
  margin-left: 230px;
  min-height: 100%;
}
*,
*:before,
*:after {
  box-sizing: border-box;
}
</style>
