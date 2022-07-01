import http from "./../../utils/http";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTargetActive: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAppointmentList(this.data.currentTargetActive)
  },

  onChange(event) {
    const { index } = event.detail;
    this.setData({
      currentTargetActive: index
    })
    this.getAppointmentList(index)
  },

  // 核销列表
  getAppointmentList(status) {
    const data = {
      status,
      itemName: "",
      orderId: ""
    }
    http("get", `/Appointment/list`, data).then(res => {
      if (res.code === 0) {
        const { appointmentInfo } = res.data;
        this.setData({
          appointmentInfo: appointmentInfo.map(item => {
            return {
              ...item,
              appointmentDate: item.appointmentDate.substr(0, 10)
            }
          })
        })
      }
    })
  },

  // 取消核销
  cancelReserveSuccess(e) {
    const { currentTargetActive } = e.detail;
    this.getAppointmentList(currentTargetActive)
  },

  // 确认完成
  confirmCompleteSuccess(e) {
    const { currentTargetActive } = e.detail;
    this.getAppointmentList(currentTargetActive)
  }
})