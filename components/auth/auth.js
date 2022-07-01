import {
  updateUserInfo,
} from "./../../api/user";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    control: {
      type: Boolean,
    },
  },

  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    getUserProfile() {
      wx.getUserProfile({
        desc: '授权公开信息',
        success: (res) => {
          const { userInfo } = res;
          getApp().globalData.userInfo = userInfo;
          updateUserInfo(userInfo).then(res => {
            this.triggerEvent("getUserInfoSuccess");
          })
        },
        fail: (err) => {
          this.triggerEvent("authCancel");
        }
      })
    }
  }
})