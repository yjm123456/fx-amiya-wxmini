// pages/appointmentHospital/appointment/appointment.js
import http from '../../../utils/http';
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },
    options: {
        addGlobalClass: true
      },
    /**
     * 组件的初始数据
     */
    data: {
        cityModel: false,
        currentId: "",
        currentIds: "",
        currentCity:"",
        pageNums:1,
        pageSizes:10,
        hospitalList:[],
        hosCityList:[],
        cityList:[],
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 授权位置
        getLocationAuth() {
            this.getCityList();
            this.getHotList();
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
            wx.getLocation({
                type: 'wgs84',
                success: (res) => {
                    const longitude = res.longitude
                    const latitude = res.latitude
                    this.loadCity(longitude, latitude)
                },
                fail: (err) => {},
            })
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
        getHospitalList(city) {
            const {
                pageNums,
                pageSizes,
                currentCity
            } = this.data
            const data = {
                pageNum: pageNums,
                pageSize: pageSizes,
                city
            }
            http("get", `/HospitalInfo/getListHospital`, data).then(res => {
                if (res.code === 0) {
                    const {
                        list
                    } = res.data.hospitalInfo;
                    this.setData({
                        hospitalList: list
                    })
                }
            })
        },
        // 导航
        navAddress(e) {
            const {
                latitude,
                longitude,
                address
            } = e.currentTarget.dataset.item
            wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                    wx.openLocation({
                        latitude: latitude, // 纬度，范围为-90~90，负数表示南纬
                        longitude: longitude, // 经度，范围为-180~180，负数表示西经
                        scale: 8, // 缩放比例
                        address: address,
                    })
                }
            })
        },
        // 切换城市
        switchCity() {
            this.setData({
                cityModel: true,
                currentId: "",
                currentIds: ""
            })
        },
        //关闭城市卡片
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
            if (type == 1) {
                this.setData({
                    currentId: id,
                    currentCity: name,
                    cityModel: false
                })
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
    }
})