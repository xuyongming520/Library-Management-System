<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom:20px">
      <el-input v-model="listQuery.userId" placeholder="用户编号" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>

    <el-table
      :data="borrows"
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
          <el-tag>{{ scope.row.booksId}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="用户编号" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="书名">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="借阅时间" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreate | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="应还时间" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtReturn | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际归还时间" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.actualReturn | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="罚款" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.fine }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否归还" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ borrowsClasses[scope.row.isReturn].display_name }}</span>
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
import * as borrows from '@/api/borrows'

export default {
  name: 'Borrows',
  data() {
    return {
      loading: true,
      borrows: [],
      total: 0,
      borrowsClasses: [
        { key: 0, display_name: '未归还' },
        { key: 1, display_name: '已归还' }
      ],
      listQuery: {
        limit: 10,
        page: 1
      },
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  methods: {
    handleFilter() {
      this.listQuery.userId = parseInt(this.listQuery.userId)
      this.listQuery.page = 1
      this.getList()
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
      console.log(this.listQuery)
      borrows.query(this.listQuery)
        .then((result) => {
          console.log(result)
          if (result.code === 1) {
            this.borrows = result.data.list
            this.total = result.data.totalCount
            this.loading = false
          } else {
            this.borrows = []
          }
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

</style>
