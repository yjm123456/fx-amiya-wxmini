// pages/appointmentCar/appointmentCar.js
import http from './../../utils/http';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sysheight: 0,
        activeNames: ['1'],
        name: '',
        phone: '',
        time: '',
        address: '',
        hospital: '',
        carType: '',
        rangeList: [],
        rangeValue: [],
        dateDetails: ['年', '月', '时', '分', '秒'],
        dateMinute: '',
        month: '',
        day: '',
        hour: '',
        minutes: '',
        merchant_name: '',
        goods_name: '请选择',
        Merchlist: [], // 展示的数据数组
        Merchlist1: [], // 后台返回的数据数组
        list: [],
        voucherList:[],
        voucherId:'',

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.getSystemInfo({ //获取设备屏幕真实高度
            success: (result) => {
                this.setData({
                    sysheight: result.windowHeight
                })
            },
        });
        this._initDateTimePickerFn();
        this.getMerchList();
        this.getConsumptionVoucher();
        this.getMostRecentlyAppointmentHospitalName();
    },
    getConsumptionVoucher() {
        http("get", `/CustomerConsumptionVoucher/allCarList`).then(res => {
            if (res.code === 0) {
                let list = res.data.customerConsumptionVoucherList;
                this.setData({
                    voucherList: list
                })
            }
        })
    },
    authorizeNotice (){
        const tmplIds = ["bbzpcTSDNUnsYCUQeeFz5u5-aRoVRDNUSffS1rNa_wE","WydLHA5a_FERDk3Re-vF4lc-ORsngx9fjZVmZhCztdI","yzI4ph707G_OiyTArLzPB2MHDcrZUhdoG42G7XW0zQ8"];
        wx.requestSubscribeMessage({
            tmplIds,
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
                this.appointmentCar();
            },
            fail: err => {
                this.appointmentCar();
            },
        })
    },
    getMostRecentlyAppointmentHospitalName() {
        http("get", `/appointment/getMostRecentlyAppointment`).then(res => {
            if (res.code === 0) {
                let appointmentInfo = res.data.name;
                this.setData({
                    hospital: appointmentInfo.hospitalName
                })
            }
        })
    },
    getMerchList() {
        http("get", `/hospitalInfo/hospitalNameList`).then(res => {
            if (res.code === 0) {
                this.setData({
                    Merchlist: res.data.hospitalInfo.map((item)=>{
                        return {id:item.id,name:item.name}
                    }),
                    Merchlist1: res.data.hospitalInfo.map((item)=>{
                        return {id:item.id,name:item.name}
                    }),
                })
            }
        })
    },
    // 输入商户姓名
    handlerInput(e) {
        let val = e.detail.value; // 用户输入的内容
        const {
            Merchlist
        } = this.data;
        if (val) {
            // 如果用户输入内容了，将原始数组进行过滤，过滤出符合用户输入的数组
            let a = Merchlist.filter(item => item.name.indexOf(val) != -1)
            this.setData({
                Merchlist: a
            })
        } else {
            // 用户没用输入或者清空了，则展示的数组为后台返回数组
            this.setData({
                Merchlist: this.data.Merchlist1
            })
        }

    },
    // 下拉弹框
    bindPickerBuyersName(e) {
        
        let i = e.detail.value; // 下拉选中的值的索引
        let name = this.data.Merchlist[i].name; //展示数组的索引中的需要展示的内容的字段
        let id = this.data.Merchlist[i].id; // 这是该字段实际要传给后端的id
        console.log("name值为"+name);
        // 下拉后需要将返回数据赋值给展示数据，否则下一次弹出下拉框不会展示全部数据
        this.setData({
            hospital: name,
            merch_id: id,
            goods_name: '请选择',
            Merchlist: this.data.Merchlist1
        })
    },
    // 时间选择器相关
    /**
     * 初始化时间选择器
     */
    _initDateTimePickerFn() {
        try {
            const mode = "dateminute";
            const value = this.data.dateMinute;
            if (mode != 'dateminute' && mode != 'datetime') {
                throw new CommonException('请输入合法的时间选择器类型！', -1)
            }
            //====获取到当前时间===
            let showTimeValue = this._validateShowTime(value, mode)

            // ====获取年份====
            const currentYear = showTimeValue.substring(0, showTimeValue.indexOf('-'))
            const currentMouth = showTimeValue.split(" ")[0].split('-')[1]
            const yearList = this._gotDateTimeList({
                _start: Number(currentYear),
                _end: Number(currentYear) + 100,
                _type: 0
            })
            // ====获取月份===
            const monthList = this._gotDateTimeList({
                _start: 1,
                _end: 12,
                _type: 1
            })
            //====获取天数===
            const dayList = this._gotDayList(currentYear, currentMouth)
            // ====获取小时===
            const hourList = this._gotDateTimeList({
                _start: 0,
                _end: 23,
                _type: 2
            })
            // ====获取分钟===
            const munithList = this._gotDateTimeList({
                _start: 0,
                _end: 59,
                _type: 3
            })
            // ====获取秒===
            const secondList = this._gotDateTimeList({
                _start: 0,
                _end: 59,
                _type: 4
            })

            let rangeList = new Array()
            rangeList.push(yearList)
            rangeList.push(monthList)
            rangeList.push(dayList)
            rangeList.push(hourList)
            rangeList.push(munithList)
            mode === "datetime" && rangeList.push(secondList)

            this.setData({
                rangeList
            }, () => {
                this._echoDateTime(showTimeValue) // 初始化时间显示
            })
        } catch (err) {
            console.log(err)
        }
    },
    /**
     * 验证显示的时间是否合法
     * @param {Number} _value 要验证的时间
     * @param {Number} _mode  选择器类型
     */
    _validateShowTime(_value, _mode) {
        let currentTime = formatTime(new Date(new Date().getTime()+1000*3600*24)).replace(/\//g, "-")
        let showTimeValue = _value.trim() || currentTime
        const secondReg = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/
        const munithReg = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/
        if (_mode === 'dateminute') { // yyyy-MM-dd HH:mm
            // 验证是否合法
            secondReg.test(showTimeValue) && (showTimeValue = showTimeValue.substring(0, showTimeValue.lastIndexOf(':')))
            munithReg.test(showTimeValue) || (showTimeValue = currentTime.substring(0, currentTime.lastIndexOf(':')))
        } else { // yyyy-MM-dd HH:mm:ss
            munithReg.test(showTimeValue) && (showTimeValue += ':00')
            secondReg.test(showTimeValue) || (showTimeValue = currentTime)
        }
        return showTimeValue
    },

    /**
     * 获取年份、月份、小时、分钟、秒
     * @param {Number} _start 开始值
     * @param {Number} _end   结束值
     * @param {Number} _type  类型
     */
    _gotDateTimeList({
        _start,
        _end,
        _type
    }) {
        let resultDataList = new Array()
        for (let i = _start; i <= _end; i++) {
            resultDataList.push(this._addZore(i) + this.data.dateDetails[_type])
        }
        return resultDataList
    },
    /**
     * 获取天数
     * @param {Number} _year  年份
     * @param {Number} _mouth  月份
     */
    _gotDayList(_year, _mouth) {
        let now = new Date(_year, _mouth, 0)
        const dayLength = now.getDate()
        let dayList = new Array()
        for (let i = 1; i <= dayLength; i++) {
            dayList.push(this._addZore(i) + '日')
        }
        return dayList
    },
    /**
     * 补零
     * @param {Number} _num  数值
     */
    _addZore(_num) {
        return _num < 10 ? '0' + _num : _num.toString()
    },
    /**
     * 回显时间
     * @param {Number} _showTimeValue  初始化时要显示的时间
     */
    _echoDateTime(_showTimeValue) {
        const rangeList = this.data.rangeList
        let rangeValue = new Array()
        const list = _showTimeValue.split(/[\-|\:|\s]/)
        list.map((el, index) => {
            rangeList[index].map((item, itemIndex) => {
                item.indexOf(el) !== -1 && rangeValue.push(itemIndex)
            })
        })
        this.setData({
            rangeValue
        })
    },
    /**
     * 点击确定时触发的回调函数
     * @param {Number} ev
     */
    selectChangeFn(ev) {
        const selectValues = ev.detail.value
        const rangeList = this.data.rangeList
        let dateTime = ''
        selectValues.map((el, index) => {
            dateTime += rangeList[index][el].substring(0, rangeList[index][el].length - 1)
            if (index == 0 || index == 1) {
                dateTime += '/'
            } else if (index == 3 || (index == 4 && index != selectValues.length - 1)) {
                dateTime += ':'
            } else if (index == 2 && index != selectValues.length - 1) {
                dateTime += ' '
            }
        })
        // ====触发父组件把值传递给父组件====
        var date = new Date(dateTime + ":00");
        console.log(date);
        console.log(date.getMonth()+1);
        var month = (date.getMonth() + 1)<10?('0'+(date.getMonth() + 1)):(date.getMonth() + 1);
        var day = date.getDate()<10?('0'+date.getDate()):date.getDate();
        var hour = date.getHours()<10?('0'+date.getHours()):date.getHours();
        var minutes = date.getMinutes()<10?('0'+date.getMinutes()):date.getMinutes();
        this.setData({
            dateMinute: dateTime + ":00",
            month,
            day,
            hour,
            minutes,
        })

    },
    /**
     *  当具体的一项的值发生改变时触发
     *  @param {Number} ev
     */
    selectColumnChangeFn(ev) {
        const {
            column,
            value
        } = ev.detail
        let {
            rangeList,
            rangeValue
        } = this.data
        let selectValue = Number(rangeList[column][value]
            .substring(0, rangeList[column][value].length - 1))
        if (column === 1) { // 改变月份 
            const currentYear = Number(rangeList[0][rangeValue[0]]
                .substring(0, rangeList[0][rangeValue[0]].length - 1))
            const dayList = this._gotDayList(currentYear, selectValue)
            rangeList[column + 1] = dayList
        }
        this.setData({
            rangeList
        })
    },

    onChange(event) {
        this.setData({
            activeNames: event.detail,
        });
    },
    onNameChange(event) {
        this.setData({
            name: event.detail
        })
    },
    onPhoneChange(event) {
        this.setData({
            phone: event.detail
        })
    },
    onAddressChange(event) {
        this.setData({
            address: event.detail
        })
    },
    onHospitalChange(event) {
        this.setData({
            hospital: event.detail
        })
    },
    onAdressChange(event) {
        this.setData({
            address: event.detail
        })
    },
    selectDateMinuteChange(ev) {
        this.setData({
            dateMinute: ev.detail.value
        })
    },
    selectCar(event) {
        var type = event.currentTarget.dataset.type;
        this.setData({
            active:type
        })
        this.setData({
            carType: type
        })
        // http("get", `/appointmentCar/getWheatherHaveCarVoucher?car=`+type).then(res => {
        //     if (res.code === 0) {
        //         var voucherId=res.data.voucherId
        //         if(!voucherId){
                    
        //             if(type==0){
        //                 wx.showToast({
        //                   title: '已选择经济型车型,将消耗1000积分',
        //                   icon:'none',
        //                   duration:1000
        //                 })
        //             }
        //             if(type==1){
        //                 wx.showToast({
        //                   title: '已选择舒适型车型,,将消耗1500积分',
        //                   icon:'none',
        //                   duration:1000
        //                 })
        //             }
        //             if(type==2){
        //                 wx.showToast({
        //                   title: '已选择商务型车型,将消耗3000积分',
        //                   icon:'none',
        //                   duration:1000
        //                 })
        //             }
        //             if(type==3){
        //                 wx.showToast({
        //                   title: '已选择豪华型车型,将消耗4500积分',
        //                   icon:'none',
        //                   duration:1000
        //                 })
        //             }
        //         }else{
        //             this.setData({
        //                 voucherId:res.data.voucherId
        //             })
        //             if(type==0){
        //                 wx.showToast({
        //                   title: '消耗一张经济型车型抵用券',
        //                   icon:'none',
        //                   duration:1000
        //                 })
        //             }
        //             if(type==1){
        //                 wx.showToast({
        //                   title: '消耗一张舒适型车型抵用券',
        //                   icon:'none',
        //                   duration:1000
        //                 })
        //             }
        //             if(type==2){
        //                 wx.showToast({
        //                   title: '消耗一张商务型车型抵用券',
        //                   icon:'none',
        //                   duration:1000
        //                 })
        //             }
        //             if(type==3){
        //                 wx.showToast({
        //                   title: '消耗一张豪华型车型抵用券',
        //                   icon:'none',
        //                   duration:1000
        //                 })
        //             }
        //         }
        //     }
        // })
        
        
    },
    appointmentCar() {
        const {
            name,
            phone,
            address,
            hospital,
            dateMinute,
            carType
        } = this.data;
        
        var d= dateMinute.replace("/",'-');
        var d2=d.replace("/",'-');
        if(!name){
            wx.showToast({
              title: '请输入姓名',
              icon:'none',
              duration:1000
            })
            return;
        }
        if(!phone){
            wx.showToast({
              title: '请输入手机号',
              icon:'none',
              duration:1000
            })
            return;
        }
        if(!address){
            wx.showToast({
              title: '请输入预约地点',
              icon:'none',
              duration:1000
            })
            return;
        }
        if(!address){
            wx.showToast({
              title: '请输入预约地点',
              icon:'none',
              duration:1000
            })
            return;
        }
        if(!hospital){
            wx.showToast({
              title: '请输入预约医院',
              icon:'none',
              duration:1000
            })
            return;
        }
        if(!dateMinute){
            wx.showToast({
              title: '请输入预约时间',
              icon:'none',
              duration:1000
            })
            return;
        }
        if(!carType){
            wx.showToast({
              title: '请输入预约车型',
              icon:'none',
              duration:1000
            })
            return;
        }
        if (!(/^1[3456789]\d{9}$/.test(phone))) {
            wx.showToast({
                title: '手机号格式错误,请重新输入',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        const data = {
            name,
            phone,
            address,
            hospital,
            appointmentDate:d2.replace(" ",'T'),
            carType
        };
        http("post", `/appointmentCar`, data).then(res => {
            if (res.code === 0) {
                wx.showToast({
                  title: '提交成功',
                  icon:"none",
                  duration:1000
                })
                wx.redirectTo({
                  url: '/pages/appointmentCarList/appointmentCarList',
                })
            }
        })
    },
    onOpen(event) {
        Toast(`展开: ${event.detail}`);
    },
    onClose(event) {
        Toast(`关闭: ${event.detail}`);
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
// 自定义异常
function CommonException(errMsg, code) {
    this.errMsg = errMsg
    this.code = code
}

// =====格式化日期===
const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}