<template>
  <div>
    <div class="form-filter">
      <el-form :inline="true"
               :model="userForm"
               class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model="userForm.username"
                    placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="userForm.nickname"
                    placeholder="昵称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table :data="tableData"
                border
                style="width: 100%">
        <el-table-column prop="username"
                         label="用户名">
        </el-table-column>
        <el-table-column prop="nickname"
                         label="昵称">
        </el-table-column>
        <el-table-column prop="state"
                         label="状态">
          <template slot-scope="scope">
            <el-tag :type="enablesType(scope.row.state)"
                    v-html="isEnables(scope.row.state)"></el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime"
                         label="创建时间"
                         :formatter="formatDate">
        </el-table-column>
        <el-table-column prop="updateTime"
                         label="更新时间"
                         :formatter="formatDate">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="primary"
                       @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini"
                       :type="enablesBtnType(scope.row.state)"
                       @click="handleToggleState(scope.$index, scope.row)">{{enablesOption(scope.row.state)}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="page.current"
                     :page-sizes="page.sizes"
                     :page-size="page.size"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="page.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userForm: {
        username: '',
        nickname: ''
      },
      tableData: [],
      page: {
        current: 1,
        size: 10,
        sizes: [10, 20, 30, 50],
        total: 0
      }
    }
  },
  methods: {
    getData () {
      this.$axiox.get('/sys/user/page', {
        params: {
          current: this.page.current,
          size: this.page.size,
          total: this.page.total,
          username: this.userForm.username,
          nickname: this.userForm.nickname
        }
      })
        .then((response) => {
          if (response.data.code === 200) {
            var tablePage = response.data.data
            if (tablePage) {
              this.page.current = tablePage.current
              this.page.size = tablePage.size
              this.page.total = tablePage.total
              this.tableData = tablePage.data
            }
          } else if (response.data.msg) {
            this.$message.error(response.data.msg)
          }
        })
        .catch((error) => {
          console.log('error:' + error)
        })
    },
    handleEdit (index, row) {
      console.log(index)
      console.log(row)
    },
    handleToggleState (index, row) {
      this.$axiox.put('/sys/user/state/' + row.id)
        .then((response) => {
          if (response.data.code === 200) {
            this.getData()
          } else if (response.data.msg) {
            this.$message.error(response.data.msg)
          }
        })
        .catch((error) => {
          console.log('error:' + error)
        })
    },
    isEnables (state) {
      switch (state) {
        case 0:
          return '正常'
        case 1:
          return '锁定'
      }
    },
    enablesType (state) {
      switch (state) {
        case 0:
          return 'success'
        case 1:
          return 'warning'
      }
    },
    enablesBtnType (state) {
      switch (state) {
        case 0:
          return 'danger'
        case 1:
          return 'success'
      }
    },
    enablesOption (state) {
      switch (state) {
        case 0:
          return '锁定'
        case 1:
          return '恢复'
      }
    },
    onSubmit () {
      this.getData()
    },
    handleSizeChange (val) {
      this.page.size = val
      this.page.current = 1
      this.getData()
    },
    handleCurrentChange (val) {
      this.page.current = val
      this.getData()
    },
    formatDate (row, column, cellValue, index) {
      const daterc = row[column.property]
      if (daterc) {
        return this.formatDateStr(new Date(daterc), 'yyyy-MM-dd hh:mm:ss')
      } else {
        return '-'
      }
    },
    formatDateStr (date, fmt) {
      var o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
          )
        }
      }
      return fmt
    }
  },
  computed: {
  },
  created () {
    this.getData()
  }
}
</script>

<style>
.form-filter {
  height: auto;
  width: 100%;
  border: 1px solid #d7dae2;
  border-radius: 4px;
  padding: 20px;
  padding-bottom: 0px;
}

.table {
  width: 100%;
  margin-top: 10px;
}
</style>
