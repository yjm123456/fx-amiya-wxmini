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
            tradeid: '',
            show: false,
            refundReason: '',
            orderId: ''
        },

        /**
         * 组件的方法列表
         */
        methods: {
            // 获取输入框值
            refundReasonChange(even) {
                const {
                    value
                } = even.detail
                this.setData({
                    refundReason: value
                })
            },
            // 取消订单
            handleCancelOrder(e) {
                const {
                    tradeid,
                    appType
                } = e.currentTarget.dataset;

                if (appType === 2) {
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
                } else {
                    wx.showToast({
                        title: '此订单不在小程序下单,请到下单平台取消订单.',
                        icon: "none",
                        duration: 2000
                    })
                }
            },

            handlePay2(e) {
                const {
                    tradeid,
                    singleplatform,
                    apptype
                } = e.currentTarget.dataset;
                // singleplatform为1表示支付订单 为2表示积分订单
                if (singleplatform == 1) {
                    // apptype为2表示在小程序下的单直接调起支付接口 不为2时在其他平台下的单 提示去下单平台支付
                    if (apptype === 2) {
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
                        wx.showToast({
                            title: '此订单不在小程序下单 请去下单平台进行支付',
                            icon: "none",
                            duration: 2000
                        })
                    }
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
                    tradeid,
                    apptype
                } = e.currentTarget.dataset;
                console.log("apptype为" + apptype);
                if (apptype === 2) {
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
                } else {
                    wx.showToast({
                        title: '此订单不是小程序订单,请到下单平台确认收货.',
                        icon: "none",
                        duration: 2000
                    })
                }
            },
            // 积分退款
            pointReund(e) {
                this.setData({
                    show: true,
                    orderId: e.currentTarget.dataset.orderid,
                    tradeId:e.currentTarget.dataset.tradeid
                });
            },
            // 取消
            onClose() {
                this.setData({
                    show: false,
                    refundReason: ''
                });
            },
            // 确认
            onConfirm() {
                const {
                    orderId,
                    refundReason,
                    tradeId
                } = this.data
                const data = {
                    orderId,
                    refundReason,
                    tradeId
                }
                http("post", `/IntegrationAccount/RefundTrade`, data).then(res => {
                    if (res.code === 0) {
                        wx.showToast({
                            title: '已提交退款申请',
                            icon: 'success',
                            duration: 2000,
                            success: () => {
                                this.setData({
                                    show: false,
                                    refundReason: ''
                                })
                                setTimeout(() => {
                                    this.triggerEvent("handleRefreshOrderList")
                                }, 2000)
                            }
                        })
                    } else {
                        wx.showToast({
                            title: '该订单已提交过退款申请，无法重复提交！',
                            icon: 'none',
                            duration: 2000
                        })

                    }
                })
            },
        },

    },

)