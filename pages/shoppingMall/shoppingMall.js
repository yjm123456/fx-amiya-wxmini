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
        controlAuthPhone:false

    },

    onShow() {
        this.refresh();
    },

    refresh() {
        this.setData({
            pageNum: 1,
            goodsInfos: [],
            nextPage: true
        })
        this.getGoodsCategory();
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
        http("get", `/Goods/categoryList?showDirectionType=1`).then(res => {
            if (res.code === 0) {
                const {
                    goodsCategorys
                } = res.data;
                this.setData({
                    goodsCategorys,
                    categoryActive: 0,
                    categoryId: goodsCategorys.length && goodsCategorys[0].id
                })
                this.getGoodsInfo();
            }
        })
    },

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
                nextPage: true
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
            pageSize
        } = this.data;
        const data = {
            categoryId,
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