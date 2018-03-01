import fetch from '@/utils/fetch';
const baseUrl = 'http://192.168.11.224:8080';
export const dashboardReq = (par) => fetch({
    baseURL: baseUrl,
    url: '/gaikuang',
    params: par
});
export const vipById = (par) => fetch({
    baseURL: baseUrl,
    url: '/huiyuanbyid',
    params: par
});
export const vipByTime = (par) => fetch({
    baseURL: baseUrl,
    url: '/huiyuanbytime',
    params: par
});
export const collect = () => fetch({
    baseURL: baseUrl,
    url: '/huizong'
});

// 供货系统
// 用户
export const userList = (par) => fetch({
    url: 'user/list',
    params: par
});
export const userDetail = (par) => fetch({
    url: 'user/detail',
    params: par
});
export const userSku = (par) => fetch({
    url: 'user/sku',
    params: par
});
// 商品
export const commodityList = (par) => fetch({
    url: 'material/list',
    params: par
});
export const commodityCount = () => fetch({
    url: 'material/stati'
});
export const commodityInfo = (par) => fetch({
    url: 'material/detail',
    method: 'get',
    params: par
});
export const commodityReject = (par) => fetch({
    url: 'material/reject',
    method: 'post',
    data: par
});
export const commodityPass = (par) => fetch({
    url: 'material/pass',
    method: 'post',
    data: par
});
export const commoditySetPrice = (par) => fetch({
    url: 'material/setPrice',
    method: 'post',
    data: par
});


//主页数据 图标
export const getPlatformData = () => fetch({
    url:'stati/platform',
});
export const getCommodityChart = ()  => fetch({
    url:'stati/goods',
});
export const getIncomeChart = () => fetch({
    url:'stati/income',
});



//订单
export const orderStati = () => fetch({
    url:'order/stati',
});
export const orderList = (params) => fetch({
    url:'order/list',
    params:params
});
export const orderDetailData = (params) => fetch({
    url:'order/detail',
    params:params
})
