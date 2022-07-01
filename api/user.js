import http from '../utils/http.js';

// 登录获取token
export const login = (data) => {
  return http("post", `/user/login`, data)
}

// 判断用户是否是客户
export const iscustomer = () => {
  return http("get", `/User/iscustomer`, {})
}

// 更新用户信息
export const updateUserInfo = (data) => {
  return http("put", `/User/updateUserInfo`, data)
}

// 解密手机号
export const decryptPhoneNumber = (data) => {
  return http("get", `/User/decryptPhoneNumber`, data)
}

// 发送验证码
export const sendCode = (phoneNumber) => {
  return http("post", `/ValidateCode/send/${phoneNumber}`, {})
}

// 验证码是否有效
export const validateCode = (data) => {
  return http("get", `/ValidateCode/validate`, data)
}

// 绑定
export const bind = (data) => {
  return http("post", `/Customer/bind`, data)
}

// 获取手机号
export const getCustomerPhone = () => {
  return http("get", `/Customer/phone`, {})
}

// 修改客户手机
export const editPhone = (phone) => {
  return http("put", `/Customer/phone/${phone}`, {})
}

// 判断是否需要授权微信用户信息
export const isAuthorizationUserInfo = () => {
  return http("get", `/User/info`)
}