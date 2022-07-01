Page({

  /**
   * 页面的初始数据
   */
  data: {
    appointmentDate: "", hospitalId: "", itemInfo: {}, itemInfoId: "", week: "", time: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { appointmentDate, hospitalId, itemInfo, itemInfoId, time, week } = options;
    this.setData({
      appointmentDate, hospitalId, itemInfo: JSON.parse(itemInfo), itemInfoId, week, time
    })
    this.getCurrentDate()
  },

  // 获取当前年月日 星期 上午下午
  getCurrentDate() {
    const date = new Date()
    // 年月日
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const currentDate = [year, month, day].map(this.formatNumber).join('-')
    // 星期
    const weekText = ['日', '一', '二', '三', '四', '五', '六']
    const currentWeek = weekText[new Date(Date.UTC(year, month - 1, day)).getDay()]
    // 上午|下午
    const currentTime = (hour >= 12) ? "下午" : "上午"
    this.setData({
      currentDate,
      currentWeek,
      currentTime,
    })
  },

  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
})