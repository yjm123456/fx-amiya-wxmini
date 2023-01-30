export const formatTime = date => {
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

// 计算距离

/**
 * @desc 由经纬度计算两点之间的距离，la为latitude缩写，lo为longitude
 * @param la1 第一个坐标点的纬度
 * @param lo1 第一个坐标点的经度
 * @param la2 第二个坐标点的纬度
 * @param lo2 第二个坐标点的经度
 * @return (int)s   返回距离(单位千米或公里)
 * @tips 注意经度和纬度参数别传反了，一般经度为0~180、纬度为0~90
 * 具体算法不做解释，有兴趣可以了解一下球面两点之间最短距离的计算方式
 */
export const distance = (la1, lo1, la2, lo2) => {
    var La1 = la1 * Math.PI / 180.0;
    var La2 = la2 * Math.PI / 180.0;
    var La3 = La1 - La2;
    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000;
    s = s.toFixed(2);
    return s;
}
