<template>
  <div class="app-container">
    <div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="公司名称" style="width:500px">
          <el-input v-model="form.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="公司地址" style="width:500px" prop="address" :rules="[{ required: true, message: '公司地址不能为空'}]">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" style="width:500px" prop="telphone" :rules="[{ required: true, message: '联系方式不能为空'}]">
          <el-input v-model="form.telphone"></el-input>
        </el-form-item>
        <el-form-item label="公司邮箱" style="width:500px" prop="email"
          :rules="[
            { required: true, message: '公司邮箱不能为空'},
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ]"
        >
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="公司介绍" prop="introduce" :rules="[{ required: true, message: '公司介绍不能为空'}]">
          <Tinymce ref="editor" :height="300" v-model="form.introduce" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import * as compare from '@/api/compare'

export default {
  name: 'CompareInfo',
  data() {
    return {
      form: {}
    }
  },
  methods: {
    getInfo() {
      compare.query()
        .then((result) => {
          console.log(result)
          this.form = result.data
        })
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          compare.updateInfo(this.form)
            .then((result) => {
              this.$message({
                type: 'success',
                message: '更新成功!'
              })
              this.getInfo()
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  created() {
    this.getInfo()
  },
  components: {
    Tinymce
  }
}
</script>

<style lang="scss" scoped>

</style>
