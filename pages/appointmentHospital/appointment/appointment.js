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
        currentCity: "",
        pageNums: 1,
        pageSizes: 10,
        hospitalList: [],
        hosCityList: [],
        cityList: [],
        area: [],
        province: '',
        city: '',
        district: '',
        selectedCity: false,
        currentDate: '',
        projectModel: false,
        AmiyaGoodsDemandList: '',
        currentId: '',
        itemInfoName: '',
        max_seconds: 60,
        send: true,
        seconds: 0,
        name: '',
        phone: '',
        code: '',
        Merchlist: [], // 展示的数据数组
        Merchlist1: [], // 后台返回的数据数组
        hospital: '',
        currentDate: '',
        time: '',
        week: '',
        address: '',
        merch_id:''
    },
    ready() {
        this.getProject(),
            this.getMerchList()
    },
    /**
     * 组件的方法列表
     */
    methods: {
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
        handlerHospitalChange(e) {
            this.setData({
                hospital: e.detail.value
            })
        },
        appointmentChange(e) {
            this.setData({
                currentDate: e.detail.currentDate,
                time: e.detail.time,
                week: e.detail.week
            })
        },
        getMerchList() {
            http("get", `/hospitalInfo/hospitalNameList`).then(res => {
                if (res.code === 0) {
                    this.setData({
                        Merchlist: res.data.hospitalInfo.map((item) => {
                            return {
                                id: item.id,
                                name: item.name
                            }
                        }),
                        Merchlist1: res.data.hospitalInfo.map((item) => {
                            return {
                                id: item.id,
                                name: item.name
                            }
                        }),
                    })
                }
            })
        },
        bindPickerBuyersName(e) {

            let i = e.detail.value; // 下拉选中的值的索引
            let name = this.data.Merchlist[i].name; //展示数组的索引中的需要展示的内容的字段
            let id = this.data.Merchlist[i].id; // 这是该字段实际要传给后端的id
            // 下拉后需要将返回数据赋值给展示数据，否则下一次弹出下拉框不会展示全部数据
            this.setData({
                hospital: name,
                merch_id: id,
                goods_name: '请选择',
                Merchlist: this.data.Merchlist1
            })
        },
        handleNameChange(e) {
            this.setData({
                name: e.detail.value
            })
        },
        handlePhoneChange(e) {
            this.setData({
                phone: e.detail.value
            })
        },
        handleCodeChange(e) {
            console.log('触发默认行为');
            this.setData({
                code: e.detail.value
            })
        },
        handleAddress(e) {
            this.setData({
                address: e.detail.value
            })
        },
        // 发送验证码
        sendCode() {
            console.log('点击发送验证码');
            const {
                phone
            } = this.data
            if (phone) {
                wx.showToast({
                    title: '请输入手机号',
                    icon: 'none',
                    duration: 1500
                })
            }
            if (phone) {
                http("POST", `/ValidateCode/send/${phone}`).then(res => {
                    setTimeout(() => {
                        wx.showToast({
                            title: '发送成功',
                            icon: 'none',
                            duration: 2000
                        })
                        var that = this;
                        // 获取总秒数
                        var seconds = this.data.max_seconds;
                        this.setData({
                            // 显示倒计时
                            send: false,
                            // 设置秒数
                            seconds: seconds,
                        })
                        // 设置定时器
                        var t = setInterval(function () {
                            // 如果秒数小于0
                            if (seconds <= 0) {
                                // 停止定时器
                                clearInterval(t);
                                that.setData({
                                    // 显示发送按钮
                                    send: true,
                                })
                                // 停止执行
                                return;
                            }
                            // 秒数减一
                            seconds--;
                            that.setData({
                                // 更新当前秒数
                                seconds: seconds,
                            })
                        }, 1000)
                    }, 1000)
                })

            } else {
                wx.showToast({
                    title: '请先输入手机号',
                    icon: 'none',
                    duration: 2000
                })
            }
        },
        // 选择项目
        selectProject() {
            this.setData({
                projectModel: true,
            })
        },
        getProject() {
            http("get", `/GoodsDemand/getAmiyaHospitalDepartmentAndGoodsDemandList`).then(res => {
                if (res.code === 0) {
                    const {
                        AmiyaHospitalDepartmentList
                    } = res.data
                    this.setData({
                        AmiyaGoodsDemandList: AmiyaHospitalDepartmentList
                    })
                }
            })
        },
        onCancel() {
            this.setData({
                projectModel: false,
            })
        },
        // 实现选项目
        selected(e) {
            const {
                id,
                projectName
            } = e.currentTarget.dataset.item
            this.setData({
                currentId: id,
                itemInfoName: projectName,
                projectModel: false,
            })
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
            http("get", `/Location/provinceCityAndDistrict`, data).then(res => {
                if (res.code === 0) {
                    const {
                        provice,
                        city,
                        district
                    } = res.data.city;
                    this.setData({
                        province: provice,
                        city: city,
                        district: district
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
        bindAreaChange: function (e) {
            const area = e.detail.value
            this.setData({
                area: area,
                province: area[0],
                city: area[1],
                district: area[2],
                selectedCity: true
            })
        },
        // 组件监听日期选择
        select(e) {
            const {
                detail
            } = e;
            this.setData({
                currentDate: detail
            })
        },
        submit() {
            const {
                currentDate,
                week,
                time,
                phone,
                name,
                hospital,
                province,
                city,
                district,
                itemInfoName,
                address,
                code,
                merch_id
            } = this.data;
            let appointArea=province+"-"+city+"-"+district;
            if (!itemInfoName) {
                wx.showToast({
                    title: '请选择项目',
                    icon: 'none',
                    duration: 2000
                })
                return
            }
            if (!name) {
                wx.showToast({
                    title: '请输入姓名',
                    icon: 'none',
                    duration: 2000
                })
                return
            }
            if (!phone) {
                wx.showToast({
                    title: '请输入手机号',
                    icon: 'none',
                    duration: 2000
                })
                return
            } else {
                if (!(/^1[3456789]\d{9}$/.test(phone))) {
                    wx.showToast({
                        title: '手机号码有误',
                        duration: 2000,
                        icon: 'none'
                    });
                    return
                }
            }
            if (!code) {
                wx.showToast({
                    title: '请输入验证码',
                    icon: 'none',
                    duration: 2000
                })
                return
            }
            if(!merch_id){
                wx.showToast({
                    title: '请选择预约医院!',
                    icon: 'none',
                    duration: 2000
                })
                return
            }
            const data = {
                week,
                appointmentDate:currentDate,
                time,
                hospitalId:merch_id,
                appointArea,
                customerName:name,
                phone,
                remark: "",
                itemInfoName,
                code,
                address
            }
            this.isValidate(data)
        },
        // 判断验证码是否有效
        isValidate(e) {
            const isphone = {
                phone: e.phone,
                code: e.code
            }
            const data = {
                phone: e.phone,
                appointmentDate: e.appointmentDate,
                hospitalId: e.hospitalId,
                appointArea: e.appointArea,
                itemInfoName: e.itemInfoName,
                remark: e.remark,
                time: e.time,
                week: e.week,
                customerName: e.customerName,
                address:e.address
            }
            http("get", `/ValidateCode/validate`, isphone).then(res => {
                if (res.code === 0) {
                    //     wx.showToast({ title: '发送成功', icon: 'none', duration: 2000 })
                    http("POST", `/Appointment/add`, data).then(res => {
                        if (res.code === 0) {
                            setTimeout(() => {
                                wx.showToast({
                                    title: '提交成功，请耐心等待工作人员审核',
                                    icon: 'none',
                                    duration: 2000
                                })
                            }, 1000)
                            setTimeout(() => {
                                wx.navigateTo({
                                    url: '/pages/appointmentHospital/appointmentHospital?active=1',
                                })
                            }, 2000)
                        }
                    })
                } else {
                    // wx.showToast({ title: '', icon: 'none', duration: 2000 })
                }
            })
        },

    }
})