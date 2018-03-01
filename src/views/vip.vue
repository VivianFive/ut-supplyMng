<style scoped lang="less" type="text/less">
    .vip-filter{
        background: #F4F4F4;
        padding: 20px 50px;
        margin: 30px 0 10px;
    }
    .search-box{
        margin-top: 20px;
        > input{
            outline: none;
            height: 28px;
            background: transparent;
            border-radius: 4px;
            margin-right: 10px;
            border: 1px solid #DFDFDF;
            padding: 0 10px;
            &::placeholder{
                color: #B2B2B2;
            }
        }
    }
    .vip-total{
        font-weight: bold;
        font-size: 18px;
        padding: 20px 0 10px;
        > span:not(:last-child){
            margin-right: 100px;
        }
    }
</style>
<template>
    <div id="vip" class="main-container">
        <div class="vip-filter">
            <div>
                时间：<DatePicker type="date" placeholder="请选择购买时间" format="yyyy/MM/dd" :options="options_s" @on-change="(date) => { s_time = date }" :value="s_time" style="width: 200px"></DatePicker>
                - <DatePicker type="date" placeholder="请选择购买时间" format="yyyy/MM/dd" @on-change="(date) => { e_time = date }" :value="e_time" style="width: 200px"></DatePicker>
                <button class="search-btn" @click="searchHandle">查询</button>
                <div class="radio-group">
                    <input type="radio" name="month" id="month1" v-model="allBtn" value="all"/>
                    <label for="month1" @click="getAllVip">全部</label>
                </div>
                <a href="http://data.bestkeep.cn/download/vip.xlsx"  class="search-btn export-btn">导出excl(全部数据)</a>
            </div>
            <div class="search-box">
                <input type="text" placeholder="用户账号/订单编号" v-model="searchId">
                <button class="search-btn" @click="getVipById">查询</button>
            </div>
        </div>
        <div class="vip-total">
            <span>会员充值次数：{{ dashboardData.amount }}</span>
            <span>会员年费购买总额：{{ dashboardData.grossSales | currency}}</span>
            <span>会员年费当前收入总额：{{ currentIncome | currency}}</span>
        </div>

        <div class="info-table">
            <Table stripe :row-class-name="rowClassName" :columns="columns" :data="data"></Table>
            <div class="page">
                <div style="display: inline-block">
                    <Page :current.sync="currentPageNum" :total="dataTotal" show-elevator @on-change="(p) => pgChange(p)"></Page>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { vipById, vipByTime } from '@/api';
    import _mixins from '@/mixins';
    import moment from 'moment';
    export default {
        mixins: [_mixins],
        data() {
            return {
                currentPageNum: 1,
                dataTotal: 0,
                searchId: '',
                allBtn: 'all',
                currentIncome: 0,
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80
                    },
                    {
                        title: '订单编号',
                        key: 'order',
                        align: 'center',
                        width: 200
                    },
                    {
                        title: '用户账号',
                        key: 'user',
                        align: 'center'
                    },
                    {
                        title: '购买时间',
                        key: 'buytime',
                        align: 'center'
                    },
                    {
                        title: '购买次数',
                        key: 'cishu',
                        align: 'center'
                    },
                    {
                        title: '购买单价',
                        key: 'price',
                        align: 'center',
                        render: (h,p) => p.row.price.toFixed(2)
                    },
                    {
                        title: '购买总价',
                        key: 'total',
                        align: 'center',
                        render: (h,p) => p.row.total.toFixed(2)
                    }
                ],
                data: []
            };
        },
        created() {
            this.getAllVip();
        },
        methods: {
            rowClassName(row, index) {
                if (index % 2) {
                    return 'double-row';
                } else {
                    return 'single-row';
                }
            },
            getVipById() {
                if (!this.searchId) {
                    this.$Message('请输入id');
                    return;
                }
                this.currentPageNum = 1;
                this.dataTotal = 0;
                vipById({ id: this.searchId }).then(res => {
                    this.data = res.list;
                    this.dashboardData.amount = res.list.length;
                    this.dashboardData.grossSales = res.list.length * 200;

                });
            },
            getVipByTime(p = 1, sTime = this.s_time, eTime = this.e_time) {
                vipByTime({
                    start: sTime,
                    end: eTime,
                    page_index: p,
                    page_num: 10
                }).then(res => {
                    this.data = res.list;
                    this.currentIncome = res.sum;
                    if (!this.dataTotal) {
                        this.dataTotal = res.total;
                        this.dashboardData.amount = res.total;
                        this.dashboardData.grossSales = res.total * 200;
                    }
                });
            },
            getAllVip() {
                this.s_time = '2015/01/01';
                this.e_time = '';
                this.currentPageNum = 1;
                this.dataTotal = 0;
                this.getVipByTime(1, '2015/01/01', moment().format('YYYY/MM/DD'));
            },
            searchHandle() {
                if (!this.s_time || !this.e_time) {
                    this.$Message.error('请选择时间！');
                    return;
                }
                if (this.e_time < this.s_time) {
                    this.$Message.error('结束时间不能大于开始时间');
                    return;
                }
                this.currentPageNum = 1;
                this.dataTotal = 0;
                this.allBtn = '';
                this.getVipByTime();
            },
            pgChange(p) {
                if (this.allBtn === 'all') {
                    this.getVipByTime(p, '2015/01/01', moment().format('YYYY/MM/DD'));
                } else {
                    this.getVipByTime(p);
                }
            }
        }
    };
</script>
