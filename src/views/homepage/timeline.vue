<template>
  <div class="app-container">
    <el-button type="success" style="margin: 0 0 20px 40px;" @click="openDialog()">新增时间点</el-button>
    <el-timeline>
      <el-timeline-item v-for="(time,key) in timeline" :key="key" :timestamp="time.releaseDate | dateFormat" placement="top">
        <el-card>
          <h4>{{time.content}}</h4>
          <p>{{time.releaseDate | dateFormat}}</p>
          <el-button type="primary" size="small" @click="openDialog(time)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteTime(time.pkId)">删除</el-button>
        </el-card>
      </el-timeline-item>
    </el-timeline>

    <el-dialog
      title="新建/编辑时间点"
      :visible.sync="dialogVisible"
      width="30%"
      center>

      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="时间点内容" style="width:500px" prop="content" :rules="[{ required: true, message: '内容不能为空'}]">
          <el-input v-model="form.content"></el-input>
        </el-form-item>
        <el-form-item label="时间" style="width:500px" prop="releaseDate" :rules="[{ required: true, message: '时间不能为空'}]">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.releaseDate" style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as compare from '@/api/compare'
import * as util from '@/utils'

export default {
  name: 'Timeline',
  data() {
    return {
      timeline: {},
      dialogVisible: false,
      form: {}
    }
  },
  methods: {
    deleteTime(id) {
      this.$confirm('此操作将永久删除该时间点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        compare.deleteTime(id)
          .then((result) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getInfo()
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    updateTime() {
      compare.updateTime(this.form)
        .then((result) => {
          this.$message({
            type: 'success',
            message: '更新成功!'
          })
          this.getInfo()
        })
    },
    createTime() {
      compare.createTime(this.form)
        .then((result) => {
          this.$message({
            type: 'success',
            message: '新建成功!'
          })
          this.getInfo()
        })
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.pkId) {
            this.updateTime()
          } else {
            this.createTime()
          }
          this.dialogVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    openDialog(data) {
      if (data) {
        this.form = { ...data }
      } else {
        this.form = {}
      }
      this.dialogVisible = true
    },
    getInfo() {
      compare.query()
        .then((result) => {
          console.log(result)
          this.timeline = result.data.companyDevelops
        })
    }
  },
  created() {
    this.getInfo()
  },
  filters: {
    dateFormat(date) {
      return util.parseTime(date, '{y}-{m}-{d}')
    }
  }
}
</script>
