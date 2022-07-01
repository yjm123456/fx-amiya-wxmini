import http from  "./../../../../utils/http";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 核销信息
    appointmentInfo: {
      type: Array
    },

    // 当前激活
    currentTargetActive: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 取消核销
    handleCancelReserve(e) {
      const { currentTargetActive } = this.data;
      const { id } = e.currentTarget.dataset;
      wx.showModal({
        title: '提示',
        content: '确认取消核销',
        success: (res) => {
          if (res.confirm) {
            http("put", `/Appointment/cancel`, id).then(res => {
              if (res.code === 0) {
                this.triggerEvent("cancelReserveSuccess", { currentTargetActive });
              }
            })
          }
        }
      })
    },

    // 查看二维码
    handleSeeQrcode(e) {
      const { id } = e.currentTarget.dataset;
      wx.navigateTo({
        url: `/pages/reserveSuccess/reserveSuccess?id=${id}`,
      })
    },

    handlePhone(e) {
      const { phone } = e.currentTarget.dataset;
      wx.makePhoneCall({
        phoneNumber: phone,
        success: () => {
        },
        fail: () => {
        }
      })
    },

    gotohere(e) {
      const { latitude, longitude, hospitalname, address } = e.currentTarget.dataset;
      wx.openLocation({
        latitude,
        longitude,
        scale: 18,
        name: hospitalname,
        address
      })
    }
  },
})
