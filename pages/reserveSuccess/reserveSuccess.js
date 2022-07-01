import http from "./../../utils/http";

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id } = options;
    this.byIdGetAppointmentInfo(id)
    this.getAppointmentQrcodeBase64(id)
  },

  // 根据核销编号获取核销信息
  byIdGetAppointmentInfo(id) {
    http("get", `/Appointment/byId/${id}`).then(res => {
      if (res.code === 0) {
        const { appointmentInfo } = res.data;
        this.setData({
          appointmentInfo: {
            ...appointmentInfo,
            appointmentDate: appointmentInfo.appointmentDate.substr(0, 10),
            createDate: appointmentInfo.createDate.substr(0, 10),
            submitDate: appointmentInfo.submitDate.substr(0, 10)
          }
        })
      }
    })
  },

  // 获取核销二维码（Base64）
  getAppointmentQrcodeBase64(id) {
    http("get", `/Appointment/qrcodeBase64/${id}`).then(res => {
      if (res.code === 0) {
        const { qrCodeBase64 } = res.data;
        this.setData({
          qrCodeBase64: `data:image/png;base64,${qrCodeBase64}`
        })
      }
    })
  }
})