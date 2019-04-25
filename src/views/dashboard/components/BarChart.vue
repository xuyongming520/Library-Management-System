<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
import * as news from '@/api/dashboard'

const animationDuration = 6000

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      loading: true,
      news: [],
      newsCount: [],
      chart: null
    }
  },
  mounted() {
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getNewsClass() {
      this.loading = true
      news.newsClass()
        .then((result) => {
          this.news = result.data
          this.loading = false
          this.classNew(news)
          this.initChart(this.newsCount)
        })
    },

    classNew(news) {
      for (var i = 0; i < this.news.length; i++) {
        if (this.news[i].classId === 1) {
          this.newsCount[i] = this.news[i].count
        } else if (this.news[i].classId === 2) {
          this.newsCount[i] = this.news[i].count
        } else if (this.news[i].classId === 3) {
          this.newsCount[i] = this.news[i].count
        }
      }
      // console.log(this.newsCount)
    },
    initChart(newsCount) {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['行业动态', '公司动态', '科研动态'],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '点击量',
          type: 'bar',
          // stack: 'vistors',
          barWidth: '20%',
          data: newsCount,
          animationDuration
        }]
      })
    }
  },
  created() {
    this.getNewsClass()
  }
}
</script>
