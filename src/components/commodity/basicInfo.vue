<style scoped type="text/less" lang="less">
    .commCheck{
        position: absolute;
        top:5px;
        right:0px;
        .pass{
            background-color: #00BA9C;
            color:#ffffff;
            margin-right: 50px;
        }
        .refuse{
            background-color:#EE7A2F;
            color:#ffffff;
        }
    }
    .comInfo-contain{
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        .comInfo-left{
            width: 49%;
            padding: 10px 20px;
            > ul {
                > li{
                    margin-bottom: 15px;
                    > span{
                        width: 80px;
                        display: inline-block;
                        font-weight: bold;
                        color:#495060
                    }
                }
                .comInfo-param{
                    flex: 1;
                    > ul {
                        > li {
                            > div {
                                display:inline-block;
                                width: 49%;
                                > span {
                                    display:inline-block;
                                    width: 80px;
                                }
                            }
                        }
                    }
                }
            }

        }
        .comInfo-right{
            width: 49%;
            padding: 10px 20px;
            > ul{
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                >li{
                    width: 45%;
                    padding-bottom: 15px;
                }
            }
        }

    }
    .comInfo-photoText{
        .title{
            margin:10px 20px;
        }
        .upload-list{
            display: inline-block;
            width: 140px;
            height: 160px;
            text-align: center;
            line-height: 60px;
            border: 1px solid transparent;
            border-radius: 4px;
            overflow: hidden;
            background: #fff;
            position: relative;
            box-shadow: 0 1px 1px rgba(0,0,0,.2);
            margin-right: 14px;
            margin-bottom: 14px;
        }
        .upload-list img{
            width: 100%;
            height: 100%;
        }
        .upload-list-cover{
            display: none;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,.6);
        }
        .upload-list:hover .upload-list-cover{
            display: block;
        }
        .upload-list-cover i{
            color: #fff;
            font-size: 32px;
            cursor: pointer;
            margin: 60px 60px;
        }
    }

</style>
<template>
    <div id="commInfo-c">
        <div style="margin-top: 20px;position: relative">
            <div class="com-settings-header">
                <h4>供货商品基本信息</h4>
            </div>
            <div class="commCheck" v-if="info.material.status == 0" >
                <Button class="pass" @click="auditHandle('pass')">审核通过</Button>
                <Button class="refuse" @click="checkNoPass = true">审核不通过</Button>
            </div>
        </div>
        <div class="dashboard-data comInfo-contain">
            <div class="comInfo-left">
                <ul>
                    <li>
                        <span> 商品ID：</span>{{info.material.id}}
                    </li>
                    <li>
                        <span>商品名称：</span>{{info.material.name}}
                    </li>
                    <li>
                        <span>商品分类：</span>一级分类 > 二级分类 > 三级分类
                    </li>
                    <li style="display: flex;align-items: flex-start;">
                        <span>商品描述：</span><div style="flex: 1;">{{info.material.descr}}</div>
                    </li>
                    <li style="display: flex;align-items: flex-start;">
                        <span>商品参数：</span>
                        <div class="comInfo-param">
                            <ul style="display: flex">
                                <li v-for="item in info.params" style="flex: 1;width: 50%">
                                    <span class="comInfo-param">{{item.key}}：</span>{{item.value}}
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
            <div  class="comInfo-right">
                <ul>
                    <li>
                        <span> 供货ID：</span>{{info.user.id}}
                    </li>
                    <li>
                        <span>供货商昵称：</span>{{info.user.nickname}}
                    </li>
                </ul>
                <ul>
                    <li>
                        <span> 供货商电话：</span>{{info.user.phone}}
                    </li>
                    <li>
                        <span>供货模式：</span>{{info.material.mode}}
                    </li>
                </ul>
                <ul>
                    <li>商品供应信息：</li>
                </ul>
                <Table height="200" :columns="columns" :data="tableData"></Table>

            </div>
        </div>
        <div style="margin-top: 20px;position: relative">
            <div class="com-settings-header">
                <h4>供权商品图文信息</h4>
            </div>
        </div>
        <div class="dashboard-data comInfo-photoText">
            <div class="title">商品预览图：</div>
            <div class="title">

                <div class="upload-list" v-for="item in info.pics" v-if="item.type == 1">
                    <template>
                        <img :src="item.url">
                        <div class="upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                        </div>
                    </template>
                </div>
                <Modal title="预览" v-model="visible">
                    <img :src="imgName" v-if="visible" style="width: 100%">
                </Modal>
            </div>
            <div class="title">商品详情图：</div>
            <div class="title">

                <div class="upload-list" v-for="item in info.pics" v-if="item.type == 2">
                    <template>
                        <img :src="item.url">
                        <div class="upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                        </div>
                    </template>
                </div>
                <Modal title="预览" v-model="visible">
                    <img :src="imgName" v-if="visible" style="width: 100%">
                </Modal>
            </div>
        </div>
        <on-sale v-if="info.material.status != 0" :auditInfo="info.material" :series="saleSeries"></on-sale>
        <!--审核通过-->
        <Modal
            title="设置销售价格"
            v-model="setSalePrice"
            ok-text="确定提交"
            @on-ok="setPriceHandle"
            :closable="false"
            class-name="vertical-center-modal">
            <Table :columns="auditTableColumns" :data="tableData"></Table>
            <div style="margin-top: 20px">一键上浮：<InputNumber :max="10" :min="0" v-model="fastSet"></InputNumber> %</div>
        </Modal>
        <!--审核不通过-->
        <Modal
            title="审核未通过"
            v-model="checkNoPass"
            ok-text="确定提交"
            @on-ok="auditHandle('reject')"
            class-name="vertical-center-modal">
            <div>填写原因：
                <Input type="textarea" v-model="auditReason" :autosize="{minRows: 5,maxRows: 8}" placeholder="请输入100个字以内的原因"></Input>
            </div>
        </Modal>
    </div>
