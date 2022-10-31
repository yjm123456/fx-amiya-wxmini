// pages/recharge.js
import http from "./../../utils/http"
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
        pay: 0,
        //充值方式
        exchangeCode: "",
        //充值金额
        amountId: '',
        selectIndex: -1,
        pageNum: 1,
        pageSize: 5,
        list: [],
        rechargeAmountList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getRechargeList();
        this.getRechargeAmountList();
    },
    getRechargeAmountList() {
        http("get", `/Recharge/amountList`).then(res => {
            if (res.code === 0) {
                var {
                    rechargeAmountList
                } = res.data;
                this.setData({
                    rechargeAmountList
                });
            }
        })
    },
    select(e) {
        const {
            id,
            index
        } = e.currentTarget.dataset;
        this.setData({
            amountId: id,
            selectIndex: index
        })
    },
    getRechargeList() {
        const {
            pageNum,
            pageSize
        } = this.data;
        const data = {
            pageNum,
            pageSize
        };
        http("get", `/Recharge/list`, data).then(res => {
            if (res.code === 0) {
                var {
                    list
                } = res.data.recordList
                list = list.map((item, index) => {
                    var rechargeDate = item.rechargeDate.replace(/T/g, ' ')
                    return {
                        ...item,
                        rechargeDate: rechargeDate
                    };
                });
                this.setData({
                    list
                })
            }
        })
    },
    //支付已存在订单
    toPay(e) {
        const {
            recordid
        } = e.currentTarget.dataset;
        const {
            exchangeCode
        } = this.data;
        http("post", `/Recharge/pay/` + recordid).then(res => {
            if (res.code === 0) {
                const {
                    tradeId,
                    alipayUrl,
                    payRequestInfo
                } = res.data.rechargeResult;
                if (exchangeCode == "WECHAT") {
                    wx.requestPayment({
                        timeStamp: payRequestInfo.timeStamp,
                        nonceStr: payRequestInfo.nonceStr,
                        package: payRequestInfo.package,
                        signType: payRequestInfo.signType,
                        paySign: payRequestInfo.paySign,
                        success(res) {
                            wx.showToast({
                                title: '支付成功',
                                icon: 'none',
                                duration: 2000
                            })                          
                        },
                        fail(res) {
                            wx.showToast({
                                title: '支付失败',
                                icon: 'none',
                                duration: 2000
                            })
                        }
                    })
                } else {
                    wx.redirectTo({
                        url: '/pages/alipay/alipay?tradeId=' + tradeId + '&alipayUrl=' + encodeURIComponent(alipayUrl),
                    })
                }

            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1000
                })
            }
        })
    },
    //取消支付订单
    cancel(e) {
        const {
            recordid
        } = e.currentTarget.dataset;
        const data = {
            recordId: recordid
        };
        http("post", `/Recharge/cancel`, data).then(res => {
            if (res.code === 0) {
                wx.showToast({
                    title: '取消成功',
                    icon: 'none',
                    duration: 3000
                });
                this.handleReset();
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1000
                })
            }
        })
    },
    toMore() {
        wx.navigateTo({
            url: '/pages/rechargeRecord/rechargeRecord',
        })
    },
    //刷新
    handleReset() {
        this.setData({
            active: 0
        })
        this.getRechargeList();
    },
    onChange(event) {},
    //选择支付方式
    onClick(event) {
        const {
            name,
            index
        } = event.currentTarget.dataset;
        this.setData({
            exchangeCode: name,
            pay: index
        });
    },
    handlePay(e) {
        console.log("调用");
        var {
            selectIndex,
            amountId
        } = this.data;

        if (selectIndex == -1) {
            wx.showToast({
                title: '请选择充值金额',
                icon: 'none',
                duration: 1000
            })
            return;
        }

        Dialog.alert({
            title: '支付方式',
            theme: 'round-button',
            confirmButtonText: '立即支付',
            closeOnClickOverlay: true,
            customStyle: 'display:flex;flex-direction:column;justify-content:center;align-items:center;background-color: transparent !important;',
            selector: "#van-dialog"
        }).then(() => {
            const{pay,exchangeCode}=this.data;
            if(pay==0){
                wx.showToast({
                    title: '请选择支付方式',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
            if(!exchangeCode){
                wx.showToast({
                    title: '请选择支付方式',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
            const data = {
                exchangeCode,
                amountId
            };
            // 生成订单
            http("post", `/Recharge`, data).then(res => {
                if (res.code === 0) {
                    const {
                        tradeId,
                        payRequestInfo,
                        alipayUrl
                    } = res.data.rechargeResult;
                    this.setData({
                        tradeId
                    })
                    // type为2是积分兑换
                    if (exchangeCode == "WECHAT") {
                        //type为1 是商城支付
                        wx.requestPayment({
                            timeStamp: payRequestInfo.timeStamp,
                            nonceStr: payRequestInfo.nonceStr,
                            package: payRequestInfo.package,
                            signType: payRequestInfo.signType,
                            paySign: payRequestInfo.paySign,
                            success(res) {
                                wx.showToast({
                                    title: '支付成功',
                                    icon: 'none',
                                    duration: 2000
                                })                           
                                //成功跳转到支付记录界面
                                setTimeout(function () {
                                    wx.redirectTo({
                                        url: '/pages/rechargeRecord/rechargeRecord',
                                    })
                                }, 2000);                           
                            },
                            fail(res) {
                                wx.showToast({
                                    title: '支付失败',
                                    icon: 'none',
                                    duration: 2000
                                })
                            }
                        })
                        this.handleReset();
                    } else if (exchangeCode == "ALIPAY") {
                        wx.redirectTo({
                            url: '/pages/alipay/alipay?tradeId=' + tradeId + '&alipayUrl=' + encodeURIComponent(alipayUrl),
                        })
                    }
                    this.handleReset();
                }
            })
        }).catch((err)=>{
            console.log("未选中");
        });
        
        


        


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