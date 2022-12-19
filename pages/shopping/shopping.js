import http from '../../utils/http.js';
import { checkUserTokenInfo } from "../../utils/login";
import { iscustomer, isAuthorizationUserInfo } from "./../../api/user";
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
    //积分
    balance:0,
    controlAuthPhone:false
  },
  onLoad(){
        this.isCustomer((isCustomer) => {
            if (isCustomer) {

            } else {
              this.handleBindPhone();
            }
          })
        this.getIntegral();
      

  },
  toInternal(){
      console.log("调用");
      wx.navigateTo({
        url: '/pages/integral/integral',
      })
  },
  // 取消绑定手机号
  cancelBindPhone() {
    this.setData({
      controlAuthPhone: false
    }),
    //取消绑定直接调转到首页
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  // 绑定手机号
  handleBindPhone() {
    this.setData({
      controlAuthPhone: true
    })
  },
  onShow() {
      this.getIntegral();
     this.refresh();
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
  // 判断是否需要授权微信用户信息
  isAuthorizationUserInfo() {
    isAuthorizationUserInfo().then(res => {
      if (res.code === 0) {
        const { userInfo } = res.data
        const { isAuthorizationUserInfo } = userInfo;
        if (isAuthorizationUserInfo) {
          this.setData({
            controlAuth: true,
          })
        } else {
          getApp().globalData.userInfo = userInfo;
          this.setData({
            userInfo: userInfo
          })
        }
      }
    })
  },
  // 获取客户的积分余额   get
getIntegral() {
    http("get", `/IntegrationAccount/balance`).then(res => {
      if (res.code === 0) {
        const { balance } = res.data;
        this.setData({
          balance
        })
      }
    })
  },
  handleRuleTap(){
      wx.navigateTo({
        url: '/pages/IntegralRule/IntegralRule',
      })
  },
  handleToShop(){
      wx.switchTab({
        url: '/pages/shoppingMall/shoppingMall',
      })
  }
  ,
  refresh() {
    this.setData({
      pageNum: 1,
      goodsInfos: [],
      nextPage: true
    })
    this.getGoodsCategory();
  },

  // 获取商品分类
  getGoodsCategory() {
    http("get", `/Goods/categoryList?showDirectionType=0`).then(res => {
      if (res.code === 0) {
        const { goodsCategorys } = res.data;
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
    const { categoryid, index } = e.currentTarget.dataset;
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
    const { categoryId, keyword, pageNum, pageSize } = this.data;
    const data = {
      categoryId, keyword, pageNum, pageSize
    }
    http("get", `/Goods/infoList`, data).then(res => {
      if (res.code === 0) {
        let { list, totalCount } = res.data.goodsInfos;
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
    const { value } = e.detail;
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
  onReachBottom: function () {
  this.getGoodsInfo();
},
  // 上拉加载
//   loadMore() {
//     if (this.data.nextPage) {
//       if (this.data.isScrolling === true) return;
//       this.data.isScrolling = true;
//       this.getGoodsInfo(() => {
//         this.data.isScrolling = false;
//       });
//     }
//   },

  // 商品详情
  goodsDetails(e) {
    const { goodsid } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/goodsDetails/goodsDetails?goodsId=${goodsid}`
    })
  },
})

