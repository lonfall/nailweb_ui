<template>
    <div>
        <div class="form-filter">
            <el-form :inline="true"
                     :model="fishForm"
                     class="demo-form-inline">
                <el-form-item label="鱼类名称">
                    <el-input v-model="fishForm.name"
                              placeholder="鱼类名称"></el-input>
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
                       @click="dialogCreateFish=true">新增
            </el-button>
        </div>
        <div class="table">
            <el-table :data="tableData"
                      border
                      style="width: 100%">
                <el-table-column prop="name"
                                 label="鱼类角色名称">
                </el-table-column>
                <el-table-column prop="price"
                                 label="价格">
                </el-table-column>
                <el-table-column prop="place"
                                 label="场所"
                                 :formatter="formatPlace">
                </el-table-column>
                <el-table-column prop="size"
                                 label="鱼影大小"
                                 :formatter="formatSize">
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

        <el-dialog title="新增鱼类"
                   :visible.sync="dialogCreateFish"
                   :width="dialogWidth">
            <el-form class="form-overflow"
                     :model="createFishForm"
                     :label-width="dialogLabelWidth">
                <el-form-item label="鱼类名称">
                    <el-input v-model="createFishForm.name"
                              autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="图片">
                    <ImgUpload :img="createFishForm.img" width="160px" height="160px"
                               v-on:update-img="updateImg"></ImgUpload>
                </el-form-item>
                <el-form-item label="价格">
                    <el-input-number v-model="createFishForm.price"
                                     :precision="0"></el-input-number>
                </el-form-item>
                <el-form-item label="南半球月份">
                    <CheckBox :values="month_values" :label="month_labels"
                              type="checkbox" :value="createFishForm.south_month"
                              v-on:update-value="updateSouthMonth"></CheckBox>
                </el-form-item>
                <el-form-item label="北半球月份">
                    <CheckBox :values="month_values" :label="month_labels"
                              type="checkbox" :value="createFishForm.north_month"
                              v-on:update-value="updateNorthMonth"></CheckBox>
                </el-form-item>
                <el-form-item label="出现时间段">
                    <TimeRangeSelector v-on:update-time="updateTime" :value="createFishForm.time"></TimeRangeSelector>
                </el-form-item>
                <el-form-item label="场所">
                    <CheckBox :values="place_values" :label="place_labels"
                              type="radio" :value="createFishForm.place"
                              v-on:update-value="updatePlace"></CheckBox>
                </el-form-item>
                <el-form-item label="鱼影大小">
                    <CheckBox :values="size_values" :label="size_labels"
                              type="radio" :value="createFishForm.size"
                              v-on:update-value="updateSize"></CheckBox>
                </el-form-item>
            </el-form>
            <div slot="footer"
                 class="dialog-footer">
                <el-button @click="dialogCreateFishCancel">取 消</el-button>
                <el-button type="primary"
                           @click="dialogCreateFishConfirm">确 定
                </el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑鱼类"
                   :visible.sync="dialogEditFish"
                   :width="dialogWidth">
            <el-form class="form-overflow"
                     :model="editFishForm"
                     :label-width="dialogLabelWidth">
                <el-form-item label="鱼类名称">
                    <el-input v-model="editFishForm.name"
                              autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="图片">
                    <ImgUpload :img="editFishForm.img" width="160px" height="160px"
                               v-on:update-img="updateEditImg"></ImgUpload>
                </el-form-item>
                <el-form-item label="价格">
                    <el-input-number v-model="editFishForm.price"
                                     :precision="0"></el-input-number>
                </el-form-item>
                <el-form-item label="南半球月份">
                    <CheckBox :values="month_values" :label="month_labels"
                              type="checkbox" :value="editFishForm.south_month"
                              v-on:update-value="updateEditSouthMonth"></CheckBox>
                </el-form-item>
                <el-form-item label="北半球月份">
                    <CheckBox :values="month_values" :label="month_labels"
                              type="checkbox" :value="editFishForm.north_month"
                              v-on:update-value="updateEditNorthMonth"></CheckBox>
                </el-form-item>
                <el-form-item label="出现时间段">
                    <TimeRangeSelector v-on:update-time="updateEditTime" :value="editFishForm.time"></TimeRangeSelector>
                </el-form-item>
                <el-form-item label="场所">
                    <CheckBox :values="place_values" :label="place_labels"
                              type="radio" :value="editFishForm.place"
                              v-on:update-value="updateEditPlace"></CheckBox>
                </el-form-item>
                <el-form-item label="鱼影大小">
                    <CheckBox :values="size_values" :label="size_labels"
                              type="radio" :value="editFishForm.size"
                              v-on:update-value="updateEditSize"></CheckBox>
                </el-form-item>
            </el-form>
            <div slot="footer"
                 class="dialog-footer">
                <el-button @click="dialogEditFishCancel">取 消</el-button>
                <el-button type="primary"
                           @click="dialogEditFishConfirm">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import ImgUpload from '../../utils/ImgUpload'
import CheckBox from '../../utils/CheckBox'
import TimeRangeSelector from '../../utils/TimeRangeSelector'

