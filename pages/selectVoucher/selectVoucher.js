// pages/selectVoucher/selectVoucher.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:[],
        radio:'',
        voucherId:'',
        deductmoney:'',
        vouchername:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const list=JSON.parse(options.list);
        this.setData({list})
    },
    onChange(event) {
        
        this.setData({
          radio: event.detail,
        });
      },
      onClick(event){
        this.setData({
            voucherId:event.currentTarget.dataset.voucherid,
            deductmoney:event.currentTarget.dataset.deductmoney,
            vouchername:event.currentTarget.dataset.vouchername
          });
      },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    //将选中的抵用券id传递给商品页
    storeSubmit(){
        var pages = getCurrentPages();   //当前页面
        var prevPage = pages[pages.length - 2];   //上一页面
        prevPage.setData({
              //直接给上一个页面赋值
              voucherId: this.data.voucherId,
              deductmoney:this.data.deductmoney,
              vouchername:this.data.vouchername
        });
        wx.navigateBack({
            //返回
            delta: 1
        })
      }
})