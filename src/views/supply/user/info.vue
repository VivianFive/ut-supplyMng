<style scoped type="text/less" lang="less">
    .userInfo-list {
        width: 100%;
        padding: 10px 20px;
        > ul {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            > li {
                width: 30%;
                padding-bottom: 15px;

            }
        }
    }
</style>
<template>
    <div id="uesrInfo" class="main-container">
        <div style="margin-top: 20px;position: relative">
            <div class="com-settings-header">
                <h4>用户信息</h4>
            </div>
        </div>
        <div class="dashboard-data userInfo-contain">
            <div class="userInfo-list">
                <ul>
                    <li>
                        <span><b> 用&ensp;户&ensp;ID：</b></span>{{info.id}}
                    </li>
                    <li>
                        <span><b> 性&emsp;别：</b></span>{{info.gender}}
                    </li>
                    <li>
                        <span> <b> 用户注册时间：</b></span>{{info.registerTime}}
                    </li>
                </ul>
                <ul>
                    <li>
                        <span> <b> 用户昵称：</b></span>{{info.nickname}}
                    </li>
                    <li>
                        <span><b> 手机号：</b></span>{{info.phone}}
                    </li>
                    <li>
                        <span> <b> 最后登录时间：</b></span>{{info.lastLoginTime}}
                    </li>
                </ul>
                <ul>
                    <li>
                        <span> <b> 所&ensp;在&ensp;地：</b></span>{{info.addr}}
                    </li>

                </ul>
                <!--<Table :columns="columns" :data="tableData"></Table>
                <h4 style="margin-top: 20px">供应商收益：<span style="color:#00BA9C">¥5000</span></h4>
                <h4 style="margin-top: 20px">平台收益：<span style="color:#00BA9C">¥5000</span></h4>-->
            </div>
        </div>
        <div class="dashboard-data">
            <ul class="info-ul">
                <li>
                    <input type="radio" id="consumption" name="total"/>
                    <label for="consumption">
                        <b>{{info.totalGoods}} 件</b>
                        <span>发布货权商品</span>
                    </label>
                </li>
                <li>
                    <input type="radio" id="vip" name="total"/>
                    <label for="vip">
                        <b>{{info.sellingGoods}} 件</b>
                        <span>在售货权商品</span>
                    </label>
                </li>
                <li>
                    <input type="radio" id="service" name="total"/>
                    <label for="service">
                        <b>{{info.soldGoods}} 件</b>
                        <span>已售罄货权商品</span>
                    </label>
                </li>
                <li>
                    <input type="radio" id="expend" name="total"/>
                    <label for="expend">
                        <b>{{info.underGoods}} 件</b>
                        <span>已下架货权商品</span>
                    </label>
                </li>
            </ul>
            <div style="padding: 40px 20px">
                <Table :columns="columns" :data="tableData"></Table>
                <div class="page">
                    <div style="display: inline-block">
                        <Page :current.sync="currentPageNum" :total="pageTotal" show-elevator @on-change="(p) => pageChange(p)"></Page>
                    </div>
                </div>
                <div style="margin-top: 30px">
                    <div><b>历史总收益：</b></div>
                    <h4 style="margin: 20px 80px">供应商收益：<span style="color:#00BA9C">{{info.goodsIncome | currency}}</span></h4>
                    <h4 style="margin: 20px 80px">销售总收益：<span style="color:#00BA9C">{{info.totalIncome | currency}}</span></h4>
                </div>

            </div>

        </div>
    </div>
</template>
<script>
    import {userDetail,userSku} from '@/api';
    import NP from 'number-precision'
    export default {
        data(){
            return {
                pageTotal:0,//总页数
                currentPageNum:1, //当前页数
                info: {},
                uid: this.$route.query.id,
                parameterList:{
                    page:1,//当前页
                    size:10//每页条数
                },
                columns:[
                    {
                        title:'商品',
                        key:'name',
                        align:'center',
                        width:200
                    },
                    {
                        title:'商品属性',
                        key:'attribute',
                        align:'center',
                    },
                    {
                        //待发货  2已发货  3已完成 4已取消
                        title:'状态',
                        key:'status',
                        align:'center',
                        render: (h,p) => {
                            const map = ['待审','审核不通过','在售','部分售罄','售罄','下架'];
                            return map[p.row.status]
                        }

                    },
                    {
                        title:'供货价',
                        key:'supplyPrice',
                        align:'center',
                        render: (h,p) => p.row.supplyPrice.toFixed(2)
                    },
                    {
                        title:'销售价',
                        key:'price',
                        align:'center',
                        render: (h,p) => p.row.price.toFixed(2)
                    },
                    {
                        title:'供应数量情况',
                        key:'num',
                        align:'center',
                        render:(h,p) => p.row.num - p.row.remain + '/' + p.row.num
                    },
                    {
                        title:'累计收益（供货收益／销售收益）',
                        key:'totle',
                        align:'center',
                        render: (h,p) => {
                            let saleNum = NP.minus(p.row.num, p.row.remain); // 销售数量
                            let supplyIncome = NP.times(p.row.supplyPrice , saleNum); // 供货收益
                            let priceSpread = NP.minus(p.row.price, p.row.supplyPrice); // 差价
                            let saleIncome = NP.times(priceSpread, saleNum); // 销售收益
                            return '￥' + supplyIncome.toFixed(2) + ' /' + '￥' + saleIncome.toFixed(2);
                        }
                    },
                ],
                tableData:[]
            }
        },
        created() {
          this.getUserInfo();
          this.getUserSku();
        },
        methods: {
            getUserInfo() {
                userDetail({id: this.uid}).then(res => {
                    this.info = res.data;
                })
            },
            getUserSku() {
                userSku({userId: this.uid, ...this.parameterList}).then(res => {
                    this.tableData = res.data.rows;
                    this.pageTotal = res.data.total;
                });
            },
            pageChange(p) {
                this.parameterList.page = p;
                this.getUserSku();
            }
        }
    };
</script>
