import { login } from "./login"
//const BASEURL = 'https://app.ameiyes.com/amiyamini/amiya/wxmini';//线上
 //const BASEURL = 'http://8.142.171.247:5621/amiya/wxmini';//测试 
const BASEURL = 'http://localhost:5621/amiya/wxmini';//本地
let exeQueue = false;
const requestArr = [];

const http = (method, url, data, callback = "") => {
  let token = wx.getStorageSync("token")
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASEURL}${url}`,
      method,
      header: {
        'content-type': 'application/json',
        // 'content-type': 'application/x-www-form-urlencoded', 
        'Authorization': token
      },
      dataType: 'json',
      data: method === "post" ? JSON.stringify(data) : data,
      success: function (res) {
        if (callback) {
          callback(res.data);
          return false;
        }
        // 请求成功
        if (res.data.code === 0 || res.data.code === -1) {
          resolve(res.data);
        }
        // token 过期
        if (res.data.code === 4010) {
          requestArr.push({
            method, url, data, callback: resolve
          })
          refreshToken()
        }
        // 未绑定
        if (res.statusCode === 401) {
          reject(res.statusCode)
        }
      },
      complete: function (res) {
        if (res.data) {
          const { code, msg } = res.data;
          if (code === -1) {
            wx.showToast({ title: msg, icon: 'none', duration: 3000 });
          } else {
            wx.hideLoading()
          }
        } else {
          wx.hideLoading()
        }
      }
    })
  })
}
export default http;

// 刷新token并回调出错api
const refreshToken = () => {
  if (!exeQueue) {
    exeQueue = true;
    login().then(() => {
      exeQueue = false;
      while (requestArr.length) {
        const { method, url, data, callback } = requestArr.pop();
        http(method, url, data, callback)
      }
    })
  }
}
