import http from '../../utils/http';

Page({
    /**
     * 页面的初始数据
     */
    data: {
        // 轮播图
        carouselImage: [],
        projectArr: [{
                name: "水光补水",
                img: "/images/icon_1.png"
            },
            {
                name: "光子嫩肤",
                img: "/images/icon_2.png"
            },
            {
                name: "热玛吉",
                img: "/images/icon_3.png"
            },
            {
                name: "欧洲之星",
                img: "/images/icon_4.png"
            },
            {
                name: "玻尿酸",
                img: "/images/icon_5.png"
            },
            {
                name: "瘦脸瘦腿",
                img: "/images/icon_6.png"
            },
            {
                name: "注射除皱",
                img: "/images/icon_7.png"
            },
            {
                name: "整形手术",
                img: "/images/icon_8.png"
            }
        ],
        // 当前地址
        currentCity: '',
        pageNum: 1,
        pageSize: 10,
        nextPage: true,
        pageNums: 1,
        pageSizes: 10,
        // 通过城市获取医院列表
        hospitalList: [],
        // 切换城市model
        cityModel: false,
        cityList: [],
        // 热门选中id
        currentId: '',
        // 省份下面选中的id
        currentIds: '',
        // 授权
        controlAuth: false,
        // 授权手机号
        controlAuthPhone: false,
        //  获取热热门城市
        hosCityList: [],
        list: [],
        //商品列表
        goodsList: [],
        //当前商品展示列表页码
        currentPageIndex: 1
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getCarouselImage()
        
        this.getGoodsList()
        // http("post", `/Order/pay/f2702bb0b2dc4b7f944f05408f60980a`).then(res => {})
    },
    getGoodsList() {
        const {
            currentPageIndex,
            pageSize,
            nextPage
        } = this.data;
        if (!nextPage) return;
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
                        nextPage: false
                    })
                }
            }
        })
    },
    handleActivity(e){
        if(e.currentTarget.dataset.activity===1){
            wx.navigateTo({
              url: '/pages/activity/activity?activityid=1',
            })
        }else{
            wx.navigateTo({
                url: '/pages/activity/activity?activityid=2',
              })
        }
    },
    // 商品详情
    goodsDetails(e) {
        const {
            goodsid
        } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `/pages/productDetails/productDetails?goodsId=${goodsid}`
        })
    },
    redirect(e) {
        if (e.currentTarget.dataset.url) {
            wx.navigateTo({
                url: e.currentTarget.dataset.url,
            })
        }
    },
    onReachBottom: function () {
        this.getGoodsList()
    },
    onShow() {
        // this.getLocationAuth();
        this.setData({
            controlAuthPhone: false
        })

    },

    // 获取轮播图
    getCarouselImage() {
        http("get", `/CarouselImage/list`).then(res => {
            if (res.code === 0) {
                const {
                    carouselImage
                } = res.data;
                this.setData({
                    carouselImage
                })
            }
        })
    },
    // 项目介绍/项目分类
    projectClass() {
        wx.navigateTo({
            url: '/pages/shoppingMall/shoppingMall',
        })
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
    },

    // 取消绑定手机号
    cancelBindPhone() {
        this.setData({
            controlAuthPhone: false
        })
    },

})