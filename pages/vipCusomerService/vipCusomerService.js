// pages/vipCusomerService/vipCusomerService.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        liveAnchor:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var app=getApp();
        const {assisteAppId}=app.globalData;
        if(assisteAppId=="ddappid"){
            this.setData({
                liveAnchor:'dd'
            })
        }
        if(assisteAppId=="jnappid"){
            this.setData({
                liveAnchor:'jn'
            })
        }
        if(assisteAppId=="wx695942e4818de445"){
            this.setData({
                liveAnchor:'sh'
            })
        }
        if(assisteAppId=="wx8747b7f34c0047eb"){
            this.setData({
                liveAnchor:'mr'
            })
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