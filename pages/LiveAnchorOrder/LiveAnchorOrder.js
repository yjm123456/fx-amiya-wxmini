// pages/LiveAnchorDetail/LiveAnchorOrder/LiveAnchorOrder.js
import http from '../../utils/http';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nickName: '',
        phone: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getUserInfo();
    },
    getUserInfo() {
        http("get", "/User/info").then(res => {
            if (res.code === 0) {
                const {
                    phone,
                    nickName
                } = res.data.userInfo;
                this.setData({
                    phone: phone,
                    nickName: nickName
                })
            }
        });
    },
    handleNameChange(e) {
        const {
            detail
        } = e;
        this.setData({
            nickName: detail
        })
    },
    handlePhoneChange(e) {
        const {
            detail
        } = e;
        this.setData({
            phone: detail
        })
    },
    purchase() {
        const {
            nickName,
            phone
        } = this.data
        let token = wx.getStorageSync("token")
        if (!token) {
            wx.showToast({
                title: '请先登录',
                icon: 'none',
                duration: 2000
            })
        } else {
            if (!nickName) {
                wx.showToast({
                    title: '请输入姓名',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
            if(!phone){
                wx.showToast({
                    title: '请输入手机号',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
            if (!(/^1[34578]\d{9}$/.test(phone))) {
                wx.showToast({
                    title: '手机号错误,请重新输入',
                    icon: 'none',
                    duration: 1000
                })
                return;
            } else {
                let cardName='啊美雅美肤卡'
                let thumbPicUrl='https://ameiya.oss-cn-hangzhou.aliyuncs.com/4b7148dcacb346c99a146804267f6e07.jpg';
                const goodsInfo={
                    thumbPicUrl:thumbPicUrl,             
                    allmoney:4999,
                    cardName:cardName,
                    quantity:1,
                    salePrice:4999,
                    id:'00000000',
                    name:'啊美雅美肤卡'
                };
               wx.redirectTo({
                 url: '/pages/confirmOrder/confirmOrder?nickName='+nickName+'&phone='+phone+'&isCard=true&goodsInfo='+encodeURIComponent(JSON.stringify([goodsInfo]))+'&allmoney=4999&cardName='+cardName+'&thumbPicUrl=https://ameiya.oss-cn-hangzhou.aliyuncs.com/4b7148dcacb346c99a146804267f6e07.jpg',
               })
            }
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