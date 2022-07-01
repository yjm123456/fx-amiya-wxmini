import http from './../../utils/http';
import Dialog from './../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],

    // 选择地址
    selectAddress: false,

    // 从那个页面跳转过来
    path: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.selectAddress && options.path) {
      this.setData({
        selectAddress: JSON.parse(options.selectAddress),
        path: options.path,
      })
    }
    this.getAddressList();
  },

  getAddressList() {
    http("get", `/Address/list`, {}).then(res => {
      if (res.code === 0) {
        const addressList = res.data.addressList.map(_item => {
          return {
            ..._item,
            lastname: _item.contact.substr(0, 1)
          }
        })
        this.setData({
          addressList
        })
      }
    })
  },

  // 编辑
  handleEdit({ currentTarget }) {
    const { item } = currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/address/address?item=${JSON.stringify(item)}`
    })
  },

  // 删除地址
  handleItemDelete(event) {
    const { currentTarget, detail } = event
    const { id } = currentTarget.dataset;
    const { position, instance } = detail;
    switch (position) {
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？',
        }).then(() => {
          http("delete", `/address/${id}`, {}).then(res => {
            if (res.code === 0) {
              instance.close();
              this.getAddressList();
            }
          })
        });
        break;
    }
  },

  // 添加新地址
  handleAddAddress() {
    wx.navigateTo({
      url: `/pages/address/address?selectAddress=${this.data.selectAddress}&path=${this.data.path}`
    })
  },

  // 选择地址
  handleSelectAddress(e) {
    const { item } = e.currentTarget.dataset;
    if (this.data.selectAddress) {
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      prevPage.setData({
        address: item
      });
      wx.navigateBack({
        delta: 1
      })
    }
  }
})