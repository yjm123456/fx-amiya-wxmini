import * as user from "../api/user.js"

// 登录
export const login = () => {
  return new Promise((resolve, reject) => {
    let launchOptions = wx.getLaunchOptionsSync();
    wx.login({
      success: res => {
        const { appId } = getApp().globalData;
        const { code } = res;
        const data = {
          appId,
          code,
          appPath: launchOptions.path,
          scene: launchOptions.scene
        };
        user.login(data).then(res => {
          const { code } = res;
          if (code === 0) {
            const { token } = res.data;
            wx.setStorageSync('token', token);
            resolve(token)
          }
        })
      }
    })
  })
}

// 检测token信息判断用户是否登录
export const checkUserTokenInfo = () => {
  return new Promise((resolve, rejcet) => {
    // token存在
    if (wx.getStorageSync('token')) {
      resolve({ token: wx.getStorageSync('token') })
    }
    // 异步获取token成功执行
    getApp().getUserTokenSuccessCallback = res => {
      resolve({ token: res })
    }
  })
}
