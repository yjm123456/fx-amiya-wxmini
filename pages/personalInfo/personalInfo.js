// pages/personalInfo/personalInfo.js
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
        userInfo: {},
        isEdit: false,
        isEditBirth: false,
        showBirthPicker: false,
        date: "",
        area: [],
        province: '',
        city: '',
        gender: "1",
        genderList: ['男', '女'],
        isEditArea: false,
        isEditGender: false,
        timeNow: new Date(),
        //昵称
        nickName: '',
        //姓名
        Name:'',
        //个性签名
        personalSignature:'',
        show: false,
        newNickName:'',
        userAvatar:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var myDate = new Date();
        var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
        var month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
        if (month < 10) {
            month = '0' + month
        }
        var day = myDate.getDate();
        if (day < 10) {
            day = '0' + day
        }
        console.log(year + '-' + month + '-' + day)
        this.setData({
            timeNow: year + '-' + month + '-' + day
        })
        this.getUserInfo();
    },
    //编辑昵称
    onNickNameChange(event){
        var nickName=event.detail;
        this.setData({
            nickName
        });
    },
    onNameChange(event){
        var Name=event.detail;
        this.setData({
            Name
        });
    },
    onPersonalSignatureChange(event){
        var personalSignature=event.detail;
        this.setData({
            personalSignature
        });
    },
    onGenderChange(event){
        this.setData({
            gender: event.detail,
          });
    },
    delete(event) {
        this.setData({
          fileList: [],
          userAvatar: ""
        });
      },
      afterRead(event) {
        const {
          file
        } = event.detail;
        self = this;
        var list = [];
        list.push({
          url: file.path,
          deletable: true
        });
        this.setData({
          fileList: list
        });
        // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
        wx.uploadFile({
          url: 'https://app.ameiyes.com/fxopenoss/aliyunoss/uploadone', // 仅为示例，非真实的接口地址
          filePath: file.path,
          name: 'uploadfile',
          success(res) {
            var url = JSON.parse(res.data).data.url
            self.setData({
              userAvatar: url
            });
          },
        });
      },
    saveInfo() {
        let {
            gender,
            //生日
            date,
            province,
            city,
            //昵称
            nickName,
            //真实姓名
            Name,
            //头像
            userAvatar,
            personalSignature,
            area1
        } = this.data
        if(!userAvatar){
            wx.showToast({
              title: '请选择头像',
              icon:'none',
              duration:1000
            })
            return;
        }
        if(!nickName){
            wx.showToast({
              title: '请输入昵称',
              icon:'none',
              duration:1000
            })
            return;
        }
        if(!Name){
            wx.showToast({
              title: '请输入姓名',
              icon:'none',
              duration:1000
            })
            return;
        }
        if(!date){
            wx.showToast({
              title: '请输入生日',
              icon:'none',
              duration:1000
            })
            return;
        }
        const data = {
            userAvatar,
            gender,
            date,
            province,
            city,
            area:area1,
            nickName,
            name:Name,
            personalSignature
        }
        http("put", "/User/userEditInfo", data).then((res) => {
            if (res.code === 0) {
                wx.showToast({
                    title: '修改成功',
                    icon: 'none',
                    duration: 1000
                })
                this.save();
                this.getUserInfo();
            }

        });
        this.setData({
            userAvatr:"",
            fileList:[]
        });
    },
    showBirthPicker() {
        this.setData({
            showBirthPicker: true
        })
    },
    onClose() {
        this.setData({
            show: false
        })
    },
    edit() {
        this.setData({
            isEdit: true
        })
    },
    save() {
        this.setData({
            isEdit: false,
            date: '',
            isEditBirth: false,
            isEditArea: false,
            isEditGender: false,
            isEditNickName:false,
            area: [],
            province: '',
            city: '',
            gender: '',
            nickName:''
        })
    },
    bindChange: function (e) {
        this.setData({
            date: e.detail.value,
        })
    },
    bindAreaChange: function (e) {
        const area = e.detail.value
        this.setData({
            area: area,
            isEditArea: true,
            province: area[0],
            city: area[1],
            area1:area[2]
        })
    },
    chooseGender() {
        this.setData({
            isEditGender: true
        })
        wx.showActionSheet({
            itemList: this.data.genderList,
            success: (res) => {
                this.setData({
                    gender: res.tapIndex === 0 ? 1 : 2
                })
            },
            fail: (res) => {
                if (this.data.gender === '') {
                    this.setData({
                        isEditGender: false
                    })
                }

            }
        })
    },
    changeNickName() {
        this.setData({
            show:true
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

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        //this.getUserInfo();
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
    to(e) {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                wx.navigateTo({
                    url: e.currentTarget.dataset.url,
                })
            } else {
                this.handleBindPhone();
            }
        })
    },
    getUserInfo() {
        http("get", "/User/info").then(res => {
            console.log("进入");
            console.log("code"+res.code);
            if (res.code === 0) {
                console.log("是否为空"+res.data.userInfo.name);
                this.setData({
                    userInfo: res.data.userInfo,
                    gender: (res.data.userInfo.gender+1).toString(),
                    city: res.data.userInfo.city,
                    area1:res.data.userInfo.area,
                    province: res.data.userInfo.province,
                    nickName:res.data.userInfo.nickName,
                    Name:!res.data.userInfo.name ?"":res.data.userInfo.name,
                    personalSignature:!res.data.userInfo.personalSignature ?"":res.data.userInfo.personalSignature,
                    date:res.data.userInfo.birthDay==null?"": res.data.userInfo.birthDay.split("T")[0],                  
                })
                var list=[];
                list.push({deletable:true,url:res.data.userInfo.avatarUrl})
                this.setData({
                    fileList:list,
                    userAvatar:res.data.userInfo.avatarUrl
                });
            }
        });
    },
    editPhone() {
        // 获取加载的页面
        const pages = getCurrentPages();
        // 当前页面url
        const url = pages[pages.length - 1].route;
        // 是否修改手机号
        const editPhone = true;
        wx.navigateTo({
            url: `/pages/login/login?path=${url}&editPhone=${editPhone}`
        });

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