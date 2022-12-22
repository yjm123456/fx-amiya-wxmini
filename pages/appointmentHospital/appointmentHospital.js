// pages/appointmentHospital/appointmentHospital.js

Page({

    /**
     * 页面的初始数据
     */
    data: {
        active:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        
    },
    onChange(event) {
        this.setData({
            active:event.detail.name
        })
        if(this.data.active==0){
            this.selectComponent("#appointment").getLocationAuth();
        }else if(this.data.active==1){
            this.selectComponent("#appointmentPlan").setActive();
        }
        
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
        //获取位置授权信息
        if(this.data.active==0){
            this.selectComponent("#appointment").getLocationAuth();
        }else if(active==1){
            this.selectComponent("#appointmentPlan");
        }
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

    }
})