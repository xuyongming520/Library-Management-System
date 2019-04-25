import request from '@/utils/request'

export function queryById(id) {
  return request({
    url: '/products/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export function query({ limit, page, name, classId }) {
  return request({
    url: '/products/list',
    method: 'get',
    params: {
      limit,
      page,
      classId: classId || '0',
      name: name.trim()
    }
  })
}

export function insert({ name, shortIntroduce, longIntroduce, marketTime, model, classId, image, company, video }) {
  return request({
    url: '/products',
    method: 'post',
    data: {
      name,
      shortIntroduce,
      longIntroduce,
      marketTime,
      model,
      image,
      company,
      classId: classId || '1',
      video
    }
  })
}

export function update({ pkId, name, shortIntroduce, longIntroduce, marketTime, model, classId, image, company, video }) {
  return request({
    url: '/products',
    method: 'put',
    data: {
      pkId,
      name,
      shortIntroduce,
      longIntroduce,
      marketTime,
      model,
      image,
      company,
      classId: classId || '1',
      video
    }
  })
}

export function deleteById(id) {
  return request({
    url: '/products',
    method: 'delete',
    params: {
      id
    }
  })
}
