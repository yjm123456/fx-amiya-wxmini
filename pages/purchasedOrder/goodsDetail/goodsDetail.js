// pages/purchasedOrder/goodsDetail/goodsDetail.js
import http from "./../../../utils/http";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo:{},
    qrCodeBase64:"",
    // 判断是否是支付订单 1支付订单 2积分订单
    type:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {

    const {orderId,type} = options
    console.log(orderId);
    console.log(type)
    this.setData({
      type:type
    })
    this.getOrderInfoById(orderId)
  },
  // 获取商品订单详情
  getOrderInfoById(orderId){
    const data = {
      orderId:orderId
    }
    http("get", "/Order/getOrderInfoById",data).then(res => {
        if(res.code === 0){
          this.setData({
            orderInfo:res.data.orderDetailResult
          })
          if(res.data.orderDetailResult.writeOffCode){
            this.getQrcodeImage(res.data.orderDetailResult.writeOffCode)
          }
        }
    })
  },
  // 获取二维码
  getQrcodeImage(writeOffCode){
    http("get", `/Order/qrcodeBase64/${writeOffCode}`).then(res => {
       if (res.code === 0) {
        const { qrCodeBase64 } = res.data;
        this.setData({
          qrCodeBase64: `data:image/png;base64,${qrCodeBase64}`
        })
      }
    })

  },
  // 复制订单号
  copyOrderNum(e){
    const {order } = e.currentTarget.dataset
    wx.setClipboardData({
      data: order,
      success: function (res) {
          wx.getClipboardData({
              success: function (res) {
                  wx.showToast({
                      title: '复制成功'
                  })
              }
          })
      }
    })
  }
})