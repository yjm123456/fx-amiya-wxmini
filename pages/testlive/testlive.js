// pages/testlive/testlive.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        liveInfo:{},
        noticeInfo:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getLiveRoom();
        this.getChannelsLiveNoticeInfo1();
    },
    getLiveRoom(){
        wx.getChannelsLiveInfo({
            finderUserName:'sph0zZWhDI39eaZ',
            success:(res)=>{
                this.setData({
                    liveInfo:res
                })
            },
            fail:(res)=>{
                console.log(res);
            }
        })
    },
    getChannelsLiveNoticeInfo1(){
        console.log("调用");
        wx.getChannelsLiveNoticeInfo({
            finderUserName:'sph0zZWhDI39eaZ',
            success:(res)=>{
                console.log("成功");
                this.setData({
                    noticeInfo:res
                })
            },
            fail:(res)=>{
                console.log("失败");
                console.log(res);
            }
        })
    },
    openLive(){
        wx.openChannelsLive({
            finderUserName:'sph0zZWhDI39eaZ',
            success:(res)=>{
                console.log("成功");
                this.setData({
                    noticeInfo:res
                })
            },
            fail:(res)=>{
                console.log("失败");
                console.log(res);
            }
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