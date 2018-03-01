<style type="text/less">
    .checkInfo{
        padding: 20px 100px 20px 20px;
    }
    .checkInfoDetail{
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        color:#495060;
    }
    .checkResult{
        padding: 20px 20px;
        .condition{
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            margin-top: 20px;
        }
    }
</style>
<template>
    <div id="commodityInfoSale"  class="main-container">
        <div style="margin-top: 20px;position: relative">
            <div class="com-settings-header">
                <h4>审核信息</h4>
            </div>
        </div>
        <div class="dashboard-data checkInfo">
            <div class="checkInfoDetail">
                <div>审核结果：{{auditInfo.audit}}</div>
                <div>审核人员：{{auditInfo.auditPerson}}</div>
                <div>审核时间：{{auditInfo.auditTime}}</div>
            </div>
            <div v-if="auditInfo.status == 1" style="padding-top: 5px">拒绝原因：{{auditInfo.auditReason}}</div>
        </div>
        <div style="margin-top: 20px;position: relative" v-if="auditInfo.status != 1">
            <div class="com-settings-header">
                <h4>销售信息</h4>
            </div>
        </div>
        <div class="dashboard-data checkResult" v-if="auditInfo.status != 1">
            <div>销售状态：{{auditInfo.status | statusFilter}}</div>

            <div class="condition">
                <span style="width: 80px;display:inline-block;margin-top: 20px">销售情况：</span>
                <div style="flex:1;margin-top: 20px">
                    <Table height="200" :columns="columns" :data="series"></Table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  export default {
      props: {
          auditInfo: {
              type: Object
          },
          series: {
              type: Array
          }
      },
      filters: {
          statusFilter(v) {
              const map = ['待审核','审核不通过','在售','部分售罄','已售罄','已下架'];
              return map[v];
          }
      },
      data() {
          return {
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
                      key:'totle',
                      align:'center',
//                      render: (h,p) => p.row.supplyPrice * p.row.num
                      render: (h,p) => (p.row.supplyPrice * p.row.num).toFixed(2)
                  }
              ]
          }
      },
      methods:{

      }
  }
</script>
