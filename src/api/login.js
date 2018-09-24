import request from '@/utils/request'

export function login(username, password) {
  const data = new FormData()
  data.set('username', username)
  data.set('password', password)
  return request({
    url: 'user/login',
    method: 'post',
    data
  })
}

export function validate(type, value) {
  return request({
    url: 'user/validate',
    method: 'get',
    params: {
      type,
      value
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
