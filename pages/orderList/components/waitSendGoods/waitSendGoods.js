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
        if (newVal === 2) {
          this.setData({
            pageNum: 1,
            list: [],
            nextPage: true,
          })
          // console.log("请求待发货")
          this.getOrderList();
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusCode: "WAIT_SELLER_SEND_GOODS",
    pageNum: 1,
    pageSize: 10,
    list: [],
    // 是否还有下一页
    nextPage: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getOrderList(callback) {
      const { statusCode, pageNum, pageSize, nextPage } = this.data;
      if (!nextPage) return;
      const data = {
        statusCode, pageNum, pageSize
      }
      http("get", `/Order/list`, data).then(res => {
        if (res.code === 0) {
          const { list, totalCount } = res.data.orders;
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
    }
  }
})