</template>
<script>
    import OnSale from './infoOnsale';
    import { commodityInfo, commodityReject, commodityPass, commoditySetPrice } from '@/api';
    import NP from 'number-precision'
    export default{
        components: {
            OnSale
        },
        data() {
            return {
                cid: this.$route.query.id,
                type: this.$route.query.type,
                info: {
                    material: {status: 1},
                    user: {},
                },
                saleSeries: [],
                columns:[
                    {
                        title:'商品属性',
                        key:'name',
                        align:'center',
                    },
                    {
                        title:'商品规格',
                        key:'spec',
                        align:'center',
                    },
                    {
                        title:'供货价',
                        key:'supplyPrice',
                        align:'center',
                        render: (h,p) => p.row.supplyPrice.toFixed(2)
                    },
                    {
                        title:'已销售数量/供应总量',
                        key:'num',
                        align:'center',
                        render: (h,p) => (p.row.num - p.row.remain) + '/' + p.row.num
                    },
                    {
                        title:'合计金额',
                        key:'price',
                        align:'center',
                        render: (h,p) => (p.row.supplyPrice * p.row.num).toFixed(2)
                    }
                ],
                tableData:[],
                auditTableColumns: [{
                        title:'商品属性',
                        key:'name',
                        align:'center',
                    },
                    {
                        title:'商品规格',
                        key:'spec',
                        align:'center',
                    },
                    {
                        title:'供货价',
                        key:'supplyPrice',
                        align:'center',
                        render: (h,p) => p.row.supplyPrice.toFixed(2)
                    },
                    {
                        title:'已销售数量/供应总量',
                        key:'num',
                        align:'center',
                        render: (h,p) => (p.row.num - p.row.remain) + '/' + p.row.num
                    },
                    {
                        title:'合计金额',
                        key:'price',
                        align:'center',
                        render: (h,p) => (p.row.supplyPrice * p.row.num).toFixed(2)
                    },
                    {
                    title: '设置销售价格',
                    key: 'price',
                    align:'center',
                    render: (h,p) => {
                        var self = this;
                        return h('input',{
                            attrs: {
                              type: 'number'
                            },
                            domProps: {
                                value: p.row.price
                            },
                            style: {
                                width: '60px',
                                borderRadius: '4px',
                                outLine: 'none',
                                border: '1px solid #eee',
                                padding: '0 5px'
                            },
                            on: {
                                input: (event) => {
                                    self.tableData[p.index].price = event.target.value;
                                }
                            }
                        })
                    }
                },],
                imgName: '',
                visible: false,
               //通过  不通过审核
                setSalePrice:false,
                checkNoPass:false,
                auditReason: '',
                fastSet: 0
            }
        },
        created() {
                this.getInfo();
        },
        methods: {
            handleView (name) {
                this.imgName = name;
                this.visible = true;
            },
            getInfo() {
                commodityInfo({materialId: this.cid}).then(res => {
                    this.info = res.data;
                    this.tableData = this.saleSeries = res.data.series;
                });
            },
            auditHandle(t) {
                if(t === 'pass') {
                    commodityPass({id: this.cid, auditPerson: 'admin'}).then(res => {
                        this.$Message.success('审核通过，请设置销售价格！');
                        this.setSalePrice = true;
                        this.getInfo();

                    })
                } else {
                    commodityReject({id: this.cid, auditReason: this.auditReason, auditPerson: 'admin'}).then(res => {
                        this.$Message.success('审核不通过，已通知供货商！');
                        this.getInfo();
                    })
                }

            },
            setPriceHandle() {
                const priceArr = this.tableData.map(e => {
                    return {id: e.id, price: this.fastSet ? NP.times(e.price, NP.plus(1, NP.divide(this.fastSet, 100))) : e.price}
                });
                const data = {
                    'materialId': this.cid,
                    'data': JSON.stringify(priceArr)
                };
                commoditySetPrice(data).then(res => {
                    this.$Message.success('设置价格成功！');
                    this.setSalePrice = false;
                })
            }
        }
    };
</script>
