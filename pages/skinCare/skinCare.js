// pages/skinCare/skinCare.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name:'',
        sysheight:'',
        showShare:false,
        options: [{
            name: '微信',
            icon: 'wechat',
            openType: 'share'
        }],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const {name}=options;
        this.setData({
            name:name
        });
        wx.getSystemInfo({//获取设备屏幕真实高度
            success: (result) => {
              this.setData({
                sysheight:result.windowHeight
              })
            },
          })
    },
    toOrder(event){
        const{name}=event.currentTarget.dataset;
        wx.navigateTo({
            url: '/pages/LiveAnchorOrder/LiveAnchorOrder?name='+name+'&type=mf',
          })
    },
     //抵用券分享
     share(e) {
        this.setData({
            showShare: true
        });
    },
    onClose() {
        this.setData({
            showShare: false
        });
    },

    onSelect(event) {
        this.onClose();
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
        return {
            title: '分享给好友',
            path: '/pages/skinCare/skinCare?name='+this.data.name
        }
    }
})