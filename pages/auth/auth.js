import * as api from "../../api/user";

Page({
  data: {
    phoneNumber: "",

    control: false,

    path: ""
  },
  onLoad(e) {
    this.data.path = e.path;
  },

  // 解密手机号
  getPhoneNumber(e) {
    const { errMsg, iv, encryptedData } = e.detail;
    if (errMsg === "getPhoneNumber:ok") {
      api.decryptPhoneNumber({ iv, encryptedData }).then(res => {
        if (res.code === 0) {
          const { phoneNumber } = res.data;
          this.setData({
            control: true,
            phoneNumber
          })
        }
      })
    }
  },

  // 使用该号码
  handleUseCurrentPhone() {
    api.bind(this.data.phoneNumber).then(res => {
      if (res.code === 0) {
        const pages = getCurrentPages();
        let delta = 0;
        for (let i = pages.length - 1; i >= 0; i--) {
          if (pages[i].route === this.data.path) {
            break;
          }
          delta += 1;
        }
        wx.navigateBack({
          delta
        })
      }
    })
  },

  // 其他手机号
  handleUseOtherPhone() {
    wx.navigateTo({
      url: `/pages/login/login?path=${this.data.path}`
    })
  }
})