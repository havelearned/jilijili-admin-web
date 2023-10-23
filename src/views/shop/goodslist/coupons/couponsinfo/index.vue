<template>
  <div>
    <div class="col bg-white shadow-2 q-pa-md q-ma-sm">
      <q-table flat color="primary" class="cross_table"
               separator="cell" :visible-columns="group"
               row-key="couponId" :columns="columns" :rows="list"
               v-model:pagination="pagination"
               :loading="loading"
               @request="query"
               :rows-per-page-options="[10,20,50,100]"
               selection="multiple"
               v-model:selected="selected">
        <template v-slot:top="table">
          <div class="row no-wrap full-width q-gutter-xs">

            <q-input clearable outlined dense placeholder="请输入编号搜索"
                     class="on-left" @input="query" debounce="500" v-model="searchForm.couponId">
              <template #append>
                <q-btn flat round icon="search" color="primary" @click="query" :loading="loading">
                  <q-tooltip>搜索</q-tooltip>
                </q-btn>
              </template>
            </q-input>

            <q-select  outlined dense square clearable v-model="searchForm.couponType"
                      :options="couponTypes" map-options emit-value>
              <template v-slot:before>
                <h5>类型</h5>
              </template>
            </q-select>


            <q-input clearable outlined dense placeholder="1"
                     class="on-left" @input="query" debounce="500" v-model="searchForm.min">
              <template v-slot:before>
                <h5>优惠金额</h5>
              </template>
              <template #after>
                ~
                <q-input clearable outlined dense placeholder="100"
                         class="on-left" @input="query" debounce="500" v-model="searchForm.max">
                </q-input>
              </template>
            </q-input>


            <q-space/>

            <div class="q-gutter-xs">
              <q-btn icon="add" no-wrap color="primary" label="新建" @click="add"/>
              <q-btn-dropdown split no-wrap label="导出" icon="file_download" color="primary"
                              v-show="$q.screen.gt.sm"
                              :loading="exporting" @click="exportExcel('专辑数据')">

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

        <template #body-cell-expirationDate="props">
          <q-td :props="props" :auto-width="true">
            {{ formatDate(props.row.expirationDate, "yyyy-MM-dd") }}
            <q-chip outline :color="expire(props.row.expirationDate) ? 'red': 'teal'">
              {{ expire(props.row.expirationDate) ? '过期' : `可用` }}
            </q-chip>
          </q-td>
        </template>


        <template #body-cell-couponAmount="props">
          <q-td :props="props" :auto-width="true">
            <q-chip outline color="red">
              {{ props.row.couponAmount }}
            </q-chip>
          </q-td>
        </template>

        <template #body-cell-minPurchaseAmount="props">
          <q-td :props="props" :auto-width="true">
            满:
            <q-chip outline color="red">
              {{ props.row.minPurchaseAmount }}
            </q-chip>
            可用
          </q-td>
        </template>


        <template #body-cell-couponType="props">
          <q-td :props="props" :auto-width="true">
            <q-chip outline
                    :color="props.row.couponType === '1' ? 'teal': props.row.couponType === '2' ? 'blue': 'orange'">
              {{ getLabelByValue(this.couponTypes, props.row.couponType) }}
            </q-chip>
          </q-td>
        </template>

        <template #body-cell-opt="props">
          <q-td :props="props" :auto-width="true">
            <q-btn flat round dense color="primary" icon="edit" @click="my_EditBefore(props.row)">
              <q-tooltip>编辑</q-tooltip>
            </q-btn>
            <btn-del :label="props.row.title" @confirm="deleted(props.row.couponId)"/>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog maximized flat persistent ref="dialog">
      <q-form @submit="submit" class="dialog_card  q-ma-sm">
        <h5 class="view_title justify-between q-px-md">
          {{ editType }}优惠卷信息
          <q-btn dense outline round icon="clear" size="sm" v-close-popup/>
        </h5>
        <q-scroll-area class="column" style="height: 80%">
          <div class="row q-col-gutter-x-md dialog_form q-pa-md">
            <div class="col-6">
              <h5>优惠卷类型:</h5>
              <q-select outlined dense square clearable v-model="form.couponType"
                        :options="couponTypes" map-options emit-value
                        :rules="[requiredTest]"/>
            </div>
            <div class="col-6" v-if="form.couponType !== '3'">
              <h5>优惠金额:</h5>
              <q-input outlined dense square clearable v-model="form.couponAmount"
                       mask="#.##" fill-mask="0" reverse-fill-mask
                       :rules="[requiredTest]"/>
            </div>
            <div class="col-6" v-if="form.couponType !== '3'">
              <h5>使用条件:</h5>
              <q-input outlined dense square clearable v-model="form.minPurchaseAmount"
                       mask="#.##" fill-mask="0" reverse-fill-mask
                       :rules="[requiredTest]"/>
            </div>
            <div class="col-6">
              <h5>过期时间:</h5>
              <q-input outlined dense square clearable :label="form.expirationDate" v-model="form.expirationDate"
                       type="date" :rules="[requiredTest]"/>
            </div>
            <div class="col-6">
              <h5>备注:</h5>
              <q-input outlined dense square clearable v-model="form.otherCouponInfo"
                       type="textarea" :rules="[requiredTest]"/>
            </div>
          </div>
        </q-scroll-area>
        <div class="row justify-center q-pa-md">
          <q-btn outline color="primary" icon="mdi-close-thick" label="关闭" v-close-popup/>
          <q-btn class="q-mx-sm" color="primary" icon="mdi-check-bold" :loading="loading" label="提交" type="submit"/>
        </div>
      </q-form>
    </q-dialog>
    <confirm ref="confirmDialog" :msg="confirmMsg" @confirm="my_delete()"/>
  </div>

