<style scoped>

</style>
<template>
    <div id="commodity" class="main-container">
        <div class="dashboard-data">
            <ul class="info-ul">
                <li>
                    <input type="radio" v-model="statusRadio" id="consumption" name="total"/>
                    <label for="consumption">
                        <b>{{countData.wait}} 件</b>
                        <span>待审核货权商品</span>
                    </label>
                </li>
                <li>
                    <input type="radio" v-model="statusRadio" id="vip" name="total"/>
                    <label for="vip">
                        <b>{{countData.selling}} 件</b>
                        <span>在售货权商品</span>
                    </label>
                </li>
                <li>
                    <input type="radio" v-model="statusRadio" id="service" name="total"/>
                    <label for="service">
                        <b>{{countData.sold}} 件</b>
                        <span>已售罄货权商品</span>
                    </label>
                </li>
                <li>
                    <input type="radio" v-model="statusRadio" id="expend" name="total"/>
                    <label for="expend">
                        <b>{{countData.under}} 件</b>
                        <span>已下架货权商品</span>
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
                        <input type="radio" name="filterRadio" id="all" value="all" v-model="statusRadio" @change="statusChange">
                        <label for="all">
                            全部
                        </label>
                    </li>
                    <li>
                        <input type="radio" name="filterRadio" id="audit" value="0" v-model="statusRadio" @change="statusChange">
                        <label for="audit">
                            待审核
                        </label>
                    </li>
                    <li>
                        <input type="radio" name="filterRadio" id="sale" value="2" v-model="statusRadio" @change="statusChange">
                        <label for="sale">
                            在售
                        </label>
                    </li>
                    <li>
                        <input type="radio" name="filterRadio" id="sellOut" value="4" v-model="statusRadio" @change="statusChange">
                        <label for="sellOut">
                            已售罄
                        </label>
                    </li>
                    <li>
                        <input type="radio" name="filterRadio" id="soldOut" value="5" v-model="statusRadio" @change="statusChange">
                        <label for="soldOut">
                            已下架
                        </label>
                    </li>
                </ul>
            </div>
            <div class="right-filter">
                <Input placeholder="商品ID/关键字" v-model="parameterList.keyword" style="width: 300px"></Input>
                <button class="search-btn" @click="searchHandle">查询</button>
            </div>
        </div>
        <div class="com-settings-header">
            <h4>货权商品列表</h4>
        </div>

        <div class="info-table">
            <Table stripe :row-class-name="rowClassName" :columns="columns" :data="tableData"></Table>
            <div class="page">
                <div style="display: inline-block">
                    <Page :current.sync="currentPageNum" :total="pageTotal" show-elevator @on-change="(p) => pageChange(p)"></Page>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { commodityList, commodityCount } from '@/api'
    export default{
        data() {
            return {
                pageTotal:0,//总页数
                currentPageNum:1, //当前页数
                statusRadio: 'all',
                parameterList:{
                    page:1,//当前页
                    size:10,//每页条数
                    keyword:'',//搜索
                    status:'',
                },
                countData:{},
                columns :[
                    {
                        title:'商品ID',
                        key:'id',
                        width:'80',
                        align:'center',
                    },
                    {
                        title:'商品名称',
                        key:'name',
                        align:'center',
                    },
                    {
                        title:'属性',
                        key:'attribute',
                        align:'center',
                    },
                    {
                        title:'规格',
                        key:'spec',
                        align:'center',
                    },
                    {
                        title:'剩余/供应数量',
                        key:'num',
                        align:'center',
                        render: (h,p) => p.row.remain+'/'+p.row.num
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
                        title:'状态',
                        key:'status',
                        align:'center',
                        render: (h,p) => {
                            const map = ['待审','审核不通过','在售','部分售罄','售罄','下架'];
                            return map[p.row.status]
                        }
                    },
                    {
                        title:'操作',
                        align:'center',
                        render: (h,param) => {
                            let row = param.row;
                            return h('router-link',{
                                props: {
                                    to: '/commodityMng/info?id='+row.id+'&type='+row.status
                                }
                            },'查看详情')
                        }
                    }
                ],
                tableData:[]
            };
        },
        created() {
            this.getCommodityList();
            this.getCommodityCount();
        },
        methods: {
            searchHandle() {
                this.parameterList.page = 1;
                this.getCommodityList();
            },
            rowClassName( row, index){
                if (index % 2) {
                    return 'double-row';
                } else {
                    return 'single-row';
                }
            },
            getCommodityList() {
                commodityList(this.parameterList).then(res => {
                    this.tableData = res.data.rows;
                    this.pageTotal = res.data.total;
                })
            },
            pageChange(p) {
                this.parameterList.page = p;
                this.getCommodityList();
            },
            getCommodityCount() {
                commodityCount().then(res => {
                    this.countData = res.data;
                })
            },
            statusChange() {
                this.parameterList.page = 1;
                this.parameterList.status = this.statusRadio === 'all' ? '' : this.statusRadio;
                this.getCommodityList();

            }
        }
    };
</script>
