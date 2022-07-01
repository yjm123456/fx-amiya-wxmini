import http from './../../utils/http';
import Dialog from './../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: null,
    active:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
    this.setData({
      item: JSON.parse(options.item),
      orderId: options.orderId
    })
  },

  onShow() {
    if (this.data.address) return;
    this.init();
  },

  init() {
    http("get", `/address/isExist`, {}).then(res => {
      if (res.code === 0) {
        // 地址不存在
        if (res.data.isExistAddress === false) {
          Dialog.confirm({
            title: '提示',
            message: '您没有添加地址',
            confirmButtonText: "去设置"
          })
            .then(() => {
              const path = 'pages/giftSubmit/giftSubmit';
              wx.navigateTo({
                url: `/pages/address/address?selectAddress=${true}&path=${path}`
              })
            })
            .catch(() => {
              wx.navigateBack({})
            });
          // 地址存在
        } else {
          http("get", `/address/single`, {}).then(res => {
            if (res.code === 0) {
              this.setData({
                address: res.data.address,
                control: true
              })
            }
          })
        }
      }
    })
  },

  // 选择地址
  handleSelectAddress() {
    const path = 'pages/giftSubmit/giftSubmit';
    wx.navigateTo({
      url: `/pages/addressList/addressList?selectAddress=${true}&path=${path}`
    })
  },

  confirm(e) {
    const { item, orderId, address,active } = this.data;
    const data = {
      // 礼品编号
      giftId: item.id,
      // 订单编号
      orderId,
      addressId: address.id,
    }
    http("post", `/Gift/receive`, data).then(res => {
      if (res.code === 0) {
        wx.reLaunch({
          url: '/pages/writeoffGoodGift/writeoffGoodGift?active=' +  active,
        })
      }
    })
  },
})