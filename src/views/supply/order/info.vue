<style scoped type="text/less" lang="less">

    .orderInfo-list {
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
    .logistics-contain {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        .logistics-title{
            padding: 10px 20px;
        }
        .logistics-info {
            width: 80%;
            > ul {
                padding: 10px 20px 10px 50px;
                > li {
                    margin-bottom: 15px;
                    > span {
                        width: 80px;
                        display: inline-block;
                        color: #495060
                    }
                }
            }

        }
    }
</style>
<template>
    <div id="orderInfo" class="main-container">
        <div style="margin-top: 20px;position: relative">
            <div class="com-settings-header">
                <h4>订单详情</h4>
            </div>
        </div>
        <div class="dashboard-data orderInfo-contain">
            <div class="orderInfo-list">
                <ul>
                    <li>
                        <span> 订单编号：</span>{{orderDetailList.id}}
                    </li>
                    <li>
                        <span>买家昵称：</span>{{orderDetailList.customer}}
                    </li>
                    <li>
                        <span> 创建时间：</span>{{orderDetailList.createTime}}
                    </li>
                </ul>
                <ul>
                    <li>
                        <span> 付款时间：</span>{{orderDetailList.payTime}}
                    </li>
                    <li>
                        <span>发货时间：</span>{{orderDetailList.shipTime}}
                    </li>
                    <li>
                        <span> 成交时间：</span>{{orderDetailList.dealTime}}
                    </li>
                </ul>
                <Table :columns="columns" :data="tableData"></Table>
                <h4 style="margin-top: 20px">&emsp;订单总价：&emsp;<span style="color:#00BA9C">{{price.totle | currency}}<span style="font-weight: normal;color: #80848F;margin-left: 5px;">(含快递费用：{{orderDetailList.deliveryCost | currency}}）</span>  </span></h4>
                <h4 style="margin-top: 20px">供应商收益：&emsp;<span style="color:#00BA9C">{{price.supply | currency}}</span></h4>
                <h4 style="margin-top: 20px">&emsp;平台收益：&emsp;<span style="color:#00BA9C">{{price.platform | currency}}</span></h4>
            </div>
        </div>
        <div style="margin-top: 20px;position: relative">
            <div class="com-settings-header">
                <h4>买家及物流信息</h4>
            </div>
            <div class="dashboard-data logistics-contain">
            <div class="logistics-info">
                <ul>
                    <li>
                        <span style="margin-left: -30px"><b>买家信息</b></span>
                    </li>
                    <li>
                        <span> 昵称：</span>{{orderDetailList.customer}}
                    </li>
                    <li>
                        <span>商品名称：</span>{{orderDetailList.materialInfo}}
                    </li>
                    <li>
                        <span>收货地址：</span>{{orderDetailList.addr}}
                    </li>
                    <li>
                        <span style="margin-left: -30px"><b>订单状态</b></span>
                    </li>
                    <li>
                        <span>订单状态：</span>{{orderDetailList.status | statusMap}}
                    </li>
                    <!--<li>
                        <span>运送方式：</span>{{orderDetailList.deliveryMode}}
                    </li>
                    <li>
                        <span>物流公司：</span>{{orderDetailList.logistics}}
                    </li>
                    <li>
                        <span>运单号：</span>{{orderDetailList.deliveryId}}
                    </li>
                    <li style="display: flex;align-items: flex-start;">
                        <span>物流详情：</span>
                        <div style="flex: 1;">
                            <Timeline >
                                <TimelineItem color="green" v-for="item in delivery" :key="item.id">
                                    <span style="font-weight: bold;display: inline-block;width: 100px">{{item.date}}</span>
                                    <span style="display: inline-block;width: 60px">{{item.time}}</span>
                                    <span>{{item.event}}</span>
                                </TimelineItem>

                            </Timeline>
                        </div>
                    </li>-->

                </ul>
            </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {orderDetailData} from '@/api'
    import NP from 'number-precision'
    export default {
        data(){
            return {
                orderId:this.$route.query.id,
                orderDetailList:{},
                tableData:[],
                delivery:[],
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
                        render:(h,param) =>{
                            let st = param.row.status;
                            let map = ['新建','待发货','已发货','已完成','已取消','已退货'];
                            return map[st]
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
                        title:'数量',
                        key:'num',
                        align:'center',
                    },
                    {
                        title:'优惠',
                        key:'discount',
                        align:'center',
                    },
                ],
                price:{
                    totle:0,
                    supply:0,
                    platform:0,
                }

            }
        },
        created(){
            this.orderDetail();
        },
        filters: {
          statusMap(v) {
              let map = ['新建','待发货','已发货','完成','取消','已退货'];
              return map[v]
          }
        },
        methods:{
            orderDetail(){
                return orderDetailData({orderId:this.orderId}).then(res =>{
                        this.orderDetailList = res.data.order;
                        this.tableData = res.data.lines;
                        this.delivery = res.data.logistics;
                    let total = res.data.lines.reduce(function(sum, val) {
                        let multip = NP.times(val.price , val.num);
                        let  subtra = NP.minus(multip, val.discountAmount);

                        return NP.plus(sum , subtra);
//                        return sum + (val.price * val.num - val.discountAmount);
                    }, 0);
                    let supply = res.data.lines.reduce(function(sum, val) {
                        let reduce = NP.times(val.supplyPrice , val.num);
                        return   NP.plus(sum ,reduce );
                       /* return sum + (val.supplyPrice * val.num );*/
                    }, 0);

                    this.price.totle = NP.plus(total,this.orderDetailList.deliveryCost);
                    this.price.supply = supply;
                    let dev = NP.plus(total,this.orderDetailList.deliveryCost);
                    this.price.platform = NP.minus(dev,  supply);

                })
            },

        }
    };
</script>
