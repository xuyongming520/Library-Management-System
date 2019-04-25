import request from '@/utils/request'

export function newsClass() {
  return request({
    url: '/news/statistic',
    method: 'get'
  })
}

export function count() {
  return request({
    url: '/company/count',
    method: 'get'
  })
}