export default {
  data () {
    return {
      fishForm: {
        name: ''
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
      dialogCreateFish: false,
      createFishForm: {
        name: '',
        img: '',
        price: 0,
        south_month: 0,
        north_month: 0,
        time: 0,
        place: 0,
        size: 0
      },
      dialogEditFish: false,
      editFishForm: {
        id: 0,
        name: '',
        img: '',
        price: 0,
        south_month: 0,
        north_month: 0,
        time: 0,
        place: 0,
        size: 0
      },
      month_values: [1 << 0, 1 << 1, 1 << 2, 1 << 3, 1 << 4, 1 << 5, 1 << 6, 1 << 7, 1 << 8, 1 << 9, 1 << 10, 1 << 11],
      month_labels: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      place_values: [1, 2, 3, 4, 5, 6],
      place_labels: ['河流', '水池', '悬崖上', '出海口', '大海', '码头'],
      size_values: [1, 2, 3, 4, 5, 6],
      size_labels: ['小', '稍小', '中', '大', '稍大', '特大']
    }
  },
  name: 'fish',
  components: {
    ImgUpload,
    CheckBox,
    TimeRangeSelector
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.$axiox.get('/fish/page', {
        params: {
          current: this.page.current,
          size: this.page.size,
          total: this.page.total,
          name: this.fishForm.name
        }
      })
        .then((response) => {
          if (response.data.code === 200) {
            let tablePage = response.data.data
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
    formatPlace (row, column, cellValue, index) {
      const place = row[column.property]
      switch (place) {
        case 1:
          return '河流'
        case 2:
          return '水池'
        case 3:
          return '悬崖上'
        case 4:
          return '出海口'
        case 5:
          return '大海'
        case 6:
          return '码头'
        default:
          return '-'
      }
    },
    formatSize (row, column, cellValue, index) {
      const size = row[column.property]
      switch (size) {
        case 1:
          return '小'
        case 2:
          return '稍小'
        case 3:
          return '中'
        case 4:
          return '大'
        case 5:
          return '稍大'
        case 6:
          return '特大'
        default:
          return '-'
      }
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
    handleEdit (index, row) {
      this.editFishForm = {
        id: row.id,
        name: row.name,
        img: row.img,
        price: row.price,
        south_month: row.south_month,
        north_month: row.north_month,
        time: row.time,
        place: row.place,
        size: row.size
      }

      this.dialogEditFish = true
    },
    handleDelete (index, row) {
      this.$confirm('确认删除？', '删除鱼类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(_ => {
          this.$axiox.delete('/fish/' + row.id)
            .then((response) => {
              if (response.data.code === 200) {
                this.$message({
                  message: '删除鱼类成功',
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
    updateImg (img) {
      this.createFishForm.img = img
    },
    updateSouthMonth (value) {
      this.createFishForm.south_month = value
    },
    updateNorthMonth (value) {
      this.createFishForm.north_month = value
    },
    updateTime (value) {
      this.createFishForm.time = value
    },
    updatePlace (value) {
      this.createFishForm.place = value
    },
    updateSize (value) {
      this.createFishForm.size = value
    },
    updateEditImg (img) {
      this.editFishForm.img = img
    },
    updateEditSouthMonth (value) {
      this.editFishForm.south_month = value
    },
    updateEditNorthMonth (value) {
      this.editFishForm.north_month = value
    },
    updateEditTime (value) {
      this.editFishForm.time = value
    },
    updateEditPlace (value) {
      this.editFishForm.place = value
    },
    updateEditSize (value) {
      this.editFishForm.size = value
    },
    dialogCreateFishCancel () {
      this.createFishForm = {
        name: '',
        img: '',
        price: 0,
        south_month: 0,
        north_month: 0,
        time: 0,
        place: 0,
        size: 0
      }
      this.dialogCreateFish = false
    },
    dialogCreateFishConfirm () {
      this.$axiox.post('/fish/create', {
        name: this.createFishForm.name,
        img: this.createFishForm.img,
        price: this.createFishForm.price,
        south_month: this.createFishForm.south_month,
        north_month: this.createFishForm.north_month,
        time: this.createFishForm.time,
        place: this.createFishForm.place,
        size: this.createFishForm.size
      })
        .then((response) => {
          if (response.data.code === 200) {
            this.$message({
              message: '新增鱼类成功',
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

      this.createFishForm = {
        name: '',
        img: '',
        price: 0,
        south_month: 0,
        north_month: 0,
        time: 0,
        place: 0,
        size: 0
      }
      this.dialogCreateFish = false
    },
    dialogEditFishCancel () {
      this.editFishForm = {
        id: 0,
        name: '',
        img: '',
        price: 0,
        south_month: 0,
        north_month: 0,
        time: 0,
        place: 0,
        size: 0
      }

      this.dialogEditFish = false
    },
    dialogEditFishConfirm () {
      this.$axiox.put('/fish/edit', {
        id: this.editFishForm.id,
        name: this.editFishForm.name,
        img: this.editFishForm.img,
        price: this.editFishForm.price,
        south_month: this.editFishForm.south_month,
        north_month: this.editFishForm.north_month,
        time: this.editFishForm.time,
        place: this.editFishForm.place,
        size: this.editFishForm.size
      })
        .then((response) => {
          if (response.data.code === 200) {
            this.$message({
              message: '编辑鱼类成功',
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

      this.editFishForm = {
        id: 0,
        name: '',
        img: '',
        price: 0,
        south_month: 0,
        north_month: 0,
        time: 0,
        place: 0,
        size: 0
      }

      this.dialogEditFish = false
    }
  }
}
</script>

<style scoped>
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
.form-overflow {
    max-height: 500px;
    overflow: auto;
}
</style>
