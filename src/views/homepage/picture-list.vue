<template>
  <div class="app-container">
    <el-form ref="form" label-width="100px">
      <el-form-item label="首页图片" prop="image">
        <el-upload
          :action="`${API_IP}/company/upload`"
          list-type="picture-card"
          :limit="6"
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
      <el-form-item label="实例效果">
        <div class="play">
          <el-carousel indicator-position="outside" height="440px">
            <el-carousel-item v-for="(item,key) in list" :key="key">
              <img :src="item.image" width="1226px" height="440px"/>
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as picture from '@/api/picture'
import { API_IP } from '@/utils/request'

export default {
  name: 'PageList',
  data() {
    return {
      list: [],
      fileList: [],
      imageList: {},
      dialogImageUrl: '',
      dialogVisible: false,
      API_IP
    }
  },
  methods: {
    handleExceed() {
      this.$message({
        type: 'warning',
        message: '只支持6张图片!'
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleSuccess(response, file) {
      this.getList()
    },
    handleRemove(file, fileList) {
      picture.deleteById(file.name)
        .then((result) => {
          if (result.code === '1') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
    },
    getList() {
      picture.query()
        .then((result) => {
          console.log(result)
          this.list = result.data
          this.fileList = []
          this.imageList = []
          result.data.forEach((value) => {
            const url = value.image.split('/')
            this.fileList.push({
              name: value.imageId,
              url: value.image
            })
            this.imageList[url[url.length - 1]] = url[url.length - 1]
          })
        })
    }
  },
  created() {
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
.play{
  width: 1226px;
}
</style>
