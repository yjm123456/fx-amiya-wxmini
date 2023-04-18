// pages/shoppingMall/shoppingMall.js
import http from '../../utils/http.js';
import {
    iscustomer,
    isAuthorizationUserInfo
} from "./../../api/user";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        balance:0,
        appId:'',
        // 是否正在处理滚动事件，避免一次滚动多次触发
        isScrolling: false,

        categoryActive: 0,

        // 商品分类
        goodsCategoryList: [],

        // 商品分类
        categoryId: "",

        // 商品名称
        keyword: "",

        pageNum: 1,

        pageSize: 10,

        // 商品列表
        goodsInfos: [],

        // 是否存在下一页
        nextPage: true,
        controlAuthPhone:false,
        goodsCategorys:'',
        //排序
        sort:0,
        saleCountSelected:false,
        priceSelected:false
    },

    onShow() {
        const {assisteAppId}=getApp().globalData;
        this.setData({appId:assisteAppId})
        this.isCustomer((isCustomer) => {
            if (isCustomer) {

            } else {
                this.handleBindPhone();
            }
        })
        this.getIntegral();
        this.getGoodsCategory();
    },
    getIntegral() {
        http("get", `/IntegrationAccount/balance`).then(res => {
            if (res.code === 0) {
                const {
                    balance
                } = res.data;
                this.setData({
                    balance
                })
            }
        })
    },
    handleRuleTap(e) {
        const {url}=e.currentTarget.dataset
        wx.navigateTo({
            url: url,
        })
    },
    refresh() {
        this.setData({
            pageNum: 1,
            goodsInfos: [],
            nextPage: true
        })
        this.getGoodsCategory();
    },
    //点击销量
    saleCountSelect() {
        const {
            saleCountSelected,
            priceSelected
        } = this.data;
        if(saleCountSelected){
            this.setData({
                sort:0
            })
        }else{
            this.setData({
                sort:1
            })
        }
        this.setData({
            saleCountSelected: !saleCountSelected,
            priceSelected: false
        })
        this.setData({
            pageNum: 1,
            goodsInfos: [],
            nextPage: true
        })
        this.getGoodsInfo();
    },
    //点击价格
    priceSelect() {
        const {
            priceSelected,
            saleCountSelected
        } = this.data;
        if(priceSelected){
            this.setData({
                sort:0
            })
        }else{
            this.setData({
                sort:2
            })
        }
        this.setData({
            saleCountSelected: false,
            priceSelected: !priceSelected
        })
        this.setData({
            pageNum: 1,
            goodsInfos: [],
            nextPage: true,
            
        })
        this.getGoodsInfo();
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
    // 获取商品分类
    getGoodsCategory() {
        const {appId}=this.data;
        http("get", `/Goods/categoryList?showDirectionType=1&appId=`+appId).then(res => {
            if (res.code === 0) {
                const {
                    goodsCategorys
                } = res.data;
                //判断是否有已存在的类别
                if(!this.data.goodsCategorys){
                    this.setData({
                        goodsCategorys,
                        categoryActive: 0,
                        categoryId: goodsCategorys.length && goodsCategorys[0].id
                    })
                    this.getGoodsInfo();
                }else{
                    console.log("类别已存在");
                    if(this.data.goodsCategorys.length!=goodsCategorys.length){
                        this.setData({
                            pageNum: 1,
                            goodsInfos: [],
                            nextPage: true
                        })
                        this.setData({
                            goodsCategorys,
                            categoryActive: 0,
                            categoryId: goodsCategorys.length && goodsCategorys[0].id
                        })
                        this.getGoodsInfo();
                        return;
                    }
                    for (let index = 0; index < goodsCategorys.length; index++) {
                        var exist= this.data.goodsCategorys.findIndex(item=>item.name==goodsCategorys[index].name);
                        if(exist<0){
                            this.setData({
                                pageNum: 1,
                                goodsInfos: [],
                                nextPage: true
                            })
                            this.setData({
                                goodsCategorys,
                                categoryActive: 0,
                                categoryId: goodsCategorys.length && goodsCategorys[0].id
                            })
                            this.getGoodsInfo();
                        }
                    }
                }


                
            }
        })
    },
    // onPullDownRefresh(){
    //     console.log("下拉刷新");
    //     this.refresh();
    // },
    // 点击商品分类
    handleGoodsCategoryClick(e) {
        const {
            categoryid,
            index
        } = e.currentTarget.dataset;
        if (this.data.categoryId !== categoryid) {
            this.setData({
                categoryId: categoryid,
                categoryActive: index,
                pageNum: 1,
                goodsInfos: [],
                nextPage: true,
                sort:0,
                saleCountSelected:false,
                priceSelected:false
            })
            this.getGoodsInfo();
        }
    },

    // 获取商品列表
    getGoodsInfo(callback) {
        const {
            categoryId,
            keyword,
            pageNum,
            pageSize,
            appId,
            sort
        } = this.data;
        const data = {
            categoryId,
            appId,
            sort,
            keyword,
            pageNum,
            pageSize
        }
        http("get", `/Goods/infoList`, data).then(res => {
            if (res.code === 0) {
                let {
                    list,
                    totalCount
                } = res.data.goodsInfos;
                this.setData({
                    goodsInfos: [...this.data.goodsInfos, ...list],
                })
                callback && callback();
                this.data.pageNum++
                if (this.data.goodsInfos.length === totalCount) {
                    this.setData({
                        nextPage: false
                    })
                }
            }
        })
    },

    // 获取商品搜索input值
    getSearchInputValue(e) {
        const {
            value
        } = e.detail;
        this.setData({
            keyword: value
        })
        if (!value) {
            this.handleGoodsSearch();
        }
    },

    // 搜索商品
    handleGoodsSearch() {
        this.setData({
            pageNum: 1,
            goodsInfos: [],
            nextPage: true
        })
        this.getGoodsInfo();
    },

    // 上拉加载
    loadMore() {
        if (this.data.nextPage) {
            if (this.data.isScrolling === true) return;
            this.data.isScrolling = true;
            this.getGoodsInfo(() => {
                this.data.isScrolling = false;
            });
        }
    },
    to(e){
        const {page}=e.currentTarget.dataset;
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                wx.navigateTo({
                    url: page
                })
            } else {
                this.handleBindPhone();
            }
        })
    },
    // 商品详情
    goodsDetails(e) {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                const {
                    goodsid
                } = e.currentTarget.dataset;
                wx.navigateTo({
                    url: `/pages/productDetails/productDetails?goodsId=${goodsid}`
                })
            } else {
                this.handleBindPhone();
            }
        })

    },
})