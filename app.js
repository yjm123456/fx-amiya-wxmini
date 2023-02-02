import { login } from "./utils/login";
import * as user from "./api/user"
App({
  onLaunch() {
    const accountInfo = wx.getAccountInfoSync();
    this.globalData.appId = accountInfo.miniProgram.appId;
    this.getUserTokenInfo();
  },

  // 获取用户token
  getUserTokenInfo() {
    login().then(res => {
      if (this.getUserTokenSuccessCallback) {
        this.getUserTokenSuccessCallback(res)
      }
    })
  },

  onShow() {
    //使用更新对象之前判断是否可用
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启当前应用？',
              success(res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用applyUpdate应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          // 新版本下载失败时执行
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '发现新版本',
              content: '请删除当前小程序，重新搜索打开...',
            })
          })
        }
      })
    } else {
      //如果小程序需要在最新的微信版本体验，如下提示
      wx.showModal({
        title: '更新提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  globalData: {
    userInfo: null,
    appId: "",
    tmplIds:['yzI4ph707G_OiyTArLzPB2MHDcrZUhdoG42G7XW0zQ8','IhE-E2gYbsAE_M-1RTTYC7xIxGrLtQuKca5ayeYDpxg','bbzpcTSDNUnsYCUQeeFz5u5-aRoVRDNUSffS1rNa_wE']
  }
})














