</template>

<script>


import {IndexMixin} from "@/boot/mixins/indexV2";
import {ellipsis, formatDate} from "@/boot/datatype";
import {expire, getDictLabel, getLabelByValue} from "@/boot/dictionary";
import {requiredTest} from "@/boot/inputTest";
import Confirm from "@/components/confirm.vue";
import BtnDel from "@/components/btndel.vue";
import {defineComponent} from "vue";
import {getDictItem} from "@/boot/api/sys/tool";

export default defineComponent({
      name: "coupons",
      mixins: [IndexMixin],
      components: {
        BtnDel, Confirm,
      },
      data() {
        return {
          columns: [
            {name: 'index', align: 'center', label: '序号', field: 'index',},
            {name: "couponId", align: 'center', label: '优惠卷编号', field: "couponId",},
            {name: "couponType", align: 'center', label: '类型', field: "couponType",},
            {name: "couponAmount", align: 'center', label: '优惠金额', field: "couponAmount",},
            {name: "minPurchaseAmount", align: 'center', label: '使用条件', field: "minPurchaseAmount",},
            {
              name: "expirationDate", align: 'center', label: '过期时间', field: "expirationDate",
            },
            {name: "otherCouponInfo", align: 'center', label: '备注', field: "otherCouponInfo",},
            {name: 'opt', align: 'center', label: '操作', field: 'opt',},],
          imgUrl: `${process.env.BASE_URL}/sys/common/static`,
          url: {
            list: '/shop/coupons/coupons/list',
            add: '/shop/coupons/coupons',
            edit: '/shop/coupons/coupons',
            delete: '/shop/coupons/coupons',
            deleteBatch: '/shop/coupons/coupons',
          },
          couponTypes: [],
        }
      },
      methods: {
        formatDate,
        expire,
        getLabelByValue,
        ellipsis,
        getDictLabel,
        requiredTest,
        initDict() {
          this.group = ["couponId",
            "couponType",
            "couponAmount",
            "minPurchaseAmount",
            "expirationDate",
            "otherCouponInfo", "opt"]

          getDictItem("sys_shop_coupon_type").then(res => {
            this.couponTypes = res.data;
          })
        },
        my_delete() {
          this.selected = this.selected.map(item => item.couponId)
          this.deleteBatchPlus()

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
