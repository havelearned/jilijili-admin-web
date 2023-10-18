<template>
  <div>
    <div class="col bg-white shadow-2 q-pa-md q-ma-sm">
      <q-table flat color="primary" class="cross_table"
               separator="cell" :visible-columns="group"
               row-key="id" :columns="columns" :rows="list"
               v-model:pagination="pagination"
               :loading="loading"
               @request="query"
               :rows-per-page-options="[10,20,50,100]"
               selection="multiple"
               v-model:selected="selected">
        <template v-slot:top="table">
          <div class="row no-wrap full-width">

            <q-input clearable outlined dense placeholder="请输入关键字搜索"
                     class="on-left" @input="query" debounce="500" v-model="searchForm.roleName">
              <template #append>
                <q-btn flat round icon="search" color="primary" @click="query" :loading="loading">
                  <q-tooltip>搜索</q-tooltip>
                </q-btn>
              </template>
            </q-input>

            <q-space/>

            <div class="q-gutter-xs">
              <q-btn icon="add" no-wrap color="primary" label="新建" @click="add"/>
              <q-btn no-wrap v-show="$q.screen.gt.sm" color="primary" label="导入" icon="file_upload"
                     :loading="importing"
                     @click="importExcel">
                <q-tooltip>请选择Excel文件</q-tooltip>

                <q-uploader auto-upload ref="excelUploader" :max-files="1"
                            class="hidden" :url="url.importExcelUrl" field-name="file"
                            accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            @uploaded="importedExcel"/>
              </q-btn>
              <q-btn-dropdown split no-wrap label="导出" icon="file_download" color="primary"
                              v-show="$q.screen.gt.sm"
                              :loading="exporting" @click="exportExcel('专辑数据')">
                <q-list>
                  <q-item clickable v-close-popup>
                    <q-btn no-wrap v-show="$q.screen.gt.sm" :loading="exporting"
                           label="下载导入模板" icon="file_download" color="primary"
                           @click="meExportExcel('专辑数据导入模板')"
                    />
                  </q-item>
                </q-list>
              </q-btn-dropdown>

              <q-btn no-wrap color="negative" label="批量删除" icon="delete"
                     :disable="selected.length === 0" v-show="$q.screen.gt.md" @click="showConfirm()"/>
              <q-btn color="primary" label="切换全屏" no-wrap
                     v-show="$q.screen.gt.md" @click="table.toggleFullscreen"
                     :icon="table.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"/>
              <q-btn-dropdown color="primary" label="自选列" icon="view_list" no-wrap
                              v-if="false"
                              v-show="$q.screen.gt.md">
                <q-list>
                  <q-item tag="label" v-for="item in columns" :key="item.name">
                    <q-item-section avatar>
                      <q-checkbox v-model="group" :val="item.name"/>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ item.label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
          </div>
        </template>


        <!--        {-->
        <!--        "couponId": "100493",-->
        <!--        "couponType": 1,-->
        <!--        "couponAmount": 58.61,-->
        <!--        "minPurchaseAmount": 25.58,-->
        <!--        "expirationDate": "2023-09-30T06:51:51.000+00:00",-->
        <!--        "otherCouponInfo": "3-19-10 Shimizu, Kita Ward"-->
        <!--        }-->

        <template #body-cell-coupons="props">
          <q-td :props="props">
            <div v-if="props.row.coupons">
              <div>{{ props.row.coupons.otherCouponInfo }}</div>
              <div>{{ props.row.coupons.expirationDate }}</div>
              <div>{{ props.row.coupons.minPurchaseAmount }}</div>
              <div>优惠类型:{{ props.row.coupons.couponType }}</div>
              <div>优惠金额:{{ props.row.coupons.couponAmount }}</div>
            </div>
          </q-td>
        </template>


        <template #body-cell-couponType="props">
          <q-td :props="props">
            <q-chip v-if="props.row.coupons[0].couponType === 1"
                    square color="teal" size="md" outline>满减
            </q-chip>
            <q-chip v-if="props.row.coupons[0].couponType === 2"
                    square color="blue" size="md" outline>直减
            </q-chip>
            <q-chip v-if="props.row.coupons[0].couponType === 3"
                    square color="orange" size="md" outline>免费
            </q-chip>
          </q-td>
        </template>



        <template #body-cell-isUsed="props">
          <q-td :props="props">
            <q-chip v-if="props.row.isUsed" square color="teal" size="md" outline>
              未使用
            </q-chip>
            <q-chip v-else square color="gray" size="md" outline>
              已使用
            </q-chip>

          </q-td>
        </template>

        <template #body-cell-couponAmount="props">
          <q-td :props="props">
            <q-chip square color="red" size="md" outline>
              {{props.row.coupons[0].couponAmount}}￥
            </q-chip>
          </q-td>
        </template>


        <template #body-cell-minPurchaseAmount="props">
          <q-td :props="props">
            <div>满:
              <q-chip square color="red" size="md" outline>
                {{ props.row.coupons[0].minPurchaseAmount }}￥
              </q-chip>

              可用
            </div>
          </q-td>
        </template>

        <template #body-cell-otherCouponInfo="props">
          <q-td :props="props">
            <div v-if="props.row.coupons">
              <div>{{ props.row.coupons[0].otherCouponInfo }}</div>
            </div>
            <div v-else>
              没有介绍的优惠卷,建议删除
            </div>
          </q-td>
        </template>

        <template #body-cell-nickname="props">
          <q-td :props="props" auto-width>
            <q-item clickable v-ripple>
              <q-item-section side>
                <q-avatar rounded size="48px">
                  <img :src="props.row.avatar"/>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label> {{ props.row.nickname }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-td>
        </template>


        <template #body-cell-opt="props">
          <q-td :props="props">
            <q-btn flat round dense color="primary" icon="edit" @click="my_EditBefore(props.row)">
              <q-tooltip>编辑</q-tooltip>
            </q-btn>
            <btn-del :label="props.row.title" @confirm="deleted(props.row)"/>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog maximized flat persistent ref="dialog">
      <q-form @submit="submit" class="dialog_card  q-ma-sm">
        <h5 class="view_title justify-between q-px-md">
          {{ editType }}角色信息
          <q-btn dense outline round icon="clear" size="sm" v-close-popup/>
        </h5>
        <q-scroll-area class="column" style="height: 80%">
          <div class="row q-col-gutter-x-md dialog_form q-pa-md">
            <div class="col-6">
              <h5>角色标识:</h5>
              <q-input outlined dense square clearable v-model="form.roleName"
                       type="tel" :rules="[requiredTest]"/>
            </div>
            <div class="col-6">
              <h5>角色名称:</h5>
              <q-input outlined dense square clearable v-model="form.title"
                       type="tel" :rules="[requiredTest]"/>
            </div>
          </div>
        </q-scroll-area>
        <div class="row justify-center q-pa-md">
          <q-btn outline color="primary" icon="mdi-close-thick" label="关闭" v-close-popup/>
          <q-btn class="q-mx-sm" color="primary" icon="mdi-check-bold" :loading="loading" label="提交" type="submit"/>
        </div>
      </q-form>
    </q-dialog>
    <confirm ref="confirmDialog" :msg="confirmMsg" @confirm="deleteBatch()"/>
  </div>

</template>

<script>


import {IndexMixin} from "@/boot/mixins/indexV2";
import {ellipsis} from "@/boot/datatype";
import {getDictLabel} from "@/boot/dictionary";
import {requiredTest} from "@/boot/inputTest";
import Confirm from "@/components/confirm.vue";
import BtnDel from "@/components/btndel.vue";
import {defineComponent} from "vue";
import {getDictItem} from "@/boot/api/sys/tool";

export default defineComponent({
      name: "redeemcode",
      mixins: [IndexMixin],
      components: {
        BtnDel, Confirm,
      },
      data() {
        return {
          columns: [
            {name: 'index', align: 'center', label: '序号', field: 'index',},
            {name: "userCouponId", align: 'center', label: '编号', field: "userCouponId",},
            {name: "nickname", align: 'center', label: '用户昵称', field: "nickname",},
            {name: "coupons", align: 'center', label: '优惠卷', field: "coupons",},
            {name: "couponType", align: 'center', label: '优惠卷类型', field: "couponType",},
            {name: "otherCouponInfo", align: 'center', label: '信息', field: "otherCouponInfo",},
            {name: "minPurchaseAmount", align: 'center', label: '使用条件', field: "minPurchaseAmount",},
            {name: "couponAmount", align: 'center', label: '优惠金额', field: "couponAmount",},
            {name: "isUsed", align: 'center', label: '优惠卷使用情况', field: "isUsed",},
            {name: "usageDate", align: 'center', label: '过期使用时间', field: "usageDate",},
            {name: "userId", align: 'center', label: '用户id', field: "userId",},
            {name: "avatar", align: 'center', label: '用户头像', field: "avatar",},
            {name: 'opt', align: 'center', label: '操作', field: 'opt',},],
          imgUrl: `${process.env.BASE_URL}/sys/common/static`,
          url: {
            list: '/shop/coupons/coupons/list',
            add: '/shop/coupons/coupons',
            edit: '/shop/coupons/coupons',
            deleteBatch: '/shop/coupons/coupons',
          },
          dictCouponType:[],
        }
      },
      methods: {
        ellipsis,
        getDictLabel,
        requiredTest,
        initDict() {
          this.group = ['index',
            // "userCouponId","userId","coupons"
            "otherCouponInfo", "minPurchaseAmount", "couponAmount","couponType",
            "isUsed", "nickname", "usageDate",  'opt']

          getDictItem("sys_shop_coupon_type").then(res=>{
            this.dictCouponType = res.data
          })

        },
        change(html, txt) {
          this.form.content = html;
          this.form.txtContent = txt;
        },

        deleted(row) {
          console.log("删除的内容=>", row)
          this.del(row)
        },
        my_EditBefore(row) {
          this.edit(row)
        },
        meExportExcel(filename) {
        },
      },
      mounted() {
        this.initDict();
      },


    }
)


</script>

<style scoped lang="css">

</style>
