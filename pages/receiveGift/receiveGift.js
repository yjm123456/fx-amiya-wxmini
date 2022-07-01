import http from "./../../utils/http";

Page({

  data: {
    orderId: "",

    list: [],

    pageNum: 1,

    pageSize: 10,

    // 是否还有下一页
    nextPage: true,

    //是否正在处理滚动事件，避免一次滚动多次触发
    isScrolling: false,

    // 地址信息
    address: null,

    control: false
  },


  onLoad: function (options) {
    const orderId = options.orderId
    this.setData({
      orderId,
    })
    this.getItemInfo()
  },

  // 获取项目列表
  getItemInfo(callback = "") {
    const { pageNum, pageSize } = this.data;
    http("get", `/Gift/infoList`, { pageNum, pageSize }).then(res => {
      if (res.code === 0) {
        let { list, totalCount } = res.data.giftInfo;
        list = list.map(item => {
          return {
            ...item,
            _checked: false
          }
        })
        this.setData({
          list: [...this.data.list, ...list],
          totalCount
        })
        callback && callback();
        this.data.pageNum++
        if (this.data.list.length === totalCount) {
          this.setData({
            nextPage: false
          })
        }
      }
    })
  },

  // 触底响应
  onReachBottom() {
    if (this.data.nextPage) {
      if (this.data.isScrolling === true) return;
      this.data.isScrolling = true;
      this.getItemInfo(() => {
        this.data.isScrolling = false;
      });
    }
  },

  onChange(e) {
    const { id } = e.target.dataset;
    const { list } = this.data;
    const index = list.findIndex(item => item.id === id);
    let _checked = "list[" + index + "]._checked"
    if (index !== -1) {
      this.setData({
        [_checked]: e.detail
      })
    }
  },

  confirm(e) {
    const { list } = this.data;
    const giftIds = list.filter(item => {
      return item._checked
    }).map(item => {
      return item.id
    })
    if (giftIds.length > 1) {
      wx.showToast({ title: `您只能领取1件礼品`, icon: 'none', duration: 2000 });
    } else if (!giftIds.length) {
      wx.showToast({ title: `请选择礼品`, icon: 'none', duration: 2000 });
    } else {
      const item = list.find(_item => _item._checked);
      wx.navigateTo({
        url: `/pages/giftSubmit/giftSubmit?item=${JSON.stringify(item)}&orderId=${this.data.orderId}`
      })
    }
  },

  // 选择地址
  handleSelectAddress() {
    wx.navigateTo({
      url: `/pages/addressList/addressList?selectAddress=${true}`
    })
  },
})

