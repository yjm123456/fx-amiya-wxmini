// pages/cooperativeinstitutions/cooperativeinstitutions.js
import http from '../../utils/http';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        cityModel: false,
        pageNum: 1,
        pageSizes: 10,
        nextPage: true,
        currentCity: "",
        controlAuthPhone: false,
        //医院列表
        hospitalList: [],
        //城市列表
        cityList: [],
        //热门城市列表
        hosCityList: [],
        sysheight:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //this.getLocation()
        //this.getCityList()
        //this.getHotList()
        wx.getSystemInfo({//获取设备屏幕真实高度
            success: (result) => {
              this.setData({
                sysheight:result.windowHeight
              })
            },
          })
    },
    // 根据所在城市获取医院列表
    getHospitalList(city) {
        const {
            pageNum,
            pageSizes,
            nextPage
        } = this.data
        let currCity = "";
        if (city) {
            currCity = city;
        }
        const data = {
            pageNum: pageNum,
            pageSize: pageSizes,
            city: currCity
        }
        if (!nextPage) return
        http("get", `/HospitalInfo/getListHospital`, data).then(res => {
            if (res.code === 0) {
                const {
                    list,
                    totalCount
                } = res.data.hospitalInfo;
                this.setData({
                    hospitalList: [...this.data.hospitalList, ...list]
                })
                this.data.pageNum++;
                if (this.data.hospitalList.length === totalCount) {
                    this.setData({
                        nextPage: false
                    })
                }

            }
        })
    },
    // 导航
    navAddress(e) {
        // const {
        //     latitude,
        //     longitude,
        //     address
        // } = e.currentTarget.dataset.item
        // wx.getLocation({
        //     type: 'wgs84',
        //     success: function (res) {
        //         wx.openLocation({
        //             latitude: latitude, // 纬度，范围为-90~90，负数表示南纬
        //             longitude: longitude, // 经度，范围为-180~180，负数表示西经
        //             scale: 8, // 缩放比例
        //             address: address,
        //         })
        //     }
        // })
    },
    // 切换城市
    switchCity() {
        this.setData({
            cityModel: true,
            currentId: "",
            currentIds: ""
        })
    },
    onCancel() {
        this.setData({
            cityModel: false,
        })
    },
    // 获取合作过的城市列表
    getCityList() {
        http("get", `/CooperativeHospitalCity/provinceAndCityList`).then(res => {
            if (res.code === 0) {
                const {
                    cityList
                } = res.data
                this.setData({
                    cityList: cityList
                })
            }
        })
    },
    // 获取热门城市
    getHotList() {
        http("get", `/CooperativeHospitalCity/hotCity`).then(res => {
            if (res.code === 0) {
                const {
                    cityList
                } = res.data
                this.setData({
                    hosCityList: cityList
                })
            }
        })
    },
    selectedCity(e) {

        const {
            id,
            name
        } = e.currentTarget.dataset.item
        const {
            type
        } = e.currentTarget.dataset
        this.setData({
            nextPage:true,
            pageNum:1,
            pageSizes:10,
            hospitalList:[]
        });
        if (type == 1) {
            this.setData({
                currentId: id,
                currentCity: name,
                cityModel: false
            })
            console.log(this.data.currentCity)
            this.getHospitalList(this.data.currentCity)
        } else {
            this.setData({
                currentIds: id,
                currentCity: name,
                cityModel: false
            })
            this.getHospitalList(this.data.currentCity)
        }

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
                } else {
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
                const {
                    city
                } = res.data;
                this.getHospitalList(city)
                this.setData({
                    currentCity: city
                });
                wx.setStorageSync('currentCity', city)
            }
        }).catch(err => {
            this.setData({
                currentCity: "获取定位失败"
            });
        })
    },
    // 到店计划
    arrivalPlan(e) {
        const {
            item
        } = e.currentTarget.dataset
        http("get", `/User/iscustomer`).then(res => {
            if (res.code === 0) {
                const {
                    isCustomer
                } = res.data
                if (isCustomer == true) {
                    wx.navigateTo({
                        url: '/pages/arrivalPlan/arrivalPlan?item=' + JSON.stringify(item),
                    })
                } else {
                    this.handleBindPhone();
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
        this.getHospitalList(this.data.currentCity);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})