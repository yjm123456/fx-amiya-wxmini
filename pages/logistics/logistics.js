import http from '../../utils/http'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 
    tradeId:"",
    expressDetailList:[],
    orderExpressInfoVo:{},
    // 
    flag:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {tradeid,type,courierNumber,expressId,receiverPhone} = options
    this.setData({
      tradeId:tradeid,
    })
    // type为1 判断是点击核销好礼页面 还是积分订单页面 如果是核销好礼页面调用核销好礼接口 
    if(type==1){
      this.getGiftLogistics(courierNumber,expressId,receiverPhone)
    }else{
      this.getLogistics(tradeid)
    }
  },
  // 获取积分订单物流信息
  getLogistics(tradeId){
    http("get", `/Order/expressInfo/${tradeId}`).then(res => {
      if(res.code === 0){
        const {orderExpressInfoVo} = res.data
        const { expressDetailList } = res.data.orderExpressInfoVo
        const list = expressDetailList.map((item,index)=>{
          // 转化时间
          var data= new Date(item.time).toJSON();
          var creationTimeStr= new Date(+new Date(data) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 
          return  {
            ...item,
            text:item.content,
            desc:creationTimeStr
          }
        })
        // 按时间排序
        list.sort(function(a,b){
            return a.time < b.time ? 1 : -1
        });
        this.setData({
          expressDetailList:list,
          orderExpressInfoVo:orderExpressInfoVo,
          flag:true
        })
      }
    })
  },
  // 核销好礼 物流信息
  getGiftLogistics(courierNumber,expressId,receiverPhone){
    const data ={
      courierNumber:courierNumber,
      expressId:expressId,
      receiverPhone:receiverPhone
    }
    http("get", `/Gift/giftExpressInfo`,data).then(res => {
      if(res.code === 0){
        const {orderExpressInfoVo} = res.data
        const { expressDetailList } = res.data.orderExpressInfoVo
        const list = expressDetailList.map((item,index)=>{
          // 转化时间
          var data= new Date(item.time).toJSON();
          var creationTimeStr= new Date(+new Date(data) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 
          return  {
            ...item,
            text:item.content,
            desc:creationTimeStr
          }
        })
        // 按时间排序
        list.sort(function(a,b){
            return a.time < b.time ? 1 : -1
        });
        this.setData({
          expressDetailList:list,
          orderExpressInfoVo:orderExpressInfoVo,
          flag:true
        })
      }
    })
  },
  // 复制
  copy(e){
    const {expressno } = e.currentTarget.dataset
    wx.setClipboardData({
      data: expressno,
      success: function (res) {
          wx.getClipboardData({
              success: function (res) {
                  wx.showToast({
                      title: '复制成功'
                  })
              }
          })
      }
    })
  }

})