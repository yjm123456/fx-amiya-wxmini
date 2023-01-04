Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const index = options.active
    this.setData({
      active:parseInt(index)
    })
  },

  handleTabChange(event) {
    const { name } = event.detail;
    this.setData({
      active: name
    })
  },

  onReachBottom() {
    const { active } = this.data;
    switch (active) {
      case 0:
        this.selectComponent("#notClaimed").getOrderList()
        break;
      default:
        this.selectComponent("#received")
    }
  }
})
