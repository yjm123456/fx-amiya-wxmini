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
         pageNum, pageSize,status:3
      }
      http("get", `/Appointment/list`, data).then(res => {
        if (res.code === 0) {
          let { list, totalCount } = res.data.appointmentInfo;
          list = list.map((item,index)=>{
            var data= new Date(item.appointmentDate).toJSON();
            var creationTimeStr= new Date(+new Date(data) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 
            // 兼容iOS 出现NaN情况
            let times = creationTimeStr.replace(/\-/g, '/') 
            let a = new Date(times).getTime();
            const date = new Date(a);
            const Y = date.getFullYear() + '-';
            const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            const D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + '  ';
            const dateString = Y + M + D ;
            return  {
              ...item,
              appointmentDate:dateString
            }
          })
          this.setData({
            list: [
              ...this.data.list, 
              ...list
            ],
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
  }
})
