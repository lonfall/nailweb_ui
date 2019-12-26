<template>
  <div>
    <div class="button-row">
      <el-button type="primary"
                 @click="dialogCreateMenu=true">新增
      </el-button>
    </div>
    <div class="table">
      <el-table ref="table"
                :data="tableData"
                border
                style="width: 100%"
                row-key="id"
                lazy
                :load="loadChildrenMenu"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column prop="data.name"
                         label="菜单名称">
        </el-table-column>
        <el-table-column prop="data.url"
                         label="菜单链接">
        </el-table-column>
        <el-table-column prop="data.permission"
                         label="权限标志">
        </el-table-column>
        <el-table-column prop="data.type"
                         label="类型">
          <template slot-scope="scope">
            <el-tag>{{formatType(scope.row.data.type)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="data.icon"
                         label="图标">
          <template slot-scope="scope">
            <i :class="scope.row.data.icon"> {{scope.row.data.icon}}</i>
          </template>
        </el-table-column>
        <el-table-column prop="data.sort"
                         label="排序">
        </el-table-column>
        <el-table-column prop="data.hide"
                         label="是否隐藏"
                         :formatter="formatHide">
        </el-table-column>
        <el-table-column label="操作"
                         width="400px"
                         fixed="right">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="primary"
                       @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="mini"
                       type="danger"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
            <el-button v-if="scope.row.data.type === 0"
                       size="mini"
                       type="primary"
                       @click="handleCreateChildren(scope.$index, scope.row)">添加下级菜单
            </el-button>
            <el-button v-if="scope.row.data.type === 1"
                       size="mini"
                       type="primary"
                       @click="handleCreateChildrenAuth(scope.$index, scope.row)">添加权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="新增菜单"
               :visible.sync="dialogCreateMenu"
               :width="dialogWidth">
      <el-form :model="createMenuForm"
               :label-width="dialogLabelWidth">
        <el-form-item label="菜单名称">
          <el-input v-model="createMenuForm.name"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单链接">
          <el-input v-model="createMenuForm.url"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限标志">
          <el-input v-model="createMenuForm.permission"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="createMenuForm.type"
                     placeholder="请选择">
            <el-option v-for="item in types"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="createMenuForm.icon"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="createMenuForm.sort"
                    type="number"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否隐藏">
          <el-switch v-model="createMenuForm.hide">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogCreateMenuCancel">取 消</el-button>
        <el-button type="primary"
                   @click="dialogCreateMenuConfirm">确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="editMenuForm.type !== 2?'编辑菜单':'编辑权限'"
               :visible.sync="dialogEditMenu"
               :width="dialogWidth">
      <el-form :model="editMenuForm"
               :label-width="dialogLabelWidth">
        <el-form-item label="菜单名称">
          <el-input v-model="editMenuForm.name"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单链接">
          <el-input v-model="editMenuForm.url"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限标志">
          <el-input v-model="editMenuForm.permission"
                    autocomplete="off"></el-input>
        </el-form-item>

        <template v-if="editMenuForm.type !== 2">
          <el-form-item label="类型">
            <el-select v-model="editMenuForm.type"
                       placeholder="请选择">
              <el-option v-for="item in types"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图标">
            <el-input v-model="editMenuForm.icon"
                      autocomplete="off"></el-input>
          </el-form-item>
        </template>

        <el-form-item label="排序">
          <el-input v-model="editMenuForm.sort"
                    type="number"
                    autocomplete="off"></el-input>
        </el-form-item>

        <template v-if="editMenuForm.type !== 2">
          <el-form-item label="是否隐藏">
            <el-switch v-model="editMenuForm.hide">
            </el-switch>
          </el-form-item>
        </template>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogEditMenuCancel">取 消</el-button>
        <el-button type="primary"
                   @click="dialogEditMenuConfirm">确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加下级菜单"
               :visible.sync="dialogCreateChildrenMenu"
               :width="dialogWidth">
      <el-form :model="createChildrenMenuForm"
               :label-width="dialogLabelWidth">
        <el-form-item label="菜单名称">
          <el-input v-model="createChildrenMenuForm.name"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单链接">
          <el-input v-model="createChildrenMenuForm.url"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限标志">
          <el-input v-model="createChildrenMenuForm.permission"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="createChildrenMenuForm.type"
                     placeholder="请选择">
            <el-option v-for="item in types"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="createChildrenMenuForm.icon"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="createChildrenMenuForm.sort"
                    type="number"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否隐藏">
          <el-switch v-model="createChildrenMenuForm.hide">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogCreateChildrenMenuCancel">取 消</el-button>
        <el-button type="primary"
                   @click="dialogCreateChildrenMenuConfirm">确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加权限"
               :visible.sync="dialogCreateChildrenAuthMenu"
               :width="dialogWidth">
      <el-form :model="createChildrenAuthMenuForm"
               :label-width="dialogLabelWidth">
        <el-form-item label="菜单名称">
          <el-input v-model="createChildrenAuthMenuForm.name"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单链接">
          <el-input v-model="createChildrenAuthMenuForm.url"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限标志">
          <el-input v-model="createChildrenAuthMenuForm.permission"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="createChildrenAuthMenuForm.sort"
                    type="number"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogCreateChildrenAuthMenuCancel">取 消</el-button>
        <el-button type="primary"
                   @click="dialogCreateChildrenAuthMenuConfirm">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      dialogWidth: '500px',
      dialogLabelWidth: '100px',
      dialogCreateMenu: false,
      createMenuForm: {
        pid: 0,
        name: '',
        url: '',
        permission: '',
        type: 0,
        icon: '',
        sort: 0,
        hide: false
      },
      dialogEditMenu: false,
      editMenuForm: {
        id: 0,
        pid: 0,
        name: '',
        url: '',
        permission: '',
        type: 0,
        icon: '',
        sort: 0,
        hide: false
      },
      dialogCreateChildrenMenu: false,
      createChildrenPid: 0,
      createChildrenMenuForm: {
        pid: 0,
        name: '',
        url: '',
        permission: '',
        type: 0,
        icon: '',
        sort: 0,
        hide: false
      },
      dialogCreateChildrenAuthMenu: false,
      createChildrenAuthPid: 0,
      createChildrenAuthMenuForm: {
        pid: 0,
        name: '',
        url: '',
        permission: '',
        type: 2,
        icon: '',
        sort: 0,
        hide: true
      },
      types: [
        {
          value: 0,
          label: '目录'
        }, {
          value: 1,
          label: '菜单'
        }, {
          value: 2,
          label: '权限'
        }
      ],
      maps: new Map()
    }
  },
  methods: {
    getData () {
      this.$axiox.get('/sys/menu/children/0')
        .then((response) => {
          if (response.data.code === 200) {
            this.tableData = response.data.data
          } else if (response.data.msg) {
            this.$message.error(response.data.msg)
          }
        })
        .catch((error) => {
          console.log('error:' + error)
        })
    },
    handleEdit (index, row) {
      this.editMenuForm = {
        id: row.data.id,
        pid: row.data.pid,
        name: row.data.name,
        url: row.data.url,
        permission: row.data.permission,
        type: row.data.type,
        icon: row.data.icon,
        sort: row.data.sort,
        hide: row.data.hide
      }
      this.dialogEditMenu = true
    },
    handleDelete (index, row) {
      var pid = row.data.pid
      this.$confirm('确认删除？', row.data.type !== 2 ? '删除菜单' : '删除权限', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(_ => {
          this.$axiox.delete('/sys/menu/' + row.data.id)
            .then((response) => {
              if (response.data.code === 200) {
                this.$message({
                  message: '删除菜单成功',
                  type: 'success'
                })
                this.getData()
                if (pid && this.maps.has(pid)) {
                  let { tree, treeNode, resolve } = this.maps.get(pid)
                  this.loadChildrenMenu(tree, treeNode, resolve)
                }
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
    handleCreateChildren (index, row) {
      this.createChildrenMenuForm.pid = row.data.id
      this.createChildrenPid = row.data.pid
      this.dialogCreateChildrenMenu = true
    },
    handleCreateChildrenAuth (index, row) {
      this.createChildrenAuthMenuForm.pid = row.data.id
      this.createChildrenAuthPid = row.data.pid
      this.dialogCreateChildrenAuthMenu = true
    },
    formatHide (row, column, cellValue, index) {
      let hide = row.data.hide
      if (hide) {
        return '是'
      } else {
        return '否'
      }
    },
    formatType (typeValue) {
      switch (typeValue) {
        case 0:
          return '目录'
        case 1:
          return '菜单'
        case 2:
          return '权限'
      }
    },
    dialogCreateMenuCancel () {
      this.resetCreateMenuForm()
    },
    dialogCreateMenuConfirm () {
      this.$axiox.post('/sys/menu/create', {
        pid: this.createMenuForm.pid,
        name: this.createMenuForm.name,
        url: this.createMenuForm.url,
        permission: this.createMenuForm.permission,
        type: this.createMenuForm.type,
        icon: this.createMenuForm.icon,
        sort: this.createMenuForm.sort,
        hide: this.createMenuForm.hide
      })
        .then((response) => {
          if (response.data.code === 200) {
            this.$message({
              message: '添加菜单成功',
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
      this.resetCreateMenuForm()
    },
    resetCreateMenuForm () {
      this.dialogCreateMenu = false
      this.createMenuForm = {
        pid: 0,
        name: '',
        url: '',
        permission: '',
        type: 0,
        icon: '',
        sort: 0,
        hide: false
      }
    },
    dialogEditMenuCancel () {
      this.resetEditMenuForm()
    },
    dialogEditMenuConfirm () {
      var pid = this.editMenuForm.pid
      this.$axiox.put('/sys/menu/edit', {
        id: this.editMenuForm.id,
        pid: this.editMenuForm.pid,
        name: this.editMenuForm.name,
        url: this.editMenuForm.url,
        permission: this.editMenuForm.permission,
        type: this.editMenuForm.type,
        icon: this.editMenuForm.icon,
        sort: this.editMenuForm.sort,
        hide: this.editMenuForm.hide
      })
        .then((response) => {
          if (response.data.code === 200) {
            this.$message({
              message: '编辑菜单成功',
              type: 'success'
            })
            this.getData()
            if (pid && this.maps.has(pid)) {
              let { tree, treeNode, resolve } = this.maps.get(pid)
              this.loadChildrenMenu(tree, treeNode, resolve)
            }
          } else if (response.data.msg) {
            this.$message.error(response.data.msg)
          }
        })
        .catch((error) => {
          console.log('error:' + error)
        })
      this.resetEditMenuForm()
    },
    resetEditMenuForm () {
      this.dialogEditMenu = false
      this.editMenuForm = {
        id: 0,
        pid: 0,
        name: '',
        url: '',
        permission: '',
        type: 0,
        icon: '',
        sort: 0,
        hide: false
      }
    },
    dialogCreateChildrenMenuCancel () {
      this.resetCreateChildrenMenuForm()
    },
    dialogCreateChildrenMenuConfirm () {
      var pid = this.createChildrenMenuForm.pid
      this.$axiox.post('/sys/menu/create', {
        pid: this.createChildrenMenuForm.pid,
        name: this.createChildrenMenuForm.name,
        url: this.createChildrenMenuForm.url,
        permission: this.createChildrenMenuForm.permission,
        type: this.createChildrenMenuForm.type,
        icon: this.createChildrenMenuForm.icon,
        sort: this.createChildrenMenuForm.sort,
        hide: this.createChildrenMenuForm.hide
      })
        .then((response) => {
          if (response.data.code === 200) {
            this.$message({
              message: '添加下级菜单成功',
              type: 'success'
            })
            this.getData()
            if (pid && this.maps.has(pid)) {
              let { tree, treeNode, resolve } = this.maps.get(pid)
              this.loadChildrenMenu(tree, treeNode, resolve)
            } else if (this.createChildrenPid && this.maps.has(this.createChildrenPid)) {
              let { tree, treeNode, resolve } = this.maps.get(this.createChildrenPid)
              this.loadChildrenMenu(tree, treeNode, resolve)
            }
          } else if (response.data.msg) {
            this.$message.error(response.data.msg)
          }
        })
        .catch((error) => {
          console.log('error:' + error)
        })
      this.resetCreateChildrenMenuForm()
    },
    resetCreateChildrenMenuForm () {
      this.dialogCreateChildrenMenu = false
      this.createChildrenMenuForm = {
        pid: 0,
        name: '',
        url: '',
        permission: '',
        type: 0,
        icon: '',
        sort: 0,
        hide: false
      }
    },
    dialogCreateChildrenAuthMenuCancel () {
      this.resetCreateChildrenAuthMenuForm()
    },
    dialogCreateChildrenAuthMenuConfirm () {
      var pid = this.createChildrenAuthMenuForm.pid
      this.$axiox.post('/sys/menu/create', {
        pid: this.createChildrenAuthMenuForm.pid,
        name: this.createChildrenAuthMenuForm.name,
        url: this.createChildrenAuthMenuForm.url,
        permission: this.createChildrenAuthMenuForm.permission,
        type: this.createChildrenAuthMenuForm.type,
        icon: this.createChildrenAuthMenuForm.icon,
        sort: this.createChildrenAuthMenuForm.sort,
        hide: this.createChildrenAuthMenuForm.hide
      })
        .then((response) => {
          if (response.data.code === 200) {
            this.$message({
              message: '添加权限成功',
              type: 'success'
            })
            this.getData()
            if (pid && this.maps.has(pid)) {
              let { tree, treeNode, resolve } = this.maps.get(pid)
              this.loadChildrenMenu(tree, treeNode, resolve)
            } else if (this.createChildrenAuthPid && this.maps.has(this.createChildrenAuthPid)) {
              let { tree, treeNode, resolve } = this.maps.get(this.createChildrenAuthPid)
              this.loadChildrenMenu(tree, treeNode, resolve)
            }
          } else if (response.data.msg) {
            this.$message.error(response.data.msg)
          }
        })
        .catch((error) => {
          console.log('error:' + error)
        })
      this.resetCreateChildrenAuthMenuForm()
    },
    resetCreateChildrenAuthMenuForm () {
      this.dialogCreateChildrenAuthMenu = false
      this.createChildrenAuthMenuForm = {
        pid: 0,
        name: '',
        url: '',
        permission: '',
        type: 2,
        icon: '',
        sort: 0,
        hide: true
      }
    },
    loadChildrenMenu (tree, treeNode, resolve) {
      var pid = tree.data.id
      this.maps.set(pid, { tree, treeNode, resolve })

      this.$axiox.get('/sys/menu/children/' + pid)
        .then((response) => {
          if (response.data.code === 200) {
            var children = response.data.data
            if (children && children.length === 0) {
              tree.hasChildren = false
              this.$set(this.$refs.table.store.states.lazyTreeNodeMap, pid, [])
            }
            resolve(children)
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
  }
}
</script>

<style>
.table {
  width: 100%;
  margin-top: 10px;
}

.button-row {
  width: 100%;
  margin-top: 10px;
}
</style>
