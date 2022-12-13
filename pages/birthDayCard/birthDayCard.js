// pages/birthDayCard/birthDayCard.js
import http from './../../utils/http';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sysheight:0,
        birthDay:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.getSystemInfo({//获取设备屏幕真实高度
            success: (result) => {
              this.setData({
                sysheight:result.windowHeight
              })
            },
          })
          this.getBirthCard();
    },
    getBirthCard(){
        http("get", "/User/birthDayCard").then(res => {
            if (res.code === 0) {
                var birthDay= res.data.birthDay;
                this.setData({
                    birthDay
                })           
            }
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

    }
})