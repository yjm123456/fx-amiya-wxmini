Component({
  /**
   * 组件的属性列表
   */
  properties: {
    appointmentInfo: {
      type: Object
    },

    qrCodeBase64: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    value: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      // console.log(event.detail);
    },
  }
})
