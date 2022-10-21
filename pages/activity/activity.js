// pages/activity/activity.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activity:""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            activity:options.activityid
        })
    },
    toDetail(event){
        const{name}=event.currentTarget.dataset;
        console.log(name);
        if(name!='dd'){
            wx.showToast({
              title: '敬请期待',
              icon:'none',
              duration:1000
            })
            return;
        }
        wx.navigateTo({
            url: '/pages/LiveAnchorDetail/LiveAnchorDetail'
        })
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