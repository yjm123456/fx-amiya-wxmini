// pages/arrivalPlan/arrivalPlan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hospitalItem:{},
    currentDate: "",
    tabList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const hospitalItem = JSON.parse(options.item)
    let facilityTagList = hospitalItem.facilityTagList
    let scaleTagList = hospitalItem.scaleTagList
    let tabList = facilityTagList.concat(scaleTagList);
    this.setData({
      hospitalItem:hospitalItem,
      tabList:tabList
    })
  },
  // 组件监听日期选择
  select(e) {
    const { detail } = e;
    this.setData({
      currentDate: detail
    })
  },
})