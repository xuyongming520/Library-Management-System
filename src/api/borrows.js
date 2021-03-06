import request from '@/utils/request'

export function query({ limit, page, userId }) {
  console.log({ limit, page, userId })
  return request({
    url: '/books/lend/record',
    method: 'post',
    data: {
      limit,
      page,
      userId: userId || 0
    }
  })
}

// export function insert({ name, shortIntroduce, longIntroduce, marketTime, model, classId, image, company, video }) {
//   return request({
//     url: '/products',
//     method: 'post',
//     data: {
//       name,
//       shortIntroduce,
//       longIntroduce,
//       marketTime,
//       model,
//       image,
//       company,
//       classId: classId || '1',
//       video
//     }
//   })
// }

// export function update({ pkId, name, shortIntroduce, longIntroduce, marketTime, model, classId, image, company, video }) {
//   return request({
//     url: '/products',
//     method: 'put',
//     data: {
//       pkId,
//       name,
//       shortIntroduce,
//       longIntroduce,
//       marketTime,
//       model,
//       image,
//       company,
//       classId: classId || '1',
//       video
//     }
//   })
// }

export function deleteById(id) {
  return request({
    url: '/books/lend',
    method: 'delete',
    params: {
      id
    }
  })
}
