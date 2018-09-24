import request from '@/utils/request'

const URL = '/downloadTask'
export function add(url) {
  const data = new FormData()
  data.set('url', url || '')
  return request({
    url: URL,
    method: 'post',
    data
  })
}

export function list(data) {
  return request({
    url: URL,
    method: 'get',
    params: { ...data, page: data.page - 1 }
  })
}

export function deleteAll(ids) {
  return request({
    url: URL,
    method: 'delete',
    data: ids
  })
}
