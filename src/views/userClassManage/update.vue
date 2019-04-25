<template>
  <div class="app-container" id="CreateNews">
    <el-form v-loading="loading" :rules="rules" ref="form" :model="form" label-width="150px">
      <el-form-item label="产品图片" prop="image">
        <el-upload
          :action="`${ip}/products/temp`"
          list-type="picture-card"
          :limit="4"
          :file-list="fileList"
          :on-success="handleSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-exceed="handleExceed">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="产品视频" prop="video" style="width:500px">
        <el-upload
          class="upload-demo"
          :action="`${ip}/products/video`"
          :on-success="handleSuccessVideo"
          :before-upload="onBeforeUploadVideo"
          multiple
          :limit="1"
          :on-exceed="handleExceedVideo"
          accept="video/mp4"
          :file-list="videoList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传mp4文件，且不超过500MB</div>
        </el-upload>
      </el-form-item>
      <div style="width:600px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="产品类型" prop="classId">
        <el-select v-model="form.classId" placeholder="请选择产品类型" style="width:320px">
          <el-option label="硬件" value="1"></el-option>
          <el-option label="软件" value="2"></el-option>
        </el-select>
      </el-form-item>
      <div style="width:400px">
        <el-form-item label="型号" prop="model">
          <el-input v-model="form.model"></el-input>
        </el-form-item>
      </div>
      <div style="width:400px">
        <el-form-item label="生产厂家/开发公司" prop="company">
          <el-input v-model="form.company"></el-input>
        </el-form-item>
      </div>
      <div style="width:400px">
        <el-form-item label="上市时间" width="" prop="marketTime">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.marketTime" style="width: 100%;"></el-date-picker>
        </el-form-item>
      </div>
      <div style="width:600px">
        <el-form-item label="产品简短介绍" prop="shortIntroduce">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="产品简短介绍"
            v-model="form.shortIntroduce">
          </el-input>
        </el-form-item>
      </div>
      <el-form-item label="产品详细介绍" prop="longIntroduce">
        <Tinymce ref="editor" :height="600" v-model="form.longIntroduce" />
      </el-form-item>
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
      loading: true,
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
      videoList: [],
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
      const isLt100M = file.size / 1024 / 1024 / 100 < 6
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
      console.log(url)
      this.imageList[url[url.length - 1]] = url[url.length - 1]
    },
    handleSuccessVideo(response, file) {
      if (response.url != null) {
        const url = response.url.split('/')
        this.form.video = url[url.length - 1]
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
      if (file.response) {
        const url = file.response.url.split('/')
        delete this.imageList[url[url.length - 1]]
      } else {
        delete this.imageList[file.name]
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    onSubmit() {
      for (const key in this.imageList) {
        if (this.imageList.hasOwnProperty(key)) {
          const element = this.imageList[key]
          console.log(element)
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
          console.log(element)
          this.form.image += `${element} `
        }
      }
      products.update(this.form)
        .then((result) => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.$router.push({ name: 'Products' })
        })
    },
    getData() {
      this.loading = true
      products.queryById(this.$route.params.id)
        .then((result) => {
          this.form = result.data
          result.data.pathList.forEach(value => {
            const url = value.split('/')
            this.fileList.push({
              name: url[url.length - 1],
              url: value
            })
            this.imageList[url[url.length - 1]] = url[url.length - 1]
          })
          const video = result.data.video
          var videoUrl = null
          if (result.data.video != null) {
            videoUrl = result.data.video.split('/')
            this.videoList.push({
              name: videoUrl[videoUrl.length - 1],
              url: video
            })
          }
          this.loading = false
        })
    }
  },
  created() {
    this.getData()
  }
}
</script>
