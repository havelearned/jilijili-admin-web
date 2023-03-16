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
        <div style="padding: 20px">
          <q-banner inline-actions>
            今日数据
            <template v-slot:action>
              <q-input type="date"/>
            </template>
          </q-banner>
        </div>

        <div class="quota-box">
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


      <div class="summary-card" v-for="() in 3">
        <div class="summary-row">
          <div>iamge</div>
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

          <div>
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

    <div>用户管理可视化模块

      <div>今日注册:50</div>
      <div>充值用户:0</div>
      <div>日期</div>
    </div>

  </div>
</template>

<script setup>
import {useStore} from "vuex";
import {computed, ref} from "vue";

const visible = ref(false);
const store = useStore();
const nickname = computed(() => store.state.user.currentUser ?
  store.state.user.currentUser.nickname.slice(1) : '登录');


</script>

<style scoped lang="less">
@import "src/css/dashboard.less";
</style>
