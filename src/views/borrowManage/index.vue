<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom:20px">
      <el-input v-model="listQuery.name" placeholder="标题" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.classId" placeholder="类别" clearable class="filter-item" style="width: 180px">
        <el-option v-for="item in productsClasses" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>

    <el-table
      :data="products"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="编号" width="95">
        <template slot-scope="scope">
          {{ scope.row.pkId }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="书名编号" width="110" align="center">
        <template slot-scope="scope">
          <el-tag>{{ productsClasses[scope.row.classId].display_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="书名称">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row.pkId)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="借阅时间" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.model }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应还时间" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.marketTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="位置" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.company }}</span>
        </template>
      </el-table-column>
      <el-table-column label="罚款" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.company }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.company }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container" style="margin-top:10px;">
      <el-pagination
        v-show="total>0"
        :current-page="listQuery.page"
        :page-sizes="[10,20,30,50]"
        :page-size="listQuery.limit"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import * as products from '@/api/borrows'

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
