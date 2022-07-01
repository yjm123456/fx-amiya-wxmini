import http from './../../utils/http';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    control: {
      type: Boolean
    },
    // 商品信息
    goods: {
      type: Object,
      observer(goodsInfo) {
        this.getGoodsInfoStandard(goodsInfo)
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    goodsInfo: {},

    // 规格列表
    goodsInfos: [],

    totalPrice: 0
  },

  methods: {
    // 关闭弹框
    handleClose() {
      this.triggerEvent("resetControlStandard")
    },

    // 获取商品规格
    getGoodsInfoStandard(goodsInfo) {
      http("get", `/Goods/infoListForGoodsGroup/${goodsInfo.id}`,).then(res => {
        if (res.code === 0) {
          let {
            goodsInfos
          } = res.data;
          this.setData({
            goodsInfos,
            goodsInfo: { ...goodsInfo, quantity: 1 }
          })
          this.getTotalPrice();
        }
      })
    },

    // 操作选择规格
    handleSelectStandard(e) {
      const {
        standard
      } = e.currentTarget.dataset;
      this.setData({
        goodsInfo: standard
      })
    },

    // 购买数量
    handleNumChange(event) {
      const {
        goodsInfo
      } = this.data;
      goodsInfo.quantity = event.detail
      this.setData({
        goodsInfo
      })
      this.getTotalPrice();
    },

    // 计算价格
    getTotalPrice() {
      const { goodsInfo } = this.data;
      this.setData({
        totalPrice: (goodsInfo.integrationQuantity * goodsInfo.quantity).toFixed(2)
      })
    },

    handlePayment(e) {
      this.handleClose();
      let type = e.currentTarget.dataset.type
      const {
        goodsInfo
      } = this.data;
      wx.navigateTo({
        // url: `/pages/confirmOrder/confirmOrder?goodsInfo=${JSON.stringify([goodsInfo])}`
        url: "/pages/confirmOrder/confirmOrder?goodsInfo=" + encodeURIComponent(JSON.stringify([goodsInfo])) + '&type=' + type
      })
    }
  },
})