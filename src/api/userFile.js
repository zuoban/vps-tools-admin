import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/userFile',
    method: 'get',
    params: { ...data, page: data.page - 1 }
  })
}

export function download(id) {
  return request({
    url: '/userFile/download',
    method: 'get',
    params: { id }
  })
}
