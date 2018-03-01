<style scoped>

</style>
<template>
    <div id="commodity" class="main-container">
        <div class="dashboard-data filter-box box-style">
            <div class="right-filter">
                <Input placeholder="用户ID/用户昵称/手机号" style="width: 300px" v-model="parameterList.keyword"></Input>
                <button class="search-btn" @click="searchHandle">查询</button>
            </div>
        </div>
        <div class="com-settings-header">
            <h4>用户列表</h4>
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
    import { userList } from '@/api'
    export default{
        data() {
            return {
                pageTotal:0,//总页数
                currentPageNum:1, //当前页数
                parameterList:{
                    page:1,//当前页
                    size:10,//每页条数
                    keyword:''//搜索
                },
                columns :[
                    {
                        title:'用户ID',
                        key:'id',
                        align:'center',
                        width: 80
                    },
                    {
                        title:'用户昵称',
                        key:'nickname',
                        align:'center',
                        width: 100
                    },
                    {
                        title:'手机号',
                        key:'phone',
                        align:'center',
                    },
                    {
                        title:'注册时间',
                        key:'registerTime',
                        align:'center',
                    },

                    {
                        title:'最近登录时间',
                        key:'lastLoginTime',
                        align:'center',
                    },
                    {
                        title:'在售货权商品',
                        key:'sellingGoods',
                        align:'center',
                        width: 120

                    },
                    {
                        title:'货权总收益',
                        key:'goodsIncome',
                        align:'center',
                        render: (h,p) => p.row.goodsIncome.toFixed(2)
                    },

                    {
                        title:'操作',
                        align:'center',
                        width: 100,
                        render: (h,param) => {
                            let row = param.row;
                            return h('router-link',{
                                props: {
                                    to: '/userMng/info?id='+row.id
                                }
                            },'查看详情')
                        }

                    }
                ],
                tableData:[]
            };
        },
        created() {
            this.getUserList();
        },
        methods: {
            searchHandle() {
                this.parameterList.page = 1;
                this.getUserList();
            },
            rowClassName( row, index){
                if (index % 2) {
                    return 'double-row';
                } else {
                    return 'single-row';
                }
            },
            getUserList() {
                userList(this.parameterList).then(res => {
                    this.tableData = res.data.rows;
                    this.pageTotal = res.data.total;
                })
            },
            pageChange(p) {
                this.parameterList.page = p;
                this.getUserList();
            }
        }
    };
</script>
