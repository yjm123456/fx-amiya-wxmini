import { iscustomer } from "../../api/user";
import { checkUserTokenInfo } from "../../utils/login";
import http from '../../utils/http';

Page({
  data: {
    // 轮播图
    carouselImage: [],

    // 授权
    controlAuth: false,

    // 授权手机号
    controlAuthPhone: false,

    // 客户已购买项目
    itemInfoList: [],

    // 当前地址
    currentCity: '',

    isCustomer: false
  },

  onLoad(e) {
    this.getCarouselImage();
  },

  onShow() {
    this.init();
    this.getLocationAuth();
  },

  init() {
    checkUserTokenInfo().then(res => {
      this.isCustomer();
    })
  },

  isCustomer() {
    iscustomer().then(res => {
      if (res.code === 0) {
        const { isCustomer } = res.data;
        this.setData({
          isCustomer
        })
        this.getCustomerAlreadyPurchaseProject();
      }
    })
  },

  // 选择地区
  handleSelectCity() {
    const { currentCity } = this.data;
    wx.navigateTo({
      url: currentCity ? `/pages/city/city?city=${currentCity}` : '/pages/city/city',
    })
  },

  // 获取轮播图数据
  getCarouselImage() {
    http("get", `/CarouselImage/list`).then(res => {
      if (res.code === 0) {
        const { carouselImage } = res.data;
        this.setData({
          carouselImage
        })
      }
    })
  },

  // 点击项目核销机构
  handleReserveHospital(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/projectReserveHospital/projectReserveHospital?id=${id}&city=${this.data.currentCity}`,
    })
  },

  // 获取已购买的项目列表
  getCustomerAlreadyPurchaseProject() {
    http("get",`/ItemInfo/canWriteOffOrders`).then(res => {
      if (res.code === 0) {
        const { itemInfoList } = res.data;
        if (itemInfoList.length) {
          this.setData({
            itemInfoList
          })
        }
      }
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
    this.isCustomer();
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

  // 授权位置
  getLocationAuth() {
    let ths = this;
    if (this.data.currentCity) return;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          // 请求用户权限:获取定位信息
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              ths.getLocation();
            },
            fail() {
              wx.showModal({
                content: '检测到您未打开地理位置权限，是否前往开启',
                cancelText: "手动定位",
                confirmText: "前往开启",
                success: (res) => {
                  if (res.cancel) {
                    //点击取消,默认隐藏弹框
                    wx.navigateTo({
                      url: '/pages/city/city'
                    })
                  } else {
                    //点击确定
                    wx.openSetting({
                      success: res => {
                        ths.getLocation()
                      }
                    })
                  }
                }
              })
            }
          })
        }
        else {
          ths.getLocation();
        }
      }
    });
  },

  // 获取经纬度
  getLocation() {
    // wx.getPrivacySetting({
    //     success: res => {
    //       if (res.needAuthorization) {
    //         // 需要弹出隐私协议
    //         this.setData({
    //           showPrivacy: true
    //         })
    //       } else {
    //         wx.getLocation({
    //             type: 'wgs84',
    //             success: (res) => {
    //                 const longitude = res.longitude
    //                 const latitude = res.latitude
    //                 this.loadCity(longitude, latitude)
    //             },
    //             fail: (err) => {},
    //         })
    //       }
    //     },
    //     fail: () => {},
    //     complete: () => {}
    //   })
    },
  

  // 获取地区信息
  loadCity(longitude, latitude) {
    const data = {
      longitude,
      latitude
    }
    http("get", `/Location/city`, data).then(res => {
      if (res.code === 0) {
        const { city } = res.data;
        this.setData({ currentCity: city });
        wx.setStorageSync('currentCity', city)
      }
    }).catch(err => {
      this.setData({ currentCity: "获取定位失败" });
    })
  },

  

  onHide() {
    this.setData({
      controlAuth: false,
      controlAuthPhone: false
    })
  }
})

