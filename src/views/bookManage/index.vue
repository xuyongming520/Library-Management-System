<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom:20px">
      <el-select v-model="listQuery.status" placeholder="类别" clearable class="filter-item" style="width: 180px">
        <el-option v-for="item in booksClasses" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 1px;" type="success" icon="el-icon-edit" @click="handleCreate">增加</el-button>
    </div>

    <el-table
      :data="books"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="编号" width="110">
        <template slot-scope="scope">
          {{ scope.row.pkId }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="图书信息编号" width="110" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.infoId }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否借阅" align="center">
        <template slot-scope="scope">
           {{ booksClasses[scope.row.status].display_name }}
        </template>
      </el-table-column>
      <el-table-column label="图书馆位置" align="center">
        <template slot-scope="scope">
           {{ scope.row.location }}
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
import * as books from '@/api/books'

export default {
  name: 'Books',
  data() {
    return {
      loading: true,
      books: [],
      total: 0,
      listQuery: {
        limit: 10,
        page: 1,
        classId: 0,
        name: ''
      },
      booksClasses: [
        { key: 0, display_name: '未借阅' },
        { key: 1, display_name: '已借阅' }
      ],
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
      this.$router.push({ path: `/bookManage/update/${id}` })
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        books.deleteById(id)
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
      this.$router.push({ name: 'CreateBook' })
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
      books.query(this.listQuery)
        .then((result) => {
          this.books = result.data.list
          this.total = result.data.totalCount
          this.loading = false
        })
    }
  },
  created() {
    this.getList()
  }
}
</script>
