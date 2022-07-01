import http from './../../utils/http';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemInfo: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getItemInfo()
  },

  // 获取项目列表
  getItemInfo() {
    http("get", `/ItemInfo/listByCustomer`, {}).then(res => {
      if (res.code === 0) {
        const { itemInfoList } = res.data;
        this.setData({
          itemInfo: itemInfoList
        })
      }
    })
  },

  // 核销
  handleReserve(e) {
    const city = wx.getStorageSync('currentCity');
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/projectReserveHospital/projectReserveHospital?id=${id}&city=${city}`,
    })
  }
})