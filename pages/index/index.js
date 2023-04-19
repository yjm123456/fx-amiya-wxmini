import http from '../../utils/http';
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
        appId: '',
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
        pageNum: 1,
        pageSize: 10,
        nextPage: true,
        pageNums: 1,
        pageSizes: 10,
        //当前商品展示列表页码
        currentPageIndex: 1,
        vouchername: '',
        vouchermoney: 0,
        nickname: '',
        //领取抵用券弹窗
        controlRecieveVoucher: false,
        //显示绑定赠送抵用券提示
        showVoucherTip: false,
        scene: '',
        show: false,
        voucherUrl: 'https://ameiya.oss-cn-hangzhou.aliyuncs.com/05206138b16b44929a5751c21ca3e612.jpg',
        showAppoint: false,
        hotCategoryList: [],
        hotNotBrandCategoryList: []
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.visit();
        const scene = decodeURIComponent(options.scene);
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                this.getShareInfo();
                if (scene != 'undefined') {
                    this.setSuperior(scene);
                }
            } else {
                this.showVoucherTips()
            }
        })
    },
    //获取用于获取信息获取的appid
    //步骤1,判断是否已绑定小程序若已绑定直接设置
    //步骤2,如果没有绑定,判断是否有最近登录的小程序记录如果有则设置为最近登录的appid
    //步骤3,如果也没有最近的登录记录,判断首页初始化时参数中是否有appid,如果有则设置为参数中的appid
    //步骤4,如果以上的值都没有则设置为当前小程序的appid
    getAppId(options) {
        let app=getApp();
        app.getUserTokenSuccessCallback=res=>{
            const {appId}=options;
            if(appId){
                http('get','/user/recordAppId/'+appId).then(res=>{
                    if(res.code==0){
                        this.getBindApp()
                    }
                })
            }else{
                this.getBindApp();
            }
            
        }
    },
    getBindApp(options){
        http('get', '/customer/isBind').then(res => {
            var assisteAppId = res.data.assisteAppId;
            if (assisteAppId) {
                this.setData({
                    appId: assisteAppId
                })
                const {
                    appId
                } = this.data;
                var app = getApp()
                app.globalData.assisteAppId = appId;
                this.getIndexData()
            } else {
                http('get', '/user/lastLoginAppId').then(res => {
                    var lastAppId = res.data.appId;
                    if (lastAppId) {
                        this.setData({
                            appId: lastAppId
                        })    
                        const {
                            appId
                        } = this.data;
                        var app = getApp()
                        app.globalData.assisteAppId = appId;
                        this.getIndexData()
                    } else {
                        const {
                            appId
                        } = options;
                        if (appId) {
                            this.setData({
                                appId: appId
                            });
                            
                            var id = this.data.appId;
                            var app = getApp()
                            app.globalData.assisteAppId = id;
                            this.getIndexData()
                        } else {
                            var app = getApp();
                            var miniAppId = app.globalData.appId;
                            this.setData({
                                appId: miniAppId
                            })
                        }
                        var id = this.data.appId;
                        var app = getApp()
                        app.globalData.assisteAppId = id;
                        this.getIndexData()
                    }
                })
            }
        })
    },
    //设置上级
    setSuperior(scene) {
        http("put", `/user/setSuperior/` + scene).then(res => {
            if (res.code === 0) {

            }
        })
    },
    getHotCategory() {
        const {
            appId
        } = this.data;
        const data = {
            appId,
            showDirectionType: 0
        };
        http('get', '/goods/hotCategoryList', data).then(res => {
            if (res.code === 0) {
                this.setData({
                    hotCategoryList: res.data.hotGoodsCategorys
                })
            }
        })
    },
    getHotNotBrandCategory() {
        const {
            appId
        } = this.data;
        const data = {
            appId,
            showDirectionType: 0
        };
        http('get', '/goods/hotNotBrandCategoryList', data).then(res => {
            if (res.code === 0) {
                this.setData({
                    hotNotBrandCategoryList: res.data.hotGoodsCategorys
                })
            }
        })
    },
    visit() {
        http("get", `/ControlPageShow`).then(res => {
            if (res.code === 0) {
                const isShowAppoint = res.data.visit
                this.setData({
                    showAppoint: isShowAppoint
                });
            }
        })
    },
    toCode(e) {
        const {
            url
        } = e.currentTarget.dataset
        wx.navigateTo({
            url: url,
        })
    },
    //显示绑定赠送抵用券提示
    showVoucherTips() {
        Dialog.alert({
            theme: 'round-button',
            confirmButtonText: "",
            closeOnClickOverlay: true,
            customStyle: "background-color:transparent !important;height:900rpx;margin-top:50rpx;postion:relative;width:550rpx;",
            selector: "#bind_tips"
        }).then(() => {
            this.handleBindPhone();
        });
    },
    // toMini(){
    //     var app = getApp();
    //     const appId = app.globalData.appId;
    //     wx.navigateToMiniProgram({
    //         appId: 'wx8747b7f34c0047eb',
    //         path: 'pages/index/index?appid='+appId,
    //         extraData: {
    //           foo: 'bar'
    //         },
    //         envVersion: 'trial',
    //         success(res) {
    //           // 打开成功
    //         }
    //       })
    // },
    getVoucher() {
        this.setData({
            show: false
        })
        this.handleBindPhone();
    },
    //领取抵用券
    recieve() {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                http("get", `/CustomerConsumptionVoucher/reciveConsumptionVoucher`).then(res => {
                    if (res.code === 0) {
                        this.setData({
                            controlRecieveVoucher: false
                        })
                        wx.showToast({
                            title: '领取成功',
                            icon: 'none',
                            duration: 1000
                        })
                    }
                })
            } else {
                this.handleBindPhone();
            }
        })
    },
    //判断当前月是否已经领取抵用券
    getRecieveVoucherInfo() {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                http("get", `/CustomerConsumptionVoucher/isReciveConsumptionVoucher`).then(res => {
                    if (res.code === 0) {
                        const isRecieve = res.data.recieve;
                        if (!isRecieve) {
                            Dialog.alert({
                                title: '会员福利',
                                theme: 'round-button',
                                confirmButtonText: '立即领取',
                                closeOnClickOverlay: true,
                                customStyle: 'background-color:#000;color:#fff;border: 2rpx solid #DEC350;',
                                className: 'van_dialog_action',
                                selector: "#recieve-voucher"
                            }).then(() => {
                                this.recieve();
                            });
                        }
                    }
                })
            } else {
                this.handleBindPhone();
            }
        })
    },
    getShareInfo() {
        var page = getCurrentPages();
        var currentPage = page[page.length - 1];
        var {
            shareid,
            customerconsumptionvoucherid,
            vouchername,
            vouchermoney,
            nickname,
        } = currentPage.options;
        this.setData({
            vouchername,
            vouchermoney,
            nickname
        });
        if (shareid != null) {
            Dialog.alert({
                title: '好友分享',
                message: '弹窗内容',
                theme: 'round-button',
                confirmButtonText: '立即领取',
                closeOnClickOverlay: true,
                customStyle: 'background-color:#000;color:#fff;border: 2rpx solid #DEC350;',
                className: 'van_dialog_action'
            }).then(() => {
                const data = {
                    shareBy: shareid,
                    consumerConsumptionVoucherId: customerconsumptionvoucherid
                }
                this.isCustomer((isCustomer) => {
                    if (isCustomer) {
                        http("post", `/CustomerConsumptionVoucher/reciveShareVoucher`, data).then(res => {
                            if (res.code === 0) {
                                wx.showToast({
                                    title: '领取成功!',
                                    icon: 'none',
                                    duration: 1000
                                })
                            } else {
                                wx.showToast({
                                    title: res.data.msg,
                                    icon: 'none',
                                    duration: 1000
                                })
                            }
                        })
                    } else {
                        this.handleBindPhone();
                    }
                })
            });
        }
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
    to(e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    },
    toShop(e) {
        wx.switchTab({
            url: e.currentTarget.dataset.url,
        })
    },
    getGoodsList() {
        const {
            currentPageIndex,
            pageSize,
            nextPage,
            appId
        } = this.data;
        if (!nextPage) return;
        const pageNum = currentPageIndex
        const data = {
            appId,
            pageNum,
            pageSize
        }
        http("get", `/Goods/hotGoodsList`, data).then(res => {
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

    handleActivity1() {
        wx.navigateTo({
            url: '/pages/LiveAnchorMessage/LiveAnchorMessage?name=dd&isAmyLiveAnchor=true'
        })
    },
    handleActivity() {
        wx.navigateTo({
            url: '/pages/LiveAnchorMessage/LiveAnchorMessage?name=jn&isAmyLiveAnchor=true'
        })
    },
    handleRedirect(event) {
        const {
            name
        } = event.currentTarget.dataset;
        wx.navigateTo({
            url: '/pages/LiveAnchorMessage/LiveAnchorMessage?name=' + name + '&isAmyLiveAnchor=false'
        })
    },
    // 商品详情
    goodsDetails(e) {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                const {
                    goodsid,
                    exchagetype
                } = e.currentTarget.dataset;
                if (exchagetype == 0) {
                    wx.navigateTo({
                        url: `/pages/goodsDetails/goodsDetails?goodsId=${goodsid}`
                    })
                } else {
                    wx.navigateTo({
                        url: `/pages/productDetails/productDetails?goodsId=${goodsid}`
                    })
                }

            } else {
                this.handleBindPhone();
            }
        })

    },
    toOrder(event) {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                const {
                    name
                } = event.currentTarget.dataset;
                wx.navigateTo({
                    url: '/pages/activity/activity'
                })
            } else {
                this.showVoucherTips()
            }
        })
    },
    toReport(event) {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                const {
                    name
                } = event.currentTarget.dataset;
                wx.navigateTo({
                    url: '/pages/aestheticsDesignReportList/aestheticsDesignReportList'
                })
            } else {
                this.showVoucherTips()
            }
        })
    },
    switchTab(e) {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                if (e.currentTarget.dataset.url) {
                    wx.switchTab({
                        url: e.currentTarget.dataset.url,
                    })

                }
            } else {
                this.showVoucherTips()
            }
        })
    },
    redirect(e) {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                if (e.currentTarget.dataset.url) {
                    if (e.currentTarget.dataset.url == '/pages/personalInfo/personalInfo') {
                        http("get", `/User/isComplete`).then(res => {
                            if (res.code === 0) {
                                var isComplete = res.data.isComplete
                                if (isComplete) {
                                    wx.navigateTo({
                                        url: '/pages/memberbenefits/memberbenefits'
                                    })
                                } else {
                                    wx.navigateTo({
                                        url: e.currentTarget.dataset.url,
                                    })
                                }
                            }
                        })
                    } else {
                        wx.navigateTo({
                            url: e.currentTarget.dataset.url + '?id=' + e.currentTarget.dataset.id,
                        })
                    }

                }
            } else {
                this.showVoucherTips()
            }
        })

    },
    switchTab(e) {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                if (e.currentTarget.dataset.url) {
                    if (e.currentTarget.dataset.url == '/pages/personalInfo/personalInfo') {
                        http("get", `/User/isComplete`).then(res => {
                            if (res.code === 0) {
                                var isComplete = res.data.isComplete
                                if (isComplete) {
                                    wx.navigateTo({
                                        url: '/pages/memberbenefits/memberbenefits'
                                    })
                                } else {
                                    wx.navigateTo({
                                        url: e.currentTarget.dataset.url,
                                    })
                                }
                            }
                        })
                    } else {

                        wx.switchTab({
                            url: e.currentTarget.dataset.url + '?id=' + e.currentTarget.dataset.id,
                        })
                    }

                }
            } else {
                this.showVoucherTips()
            }
        })

    },
    onReachBottom: function () {
        this.getGoodsList()
    },
    onShow() {
        // 获取当前小程序的页面栈  
        let pages = getCurrentPages();
        // 数组中索引最大的页面--当前页面  
        let currentPage = pages[pages.length - 1];
        // 打印出当前页面中的 options  
        const {options}=currentPage;
        this.getAppId(options);
        
    },
    //获取首页数据
    getIndexData(){
        this.setData({
            pageNum: 1,
            pageSize: 10,
            nextPage: true,
            currentPageIndex: 1,
            goodsList: []
        });
        this.getCarouselImage();
        this.getGoodsList();
        this.getHotCategory();
        this.getHotNotBrandCategory();
    },
    // 获取轮播图
    getCarouselImage() {
        const {
            appId
        } = this.data;
        http("get", '/CarouselImage/list/' + appId).then(res => {
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
    onShareAppMessage() {
        return {
            //分享的标题
            //缩略图
            //分享页面的路径
            path: "/pages/index/index",
        }
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
        //绑定成功后获取分享信息
        this.getShareInfo();
        if (scene != 'undefined') {
            this.setSuperior(scene);
        }
    },

    // 取消绑定手机号
    cancelBindPhone() {
        this.setData({
            controlAuthPhone: false
        })
    },

})