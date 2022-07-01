import http from "./../../utils/http";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: [],

    isCanReceive: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUnReceiveGiftOrderList();
  },

  // 获取未领取礼品的订单列表
  getUnReceiveGiftOrderList() {
    http("get", `/Order/unReceiveGiftOrderList`).then(res => {
      if (res.code === 0) {
        this.setData({
          order: res.data.order
        })
      }
    })
  },

  // 领取礼品
  receiveGift(e) {
    const { orderid } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/receiveGift/receiveGift?orderId=${orderid}`,
    })
  }
})