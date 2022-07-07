import http from "./../../../../utils/http";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        list: {
            type: Array
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        tradeid: ''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 取消订单
        handleCancelOrder(e) {
            const {
                tradeid
            } = e.currentTarget.dataset;
            wx.showModal({
                title: '提示',
                content: '确认取消订单',
                success: (res) => {
                    if (res.confirm) {
                        http("get", `/Order/cancel/${tradeid}`).then(res => {
                            if (res.code === 0) {
                                wx.showToast({
                                    title: '取消成功',
                                    icon: 'success',
                                    duration: 2000,
                                    success: () => {
                                        this.triggerEvent("handleRefreshOrderList")
                                    }
                                })
                            }
                        })
                    }
                }
            })
        },

        handlePay2(e) {
            console.log(e.currentTarget.dataset)
            const {
                tradeid,
                singleplatform
            } = e.currentTarget.dataset;
            // singleplatform为1表示支付订单 为2表示积分订单
            if (singleplatform == 1) {
                // apptype为2表示在小程序下的单直接调起支付接口 不为2时在其他平台下的单 提示去下单平台支付
                    http("post", `/Order/wechatPay/${tradeid}`).then(res => {
                        const {
                            alipayUrl
                        } = res.data.orderPayGetResult
                        wx.redirectTo({
                            url: '/pages/alipay/alipay?alipayUrl=' + encodeURIComponent(alipayUrl),
                        })
                    })
                    // http("post", `/Order/wechatPay/${tradeid}`).then(res => {
                    //   const { orderPayGetResult } = res.data
                    //   wx.requestPayment({
                    //     timeStamp:  orderPayGetResult.timeStamp,
                    //     nonceStr:  orderPayGetResult.nonceStr,
                    //     package:  orderPayGetResult.package,
                    //     signType:  orderPayGetResult.signType,
                    //     paySign: orderPayGetResult.paySign,
                    //     success (res) { 
                    //       http("post", `/Order/pay/${tradeid}`).then(res => {
                    //         if (res.code === 0) {
                    //           wx.showToast({
                    //             title: '支付成功',
                    //             icon: 'success',
                    //             duration: 2000,
                    //             success: function () {
                    //               // http("post", `/Order/pay/${tradeid}`).then(res => {})
                    //               setTimeout(function () {
                    //                 wx.redirectTo({
                    //                   url: '/pages/purchasedOrder/purchasedOrder',
                    //                 })
                    //               }, 2000);
                    //             }
                    //           })
                    //         }
                    //       })
                    //     },
                    //     fail (res) { 
                    //       wx.showToast({ title: '支付失败', icon: 'none', duration: 2000 })
                    //     }
                    //   })
                    // })
                
            } else {
                // 积分支付
                wx.showModal({
                    title: '提示',
                    content: '确认支付',
                    success: (res) => {
                        if (res.confirm) {
                            http("post", `/Order/pay/${tradeid}`).then(res => {
                                if (res.code === 0) {
                                    wx.showToast({
                                        title: '支付成功',
                                        icon: 'success',
                                        duration: 2000,
                                        success: () => {
                                            this.triggerEvent("handleRefreshOrderList")
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            }
        },


        // 支付
        handlePay(e) {
            const {
                tradeid,
                orderifon
            } = e.currentTarget.dataset;
            // 订单重新支付 exchangeType==1的时候调起微信支付
            if (orderifon[0].exchangeType == 1) {
                http("post", `/Order/wechatPay/${tradeid}`).then(res => {
                    const {
                        orderPayGetResult
                    } = res.data
                    wx.requestPayment({
                        timeStamp: orderPayGetResult.timeStamp,
                        nonceStr: orderPayGetResult.nonceStr,
                        package: orderPayGetResult.package,
                        signType: orderPayGetResult.signType,
                        paySign: orderPayGetResult.paySign,
                        success(res) {
                            http("post", `/Order/pay/${tradeid}`).then(res => {
                                if (res.code === 0) {
                                    wx.showToast({
                                        title: '支付成功',
                                        icon: 'success',
                                        duration: 2000,
                                        success: function () {
                                            setTimeout(function () {
                                                wx.redirectTo({
                                                    url: '/pages/orderList/orderList',
                                                })
                                            }, 2000);
                                        }
                                    })
                                }
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
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: '确认支付',
                    success: (res) => {
                        if (res.confirm) {
                            http("post", `/Order/pay/${tradeid}`).then(res => {
                                if (res.code === 0) {
                                    wx.showToast({
                                        title: '支付成功',
                                        icon: 'success',
                                        duration: 2000,
                                        success: () => {
                                            this.triggerEvent("handleRefreshOrderList")
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            }
        },
        toDetail(e) {
            const {
                orderid,
                type
            } = e.currentTarget.dataset;
            console.log(orderid)
            wx.navigateTo({
                url: "/pages/purchasedOrder/goodsDetail/goodsDetail?orderId=" + orderid + "&type=" + type,
            })
        },
        toLogistics(e) {
            const {
                tradeid,
                type
            } = e.currentTarget.dataset;
            wx.navigateTo({
                url: '/pages/logistics/logistics?tradeid=' + tradeid,
            })
        },
        // 确认收货
        handleConfirm(e) {
            const {
                tradeid
            } = e.currentTarget.dataset;
            wx.showModal({
                title: '提示',
                content: '确认收货',
                success: (res) => {
                    if (res.confirm) {
                        http("get", `/Order/confirmReceive/${tradeid}`).then(res => {
                            if (res.code === 0) {
                                wx.showToast({
                                    title: '确认成功',
                                    icon: 'success',
                                    duration: 2000,
                                    success: () => {
                                        this.triggerEvent("handleRefreshOrderList")
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
    }
})