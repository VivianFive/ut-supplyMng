<style scoped lang="less">

    .filter-box{
        padding: 20px 50px;
        margin: 30px 0 10px;
    }

</style>
<template>
    <div id="dashboard" class="main-container">
        <div class="filter-box">
            时间：<DatePicker :options="options_s" @on-change="(date) => { s_time = date }" :value="s_time" format="yyyy/MM/dd" type="date" placeholder="请选择开始时间" style="width: 200px"></DatePicker>
             - <DatePicker @on-change="(date) => { e_time = date }" :value="e_time" format="yyyy/MM/dd" type="date" placeholder="请选择结束时间" style="width: 200px"></DatePicker>
            <button class="search-btn" @click="searchHandle">查询</button>
            <div class="radio-group">
                <input type="radio" name="month" id="month1" v-model="allBtn" value="all"/>
                <label for="month1" @click="getAll">全部</label>
            </div>
            <a href="http://data.bestkeep.cn/download/gaikuang.xlsx"  class="search-btn export-btn">导出excl(全部数据)</a>
        </div>
        <div class="dashboard-data">
            <ul class="info-ul">
                <li>
                    <input type="radio" id="consumption" name="total"/>
                    <label for="consumption">
                        <b>{{ dashboardData.big | currency }}</b>
                        <span>会员供货收入</span>
                    </label>
                </li>
                <li>
                    <input type="radio" id="vip" name="total"/>
                    <label for="vip">
                        <b>{{ dashboardData.year | currency }}</b>
                        <span>会员年费购买总额</span>
                    </label>
                </li>
                <li>
                    <input type="radio" id="service" name="total"/>
                    <label for="service">
                        <b>{{ dashboardData.service | currency }}</b>
                        <span>服务费汇总</span>
                    </label>
                </li>
                <li>
                    <input type="radio" id="expend" name="total"/>
                    <label for="expend">
                        <b>{{ dashboardData.expend | currency }}</b>
                        <span>会员供货支出</span>
                    </label>
                </li>
            </ul>
        </div>
        <div class="info-table">
            <Table stripe :row-class-name="rowClassName" :columns="columns" :data="data"></Table>
            <div class="page">
                <div style="display: inline-block">
                    <Page :current.sync="currentPageNum" class-name="page-class" :total="dataTotal" show-elevator @on-change="(p) => spliceTable(p-1)"></Page>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { dashboardReq } from '@/api';
    import _mixins from '@/mixins';
    import moment from 'moment';
    let tableData;
    export default {
        mixins: [_mixins],
        data() {
            return {
                currentPageNum: 1,
                allBtn: 'all',
                columns: [
                    {
                        title: '时间',
                        key: 'time',
                        align: 'center'
                    },
                    {
                        title: '会员供货收入',
                        key: 'bigin',
                        align: 'center',
                        render: (h,p) => p.row.bigin.toFixed(2)
                    },
                    {
                        title: '会员年费',
                        key: 'year',
                        align: 'center',
                        render: (h,p) => p.row.year.toFixed(2)
                    },
                    {
                        title: '服务费',
                        key: 'serv',
                        align: 'center',
                        render: (h,p) => p.row.serv.toFixed(2)
                    },
                    {
                        title: '会员供货支出',
                        key: 'bigout',
                        align: 'center',
                        render: (h,p) => p.row.bigout.toFixed(2)
                    }
                ],
                data: [],
                dataTotal: 0
            };
        },
        created() {
            this.getAll();
        },
        methods: {
            rowClassName(row, index) {
                if (index % 2) {
                    return 'double-row';
                } else {
                    return 'single-row';
                }
            },
            getDashboardData(par) {
                this.currentPageNum = 1;
                dashboardReq(par).then(res => {
                    tableData = res.list;
                    this.dataTotal = res.list.length;
                    this.spliceTable();
                    this.computeTotal(res.list);
                });
            },
            getAll() {
                this.s_time = "2015/01/01";
                this.e_time = "";
                this.getDashboardData({
                    start: '2015/01/01',
                    end: moment().format('YYYY/MM/DD')
                });
            },
            // 分页
            spliceTable(page = 0) {
                this.data = tableData.slice(page * 10, (page + 1) * 10);
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
                this.allBtn = '';
                this.getDashboardData({
                    start: this.s_time,
                    end: this.e_time
                });
            },
            computeTotal(arr) {
                if (arr.length === 0) return;
                let total = arr.reduce((pre, cur) => {
                    return {
                        'bigin': pre.bigin + cur.bigin,
                        'year': pre.year + cur.year,
                        'serv': pre.serv + cur.serv,
                        'bigout': pre.bigout + cur.bigout
                    };
                });
                this.dashboardData.big = total.bigin;
                this.dashboardData.year = total.year;
                this.dashboardData.service = total.serv;
                this.dashboardData.expend = total.bigout;
            }
        }
    };
</script>
