import http from "./../../../../utils/http"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array
    },
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
    // 取消预约
    cancel(e){
      const {id} = e.currentTarget.dataset
      const data = id
      wx.showModal({
        title: '提示',
        content: '确认取消预约吗',
        success: (res) => {
          if (res.confirm) {
            http("PUT", `/Appointment/cancel`,data).then(res => {
              if (res.code === 0) {
                wx.showToast({
                  title: '取消成功',
                  icon: 'success',
                  duration: 2000,
                  success: () => {
                    this.triggerEvent("handleRefreshOrderList")
                  }
                })
              }
            })
          }
        }
      })
    },
    // 确认完成
    submite(e){
      const {id} = e.currentTarget.dataset
      const data = id
      wx.showModal({
        title: '提示',
        content: '要确定已完成吗',
        success: (res) => {
          if (res.confirm) {
            http("PUT", `/Appointment/confirmFinish`,data).then(res => {
              if (res.code === 0) {
                wx.showToast({
                  title: '确认成功',
                  icon: 'success',
                  duration: 2000,
                  success: () => {
                    setTimeout(()=>{
                      wx.showToast({title: '已确认完成' , icon: 'none', duration: 2000})
                    },1000)
                    this.triggerEvent("handleRefreshOrderList")
                  }
                })
              }
            })
          }
        }
      })
    }
  }
})
