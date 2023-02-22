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
            orderId: '',
            refundShow:false
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
                    type
                } = e.currentTarget.dataset;

                if (type === 2) {
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
            handleCancelPointAnMoneyOrder(e){
                const {
                    tradeid,
                    type
                } = e.currentTarget.dataset;

                if (type === 2) {
                    wx.showModal({
                        title: '提示',
                        content: '确认取消订单',
                        success: (res) => {
                            if (res.confirm) {
                                http("post", `/Order/canclePointAndMoneyOrder/${tradeid}`).then(res => {
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
                // singleplatform为1表示支付订单 为0表示积分订单,3表示余额支付
                if (singleplatform == 6) {
                    // apptype为2表示在小程序下的单直接调起支付接口 不为2时在其他平台下的单 提示去下单平台支付
                    if (apptype === 2) {
                        http("post", `/Order/wechatPay/${tradeid}`).then(res => {
                            // const {
                            //     alipayUrl
                            // } = res.data.orderPayGetResult
                            // wx.redirectTo({
                            //     url: '/pages/alipay/alipay?alipayUrl=' + encodeURIComponent(alipayUrl),
                            // })
                            const {
                                tradeId,
                                payRequestInfo,
                                alipayUrl
                            } = res.data.orderPayGetResult;
                            this.setData({
                                moneyTradeId: tradeId
                            })
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
                                    var app = getApp();
                                    const tmplIds = app.globalData.tmplIds;
                                    wx.requestSubscribeMessage({
                                        tmplIds: tmplIds,
                                        success: res => {
                                            tmplIds.forEach(item => {
                                                if (res[item] === 'reject') {
                                                    wx.showToast({
                                                        title: '此次操作会导致您接收不到通知',
                                                        icon: 'none',
                                                        duration: 2000,
                                                    })
                                                }
                                            })
                                            console.log("授权成功");
                                            setTimeout(function () {
                                                wx.redirectTo({
                                                    url: '/pages/orderList/orderList'
                                                })
                                            }, 1000);
                                        },
                                        fail: err => {
                                            console.log("授权失败");
                                            setTimeout(function () {
                                                wx.redirectTo({
                                                    url: '/pages/orderList/orderList'
                                                })
                                            }, 1000);
                                        },
                                    })
                                    // setTimeout(function () {
                                    //     wx.redirectTo({
                                    //         url: '/pages/orderList/orderList',
                                    //     })
                                    // }, 1000);
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
                        wx.showToast({
                            title: '此订单不在小程序下单 请去下单平台进行支付',
                            icon: "none",
                            duration: 2000
                        })
                    }
                } else if(singleplatform == 0){
                    
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
                }else if(singleplatform == 3){
                    console.log("调用余额支付");
                    //余额支付
                    wx.showModal({
                        title: '提示',
                        content: '确认支付',
                        success: (res) => {
                            if (res.confirm) {
                                http("post", `/Order/balancePay/${tradeid}`).then(res => {
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
            //申请退款
            // handleRefund(){
            //     const {
            //         tradeid,
            //         apptype
            //     } = e.currentTarget.dataset;
            //     if (apptype === 2) {
            //         const data={
            //             tradeId:tradeid,
            //             orderId:''
            //         };
            //         wx.showModal({
            //             title: '提示',
            //             content: '确认提交退款申请?',
            //             success: (res) => {
            //                 if (res.confirm) {
            //                     http("post", `/Order/refund`,data).then(res => {
            //                         if (res.code === 0) {
            //                             wx.showToast({
            //                                 title: '提交成功',
            //                                 icon: 'success',
            //                                 duration: 2000,
            //                                 success: () => {
            //                                     this.triggerEvent("handleRefreshOrderList")
            //                                 }
            //                             })
            //                         }
            //                     })
            //                 }
            //             }
            //         })
            //     } else {
            //         wx.showToast({
            //             title: '此订单不是小程序订单,请到下单提交退款.',
            //             icon: "none",
            //             duration: 2000
            //         })
            //     }
            // },
            // 积分退款
            pointReund(e) {
                this.setData({
                    show: true,
                    orderId: e.currentTarget.dataset.orderid,
                    tradeId:e.currentTarget.dataset.tradeid
                });
            },
            //订单
            handleRefund(e) {
                this.setData({
                    refundShow: true,
                    orderId: "",
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
            onRefundClose(){
                this.setData({
                    refundShow: false,
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
            onRefundConfirm(){
                const {
                    orderId,
                    refundReason,
                    tradeId
                } = this.data
                const data = {
                    orderId,
                    remark:refundReason,
                    tradeId
                }
                http("post", `/order/refund`, data).then(res => {
                    if (res.code === 0) {
                        wx.showToast({
                            title: '已提交退款申请',
                            icon: 'success',
                            duration: 2000,
                            success: () => {
                                this.setData({
                                    refundShow: false,
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
            }
        },

    },

)