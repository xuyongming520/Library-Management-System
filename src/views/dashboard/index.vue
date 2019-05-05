<template>
  <div class="dashboard-container">

    <el-row :gutter="40" class="panel-group">
    <el-col :xs="24" :sm="24" :lg="12" class="card-panel-col">
      <div class="card-panel" @click="">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="user" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-text">
            用户
        </div>
        <div class="card-panel-description">
          <span class="card-panel-num" >{{this.news}}</span>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="24" :lg="12" class="card-panel-col">
      <div class="card-panel" @click="">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="case" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-text">
            图书
          </div>
        <div class="card-panel-description">
          <span class="card-panel-num" >{{this.case}}</span>
        </div>
      </div>
    </el-col>
  </el-row>

  <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
    <bar-chart />
  </el-row>

  <el-row :gutter="80" justify="space-between" type="flex">
    <el-col :xs="{span: 16}" :sm="{span: 16}" :md="{span: 16}" :lg="{span: 8}" :xl="{span: 8}" style="padding-right:8px">
      <vue-calendar></vue-calendar>
    </el-col>
  <el-col :xs="{span: 32}" :sm="{span: 32}" :md="{span: 32}" :lg="{span: 16}" :xl="{span: 16}" >
    <template>
      <el-table
        :data="newsInfo"
        element-loading-text="Loading"
        fit
        highlight-current-row
        style="width: 100%">
            <el-table-column
              label="新闻"
              width="600">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="类型"
              width="150">
              <template slot-scope="scope">
                <span>
                  {{ newsClasses[scope.row.classId].display_name }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="日期">
              <template slot-scope="scope">
                <span style="margin-left: 10px">
                  {{ scope.row.releaseDate | formatDate}}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="作者" align="center" width="180" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <span style="margin-left: 10px">
                  {{ scope.row.author }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </template>

      </el-col>
    </el-row>
  </div>
</template>

<script>
import BarChart from './components/BarChart'
import TodoList from './components/TodoList'
import VueCalendar from './components/VueCalendar'
import * as count from '@/api/dashboard'
import * as newsInfo from '@/api/news'

export default {
  name: 'dashboard',
  data() {
    return {
      count: [],
      newsInfo: [],
      case: 0,
      pro: 0,
      news: 0,
      newsClasses: [
        { key: 0, display_name: '全部' },
        { key: 1, display_name: '行业动态' },
        { key: 2, display_name: '公司动态' },
        { key: 3, display_name: '科研动态' }
      ],
      listQuery: {
        limit: 10,
        page: 1,
        classId: 0,
        name: ''
      }
    }
  },
  components: {
    BarChart,
    TodoList,
    VueCalendar
  },
  methods: {
    getCount() {
      this.loading = true
      count.count()
        .then((result) => {
          this.case = result.data.case
          this.news = result.data.news
          this.pro = result.data.products
          this.loading = false
        })
    },
    getList() {
      this.loading = true
      newsInfo.query(this.listQuery)
        .then((result) => {
          console.log(result.data.list[0].releaseDate)
          this.newsInfo = result.data.list
          this.loading = false
        })
    },
    handleUpdate(id) {
      this.$router.push({ path: `views/products/update/${id}` })
    }
  },
  created() {
    this.getCount()
    this.getList()
  },
  filters: {
    formatDate(val) {
      console.log(12)
      console.log(val)
      const date = new Date(val)
      const year = date.getFullYear()
      const month = date.getMonth() > 8 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
      const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`
      return `${year}-${month}-${day}`
    }
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    text-align: center;
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shopping {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shopping {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-text {
        float: left;
        font-weight: bold;
        margin: 45px;
        margin-left: 20px;
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 28px;
        margin-bottom: 12px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 45px;
      margin-left: 0px;
      .card-panel-num {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 28px;
        margin-bottom: 12px;
      }
    }
  }
}

.dashboard-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
