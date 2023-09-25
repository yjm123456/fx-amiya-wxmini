// pages/activity/activity.js
import http from '../../utils/http';
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
        activity: "",
        controlAuthPhone: false,
        name:'',
        backgroudImage:'',
        isQRcodeRedirect:false,
        pageNum: 1,
        pageSize: 10,
        nextPage: true,
        //当前商品展示列表页码
        currentPageIndex: 1,
        consumptionCredentialsList: [],
        liveAnchor:'',
        baseLiveAnchorId:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let {
            q,
            name
        } = options;
        if(name){
            this.setData({
                name
            })
        }
        if (q) {
            q=decodeURIComponent(q);
            name = q.split("?")[1].split("=")[1];
        }
        this.setData({
            name
        })
        if(name==='dd'){
            this.setData({
                backgroudImage:'https://ameiya.oss-cn-hangzhou.aliyuncs.com/97c2b62bcf7d4c50a70bba78b9647896.jpg',
                isQRcodeRedirect:true,
                baseLiveAnchorId:'f0a77257-c905-4719-95c4-ad2c4f33855c'
            })
        }
        if(name==='jn'){
            this.setData({
                backgroudImage:'https://ameiya.oss-cn-hangzhou.aliyuncs.com/84aa3e05718d45519ac3c53699a5747f.jpg',
                isQRcodeRedirect:true,
                baseLiveAnchorId:'af69dcf5-f749-41ea-8b50-fe685facdd8b'
            })
        }

        this.setData({
            activity: options.activityid
        })
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
    showAlert(){
        wx.showToast({
          title: '敬请期待!',
          icon:'none',
          duration:1000
        })
    },
    CustomerConsumptionCredentials() {
        const {
            currentPageIndex,
            pageSize,
            nextPage
        } = this.data;
        if (!nextPage) return;
        const pageNum = currentPageIndex
        const data = {
            pageNum,
            pageSize,
        }
        http("get", `/customerConsumptionCredentials/list`, data).then(res => {
            if (res.code === 0) {
                let {
                    list,
                    totalCount
                } = res.data.customerConsumptionCredentials;
                list=list.map((item, index) => {                                     
                    return {
                        ...item,
                        CreateDate1: item.consumeDate.split("T")[0]
                    };
                });
                this.setData({
                    consumptionCredentialsList: [...this.data.consumptionCredentialsList, ...list]
                });
                this.data.currentPageIndex++;
                if (this.data.consumptionCredentialsList.length === totalCount) {
                    this.setData({
                        nextPage: false
                    })
                }
            }
        })
    },
    toDetail(e) {
        const {
            id
        } = e.currentTarget.dataset;
        wx.navigateTo({
            url: e.currentTarget.dataset.url + "?id=" + id
        })
    },
    to(e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.url
        })
    },
    //显示绑定赠送抵用券提示
    showVoucherTips() {
        Dialog.alert({
            theme: 'round-button',
            confirmButtonText: "",
            closeOnClickOverlay: true,
            customStyle: "background-color:transparent !important;height:900rpx;margin-top:50rpx;postion:relative;width:550rpx;",
            selector: "#bind_tips"
        }).then(() => {
            this.handleBindPhone();
        });
    },
    getVoucher() {
        this.setData({
            show: false
        })
        this.handleBindPhone();
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
    toAddCustomerConsumptionCredential(){
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                const {
                    baseLiveAnchorId
                } = this.data
                wx.navigateTo({
                    url: '/pages/AddConsumptionCredential/AddConsumptionCredential?baseLiveAnchorId='+baseLiveAnchorId
                })
            } else {
                this.showVoucherTips()
            }
        })
       
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

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.setData({
            pageNum: 1,
            pageSize: 10,
            nextPage: true,
            //当前商品展示列表页码
            currentPageIndex: 1,
            consumptionCredentialsList: []
        });
        this.CustomerConsumptionCredentials();
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
        this.CustomerConsumptionCredentials();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        return {
            title: '消费领积分',
            path: '/pages/CustomerConsumptionCredentials/CustomerConsumptionCredentials?name=' + this.data.name,
        }
    }
})