<style scoped lang="less" type="text/less">
    .dashboard-block {
        display: flex;
        justify-content: space-between;
        > .block-item {
            width: 23%;
            height: 160px;
            background: #F4F4F4;
            text-align: center;
            padding: 20px;
            h4, p {
                margin-bottom: 12px;
            }
            .dashNum{
                text-align: left;
                display: inline-block;
                /*
                text-align: justify;
                width: 80px;
                vertical-align: top;*/
            }
            /*.dashNum:after{
                content: '';
                display: inline-block;
                width: 100%;
                overflow: hidden;
                height: 0;
            }*/
        }
    }

    .chart {
        margin: 20px 0 10px;
        border: 1px solid #979797;
        padding: 10px;
        border-radius: 5px;
    }

    #commodity-chart {
        width: 100%;
        height: 400px;
    }

    #income-chart {
        width: 100%;
        height: 400px;
    }
</style>
<template>
    <div id="supplyDashboard" class="main-container">
        <div class="com-settings-header">
            <h4>概况</h4>
        </div>
        <div class="dashboard-block">
            <div class="block-item">
                <div>
                    <h4>总收益</h4>
                    <div class="dashNum">
                    <p>平台总收益：{{PlatformList.platformIncome | currency}}</p>
                    <p>用户总收益：{{PlatformList.income | currency}}</p>
                    </div>
                </div>
            </div>
            <div class="block-item">
                <div>
                    <h4>货权商品数量</h4>
                    <div class="dashNum">
                    <p><span>商品总量：</span>{{PlatformList.goodsTotal}}</p>
                    <p><span>在售货权：</span>{{PlatformList.goodsSelling}}</p>
                    <p><span>待审货权：</span>{{PlatformList.goodsNew}}</p>
                    </div>
                </div>

            </div>
            <div class="block-item">
                <div>
                    <h4>订单数量</h4>
                    <div class="dashNum">
                    <p>订单总笔数：{{PlatformList.orderTotal}}</p>
                    <p>待发货订单：{{PlatformList.orderWait}}</p>
                    <p>已完成订单：{{PlatformList.orderDone}}</p>
                    </div>
                </div>

            </div>
            <div class="block-item">
                <div>
                    <h4>用户数量</h4>
                    <div class="dashNum">
                    <p>供应商总量：{{PlatformList.userTotal}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="com-settings-header">
            <h4>货权商品趋势图</h4>
        </div>
        <div class="chart">
            <RadioGroup v-model="timeLine" type="button" @on-change="getCommodityChartInfo">
                <Radio label="2">年</Radio>
                <Radio label="1">月</Radio>
                <Radio label="0">日</Radio>
            </RadioGroup>
            <div id="commodity-chart">

            </div>
        </div>
        <div class="com-settings-header">
            <h4>收益趋势图</h4>
        </div>
        <div class="chart">
            <RadioGroup v-model="incomeTimeLine" type="button" @on-change="getIncomeChartInfo">
                <Radio label="2">年</Radio>
                <Radio label="1">月</Radio>
                <Radio label="0">日</Radio>
            </RadioGroup>
            <div id="income-chart">

            </div>
        </div>


    </div>
</template>
<script>
    import echarts from 'echarts'
    import {getPlatformData, getCommodityChart, getIncomeChart} from '@/api'

    export default {
        data() {
            return {
                PlatformList:{},
                timeLine: '0',
                incomeTimeLine: '0',
                //实时数据
                chart: null,
                commodityData: {},
                income: null,
                incomeData: {},
                inchart:null,
            };
        },
        created() {
            this.getPlatformList();
            //折线图
            this.getCommodityChartInfo();
            this.getIncomeChartInfo();
        },
        methods: {
            getPlatformList() {
                return getPlatformData().then(res => {
                    this.PlatformList = res;
                })
            },
            getCommodityChartInfo() {
                return getCommodityChart().then(res => {
                    this.commodityData = res;
                    this.selectCommodityData();
                })
            },
            selectCommodityData() {
                let dataType, xAxis, selling, wait;
                dataType = this.timeLine === '0' ? 'day' : this.timeLine === '1' ? 'month' : 'year';
                xAxis = this.commodityData.selling[dataType].map(e => Object.keys(e).join(''));
                selling = this.commodityData.selling[dataType].map(e => Object.values(e).join(''));
                wait = this.commodityData.wait[dataType].map(e => Object.values(e).join(''));
//                初始化图标
                this.chart ? this.updataCommodityChart(xAxis, selling, wait) : this.initCommodityChart(xAxis, selling, wait)
            },
            initCommodityChart(xAxis, selling, wait) {
                this.chart = echarts.init(document.getElementById('commodity-chart'));
                this.chart.setOption({
                    color: ['#5B9BD5', '#ED7D31'],
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['在售货权商品', '待审货权商品']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: xAxis
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '在售货权商品',
                            type: 'line',
                            data: selling
                        },
                        {
                            name: '待审货权商品',
                            type: 'line',
                            data: wait
                        }
                    ]
                })
            },
            updataCommodityChart(xAxis, selling, wait) {
                this.chart.setOption({
                    color: ['#5B9BD5', '#ED7D31'],
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['在售货权商品', '待审货权商品']
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: xAxis
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '在售货权商品',
                            type: 'line',
                            data: selling
                        },
                        {
                            name: '待审货权商品',
                            type: 'line',
                            data: wait
                        }
                    ]
                })
            },

            getIncomeChartInfo() {
                return getIncomeChart().then(res => {
                    this.incomeData = res;
                    this.selectincomeData();
                })
            },
            selectincomeData(){
                let inComeType,xAix,platform,users;
                inComeType = this.incomeTimeLine === '0' ? 'day' : this.incomeTimeLine === '1' ? 'month' :'year';
                xAix = this.incomeData.platform[inComeType].map(e =>Object.keys(e).join(''));
                platform = this.incomeData.platform[inComeType].map(e => Object.values(e).join(''));
                users = this.incomeData.users[inComeType].map(e => Object.values(e).join(''));
                this.income ? this.updataInComeChart(xAix,platform,users) : this.initInComeChart(xAix,platform,users)
            },
            initInComeChart(xaxis,platform,users){
                this.inchart = echarts.init(document.getElementById('income-chart'));
                this.inchart.setOption({
                    color: ['#5B9BD5', '#ED7D31'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['平台总收益', '供应商总收益']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        axisTick: {show: false},
                        data:xaxis
                    }],
                    yAxis: [{
                        type: 'value',
                    }],
                    series: [
                        {
                            name: '平台总收益',
                            type: 'bar',
                            data: platform
                        },
                        {
                            name: '供应商总收益',
                            type: 'bar',
                            data: users
                        }
                    ]
                })
            },
            updataInComeChart(xaxis,platform,users){
                this.inchart.setOption({
                    color: ['#5B9BD5', '#ED7D31'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['平台总收益', '供应商总收益']
                    },
                    xAxis: [
                        {
                        boundaryGap: false,
                        data:xaxis
                    }
                    ],
                    yAxis: [
                        {
                        type: 'value',
                    }
                    ],
                    series: [
                        {
                            name: '平台总收益',
                            type: 'bar',
                            data: platform
                        },
                        {
                            name: '供应商总收益',
                            type: 'bar',
                            data: users
                        }
                    ]
                })
            }
        }
    };
</script>
