// pages/LiveAnchorDetail/LiveAnchorMessage/LiveAnchorMessage.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import {
    iscustomer,
    isAuthorizationUserInfo
} from "./../../api/user";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: '',
        sysheight: '',
        liveAnchorName: '',
        controlAuthPhone: false,
        name: '',
        gifName: '',
        style: "",
        show: false,
        //是否是啊美雅主播
        isAmyLiveAnchor: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.getSystemInfo({ //获取设备屏幕真实高度
            success: (result) => {
                this.setData({
                    sysheight: result.windowHeight
                })
            },
        })
        const {
            name,
            isAmyLiveAnchor
        } = options;
        this.setData({
            name,
            isAmyLiveAnchor
        });
        if (name == "dd") {
            this.setData({
                imgUrl: "https://ameiya.oss-cn-hangzhou.aliyuncs.com/5eb69ef16d554614abe84cb69dc8365e.jpg",
                liveAnchorName: "刀刀",
                gifName: 'https://ameiya.oss-cn-hangzhou.aliyuncs.com/ca60892b41d348d498cd77f4ee8e1026.png',
                style: "top: -800rpx;"
            });
        } else if (name == "jn") {
            this.setData({
                imgUrl: "https://ameiya.oss-cn-hangzhou.aliyuncs.com/5a1745da57254910a1706278803e15e2.jpg",
                liveAnchorName: "吉娜",
                gifName: 'https://ameiya.oss-cn-hangzhou.aliyuncs.com/28be25a1e68c4040b3590ad0f4e7a1d6.png',
                style: "top: -820rpx;"
            });
        } else if (name == 'kd') {
            this.setData({
                imgUrl: "https://ameiya.oss-cn-hangzhou.aliyuncs.com/4582dbdf60004e8f80141491ed9c9e7e.jpg",
            });
        } else if (name == 'yls') {
            this.setData({
                imgUrl: "https://ameiya.oss-cn-hangzhou.aliyuncs.com/471b7909b08144d690502da3ec8824fd.jpg",
            });
        } else if (name == 'my') {
            this.setData({
                imgUrl: "https://ameiya.oss-cn-hangzhou.aliyuncs.com/86296a338116490694e1953401db0dd6.jpg",
            });
        } else if (name == 'zz') {
            this.setData({
                imgUrl: "https://ameiya.oss-cn-hangzhou.aliyuncs.com/d6a57c17a8854ac3850e055ddf2b0d82.jpg",
            });
        }
    },
    toOrder(event) {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                const {
                    name
                } = event.currentTarget.dataset;
                wx.navigateTo({
                    url: '/pages/LiveAnchorOrder/LiveAnchorOrder?name=' + name,
                })
            } else {
                this.showVoucherTips()
            }
        })
    },
    getVoucher() {
        this.setData({
            show: false
        })
        this.handleBindPhone();
    },
    isCustomer(callback) {
        iscustomer().then(res => {
            if (res.code === 0) {
                const {
                    isCustomer
                } = res.data;
                callback && callback(isCustomer)
            }
        })
    },
    //显示绑定赠送抵用券提示
    showVoucherTips() {
        Dialog.alert({
            theme: 'round-button',
            confirmButtonText: "",
            closeOnClickOverlay: true,
            customStyle: "background-color:transparent !important;height:900rpx;margin-top:50rpx;postion:relative;width:550rpx;",
            selector: "#skbind_tip",
            context: this
        }).then(() => {
            this.handleBindPhone();
        });
    },
    // 绑定手机号
    handleBindPhone() {
        this.setData({
            controlAuthPhone: true
        })
    },
    // 成功绑定手机号
    successBindPhone() {
        this.setData({
            controlAuthPhone: false
        })
        //绑定成功后获取分享信息
        //this.getShareInfo();
    },

    // 取消绑定手机号
    cancelBindPhone() {
        this.setData({
            controlAuthPhone: false
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