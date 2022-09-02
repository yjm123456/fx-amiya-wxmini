// pages/missionCenter/missionCenter.js
import http from '../../utils/http';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        growthBalanceInfo:{},
        //是否已签到
        Signed: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.GetGrowthPoint(); 
        this.IsSigned();
    },
    //判断今天是否已签到
    IsSigned(){
        var date = new Date();
        var Y = date.getFullYear().toString();
        var M = (date.getMonth()+1).toString();
        var D = date.getDate().toString();
        var today=Y+M+D;
        console.log("今天"+today);
        var sign=wx.getStorageSync('sign');
        if(sign==today){
            this.setData({
                Signed:true
            })
        }
    },
    GetGrowthPoint() {
        http("get", `/GrowthPointsAccount/balance`).then(res => {
            if (res.code === 0) {
                const {
                    growthBalanceInfo
                } = res.data;
                this.setData({
                    growthBalanceInfo
                })
            }
        })
    },
    toSignIn() {
        http("post", `/Task/signIn`).then(res => {
            if (res.code === 0) {
                wx.showToast({
                    title: '签到成功',
                    icon: 'none',
                    duration: 1000
                });
                var date = new Date();
                var Y = date.getFullYear().toString();
                var M = (date.getMonth()+1).toString();
                var D = date.getDate().toString();
                wx.setStorageSync('sign', Y + M + D)
                this.setData({
                    Signed:true
                });
                this.GetGrowthPoint();
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1000
                })
            }
        })
    },
    toCompelete(e) {
        if(e.currentTarget.dataset.task==='shop'){
            wx.switchTab({
              url: '/pages/shoppingMall/shoppingMall',
            })
        }else{
            wx.showToast({
                title: '敬请期待...',
                icon: 'none'
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