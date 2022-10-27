// pages/LiveAnchorDetail/LiveAnchorOrder/LiveAnchorOrder.js
import http from '../../utils/http';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nickName: '',
        phone: '',
        liveAnchorName: '',
        type: '',
        appointmentCity: '',
        appointmentDate: '',
        currentCity: '',
        cityModel: false,
        currentId: '',
        currentIds: '',
        cityList: [],
        display: false,
        cityList:[
            '杭州',
            '上海',
            '南京',
            '武汉',
            '北京'
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const {
            name,
            type
        } = options
        this.setData({
            liveAnchorName: name,
            type
        });
        this.getUserInfo();
        this.getLocationAuth();
        this.getCityList()
        this.getHotList()
    },
    selectDate() {
        this.setData({
            display: true
        });
    },
    onClose() {
        this.setData({
            display: false
        });
    },
    formatDate(date) {
        date = new Date(date);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    onConfirm(event) {
        this.setData({
            display: false,
            appointmentDate: this.formatDate(event.detail),
        });
    },
    getUserInfo() {
        http("get", "/User/info").then(res => {
            if (res.code === 0) {
                const {
                    phone,
                    nickName
                } = res.data.userInfo;
                this.setData({
                    phone: phone,
                    nickName: nickName
                })
            }
        });
    },
    // 获取合作过的城市列表
    getCityList() {
        http("get", `/CooperativeHospitalCity/provinceAndCityList`).then(res => {
            if (res.code === 0) {
                const {openCity}=this.data;
                const {
                    cityList
                    
                } = res.data
                for(var item in cityList){
                    if(item.city){}
                }
                var newCityList=[];
                for (let index = 0; index < cityList.length; index++) {
                    const element = cityList[index];
                    for (let index1 = 0; index1 < openCity.length; index1++) {
                        var city=openCity[index1];
                        var name=element.city.name;
                       
                        console.log(name==undefined);
                        if(name==undefined){
                            name='未知'
                        }
                        console.log("名称"+name);
                        if(name.indexOf(city)){
                            newCityList.push(element);
                        }                    
                    }
                }
                
                this.setData({
                    cityList: newCityList
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
    selectedCity(event) {
        console.log("选择");
        
        const{city}=event.currentTarget.dataset
        console.log(city);
        this.setData({
            appointmentCity:city,
            cityModel:false
        })
        
        // const {
        //     id,
        //     name
        // } = e.currentTarget.dataset.item
        // const {
        //     type
        // } = e.currentTarget.dataset
        // if (type == 1) {
        //     this.setData({
        //         currentId: id,
        //         appointmentCity: name,
        //         currentCity: name,
        //         cityModel: false
        //     })
        //     this.getHospitalList(this.data.currentCity)
        // } else {
        //     this.setData({
        //         currentIds: id,
        //         currentCity: name,
        //         appointmentCity: name,
        //         cityModel: false
        //     })
        //     //this.getHospitalList(this.data.currentCity)
        // }

    },
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
                const {cityList}=this.data
                const {
                    city
                } = res.data;
                for (let index1 = 0; index1 < cityList.length; index1++) {
                    var city1=cityList[index1];
                    console.log(city1);
                    console.log(city);
                    if(city.indexOf(city1)){
                        this.setData({
                            appointmentCity: city
                        });
                    }                    
                }
                
            }
        }).catch(err => {
            this.setData({
                currentCity: "获取定位失败"
            });
        })
    },
    handleNameChange(e) {
        const {
            detail
        } = e;
        this.setData({
            nickName: detail
        })
    },
    handlePhoneChange(e) {
        const {
            detail
        } = e;
        this.setData({
            phone: detail
        })
    },
    purchase() {
        const {
            nickName,
            phone,
            liveAnchorName,
            type,
            appointmentCity,
            appointmentDate
        } = this.data
        let token = wx.getStorageSync("token")
        if (!token) {
            wx.showToast({
                title: '请先登录',
                icon: 'none',
                duration: 2000
            })
        } else {
            if (!nickName) {
                wx.showToast({
                    title: '请输入姓名',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
            if (!phone) {
                wx.showToast({
                    title: '请输入手机号',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
            if (type == 'mf') {
                if (!appointmentCity) {
                    wx.showToast({
                        title: '请选择预约城市',
                        icon: 'none',
                        duration: 1000
                    })
                    return;
                }
                if (!appointmentDate) {
                    wx.showToast({
                        title: '请选择预约时间',
                        icon: 'none',
                        duration: 1000
                    })
                    return;
                }
            }
            if (!(/^1[34578]\d{9}$/.test(phone))) {
                wx.showToast({
                    title: '手机号错误,请重新输入',
                    icon: 'none',
                    duration: 1000
                })
                return;
            } else {
                let cardName = '啊美雅面诊卡'
                let thumbPicUrl = 'https://ameiya.oss-cn-hangzhou.aliyuncs.com/4b7148dcacb346c99a146804267f6e07.jpg';
                if (liveAnchorName == 'dd') {
                    cardName = cardName + '-刀刀'
                    thumbPicUrl = 'https://ameiya.oss-cn-hangzhou.aliyuncs.com/4b7148dcacb346c99a146804267f6e07.jpg';
                } else if (liveAnchorName == 'jn') {
                    cardName = cardName + '-吉娜'
                    thumbPicUrl = 'https://ameiya.oss-cn-hangzhou.aliyuncs.com/4b7148dcacb346c99a146804267f6e07.jpg';
                }
                
                if (type == 'mf') {
                    cardName = '定制美肤券'
                    if (liveAnchorName == 'dd') {
                        cardName = cardName + '-刀刀'
                        thumbPicUrl = 'https://ameiya.oss-cn-hangzhou.aliyuncs.com/1318bb0b9f6f43bb8f8f339f6e162443.jpg';
                    } else if (liveAnchorName == 'jn') {
                        cardName = cardName + '-吉娜'
                        thumbPicUrl = 'https://ameiya.oss-cn-hangzhou.aliyuncs.com/e4d4ceb4532346bfa246ba072d46c0aa.jpg';
                    }
                }
                

                let goodsInfo = {
                    thumbPicUrl: thumbPicUrl,
                    allmoney: 199,
                    cardName: cardName,
                    quantity: 1,
                    salePrice: 199,
                    id: '00000000',
                    name: cardName,
                    appointmentCity: '',
                    appointmentDate: ''
                };
                let allmoney = 199;
                if (type == 'mf') {
                    goodsInfo = {
                        thumbPicUrl: thumbPicUrl,
                         allmoney: 4999,                      
                        cardName: cardName,
                        quantity: 1,
                        salePrice: 4999,
                        id: '00000000',
                        name: cardName,
                        appointmentCity: appointmentCity,
                        appointmentDate: appointmentDate
                    };
                    allmoney = 4999;
                }
                wx.redirectTo({
                    url: '/pages/confirmOrder/confirmOrder?nickName=' + nickName + '&phone=' + phone + '&isCard=true&goodsInfo=' + encodeURIComponent(JSON.stringify([goodsInfo])) + '&cardName=' + cardName + '&thumbPicUrl='+thumbPicUrl+'&allmoney=' + allmoney,
                })
            }
        }
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})