<template>
  <div class="app-container" id="CreateNews">
    <el-form :rules="rules" ref="form" :model="form" label-width="150px">
      <div style="width:600px">
        <el-form-item label="详情编号" prop="infoId">
          <el-input v-model="form.infoId"></el-input>
        </el-form-item>
      </div>
      <div style="width:600px">
        <el-form-item label="图书馆位置" prop="location">
          <el-input v-model="form.location"></el-input>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即发布</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as books from '@/api/books'
import { API_IP } from '@/utils/request'
export default {
  name: 'CreateNews',
  data() {
    return {
      form: {
        location: '',
        infoId: ''
      },
      rules: {
        location: [{ required: true, message: '请输入图书管位置', trigger: 'blur' }]
        // infoId: [{ required: true, message: '请输入图书详情', trigger: 'blur' }]
      },
      ip: API_IP
    }
  },
  methods: {
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.createdBooks()
        } else {
          return false
        }
      })
    },
    createdBooks() {
      console.log(this.form)
      books.insert(this.form)
        .then((result) => {
          console.log(result)
          this.$message({
            type: 'success',
            message: '创建成功!'
          })
          this.$router.push({ name: 'Books' })
        })
    }
  }
}
</script>
