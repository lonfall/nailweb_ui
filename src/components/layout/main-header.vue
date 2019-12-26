<template>
  <el-header class="i-el-header">
    <el-dropdown trigger="click"
                 class="i-el-header-dropdown"
                 @command="handleCommand">
      <span class="el-dropdown-link i-el-header-dropdown-link">
        <div class="i_avatar_div">
          <el-avatar :size='40'
                     :src="user.avatar"
                     @error="errorHandler">
            <img :src="error" />
          </el-avatar>
        </div>
        {{user.nickname}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="setting"
                          icon="fa fa-cog">修改头像
        </el-dropdown-item>
        <el-dropdown-item command="signOut"
                          icon="fa fa-sign-out">退出
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dialog title="修改头像"
               :visible.sync="dialogEditAvatar"
               :width="dialogWidth"
               :modal-append-to-body="false">
      <el-upload class="avatar-uploader"
                 :action="uploadUrl"
                 :with-credentials="true"
                 :show-file-list="false"
                 :on-success="handleAvatarSuccess"
                 :before-upload="beforeAvatarUpload">
        <img v-if="avatarUrl"
             :src="avatarUrl"
             class="avatar">
        <i v-else
           class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogEditAvatarCancel">取 消</el-button>
        <el-button type="primary"
                   @click="dialogEditAvatarConfirm">确 定
        </el-button>
      </div>
    </el-dialog>
  </el-header>
</template>

<script>
import avatarError from '@/assets/img/avatar_error.png'

export default {
  data () {
    return {
      error: avatarError,
      dialogWidth: '300px',
      dialogLabelWidth: '100px',
      dialogEditAvatar: false,
      avatarUrl: '',
      uploadUrl: process.env.API_HOST + 'file/upload'
    }
  },
  methods: {
    errorHandler () {
      return true
    },
    handleCommand (command) {
      switch (command) {
        case 'setting':
          this.dialogEditAvatar = true
          if (this.user.avatar) {
            this.avatarUrl = this.user.avatar
          }
          break
        case 'signOut':
          if (this.$cookies.isKey('token')) {
            this.$cookies.remove('token')
          }
          this.$router.push('/login')
          break
      }
    },
    dialogEditAvatarCancel () {
      this.dialogEditAvatar = false
    },
    dialogEditAvatarConfirm () {
      if (this.avatarUrl) {
        this.$axiox.put('/sys/user/avatar/' + this.user.id, {}, {
          params: {
            img: this.avatarUrl
          }
        })
          .then((response) => {
            if (response.data.code === 200) {
              this.$message({
                message: '编辑用户头像成功',
                type: 'success'
              })
              this.user.avatar = this.avatarUrl
            } else if (response.data.msg) {
              this.$message.error(response.data.msg)
            }
          })
          .catch((error) => {
            console.log('error:' + error)
          })
      } else {
        this.$message({
          message: '用户头像为空',
          type: 'warning'
        })
      }

      this.dialogEditAvatar = false
    },
    handleAvatarSuccess (res, file) {
      console.log(res, file)
      this.avatarUrl = process.env.API_HOST + 'file/download/' + res.data
      // this.avatarUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
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

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin-left: 40px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
