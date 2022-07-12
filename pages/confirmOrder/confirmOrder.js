import http from "./../../utils/http";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 积分
    // 地址
    address: null,
    // 商品
    goodsInfo: [],
    // 备注
    remark: "",
    // 是否实物
    isMaterial: false,
    // 总价格
    totalPrice: 0,
    // 交易编号
    tradeId: "",

    // 商城
    //城市id
    cityid:"",
    // 医院id
    hospitalid:"",
    // 判断是商城还是积分兑换
    type:"",
    // 总价
    allmoney:"",
    active:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {hospitalid , type , allmoney} = options
    this.setData({
      hospitalid,
      goodsInfo,
      allmoney,
      type,
      isMaterial: goodsInfo.some(_item => _item.isMaterial),
      totalPrice: goodsInfo.reduce((acc, cur) => {
        return acc += cur.integrationQuantity * cur.quantity
      }, 0).toFixed(2)
    })
  },

  handleSelectAddress() {
    const path = 'pages/confirmOrder/confirmOrder';
    wx.navigateTo({
      url: `/pages/addressList/addressList?selectAddress=${true}&path=${path}`
    })
  },

  handleRemarkChange(e) {
    const { detail } = e;
    this.setData({
      remark: detail
    })
  },

  handlePay(e) {
    const {ismaterial} = e.currentTarget.dataset
    const { address, goodsInfo, remark, isMaterial, tradeId ,allmoney,hospitalid ,type} = this.data;
    if (tradeId&&type == 2) {
      // 支付
      this.pay(tradeId)
      return;
    }
    if (isMaterial && !address) {
      wx.showToast({
        title: '请选择地址',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    const data = {
      // 地址编号
      addressId: address && address.id,
      // 备注
      remark,
      orderItemList: goodsInfo.map(_item => {
        return {
          // 商品编号
          goodsId: _item.id,
          // 购买数量
          quantity: _item.quantity,
          hospitalId:_item.hospitalid ? _item.hospitalid : 0 ,
          actualPayment:Number(_item.allmoney) ? Number(_item.allmoney) : 0
        }
      })
    }
    // 生成订单
    http("post", `/Order`, data).then(res => {
      if (res.code === 0) {
        const { tradeId , payRequestInfo ,alipayUrl} = res.data.orderAddResult;
        this.setData({
          tradeId
        })
        // type为2是积分兑换
        if(type == 2 ){
          wx.showModal({
            title: '提示',
            content: '是否支付',
            success: (res) => {
              if (res.confirm) {
                this.pay(tradeId)
              } else if (res.cancel) {
                // 取消支付
              }
            }
          })
        }else{
          // type为1 是商城支付
          // wx.requestPayment({
          //   timeStamp:  payRequestInfo.timeStamp,
          //   nonceStr:  payRequestInfo.nonceStr,
          //   package:  payRequestInfo.package,
          //   signType:  payRequestInfo.signType,
          //   paySign: payRequestInfo.paySign,
          //   success (res) { 
          //     http("post", `/Order/pay/${tradeId}`).then(res => {
          //       if (res.code === 0) {
          //         wx.showToast({
          //           title: '支付成功',
          //           icon: 'success',
          //           duration: 2000,
          //           success: function () {
          //             // http("post", `/Order/pay/${tradeId}`).then(res => {})
          //             setTimeout(function () {
          //               wx.redirectTo({
          //                 url: '/pages/purchasedOrder/purchasedOrder',
          //               })
          //             }, 2000);
          //           }
          //         })
          //       }
          //     })
          //   },
          //   fail (res) { 
          //     wx.showToast({ title: '支付失败', icon: 'none', duration: 2000 })
          //   }
          // })
          wx.redirectTo({
            url: '/pages/alipay/alipay?tradeId=' + tradeId + '&alipayUrl=' + encodeURIComponent(alipayUrl),
          })
        }
      }
    })
  },

  pay(tradeId) {
    http("post", `/Order/pay/${tradeId}`).then(res => {
      if (res.code === 0) {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000,
          success: function () {
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/purchasedOrder/purchasedOrder?active=1'
              })
            }, 2000);
          }
        })
      }
    })
  }
})



