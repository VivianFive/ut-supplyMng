<style scoped>
</style>
<template>
    <div id="commodity" class="main-container">
        <div class="dashboard-data">
            <ul class="info-ul">
                <li>
                    <input type="radio" id="consumption" name="total"/>
                    <label for="consumption">
                        <b>{{statiData.wait}} 笔</b>
                        <span>待发货订单</span>
                    </label>
                </li>
                <li>
                    <input type="radio" id="vip" name="total"/>
                    <label for="vip">
                        <b>{{statiData.ship}} 笔</b>
                        <span>已发货订单</span>
                    </label>
                </li>
                <li>
                    <input type="radio" id="service" name="total"/>
                    <label for="service">
                        <b>{{statiData.done}} 笔</b>
                        <span>已完成订单</span>
                    </label>
                </li>
                <li>
                    <input type="radio" id="expend" name="total"/>
                    <label for="expend">
                        <b>{{statiData.cancel}} 笔</b>
                        <span>已取消订单</span>
                    </label>
                </li>
            </ul>
        </div>
        <div class="filter-box box-style">
            <div class="left-filter">
                <ul class="filter-ul">
                    <li>
                        状态：
                    </li>
                    <li>
                        <input type="radio" name="filterRadio" id="all" value="" v-model="params.status" @change="searchHandle">
                        <label for="all">
                            全部
                        </label>
                    </li>
                    <li>
                        <input type="radio" name="filterRadio" id="audit" value="1" v-model="params.status" @change="searchHandle">
                        <label for="audit">
                            待发货
                        </label>
                    </li>
                    <li>
                        <input type="radio" name="filterRadio" id="sale" value="2" v-model="params.status" @change="searchHandle">
                        <label for="sale">
                            已发货
                        </label>
                    </li>
                    <li>
                        <input type="radio" name="filterRadio" id="sellOut" value="3" v-model="params.status" @change="searchHandle">
                        <label for="sellOut">
                            已完成
                        </label>
                    </li>
                    <li>
                        <input type="radio" name="filterRadio" id="soldOut" value="4" v-model="params.status" @change="searchHandle">
                        <label for="soldOut">
                            已取消
                        </label>
                    </li>
                    <li>
                        <input type="radio" name="filterRadio" id="salesReturn" value="5" v-model="params.status" @change="searchHandle">
                        <label for="salesReturn">
                            已退货
                        </label>
                    </li>
                </ul>
            </div>
            <div class="right-filter">
                <Input placeholder="订单号/收件人姓名" style="width: 300px" v-model="params.keyword"></Input>
                <button class="search-btn" @click="searchHandle">查询</button>
            </div>
        </div>
        <div class="com-settings-header">
            <h4>订单列表</h4>
        </div>

        <div class="info-table">
            <Table stripe :row-class-name="rowClassName" :columns="columns" :data="tableData"></Table>
            <div class="page">
                <div style="display: inline-block">
                    <Page :total="dataTotal" show-elevator @on-change="(n) => pageChange(n)"></Page>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {orderStati,orderList} from '@/api'
    export default{
        data() {
            return {
                statiData:{}, //订单统计
                columns :[
                    {
                        title:'订单编号',
                        key:'id',
                        align:'center',
                    },
                    {
                        title:'订单时间',
                        key:'createTime',
                        align:'center',
                    },
                    {
                        title:'商品信息',
                        key:'materialInfo',
                        align:'center',
                    },
                    {
                        title:'销售价',
                        key:'price',
                        align:'center',
                        render: (h,p) => p.row.price.toFixed(2)
                    },

                    {
                        title:'供货价',
                        key:'supplyPrice',
                        align:'center',
                        render: (h,p) => p.row.supplyPrice.toFixed(2)
                    },
                    {
                        title:'数量',
                        key:'num',
                        align:'center',
                    },
                    {
                        title:'买家',
                        key:'customer',
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
                        title:'操作',
                        align:'center',
                        render: (h,param) => {
                            let row = param.row
                                ,btns = [];
                            btns.push(this.createBtn(h,'查看详情',() =>{
                                this.$router.push({path:'/orderMng/info',query: {id:row.id}})
                            }))
                            return h('div',btns)
                        }

                    }
                ],
                tableData:[], //table
                params:{
                    keyword:'',
                    status:'',
                    page:1,
                    size:10,
                },
                dataTotal:0, //总页数
            };
        },
        created() {
            this.orderStatiLiat();
            this.searchHandle();
        },
        methods: {
            orderStatiLiat (){
                return orderStati().then(res =>{
                    this.statiData = res.data;

                })
            },
            searchHandle() {
                return orderList(this.params).then(res =>{
                    this.dataTotal = res.data.total;
                    this.tableData = res.data.rows;
                })
            },
            rowClassName( row, index){
                if (index % 2) {
                    return 'double-row';
                } else {
                    return 'single-row';
                }
            },
            createBtn(render,label,callback){
                return render ('a',{
                   /* props: {
                        type: 'text',
                        size:'small',
                        color:'#5B9BD5',
            },*/
                    on: {
                        click: () =>{
                            callback && callback();
                        }
                    }
                },label)
            },
            pageChange(n){
                this.params.page = n ;
                this.searchHandle();
            }
        }
    };
</script>
