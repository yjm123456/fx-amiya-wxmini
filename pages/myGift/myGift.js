import http from "./../../utils/http";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,

    pageSize: 10,

    // 是否还有下一页
    nextPage: true,

    //是否正在处理滚动事件，避免一次滚动多次触发
    isScrolling: false,

    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myGift()
  },

  // 获取项目列表
  myGift(callback = "") {
    const { pageNum, pageSize } = this.data;
    http("get", `/Gift/receiveGift`, { pageNum, pageSize }).then(res => {
      if (res.code === 0) {
        let { list, totalCount } = res.data.receiveGift;
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.nextPage) {
      if (this.data.isScrolling === true) return;
      this.data.isScrolling = true;
      this.myGift(() => {
        this.data.isScrolling = false;
      });
    }
  }
})