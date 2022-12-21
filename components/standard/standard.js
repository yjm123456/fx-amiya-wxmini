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

    totalPrice: 0,
    //选择的规格对应的价格
    selectPrice:0,
    //选择的规格id
    selectStandardId:'',
    selectedIndex:-1
  },

  methods: {
    // 关闭弹框
    handleClose() {
      this.triggerEvent("resetControlStandard")
    },
    selectStandard(event){
        console.log(event.currentTarget.dataset);
        const {id,price,index}=event.currentTarget.dataset;
        console.log("id的值为"+id);

        this.setData({
            selectStandardId:id,
            selectPrice:price,
            selectedIndex:index
        })
        console.log("当前选择后选中的价格为"+this.data.selectPrice);
        const {
            goodsInfo
          } = this.data;
          goodsInfo.quantity = 1
          goodsInfo.integrationQuantity=price
          goodsInfo.selectStandard=id
          this.setData({
            goodsInfo
          })
          console.log(goodsInfo.quantity);
          this.getTotalPrice();
        console.log("是否相同"+this.data.selectedIndex===index);
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
        id
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
      console.log("当前选中的价格为"+this.data.selectPrice);
      this.setData({
        totalPrice: (this.data.selectPrice * goodsInfo.quantity).toFixed(2)
      })
    },

    handlePayment(e) {
        if(this.data.selectPrice==0){
            wx.showToast({
              title: '"请选择规格"',
              icon:'none',
              duration:1000
            })
            return;
        }
      this.handleClose();
      let type = e.currentTarget.dataset.type
      const {
        goodsInfo
      } = this.data;
      wx.navigateTo({
        // url: `/pages/confirmOrder/confirmOrder?goodsInfo=${JSON.stringify([goodsInfo])}`
        url: "/pages/confirmOrder/confirmOrder?goodsInfo=" + encodeURIComponent(JSON.stringify([goodsInfo])) + '&type=' + type+'&selectStandardId='+this.data.selectStandardId
      })
    }
  },
})