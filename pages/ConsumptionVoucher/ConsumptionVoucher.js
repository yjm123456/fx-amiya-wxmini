import http from "./../../utils/http"
import {
    iscustomer,
    isAuthorizationUserInfo
} from "./../../api/user";
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

// pages/ConsumptionVoucher/ConsumptionVoucher.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showShare: false,
        options: [{
            name: '微信',
            icon: 'wechat',
            openType: 'share'
        }],
        pageNum: 1,
        pageSize: 10,
        nextPage: true,
        list: [],
        //用户id
        shareId: '',
        //用户要分享的抵用券id
        customerConsumptionVoucherId: '',
        //分享抵用券的名称
        vouchername:'',
        //分享抵用券的抵扣金额
        vouchermoney:0,
        nickname:'',
        totalCount:0,
        qrCodeBase64:'',
        writeOfCode:'',
        active:0,
        type:1,
        activeNames: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var nickname=options.nickname;
        this.setData({nickname});
        this.getConsumptionVoucher();
    },
    onClick(event){
        console.log("激活选项"+event.detail.activeNames);
        this.setData({
            activeNames: event.detail,
          });
    },
    onChange(event) {
        this.setData({
            active: event.detail.name,
            list: [],
            nextPage: true,
            pageNum: 1,
            pageSize: 10
        });
        const {
            active
        } = this.data;
        if (active == 0) {
            this.setData({
                type: 1
            })
            this.getConsumptionVoucher();
        }
        if (active == 1) {
            this.setData({
                type: 2
            })
            this.getConsumptionVoucher();
        }
        if (active == 2) {
            this.setData({
                type: 3
            })
            this.getConsumptionVoucher();
        }
    },
    //点击使用跳转到商城
    toShop() {
        wx.switchTab({
            url: '/pages/shoppingMall/shoppingMall',
        })
    },
    //面诊抵用券画核销码
    getQrcodeImage(e){
        var {code}=e.currentTarget.dataset;
        http("get", `/Order/qrcodeBase64/${code}`).then(res => {
           if (res.code === 0) {
            const { qrCodeBase64 } = res.data;
            this.setData({
              qrCodeBase64: `data:image/png;base64,${qrCodeBase64}`,
              writeOfCode:code
            })
            Dialog.alert({
                message: '弹窗内容',
                theme: 'round-button',
              }).then(() => {
                // on close
              });
          }
        })
    
      },
    //抵用券分享
    share(e) {
        var {
            shareid,
            id,
            vouchername,
            vouchermoney
        } = e.currentTarget.dataset;

        this.setData({
            showShare: true,
            shareId: shareid,
            customerConsumptionVoucherId: id,
            vouchermoney,
            vouchername
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
    getConsumptionVoucher() {
        const {
            pageNum,
            pageSize,
            nextPage,
            type
        } = this.data;
        if (!nextPage) return;
        const data = {
            pageNum,
            pageSize,
            type
        }
        http("get", `/CustomerConsumptionVoucher/list`, data).then(res => {
            if (res.code === 0) {
                let {
                    list,
                    totalCount
                } = res.data.customerConsumptionVoucherList;
                this.setData({
                    list: [
                        ...this.data.list,
                        ...list
                    ]
                })
                this.data.pageNum++;
                if (this.data.list.length === totalCount) {
                    this.setData({
                        nextPage: false
                    })
                }
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
        this.getConsumptionVoucher()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        return {
            title: '分享给好友',
            path: '/pages/index/index?shareid=' + this.data.shareId + '&customerconsumptionvoucherid=' + this.data.customerConsumptionVoucherId+'&vouchername='+this.data.vouchername+'&vouchermoney='+this.data.vouchermoney+'&nickname='+this.data.nickname,
            
        }
    }
})