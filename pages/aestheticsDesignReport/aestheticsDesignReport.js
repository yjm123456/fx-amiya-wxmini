// pages/aestheticsDesignReport/aestheticsDesignReport.js
import http from './../../utils/http';
import {
    iscustomer
} from "./../../api/user";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        reportId: '',
        status: '',
        name: '',
        birthDay: '',
        phone: '',
        city: '',
        simpleCity: '',
        hasAestheticMedicineHistory: '',
        historyDescribe1: '',
        historyDescribe2: '',
        historyDescribe3: '',
        whetherAcceptOperation: '',
        whetherAllergyOrOtherDisease: '',
        allergyOrOtherDiseaseDescribe: '',
        beautyDemand: '',
        budget: '',
        frontPicture: '',
        frontPictureList: '',
        sidePicture: '',
        sidePictureList: '',
        design: '',
        pictures: [],
        // 授权手机号
        controlAuthPhone: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const {
            reportId,
            status
        } = options;
        this.setData({
            status
        })
        if (reportId) {
            this.setData({
                reportId
            });
            this.GetReport(reportId);
        } else {
            this.isCustomer((isCustomer) => {
                if (isCustomer) {
                    this.GetUserInfo();
                } 
            })
            
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

    handleNameChange(e) {
        this.setData({
            name: e.detail.value
        })
    },
    handleAgeChange(e) {
        this.setData({
            birthDay: e.detail.value
        })
    },
    handlePhoneChange(e) {
        this.setData({
            phone: e.detail.value
        })
    },
    handleCityChange(e) {
        this.setData({
            city: e.detail.value.join('-'),
            simpleCity: e.detail.value[1]
        })
    },
    onHistoryChange(e) {
        let hasAestheticMedicineHistory = (e.detail == 1 ? true : false)
        this.setData({
            hasAestheticMedicineHistory
        })
        if (!hasAestheticMedicineHistory) {
            this.setData({
                historyDescribe1: '',
                historyDescribe2: '',
                historyDescribe3: ''
            })
        }
    },
    handleMinimallyInvasive(e) {
        this.setData({
            historyDescribe1: e.detail.value
        })
    },
    handlePlastic(e) {
        this.setData({
            historyDescribe2: e.detail.value
        })
    },
    handleSkin(e) {
        this.setData({
            historyDescribe3: e.detail.value
        })
    },
    onOperationChange(e) {
        this.setData({
            whetherAcceptOperation: e.detail == 1 ? true : false
        })
    },
    onAllergyOrOtherDiseaseChange(e) {
        let whetherAllergyOrOtherDisease = (e.detail == 1 ? true : false);
        this.setData({
            whetherAllergyOrOtherDisease
        })
        if (!whetherAllergyOrOtherDisease) {
            this.setData({
                allergyOrOtherDiseaseDescribe: ''
            })
        }
    },
    handleAllergyOrOtherDisease(e) {
        this.setData({
            allergyOrOtherDiseaseDescribe: e.detail.value
        })
    },
    handleDemand(e) {
        this.setData({
            beautyDemand: e.detail.value
        })
    },
    handleBudget(e) {
        this.setData({
            budget: e.detail.value
        })
    },
    afterfrontPictureRead(event) {
        var self = this;
        const {
            file
        } = event.detail;
        wx.uploadFile({
            url: 'https://app.ameiyes.com/fxopenoss/aliyunoss/uploadone',
            filePath: file.path,
            name: 'uploadfile',
            success(res) {
                const img = {
                    url: file.path,
                    deletable: true
                }
                self.setData({
                    frontPictureList: [img]
                })
                var url = JSON.parse(res.data).data.url
                self.setData({
                    frontPicture: url
                });
            },
            fail(res) {
                wx.showToast({
                    title: '上传失败,请稍后重试!',
                    icon: 'none',
                    duration: 1000,
                    success() {
                        self.setData({
                            frontPictureList: [],
                            frontPicture: ''
                        })
                    }
                })
            }
        });
    },
    deleteFrontPicture() {
        this.setData({
            frontPictureList: [],
            frontPicture: ''
        })
    },
    afterSidePictureRead(event) {
        var self = this;
        const {
            file
        } = event.detail;
        wx.uploadFile({
            url: 'https://app.ameiyes.com/fxopenoss/aliyunoss/uploadone',
            filePath: file.path,
            name: 'uploadfile',
            success(res) {
                const img = {
                    url: file.path,
                    deletable: true
                }
                self.setData({
                    sidePictureList: [img]
                })
                var url = JSON.parse(res.data).data.url
                self.setData({
                    sidePicture: url
                });
            },
            fail(res) {
                wx.showToast({
                    title: '上传失败,请稍后重试!',
                    icon: 'none',
                    duration: 1000,
                    success() {
                        self.setData({
                            sidePictureList: [],
                            sidePicture: ''
                        })
                    }
                })
            }
        });
    },
    deleteSidePicture() {
        this.setData({
            sidePictureList: [],
            sidePicture: ''
        })
    },
    // 预览图片
    previewImage(e) {
        var current = e.currentTarget.dataset.src;
        wx.previewImage({
            current: current, // 当前显示图片的http链接
            urls: this.data.pictures, // 需要预览的图片http链接列表
        })
    },
    AddReport() {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                this.AddReport2();
            } else {
                this.handleBindPhone();
            }
        })
    },
    // 添加美学设计报告
    AddReport2() {
        let {
            name,
            birthDay,
            phone,
            city,
            hasAestheticMedicineHistory,
            historyDescribe1,
            historyDescribe2,
            historyDescribe3,
            whetherAcceptOperation,
            whetherAllergyOrOtherDisease,
            allergyOrOtherDiseaseDescribe,
            beautyDemand,
            budget,
            frontPicture,
            sidePicture,
        } = this.data;
        if (!name) {
            wx.showToast({
                title: '请输入姓名',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        if (!birthDay) {
            wx.showToast({
                title: '请输入生日',
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
        if (!(/^1[3456789]\d{9}$/.test(phone))) {
            wx.showToast({
                title: '手机号格式错误',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        if (!city) {
            wx.showToast({
                title: '请输入城市',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        if (!hasAestheticMedicineHistory) {
            if (hasAestheticMedicineHistory == false) {
                historyDescribe1 = '';
                historyDescribe2 = '';
                historyDescribe3 = '';
            } else {
                wx.showToast({
                    title: '请选择是否做过医美项目!',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
        }
        if (hasAestheticMedicineHistory == true) {
            if (!historyDescribe1) {
                wx.showToast({
                    title: '请输入微创调整过的部位以及所有材料!',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
            if (!historyDescribe2) {
                wx.showToast({
                    title: '请输入整形调整的部位!',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
            if (!historyDescribe3) {
                wx.showToast({
                    title: '请输入皮肤做过的仪器或项目!',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
        }
        if (whetherAcceptOperation != false && whetherAcceptOperation != true) {
            wx.showToast({
                title: '请选择是否接受手术!',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        if (whetherAllergyOrOtherDisease != true && whetherAllergyOrOtherDisease != false) {
            wx.showToast({
                title: '请选择是否有药物过敏史或其他疾病!',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        if (whetherAllergyOrOtherDisease) {
            if (!allergyOrOtherDiseaseDescribe) {
                wx.showToast({
                    title: '请填写过敏史或其他疾病详情!',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
        } else {
            allergyOrOtherDiseaseDescribe = ''
        }
        if (!beautyDemand) {
            wx.showToast({
                title: '请填写变美需求!',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        if (!budget) {
            wx.showToast({
                title: '请填写预算!',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        if (!sidePicture) {
            wx.showToast({
                title: '请上传侧面图片!',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        if (!frontPicture) {
            wx.showToast({
                title: '请上传正面图片!',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        const data = {
            name,
            birthDay,
            phone,
            city,
            hasAestheticMedicineHistory,
            historyDescribe1,
            historyDescribe2,
            historyDescribe3,
            whetherAcceptOperation,
            whetherAllergyOrOtherDisease,
            allergyOrOtherDiseaseDescribe,
            beautyDemand,
            budget,
            frontPicture,
            sidePicture
        }
        http('post', '/aestheticsDesignReport/add', data).then(res => {
            if (res.code == 0) {
                wx.showToast({
                    title: '您的美学设计信息已提交，请耐心等待啊美雅管家为您提供专属的设计报告!',
                    icon: 'none',
                    duration: 1000
                })
                var app = getApp();
                const tmplIds = app.globalData.designTmpId;
                wx.requestSubscribeMessage({
                    tmplIds: tmplIds,
                    success: res => {
                        tmplIds.forEach(item => {
                            if (res[item] === 'reject') {
                                wx.showToast({
                                    title: '此次操作会导致您接收不到通知',
                                    icon: 'none',
                                    duration: 2000,
                                })
                            }
                        })
                        setTimeout(() => wx.redirectTo({
                            url: '/pages/aestheticsDesignReportList/aestheticsDesignReportList',
                        }), 1000);
                    },
                    fail: err => {
                        setTimeout(() => wx.redirectTo({
                            url: '/pages/aestheticsDesignReportList/aestheticsDesignReportList',
                        }), 1000);
                    },
                })

            }
        })
    },
    GetUserInfo() {
        http('get', '/user/birthDayCard').then(res => {
            if (res.code == 0) {
                let {
                    name,
                    phone,
                    birthDay,
                    province,
                    city,
                    area
                } = res.data.birthDay
                birthDay = res.data.birthDay.birthDay.split('T')[0];
                this.setData({
                    name: name,
                    birthDay: birthDay,
                    phone: phone,
                    city: province + '-' + city + '-' + area,
                    simpleCity: city
                })
            }
        });
    },
    GetReport(reportId) {
        http('get', '/AestheticsDesignReport/getByid/' + reportId).then(
            res => {
                if (res.code == 0) {
                    const {
                        status
                    } = this.data;
                    const {
                        info,
                    } = res.data;
                    this.setData({
                        name: info.name,
                        birthDay: info.birthDay.split('T')[0],
                        phone: info.phone,
                        simpleCity: info.city.split('-')[1],
                        city: info.city,
                        hasAestheticMedicineHistory: info.hasAestheticMedicineHistory,
                        historyDescribe1: info.historyDescribe1,
                        historyDescribe2: info.historyDescribe2,
                        historyDescribe3: info.historyDescribe3,
                        whetherAcceptOperation: info.whetherAcceptOperation,
                        whetherAllergyOrOtherDisease: info.whetherAllergyOrOtherDisease,
                        allergyOrOtherDiseaseDescribe: info.allergyOrOtherDiseaseDescribe,
                        beautyDemand: info.beautyDemand,
                        budget: info.budget,
                        frontPicture: info.frontPicture,
                        frontPictureList: [{
                            url: info.frontPicture,
                            deletable: true
                        }],
                        sidePicture: info.sidePicture,
                        sidePictureList: [{
                            url: info.sidePicture,
                            deletable: true
                        }],
                        design: info.design,
                    })
                    if (status == 'design') {
                        this.setData({
                            pictures: [info.design.frontPicture, info.design.sidePicture]
                        })
                    }
                }

            });
    },
    updateReport() {
        let {
            reportId,
            name,
            birthDay,
            phone,
            city,
            hasAestheticMedicineHistory,
            historyDescribe1,
            historyDescribe2,
            historyDescribe3,
            whetherAcceptOperation,
            whetherAllergyOrOtherDisease,
            allergyOrOtherDiseaseDescribe,
            beautyDemand,
            budget,
            frontPicture,
            sidePicture,
        } = this.data;
        if (!name) {
            wx.showToast({
                title: '请输入姓名',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        if (!birthDay) {
            wx.showToast({
                title: '请输入生日',
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
        if (!(/^1[3456789]\d{9}$/.test(phone))) {
            wx.showToast({
                title: '手机号格式错误',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        if (!city) {
            wx.showToast({
                title: '请输入城市',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        if (!hasAestheticMedicineHistory) {
            if (hasAestheticMedicineHistory == false) {} else {
                wx.showToast({
                    title: '请选择是否做过医美项目!',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
        }
        if (hasAestheticMedicineHistory == true) {
            if (!historyDescribe1) {
                wx.showToast({
                    title: '请输入微创调整过的部位以及所有材料!',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
            if (!historyDescribe2) {
                wx.showToast({
                    title: '请输入整形调整的部位!',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
            if (!historyDescribe3) {
                wx.showToast({
                    title: '请输入皮肤做过的仪器或项目!',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
        }
        if (whetherAcceptOperation != false && whetherAcceptOperation != true) {
            wx.showToast({
                title: '请选择是否接受手术!',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        if (whetherAllergyOrOtherDisease != true && whetherAllergyOrOtherDisease != false) {
            wx.showToast({
                title: '请选择是否有药物过敏史或其他疾病!',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        if (whetherAllergyOrOtherDisease) {
            if (!allergyOrOtherDiseaseDescribe) {
                wx.showToast({
                    title: '请填写过敏史或其他疾病详情!',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
        }
        if (!beautyDemand) {
            wx.showToast({
                title: '请填写变美需求!',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        if (!budget) {
            wx.showToast({
                title: '请填写预算!',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        if (!sidePicture) {
            wx.showToast({
                title: '请上传侧面图片!',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        if (!frontPicture) {
            wx.showToast({
                title: '请上传正面图片!',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        const data = {
            id: reportId,
            name,
            birthDay,
            phone,
            city,
            hasAestheticMedicineHistory,
            historyDescribe1,
            historyDescribe2,
            historyDescribe3,
            whetherAcceptOperation,
            whetherAllergyOrOtherDisease,
            allergyOrOtherDiseaseDescribe,
            beautyDemand,
            budget,
            frontPicture,
            sidePicture
        }
        http('put', '/AestheticsDesignReport', data).then(res => {
            if (res.code == 0) {
                wx.showToast({
                    title: '修改成功!',
                    icon: 'none',
                    duration: 1000
                })
            }
        })
    },
    ToPageLocation() {
        wx.pageScrollTo({
            selector: '#designblock', // 写法同css选择器
            success: data => {

            },
            fail: data => {

            }
        });
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