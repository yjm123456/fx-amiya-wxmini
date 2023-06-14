import { login } from "./utils/login";
import * as user from "./api/user"
App({
  onLaunch() {
    const accountInfo = wx.getAccountInfoSync();
    this.globalData.appId = accountInfo.miniProgram.appId;
    this.globalData.isLogin = false;
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
    assisteAppId:"",
    isLogin:false,
    tmplIds:['vayFjnf7gU8-qukpUbLno8Da78Ze2cjUtip1xW0Sqik','XLGnCrVBU40eZ38_7mTrLxMFVck5dfTgjT2-U3FD9i8','wrtg5gf5s_6j6nCF6-AUl6xDiIS_g9vtGONp-hqbFH8'],
    giftTmpId:['0-67gP8KEM8YPI6I8I3r01BxH080Gi1ZLO8XKT4Us4c'],
    designTmpId:['xd76aOnROJDA1gZciQ3eK1ZowQo1V3w08TL96_UkeMw'],
    appIds:['wx695942e4818de445','wx8747b7f34c0047eb','ddqz','jnqz']
  }
})














































