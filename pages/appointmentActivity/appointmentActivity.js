import http from './../../utils/http';
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        return {
            title: "预约活动",
            path: '/pages/appointmentActivity/appointmentActivity'
        }
    },
    /**
     * 预约
     */
    appointment(){
        http('post','/AppointmentActivity').then(res=>{
            if(res.code==0){
                wx.showToast({
                    title: '预约成功...',
                    icon: 'none',
                    duration: 1500
                })
            }else{
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1500
                })
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