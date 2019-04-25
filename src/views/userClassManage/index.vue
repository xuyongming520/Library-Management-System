<template>
  <div class="app-container">
    <el-table
      :data="products"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="分类编号">
        <template slot-scope="scope">
          {{ scope.row.pkId }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="类别" align="center">
        <template slot-scope="scope">
          <el-tag>{{ productsClasses[scope.row.classId].display_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.pkId)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.pkId)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import * as products from '@/api/products'

export default {
  name: 'Products',
  data() {
    return {
      loading: true,
      products: [],
      total: 0,
      productsClasses: [
        { key: 0, display_name: '全部' },
        { key: 1, display_name: '硬件' },
        { key: 2, display_name: '软件' }
      ],
      listQuery: {
        limit: 10,
        page: 1,
        classId: 0,
        name: ''
      },
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  methods: {
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    handleUpdate(id) {
      this.$router.push({ path: `/products/update/${id}` })
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        products.deleteById(id)
          .then((result) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.$router.push({ name: 'CreateProducts' })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    getList() {
      this.loading = true
      products.query(this.listQuery)
        .then((result) => {
          console.log(result)
          this.products = result.data.list
          this.total = result.data.totalCount
          this.loading = false
        })
    }
  },
  created() {
    this.getList()
  },
  filters: {
    formatDate(val) {
      const date = new Date(val)
      const year = date.getFullYear()
      const month = date.getMonth() > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
      const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate() + 1}`
      return `${year}-${month}-${day}`
    }
  }
}
</script>

<style lang="scss" scoped>
#products{

}
</style>
