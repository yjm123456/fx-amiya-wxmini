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
        sumPoint:0,
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
        this.getAllMoney()
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
        this.getGoodsList();
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
        if (this.data.result.length <= 0) {
            Toast("请先选择商品");
            return;
        }
        let goods = [];
        for (let i = 0; i < this.data.result.length; i++) {
            //const element = this.data.result[i];
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
                url: "/pages/cartConfirmOrder/cartConfirmOrder?goodsInfo=" + encodeURIComponent(JSON.stringify(goods))
            })
            // 判断是否实物商品 false不是实物 false不需要发货
            // if (goodsInfo.isMaterial === false) {
            //     if (!cityname) {
            //         wx.showToast({
            //             title: '请选择城市',
            //             icon: 'none',
            //             duration: 2000
            //         })
            //     } else if (!hospitalid) {
            //         wx.showToast({
            //             title: '请选择门店',
            //             icon: 'none',
            //             duration: 2000
            //         })
            //     } else {
            //         goodsInfo.salePrice = hospitalsaleprice
            //         goodsInfo.allmoney = allmoney
            //         goodsInfo.hospitalid = hospitalid
            //         this.setData({
            //             goodsInfo
            //         })
            //         wx.navigateTo({
            //             // url: `/pages/confirmOrder/confirmOrder?goodsInfo=${JSON.stringify([goodsinfo])}`
            //             url: "/pages/confirmOrder/confirmOrder?goodsInfo=" + encodeURIComponent(JSON.stringify([goodsInfo])) + '&type=' + type + '&allmoney=' + allmoney
            //         })
            //     }
            // } else {
            //     //对goodsInfo重新添加两个属性
            //     goodsInfo.allmoney = allmoney
            //     goodsInfo.hospitalid = hospitalid
            //     //设置新属性后重新更新值
            //     this.setData({
            //         goodsInfo
            //     })
            //     wx.navigateTo({
            //         url: "/pages/confirmOrder/confirmOrder?goodsInfo=" + encodeURIComponent(JSON.stringify([goodsInfo])) + '&type=' + type + '&allmoney=' + allmoney
            //     })
            // }

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
        this.getGoodsList();
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

                    } else {
                        if (list[index].isMaterial) {
                            list[index].singleprice = list[index].price / list[index].num
                        } else {
                            list[index].singleprice = list[index].hospitalSalePrice / list[index].num
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
        let sumPoint=0;
        for (let i = 0; i < this.data.result.length; i++) {
            for (let j = 0; j < this.data.list.length; j++) {
                if (this.data.result[i] === this.data.list[j].id) {
                    if(this.data.list[j].exchangeType===1){
                        if(this.data.list[j].isMember){
                            sumMoney += this.data.list[j].memberPrice * this.data.list[j].num;
                        }else{
                            sumMoney += this.data.list[j].singleprice * this.data.list[j].num;
                        }
                        
                    }else if(this.data.list[j].exchangeType===0){
                        sumPoint += this.data.list[j].singleprice * this.data.list[j].num;
                    }                    
                }
            }
        }
        this.setData({
            sum: sumMoney * 100,
            sumPoint:sumPoint
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