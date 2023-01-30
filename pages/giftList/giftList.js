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

    control: false,
    radio: "",
    // 选中的商品
    goodsItem:{},
    // active:1是未领取 2是已领取
    active:1
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
    http("get", `/Gift/infoList`, { pageNum, pageSize,categoryId:'6969bd41987b415b8376e5526ebf5679' }).then(res => {
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

  onChange(even) {
   this.setData({
     radio : even.detail
   })
  },

  confirm(e) {
    const { list,radio } = this.data;
    list.map((item,index)=>{
      if(item.id == radio){
        this.setData({
          goodsItem : item
        })
      }
    })
    if(radio){
      const {goodsItem,active,orderId} = this.data
      // wx.showToast({ title: `领取成功`, icon: 'none', duration: 2000 });
      // setTimeout(function () {
      //   wx.redirectTo({
      //     url: `/pages/writeoffGoodGift/writeoffGoodGift?item=${JSON.stringify(goodsItem)}&orderId=${orderId}&active=${active}`
      //   })
      // }, 2000);
      wx.navigateTo({
        url: `/pages/giftSubmit/giftSubmit?item=${JSON.stringify(goodsItem)}&orderId=${orderId}&active=${active}`
      })
    }else{
      wx.showToast({ title: `请选择礼品`, icon: 'none', duration: 2000 });
    }
  },

  // 选择地址
  handleSelectAddress() {
    wx.navigateTo({
      url: `/pages/addressList/addressList?selectAddress=${true}`
    })
  },
})

