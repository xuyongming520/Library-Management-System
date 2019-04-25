<template>
  <div class="app-container" id="CreateNews">
    <el-form :rules="rules" ref="form" :model="form" label-width="150px">
      <div style="width:600px">
        <el-form-item label="图书分类名称" prop="name">
          <el-input v-model="form.name"></el-input>
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
import Tinymce from '@/components/Tinymce'
import * as products from '@/api/products'
import { API_IP } from '@/utils/request'
export default {
  name: 'CreateNews',
  data() {
    return {
      form: {
        name: '',
        model: '',
        classId: '',
        company: '岩创科技有限公司',
        shortIntroduce: '',
        longIntroduce: '',
        marketTime: new Date(),
        image: '',
        video: ''
      },
      rules: {
        name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        model: [{ required: true, message: '请输入产品型号', trigger: 'blur' }],
        classId: [{ required: true, message: '请选择产品类型', trigger: 'blur' }],
        company: [{ required: true, message: '请输入产品生产厂家/开发公司', trigger: 'blur' }],
        shortIntroduce: [{ required: true, message: '请输入产品简短介绍', trigger: 'blur' }],
        longIntroduce: [{ required: true, message: '请输入产品详细介绍', trigger: 'blur' }],
        marketTime: [{ required: true, message: '请输入产品上市时间', trigger: 'blur' }],
        image: [{ required: true, message: '请上传产品图片', trigger: 'blur' }]
      },
      fileList: [],
      imageList: {},
      dialogImageUrl: '',
      dialogVisible: false,
      ip: API_IP
    }
  },
  components: {
    Tinymce
  },
  methods: {
    handleExceed() {
      this.$message({
        type: 'warning',
        message: '只支持4张图片!'
      })
    },
    handleExceedVideo() {
      this.$message({
        type: 'warning',
        message: '只支持1段视频!'
      })
    },
    onBeforeUploadVideo(file) {
      const isIMAGE = (file.type === ('video/mp4'))
      const isLt100M = file.size / 1024 / 1024 / 100 <= 5
      if (!isIMAGE) {
        this.$message.error('上传文件只能是mp4格式!')
      }
      if (!isLt100M) {
        this.$message.error('上传文件大小不能超过 500MB!')
      }
      return isIMAGE && isLt100M
    },
    handleSuccess(response, file) {
      const url = response.url.split('/')
      this.imageList[file.uid] = url[url.length - 1]
    },
    handleSuccessVideo(response, file) {
      console.log(response, file)
      if (response.url != null) {
        const url = response.url.split('/')
        this.form.video = url[url.length - 1]
      }
    },
    handleRemove(file, fileList) {
      delete this.imageList[file.uid]
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    onSubmit() {
      for (const key in this.imageList) {
        if (this.imageList.hasOwnProperty(key)) {
          const element = this.imageList[key]
          this.form.image += `${element} `
        }
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.createdProducts()
        } else {
          return false
        }
      })
    },
    createdProducts() {
      this.form.image = ''
      for (const key in this.imageList) {
        if (this.imageList.hasOwnProperty(key)) {
          const element = this.imageList[key]
          this.form.image += `${element} `
        }
      }
      products.insert(this.form)
        .then((result) => {
          this.$message({
            type: 'success',
            message: '创建成功!'
          })
          this.$router.push({ name: 'Products' })
        })
    }
  }
}
</script>
