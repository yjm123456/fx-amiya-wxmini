// pages/integral/integral.js
import http from "./../../utils/http"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    pageSize: 10,
    list: [],
    // 是否还有下一页
    nextPage: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getIntegral()
    this.getInterList()
  },
  // 获取客户的积分余额   get
  getIntegral() {
    http("get", `/IntegrationAccount/balance`).then(res => {
      if (res.code === 0) {
        const { balance } = res.data;
        this.setData({
          balance
        })
      }
    })
  },
  getInterList(callback){
    const { pageNum, pageSize, nextPage } = this.data;
      if (!nextPage) return;
      const data = {
        pageNum, pageSize
      }
      http("get", `/IntegrationAccount/list`, data).then(res => {
        if (res.code === 0) {
          let { list, totalCount } = res.data.hospitalInfo;
          list = list.map((item,index)=>{
            var data= new Date(item.createDate).toJSON();
            var creationTimeStr= new Date(+new Date(data) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 
            return  {
              ...item,
              createDate:creationTimeStr
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

  // 刷新列表
  handleRefreshOrderList() {
    this.handleReset();
    this.getInterList();
  },

    /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getInterList();
  },
})

