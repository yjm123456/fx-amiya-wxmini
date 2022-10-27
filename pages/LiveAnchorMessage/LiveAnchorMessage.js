// pages/LiveAnchorDetail/LiveAnchorMessage/LiveAnchorMessage.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl:'',
        sysheight:''
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
        const {name}=options;
        if(name=="dd"){
            this.setData({
                imgUrl:"https://ameiya.oss-cn-hangzhou.aliyuncs.com/b9b86d9ef6c14892b44d490613604551.jpg"

            });
        }else if(name=="jn"){
            this.setData({
                imgUrl:"https://ameiya.oss-cn-hangzhou.aliyuncs.com/470f256b5e9c41b3b48217b73a57d514.jpg"

            });
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