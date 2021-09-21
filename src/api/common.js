import request from '@/utils/request'

// 获取账户列表
export function accountLists(data) {
  return request({
    url: '/accounts',
    method: 'get',
    params: data,
    baseURL: process.env.VUE_APP_REMOTE_API
  })
}

// 登录
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    baseURL: process.env.VUE_APP_REMOTE_API,
    data
  })
}

// 获取仓位配置信息
export function getStrategyConf(data) {
  return request({
    url: '/strategyConfig',
    method: 'get',
    params: data,
    baseURL: process.env.VUE_APP_REMOTE_API
  })
}

// 获取仓位配置表头信息
export function getStrategyList() {
  return request({
    url: '/strategylist',
    method: 'get',
    baseURL: process.env.VUE_APP_REMOTE_API
  })
}

// 更新仓位配置信息
export function updateStrategyConf(data) {
  return request({
    url: '/strategyConfig',
    method: 'post',
    data,
    baseURL: process.env.VUE_APP_REMOTE_API
  })
}

// 获取合约配置信息
export function getContractConfig() {
  return request({
    url: '/contractconf',
    method: 'get',
    baseURL: process.env.VUE_APP_REMOTE_API
  })
}

// 更新合约配置信息
export function updateContractConfig(data) {
  return request({
    url: '/contractconf',
    method: 'post',
    data,
    baseURL: process.env.VUE_APP_REMOTE_API
  })
}

// 获取历史数据
export function getDayStats(data) {
  return request({
    url: '/daystats',
    method: 'get',
    params: data,
    baseURL: process.env.VUE_APP_REMOTE_API
  })
}

// 获取品种盈亏
export function getCommsProfit(data) {
  return request({
    url: '/commsProfit',
    method: 'get',
    params: data,
    baseURL: process.env.VUE_APP_REMOTE_API
  })
}

// 获取仓位
export function getPs(data) {
  return request({
    url: '/ps',
    method: 'get',
    params: data,
    baseURL: process.env.VUE_APP_REMOTE_API
  })
}
// 回测仓位
export function getPshistorybasktest(data) {
  return request({
    url: '/pshistorybasktest',
    method: 'get',
    params: data,
    baseURL: process.env.VUE_APP_REMOTE_API
  })
}

// 获取仓位最新时间
export function getPsTimeStamp(data) {
  return request({
    url: '/getPsTimeStamp',
    method: 'get',
    params: data,
    baseURL: process.env.VUE_APP_REMOTE_API
  })
}

// 获取历史仓位
export function getHistory(data) {
  return request({
    url: '/pshistory',
    method: 'get',
    params: data,
    baseURL: process.env.VUE_APP_REMOTE_API
  })
}
// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }
