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
    }
    
  },

  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    getUserProfile() {
        let randomAvatarUrl=[
            "https://ameiya.oss-cn-hangzhou.aliyuncs.com/3cec259bae5648dc8e6d9f69e9d5aeca.png",
            "https://ameiya.oss-cn-hangzhou.aliyuncs.com/e7b904bab9e24107accd14311c9e4ee6.png",
            "https://ameiya.oss-cn-hangzhou.aliyuncs.com/c8f70f2329af4d00993a701b25ccd171.png",
            "https://ameiya.oss-cn-hangzhou.aliyuncs.com/def25b480b9a4390976176e27b751c31.png",
            "https://ameiya.oss-cn-hangzhou.aliyuncs.com/85c1d66a3c9d415b952628862001611c.png",
            "https://ameiya.oss-cn-hangzhou.aliyuncs.com/3cec259bae5648dc8e6d9f69e9d5aeca.png"
        ]
      wx.getUserProfile({
        desc: '授权公开信息',
        success: (res) => {
          const { userInfo } = res;
          getApp().globalData.userInfo = userInfo;
          var index= parseInt(Math.random()*5,10);; 
          userInfo.AvatarUrl=randomAvatarUrl[index];
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