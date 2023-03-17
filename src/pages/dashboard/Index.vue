<template>
  <div class="page">
    <q-card>
      <div class="welcome-piece">
        <div class="welcome-float q-pa-md q-gutter-sm">
          <q-avatar size="80px" font-size="52px" color="teal" text-color="white" icon="directions">
            {{ nickname }}
          </q-avatar>

          <div>
            <div class="welcome-title-font">
              {{ `欢迎光临:` + nickname }}<br>
            </div>

            <div class="welcome-font">
              这是jilijili后台管理系统
            </div>
          </div>
        </div>
      </div>
    </q-card>


    <!--   今日数据   -->
    <q-card>
      <div class="quota">
        <div style="padding: 20px" class="q-ma-sm">
          <q-banner inline-actions>
            今日数据
            <template v-slot:action>
              <q-input type="date"/>
            </template>
          </q-banner>
        </div>

        <div class="quota-box q-ma-md">
          <div class="quota-item" v-for="() in 5">
            <div class="quota-font">今日增长</div>
            <div class="quota-point">90人</div>
            <div class="quota-action-point">同比昨日

              <span class="quota-action-data">50%</span>
              <q-icon size="xs" color="red" name="font_download"/>
            </div>
          </div>
        </div>
      </div>
      <q-inner-loading
        :showing="visible"
        label="加载中..."
        label-class="text-teal"
        label-style="font-size: 1.1em"
      />
    </q-card>

    <!-- 统计数据-->
    <q-card class="summary-box">
      <div class="summary-card">
        <div class=" summary-font">总流量</div>
        <div class=" summary-font">601,986,875</div>
      </div>
      <div class="summary-line"></div>


      <div class="summary-card" >
        <div class="summary-row">
          <div ref="pay" style="width: 100px;height: 100px"></div>
          <div>
            <div class=" summary-font">付费用户</div>
            <div class=" summary-font-point">601,986,875</div>
            <div class=" summary-font-min">同步上升:<em>100%</em></div>
          </div>
        </div>
      </div>
    </q-card>


    <div class="trend-box">
      <q-card class="trend-item1">

        <q-banner inline-actions class="text-white bg-grey-14">

          <template v-slot:action>
            <q-btn flat color="white" label="月数据趋势"/>
          </template>
        </q-banner>

        <div class="trend-contain">
          <div class="">支付成功率</div>
          <div class="">45.82</div>
          <div class="">周上升:<em>100%</em>月同比下降<em>10%</em></div>

          <div ref="test" style="width: 100%;height: 200px">
            统计图
          </div>
        </div>


        <q-inner-loading
          :showing="visible"
          label="加载中..."
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </q-card>

      <q-card class="trend-item2">
        <q-banner inline-actions class="text-white bg-grey-14">

          <template v-slot:action>
            <q-btn flat color="white" label="排查代办提示"/>
          </template>
        </q-banner>

        <q-inner-loading
          :showing="visible"
          label="加载中..."
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </q-card>

      <q-card class="trend-item3">
        <q-banner inline-actions class="text-white bg-grey-14">
          <template v-slot:action>
            <q-btn flat color="white" label="产品销售好评度"/>
          </template>
        </q-banner>


        <q-inner-loading
          :showing="visible"
          label="加载中..."
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </q-card>
    </div>




  </div>
</template>

<script setup>
import {useStore} from "vuex";
import {computed, onMounted, ref} from "vue";
import * as echarts from 'echarts';

const visible = ref(false);
const store = useStore();
const nickname = computed(() => store.state.user.currentUser ? store.state.user.currentUser.nickname.slice(1) : '登录');

const pay= ref(null)
const test= ref(null)
const free=ref(null)
const other=ref(null)
onMounted(()=>{
  const myChart = echarts.init(pay.value);
  const option  ={
    title: {
      text: '',
      left: 'center',
      top: 'center'
    },
    series: [
      {
        type: 'pie',
        data: [
          {
            value: 335,
            name: 'A'
          },
          {
            value: 234,
            name: 'B'
          },
          {
            value: 1548,
            name: 'C'
          }
        ],
        radius: ['40%', '70%']
      }
    ]
  }
  myChart.setOption(option)

  const myChart2 = echarts.init(test.value);
  const option2  ={
    xAxis: {
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {},
    series: [
      {
        type: 'bar',
        data: [23, 24, 18, 25, 27, 28, 25]
      }
    ]
  }
  myChart2.setOption(option2)


  // 付费流量
  const plaOption={
    xAxis: {
      data: ['付费流量']
    },
    yAxis: {},
    series: [
      {
        type: 'bar',
        data: [23]
      }
    ]
  }


  // 免费流量
  const freeOption={
    xAxis: {
      data: ['免费流量']
    },
    yAxis: {},
    series: [
      {
        type: 'bar',
        data: [23]
      }
    ]
  }

  // 其他流量
  const otherOption={
    xAxis: {
      data: ['其他流量']
    },
    yAxis: {},
    series: [
      {
        type: 'bar',
        data: [23]
      }
    ]
  }

})


const initEcharts=(option,refDoc)=>{
  echarts.init(refDoc.value).setOption(option)
}



</script>

<style scoped lang="less">
@import "src/css/dashboard.less";
</style>

