// pages/shoppingCart/shoppingCart.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import http from '../../utils/http';

function throttle(fn, interval) {
    var enterTime = 0; //触发的时间
    var gapTime = interval || 300; //间隔时间，如果interval不传，则默认300ms
    return function () {
        var context = this;
        var backTime = new Date(); //第一次函数return即触发的时间
        if (backTime - enterTime > gapTime) {
            fn.call(context, arguments);
            enterTime = backTime; //赋值给第一次触发的时间，这样就保存了第二次触发的时间
        }
    };
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        selectAll: false,
        //购物车商品列表
        list: [],
        //选中的商品列表
        result: [],
        sum: 0,
        sumPoint: 0,
        //商品列表
        goodsList: [],
        pageNum: 1,
        pageSize: 10,
        nextPage: true,
        pageNums: 1,
        pageSizes: 10,
        //当前商品展示列表页码
        currentPageIndex: 1,
        goodsNextPage: true,
        //判断购物车是否为空
        empty: true,
        //选中的优惠券id
        selectedVoucher: '0',
        //选中的抵用券类型
        voucherType:0,
        //全局抵用券的折扣价格
        deductMoney:0,
        //全部有效的优惠券列表
        voucherList: [{
            text: '选择优惠券',
            value: '0'
        }],
        originVoucherList: []
    },
    onChange(event) {
        this.setData({
            result: event.detail,
        });
        if (this.data.result.length === this.data.list.length) {
            this.setData({
                selectAll: true
            })
        } else {
            this.setData({
                selectAll: false
            })
        }
        this.getAllMoney();
        this.handleVoucherPrice();
    },
    //获取用户拥有的抵用券
    getCustomerVoucher(e) {
        //商品id
        const {
            id
        } = e.currentTarget.dataset;
        const data = {
            isUsed: false,
            goodsId: id
        };
        http("get", `/CustomerConsumptionVoucher/allList`, data).then(res => {
            if (res.code === 0) {
                const {
                    customerConsumptionVoucherList
                } = res.data;
                if (customerConsumptionVoucherList.length > 0) {
                    wx.navigateTo({
                        url: '/pages/selectVoucher/selectVoucher?list=' + JSON.stringify(res.data.customerConsumptionVoucherList) + '&type=shopcar' + '&goodsId=' + id,
                    })
                } else {
                    wx.showToast({
                        title: '没有可用于此商品的抵用券',
                        icon: 'none',
                        duration: 1000
                    })
                }
            }
        })
    },
    //选择抵用券
    selectVoucher(event) {
        this.setData({
            selectedVoucher: event.detail
        });
        this.changeSelectGoods();
        this.handleVoucherPrice();
    },
    // 选中抵用券后重新调整商品选中项
    changeSelectGoods() {
        const {
            selectedVoucher,
            result,
            originVoucherList,
            list
        } = this.data;
        var voucher = originVoucherList.find(e => e.customerVoucherId == selectedVoucher);
        const {
            vioucherId
        } = voucher;
        var selectGoodIdArr = [];
        let haveMatchGoods = false;
        
        if (voucher.isSpecifyProduct) {
            for (let index = 0; index < list.length; index++) {
                if (list[index].voucherIdList.indexOf(vioucherId) > -1) {
                    haveMatchGoods = true;
                    selectGoodIdArr.push(list[index].id);
                }
            }
            if (!haveMatchGoods) {
                wx.showToast({
                    title: '购物车内没有符合使用条件的商品!',
                    icon: 'none',
                    duration: 1000
                });
                this.setData({
                    selectedVoucher: '0'
                })
                return;
            }
            this.setData({
                voucherType:voucher.type
                
            });
        } else {
            //全局抵用券选中全局商品
            let haveMatchGoods = false;
            for (let index = 0; index < list.length; index++) {
                if (list[index].exchangeType == 1) {
                    haveMatchGoods = true;
                }
            }
            if (!haveMatchGoods) {
                selectGoodIdArr = result;
                wx.showToast({
                    title: '购物车内没有符合使用条件的商品!',
                    icon: 'none',
                    duration: 1000
                });
                return;
            }
            this.setData({
                voucherType:voucher.type,
                deductMoney:voucher.deductMoney
            });
            for (let index = 0; index < list.length; index++) {
                selectGoodIdArr.push(list[index].id);
            }
        }
        this.setData({
            result: selectGoodIdArr
        })
        if (this.data.result.length === this.data.list.length) {
            this.setData({
                selectAll: true
            })
        } else {
            this.setData({
                selectAll: false
            })
        }
        this.getAllMoney();
    },
    // 计算使用抵用券后的价格
    handleVoucherPrice() {
        console.log("抵用券价格修改");
        //获取选中的商品
        const {
            result,
            list,
            selectedVoucher,
            voucherList,
            sum,
            originVoucherList
        } = this.data;
        if (!selectedVoucher) {
            return;
        }
        const currentVoucher = originVoucherList.find(i => i.customerVoucherId == selectedVoucher);
        if (!currentVoucher) {
            return;
        } else {
            if (!currentVoucher.isSpecifyProduct) {
                if (currentVoucher.isNeedMinFee) {
                    if (currentVoucher.minPrice * 100 > sum) {
                        wx.showToast({
                            title: '支付总金额小于抵用券要求,不能使用!',
                            icon: 'none',
                            duration: 1000
                        })
                        this.setData({
                            selectedVoucher: '0'
                        });
                        return;
                    }
                    
                }
                this.getAllMoney();
                let newSum = sum - (currentVoucher.deductMoney * 100) > 0 ? (sum - (currentVoucher.deductMoney * 100)) : 10
                console.log("新的值为"+newSum);
                this.setData({
                    sum: newSum
                })
            } else {
                if (result.length != 0) {
                    for (let i = 0; i < result.length; i++) {
                        for (let j = 0; j < list.length; j++) {
                            var currentGoodsVoucher = list[j];
                            if (currentGoodsVoucher.id == result[i] && currentGoodsVoucher.exchangeType != 0) {
                                var selectVoucherId = originVoucherList.find(e => e.customerVoucherId == selectedVoucher);
                                if (currentGoodsVoucher.voucherIdList.length != 0 && currentGoodsVoucher.voucherIdList.indexOf(selectVoucherId.vioucherId) > -1) {
                                    var voucher = voucherList.find(i => i.value == selectedVoucher);
                                    if (voucher) {
                                        if (voucher.isNeedMinFee) {
                                            if (voucher.minPrice * 100 > sum) {
                                                wx.showToast({
                                                    title: '支付总金额小于抵用券要求,不能使用!',
                                                    icon: 'none',
                                                    duration: 1000
                                                })
                                                this.setData({
                                                    selectedVoucher: '0'
                                                })
                                            }
                                            return;
                                        } else {
                                            if (voucher.isSpecifyProduct) {
                                                if (voucher.type == 0) {
                                                    // 金额抵用券
                                                    currentGoodsVoucher.voucherPrice = currentGoodsVoucher.singleprice - voucher.deductMoney > 0 ? (currentGoodsVoucher.singleprice - voucher.deductMoney) : 0.1;
                                                } else if (voucher.type == 4) {
                                                    // 折扣抵用券
                                                    currentGoodsVoucher.voucherPrice = Math.ceil(currentGoodsVoucher.singleprice * voucher.deductMoney);
                                                }
                                                this.setData({
                                                    list
                                                })
                                                this.getAllMoney();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    //获取用户所有的抵用券
    getCustomerAllVoucher(e) {
        http("get", `/CustomerConsumptionVoucher/getAllValidVoucher`).then(res => {
            if (res.code === 0) {
                const {
                    voucherList
                } = res.data;
                var list = voucherList.map(_item => {
                    return {
                        text: _item.voucherName,
                        value: _item.customerVoucherId,
                        isNeedMinFee: _item.isNeedMinFee,
                        isSpecifyProduct: _item.isSpecifyProduct,
                        minPrice: _item.minPrice,
                        type: _item.type,
                        deductMoney: _item.deductMoney
                    }
                });
                if (list.length > 0) {
                    this.setData({
                        voucherList: [...this.data.voucherList, ...list]
                    })
                } else {
                    this.setData({
                        voucherList: new [{
                            text: '暂无可用抵用券',
                            value: '0'
                        }]
                    })
                }
                // 保存返回的原始抵用券数据
                this.setData({
                    originVoucherList: voucherList
                })
            }
        })
    },
    refreshPage() {
        this.setData({
            selectAll: false,
            //购物车商品列表
            list: [],
            //选中的商品列表
            result: [],
            sum: 0,
            //商品列表
            goodsList: [],
            pageNum: 1,
            pageSize: 10,
            nextPage: true,
            pageNums: 1,
            pageSizes: 10,
            //当前商品展示列表页码
            currentPageIndex: 1,
            goodsNextPage: true,
            //判断购物车是否为空
            empty: true
        })
        this.getCartProduct()
        //获取商品列表(暂时不使用)
        //this.getGoodsList();
    },
    onNumChange(e) {
        const {
            index,
            id,
            goodsid,
            cityid,
            hospitalid
        } = e.currentTarget.dataset
        const num = e.detail;
        this.data.list[index].num = num
        this.setData({
            ["list[" + index + "]"]: this.data.list[index]
        });
        this.isEmpty();
        throttle(this.updateNum(id, goodsid, index, cityid, hospitalid), 1000)
        this.getAllMoney();
        this.handleVoucherPrice();
    },
    updateNum(id, goodsid, index, cityid, hospitalid) {
        const data = {
            Id: id,
            GoodsId: goodsid,
            Num: this.data.list[index].num,
            CityId: cityid,
            HospitalId: hospitalid
        }
        http("put", "/GoodsShopCar", data).then(res => {
            if (res.code == 0) {
                console.log("添加成功")
            }
        })
        this.getCartProduct()
    },
    isEmpty() {
        for (let index = 0; index < this.data.list.length; index++) {
            const element = this.data.list[index];
            console.log(element);
            if (element.num > 0) {
                this.setData({
                    empty: false
                })
                return;
            }
        }
        this.setData({
            empty: true
        })
    },
    // 购买
    purchase(e) {
        const {
            selectedVoucher,
            voucherType,
            deductMoney
        } = this.data;
        if (this.data.result.length <= 0) {
            Toast("请先选择商品");
            return;
        }
        let goods = [];
        for (let i = 0; i < this.data.result.length; i++) {
            for (let j = 0; j < this.data.list.length; j++) {
                if (this.data.result[i] === this.data.list[j].id) {
                    if (!this.data.list[j].isMaterial) {
                        if (!this.data.list[j].hospitalid) {
                            Toast('请先选择门店');
                        }
                    }
                    goods = [...goods, this.data.list[j]]
                }
            }
        }
        let token = wx.getStorageSync("token")
        if (!token) {
            wx.showToast({
                title: '请先登录',
                icon: 'none',
                duration: 2000
            })
        } else {
            wx.redirectTo({
                url: "/pages/cartConfirmOrder/cartConfirmOrder?goodsInfo=" + encodeURIComponent(JSON.stringify(goods)) + "&selectedvoucher=" + selectedVoucher+"&vouchertype="+voucherType+"&deductmoney="+deductMoney
            })
        }
    },

    //阻止事件冒泡
    stopPro() {},
    deleteFromCart() {
        const {
            goodsis,
            id
        } = e.currentTarget.dataset;
        const data = {
            Id: id,
            status: 0
        }
        http("put", "/GoodsShopCar", data).then(res => {
            if (res.code === 0) {
                this.getCartProduct();
            }
        });
    },
    //单元格触发复选框点击事件
    toggle(event) {
        const {
            index
        } = event.currentTarget.dataset;
        const checkbox = this.selectComponent(`.checkboxes-${index}`);
        checkbox.toggle();
    },

    noop() {},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getCartProduct()
        //this.getGoodsList();
        this.getCustomerAllVoucher()
    },
    toShopMall() {
        wx.switchTab({
            url: '/pages/shoppingMall/shoppingMall',
        })
    },
    getCartProduct() {
        const {
            pageNum,
            pageSize
        } = this.data;
        const data = {
            keyword: "",
            pageNum,
            pageSize
        }
        http("get", `/GoodsShopCar/goodsShopCarList`, data).then(res => {
            if (res.code === 0) {
                let {
                    list,
                    totalCount
                } = res.data.goodsShopCarInfos;
                for (let index = 0; index < list.length; index++) {

                    if (list[index].exchangeType === 0) {

                        list[index].singleprice = list[index].interGrationAccount
                        list[index].voucherPrice = list[index].interGrationAccount;
                    } else {
                        if (list[index].isMaterial) {
                            list[index].singleprice = list[index].price / list[index].num;
                            list[index].voucherPrice = list[index].singleprice;
                        } else {
                            list[index].singleprice = list[index].hospitalSalePrice / list[index].num
                            list[index].voucherPrice = list[index].singleprice;
                        }

                    }
                }
                this.setData({
                    list: [...this.data.list, ...list],
                })
                this.isEmpty();
                this.data.pageNum++
                if (this.data.list.length === totalCount) {
                    this.setData({
                        nextPage: false
                    })
                    this.getGoodsList();
                }
            }
        })
    },
    radioChange(e) {
        if (this.data.selectAll) {

            this.setData({
                selectAll: false,
                result: []
            })
            this.getAllMoney()
        } else {
            this.setData({
                selectAll: true,
                result: this.data.list.map(item => {
                    return item.id.toString()
                })
            })
            this.getAllMoney();
        }
    },
    getAllMoney() {
        let sumMoney = 0;
        let sumPoint = 0;
        for (let i = 0; i < this.data.result.length; i++) {
            for (let j = 0; j < this.data.list.length; j++) {
                if (this.data.result[i] === this.data.list[j].id) {
                    if (this.data.list[j].exchangeType === 1) {
                        if (this.data.list[j].isMember) {
                            sumMoney += this.data.list[j].memberPrice * this.data.list[j].num;
                        } else {
                            if (this.data.list[j].voucherId) {
                                if (this.data.list[j].voucherType == 0) {
                                    sumMoney += (this.data.list[j].voucherPrice * this.data.list[j].num) - this.data.list[j].deductMoney;
                                } else if (this.data.list[j].voucherType == 4) {
                                    sumMoney += Math.ceil((this.data.list[j].voucherPrice * this.data.list[j].num) * this.data.list[j].deductMoney);
                                }
                            } else {
                                sumMoney += this.data.list[j].voucherPrice * this.data.list[j].num;
                            }
                        }
                    } else if (this.data.list[j].exchangeType === 0) {
                        sumPoint += this.data.list[j].singleprice * this.data.list[j].num;
                    }
                }
            }
        }
        this.setData({
            sum: sumMoney * 100,
            sumPoint: sumPoint
        })
    },
    getGoodsList() {
        const {
            currentPageIndex,
            pageSize,
            goodsNextPage
        } = this.data;
        if (!goodsNextPage) return;
        const pageNum = currentPageIndex
        const data = {
            pageNum,
            pageSize
        }
        http("get", `/Goods/likeInfoList`, data).then(res => {
            if (res.code === 0) {
                let {
                    list,
                    totalCount
                } = res.data.goodsInfos;
                this.setData({
                    goodsList: [...this.data.goodsList, ...list],
                })
                //callback && callback();
                this.data.currentPageIndex++;
                if (this.data.list.length === totalCount) {
                    this.setData({
                        goodsNextPage: false
                    })
                }
            }
        })
    },
    // 商品详情
    goodsDetails(e) {
        const {
            goodsid,
            exchangetype
        } = e.currentTarget.dataset;
        console.log(exchangetype)
        if (exchangetype === 1) {
            wx.navigateTo({
                url: `/pages/productDetails/productDetails?goodsId=${goodsid}`
            })
        } else {
            wx.navigateTo({
                url: `/pages/goodsDetails/goodsDetails?goodsId=${goodsid}`
            })
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
        //this.refreshPage()
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
        console.log("底部")
        this.getCartProduct()
        this.getGoodsList();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})