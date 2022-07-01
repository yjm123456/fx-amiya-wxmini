Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemInfoList: {
      type: Array
    },
    currentCity: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleReserveHospital(e) {
      const { id } = e.currentTarget.dataset;
      wx.navigateTo({
        url: `/pages/projectReserveHospital/projectReserveHospital?id=${id}&city=${this.data.currentCity}`,
      })
    }
  }
})
