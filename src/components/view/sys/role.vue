<template>
  <div>
    <div class="form-filter">
      <el-form :inline="true"
               :model="roleForm"
               class="demo-form-inline">
        <el-form-item label="角色名称">
          <el-input v-model="roleForm.name"
                    placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="roleForm.remark"
                    placeholder="备注"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="onSubmit">查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="button-row">
      <el-button type="primary"
                 @click="dialogCreateRole=true">新增
      </el-button>
    </div>
    <div class="table">
      <el-table :data="tableData"
                border
                style="width: 100%">
        <el-table-column prop="name"
                         label="角色名称">
        </el-table-column>
        <el-table-column prop="remark"
                         label="备注">
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
                       @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="mini"
                       type="danger"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
            <el-button size="mini"
                       type="primary"
                       @click="handleMenu(scope.$index, scope.row)">菜单权限
            </el-button>
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

    <el-dialog title="新增角色"
               :visible.sync="dialogCreateRole"
               :width="dialogWidth">
      <el-form :model="createRoleForm"
               :label-width="dialogLabelWidth">
        <el-form-item label="角色名称">
          <el-input v-model="createRoleForm.name"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色备注">
          <el-input v-model="createRoleForm.remark"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogCreateRoleCancel">取 消</el-button>
        <el-button type="primary"
                   @click="dialogCreateRoleConfirm">确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑角色"
               :visible.sync="dialogEditRole"
               :width="dialogWidth">
      <el-form :model="editRoleForm"
               :label-width="dialogLabelWidth">
        <el-form-item label="角色名称">
          <el-input v-model="editRoleForm.name"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色备注">
          <el-input v-model="editRoleForm.remark"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogEditRoleCancel">取 消</el-button>
        <el-button type="primary"
                   @click="dialogEditRoleConfirm">确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="菜单权限"
               :visible.sync="dialogMenuRole"
               :width="dialogWidth"
               @open="dialogMenuRoleOpen">
      <el-tree :props="menu.props"
               :data="menu.data"
               empty-text="未找到菜单"
               node-key="id"
               show-checkbox
               :check-strictly="true"
               ref="tree">
      </el-tree>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogMenuRoleCancel">取 消</el-button>
        <el-button type="primary"
                   @click="dialogMenuRoleConfirm">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleForm: {
        name: '',
        remark: ''
      },
      tableData: [],
      page: {
        current: 1,
        size: 10,
        sizes: [10, 20, 30, 50],
        total: 0
      },
      dialogWidth: '500px',
      dialogLabelWidth: '100px',
      dialogCreateRole: false,
      createRoleForm: {
        name: '',
        remark: ''
      },
      dialogEditRole: false,
      editRoleForm: {
        id: '',
        name: '',
        remark: ''
      },
      dialogMenuRole: false,
      menu: {
        roleId: '',
        props: {
          label: function (data, node) {
            return data.data.name
          },
          children: 'children'
        },
        data: []
      }
    }
  },
  methods: {
    getData () {
      this.$axiox.get('/sys/role/page', {
        params: {
          current: this.page.current,
          size: this.page.size,
          total: this.page.total,
          name: this.roleForm.name,
          remark: this.roleForm.remark
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
    },
    dialogCreateRoleCancel () {
      this.createRoleForm = {
        name: '',
        remark: ''
      }
      this.dialogCreateRole = false
    },
    dialogCreateRoleConfirm () {
      this.$axiox.post('/sys/role/create', {
        name: this.createRoleForm.name,
        remark: this.createRoleForm.remark
      })
        .then((response) => {
          if (response.data.code === 200) {
            this.$message({
              message: '新建角色成功',
              type: 'success'
            })
            this.getData()
          } else if (response.data.msg) {
            this.$message.error(response.data.msg)
          }
        })
        .catch((error) => {
          console.log('error:' + error)
        })

      this.createRoleForm = {
        name: '',
        remark: ''
      }
      this.dialogCreateRole = false
    },
    handleEdit (index, row) {
      this.editRoleForm.id = row.id
      this.editRoleForm.name = row.name
      this.editRoleForm.remark = row.remark

      this.dialogEditRole = true
    },
    dialogEditRoleCancel () {
      this.editRoleForm = {
        id: '',
        name: '',
        remark: ''
      }
      this.dialogEditRole = false
    },
    dialogEditRoleConfirm () {
      this.$axiox.put('/sys/role/edit', {
        id: this.editRoleForm.id,
        name: this.editRoleForm.name,
        remark: this.editRoleForm.remark
      })
        .then((response) => {
          if (response.data.code === 200) {
            this.$message({
              message: '编辑角色成功',
              type: 'success'
            })
            this.getData()
          } else if (response.data.msg) {
            this.$message.error(response.data.msg)
          }
        })
        .catch((error) => {
          console.log('error:' + error)
        })

      this.editRoleForm = {
        id: '',
        name: '',
        remark: ''
      }
      this.dialogEditRole = false
    },
    handleDelete (index, row) {
      this.$confirm('确认删除？', '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(_ => {
          this.$axiox.delete('/sys/role/' + row.id)
            .then((response) => {
              if (response.data.code === 200) {
                this.$message({
                  message: '删除角色成功',
                  type: 'success'
                })
                this.getData()
              } else if (response.data.msg) {
                this.$message.error(response.data.msg)
              }
            })
            .catch((error) => {
              console.log('error:' + error)
            })
        })
        .catch(_ => { })
    },
    handleMenu (index, row) {
      this.menu.roleId = row.id

      this.dialogMenuRole = true
    },
    initMenuData () {
      this.$axiox.get('/sys/menu/tree')
        .then((response) => {
          if (response.data.code === 200) {
            this.menu.data = response.data.data
          } else if (response.data.msg) {
            this.$message.error(response.data.msg)
          }
        })
        .catch((error) => {
          console.log('error:' + error)
        })
    },
    dialogMenuRoleCancel () {
      this.menu.roleId = ''

      this.dialogMenuRole = false
    },
    dialogMenuRoleConfirm () {
      var checkedKeys = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
      this.$axiox.post('/sys/role/menu/' + this.menu.roleId, checkedKeys)
        .then((response) => {
          if (response.data.code === 200) {
            this.$message({
              message: '编辑菜单权限成功',
              type: 'success'
            })
          } else if (response.data.msg) {
            this.$message.error(response.data.msg)
          }
        })
        .catch((error) => {
          console.log('error:' + error)
        })
      this.menu.roleId = ''
      this.dialogMenuRole = false
    },
    dialogMenuRoleOpen () {
      this.$axiox.get('/sys/role/menu/' + this.menu.roleId)
        .then((response) => {
          if (response.data.code === 200) {
            var menuIds = response.data.data
            if (menuIds) {
              this.$refs.tree.setCheckedKeys(menuIds)
            }
          } else if (response.data.msg) {
            this.$message.error(response.data.msg)
          }
        })
        .catch((error) => {
          console.log('error:' + error)
        })
    }
  },
  created () {
    this.getData()
    this.initMenuData()
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

.button-row {
  width: 100%;
  margin-top: 10px;
}
</style>
