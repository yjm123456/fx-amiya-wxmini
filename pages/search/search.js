// pages/search/search.js
import http from "../../utils/http";
import {
    iscustomer,
    isAuthorizationUserInfo
} from "./../../api/user";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //控制分类侧边栏显示
        show: false,
        //控制商品列表展示
        goodsShow: false,
        //控制搜索记录和标签展示
        tagShow: true,
        //搜索关键词
        keyword: '',
        //类别id
        categoryId: '',
        //商城分类
        exchageCategory: [],
        //积分商城分类
        pointCategory: [],
        //搜索记录
        histories: [],
        //商品标签
        tags: [],
        //商品
        goodsList: [],
        pageNum: 1,
        pageSize: 10,
        nextPage: true,
        //是否选中销量排序
        saleCountSelected: false,
        //是否选中价格排序
        priceSelected: false,
        controlAuthPhone:false,
        showHistory:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getCategory();
        this.getSearchHistory();
        this.getTags();
    },
    goodsDetails(e) {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                const {
                    goodsid,
                    exchagetype
                } = e.currentTarget.dataset;
                if(exchagetype==0){
                    wx.navigateTo({
                        url: `/pages/goodsDetails/goodsDetails?goodsId=${goodsid}`
                    })
                }else{
                    wx.navigateTo({
                        url: `/pages/productDetails/productDetails?goodsId=${goodsid}`
                    })
                }
                
            } else {
                this.handleBindPhone();
            }
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
    //搜索
    search() {
        if (!keyword) {
            wx.showToast({
                title: '请输入搜索的内容',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        this.setData({
            goodsShow: true,
            tagShow: false,
            goodsList: [],
            categoryId: '',
            nextPage: true,
            pageNum: 1,
            saleCountSelected: false,
            priceSelected: false
        })

        const {
            keyword
        } = this.data;
        
        var history = wx.getStorageSync("search_history");
        if (!history) {
            wx.setStorageSync('search_history', keyword)
            this.setData({
                histories: [keyword]
            })
        } else {
            var histories = history.split(',')
            if (histories.length >= 10) {
                // 删除旧元素,添加新元素
                histories.pop();
                histories.unshift(keyword);
                this.setData({
                    histories
                })
                wx.setStorageSync('search_history', histories.join(','))
            } else {
                //添加新元素
                histories.unshift(keyword);
                this.setData({
                    histories
                })
                wx.setStorageSync('search_history', histories.join(','))
            }
        }
        this.toSearch();
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
    toSearch() {
        const {
            keyword,
            categoryId,
            pageSize,
            pageNum,
            nextPage,
            goodsList,
            saleCountSelected,
            priceSelected
        } = this.data;
        if (!nextPage) return;
        const data = {
            keyword,
            categoryId,
            pageSize,
            pageNum,
            orderBySaleCount: saleCountSelected,
            orderByPrice: priceSelected
        }
        http('get', '/goods/search', data).then(res => {
            if (res.code == 0) {
                const {
                    searchResult
                } = res.data;
                var list = [...goodsList, ...searchResult.list]
                this.setData({
                    goodsList: list
                })
                console.log("list的长度为"+list.length);
                this.data.pageNum++
                if (list.length >= searchResult.totalCount) {
                    this.setData({
                        nextPage: false
                    })
                }
            }
        })
    },
    tagSearch(e) {
        const {
            id,
            name
        } = e.currentTarget.dataset;
        this.setData({
            goodsShow: true,
            tagShow: false,
            keyword: name
        })
        var history = wx.getStorageSync("search_history");
        if (!history) {
            wx.setStorageSync('search_history', name)
            this.setData({
                histories: [name]
            })
        } else {
            var histories = history.split(',')
            if (histories.length >= 10) {
                // 删除旧元素,添加新元素
                histories.pop();
                histories.unshift(name);
                this.setData({
                    histories
                })
                wx.setStorageSync('search_history', histories.join(','))
            } else {
                //添加新元素
                histories.unshift(name);
                this.setData({
                    histories
                })
                wx.setStorageSync('search_history', histories.join(','))
            }
        }
        this.toSearch()
    },
    getSearchHistory() {
        var history = wx.getStorageSync('search_history')
        console.log(history);
        if (history) {
            var histories = history.split(',');
            this.setData({
                histories,
                showHistory:true
            })
        }else{
            this.setData({
                histories:[],
                showHistory:false
            })
        }
    },
    onKeywordChange(e) {
        this.setData({
            keyword: e.detail.value
        })
    },
    //选择类别
    selectCategory(e) {
        const {
            id
        } = e.currentTarget.dataset;
        this.setData({
            categoryId: id,
            pageNum: 1,
            show: false,
            nextPage: true,
            goodsList: []
        })
        this.toSearch();
    },
    //点击销量
    saleCountSelect() {
        const {
            saleCountSelected,
            priceSelected
        } = this.data;
        this.setData({
            saleCountSelected: !saleCountSelected,
            priceSelected: false
        })
        this.setData({
            pageNum: 1,
            goodsList: [],
            nextPage: true
        })
        this.toSearch();
    },
    //点击价格
    priceSelect() {
        const {
            priceSelected,
            saleCountSelected
        } = this.data;
        this.setData({
            saleCountSelected: false,
            priceSelected: !priceSelected
        })
        this.setData({
            pageNum: 1,
            goodsList: [],
            nextPage: true
        })
        this.toSearch();
    },
    //清除历史记录
    clearHistory() {
        wx.setStorageSync('search_history', "")
        this.getSearchHistory();
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
    getCategory() {
        http('get', '/goods/allCategoryList').then(res => {
            if (res.code == 0) {
                const {
                    goodsCategorys
                } = res.data;
                var exchageCategory = goodsCategorys.filter(item => item.showDirectionType == 1);
                var pointCategory = goodsCategorys.filter(item => item.showDirectionType == 0);
                this.setData({
                    exchageCategory,
                    pointCategory
                })
            }
        })
    },
    getTags() {
        http('get', '/goods/tagList').then(res => {
            if (res.code == 0) {
                const {
                    tags
                } = res.data;

                this.setData({
                    tags
                })
            }
        })
    },
    // 显示侧边栏
    showPopup() {
        this.setData({
            show: true
        })
    },
    // 隐藏侧边栏
    onClose() {
        this.setData({
            show: false
        });
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
        this.toSearch();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})