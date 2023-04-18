// pages/aestheticDesign/aestheticDesign.js
import http from './../../utils/http';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        liveAnchor:'dd'
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
                liveAnchor:'mr'
            })
        }
    },
    //跳转美学设计界面
    toDesign(){
        wx.navigateTo({
          url: '/pages/aestheticsDesignReportList/aestheticsDesignReportList',
        })
    },
    //跳转到形象设计卡页面
    toCard(){
        const {liveAnchor}=this.data;
        if(liveAnchor=='mr'){
            wx.navigateTo({
              url: '/pages/activity/activity',
            })
        }else{
            wx.navigateTo({
              url: '/pages/LiveAnchorOrder/LiveAnchorOrder?name='+liveAnchor,
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