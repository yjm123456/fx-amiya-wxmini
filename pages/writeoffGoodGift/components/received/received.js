// pages/writeoffGoodGift/components/received.js
import http from "./../../../../utils/http";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    active: {
      type: Number,
      value: "",
      observer(newVal, oldVal) {
        if (newVal === 1) {
          this.handleReset();
          this.getOrderList();
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    pageNum: 1,
    pageSize: 10,
    list: [],
    // 是否还有下一页
    nextPage: true,
    ExchangeType :1,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getOrderList(callback) {
      const { pageNum, pageSize, nextPage } = this.data;
      if (!nextPage) return;
      const data = {
         pageNum, pageSize
      }
      http("get", `/Gift/receiveGift`, data).then(res => {
        if (res.code === 0) {
          const { list, totalCount } = res.data.receiveGift;
          this.setData({
            list: [...this.data.list, ...list],
          })
          callback && callback();
          this.data.pageNum++;
          if (this.data.list.length === totalCount) {
            this.setData({
              nextPage: false
            })
          }
        }
      })
    },

    handleReset() {
      this.setData({
        pageNum: 1,
        list: [],
        nextPage: true,
      })
    },

    // 刷新订单列表
    handleRefreshOrderList() {
      this.handleReset();
      this.getOrderList();
    },
    //查看物流信息
    lookLogistics(e){
      const {courierNumber, receiverPhone, expressId} = e.currentTarget.dataset.item
      // courierNumber={{item.courierNumber}}&expressId={{item.expressId}}&receiverPhone={{item.receiverPhone
      if(expressId){
        wx.navigateTo({
          url: '/pages/logistics/logistics?courierNumber=' + courierNumber + '&receiverPhone=' + receiverPhone +'&expressId=' + expressId + '&type=1',
        })
      }else{
        wx.showToast({title: '暂无物流信息' , icon: 'none', duration: 2000})
      }
    }
  }
})
