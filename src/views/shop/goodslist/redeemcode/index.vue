<template>
  <div>
    <div class="col bg-white shadow-2 q-pa-md q-ma-sm">
      <q-table flat color="primary" class="cross_table"
               separator="cell" :visible-columns="group"
               row-key="promoCodeId" :columns="columns" :rows="list"
               v-model:pagination="pagination"
               :loading="loading"
               @request="query"
               :rows-per-page-options="[10,20,50,100]"
               selection="multiple"
               v-model:selected="selected">
        <template v-slot:top="table">
          <div class="row no-wrap full-width q-gutter-xs">
<!--            <q-input clearable outlined dense placeholder="请输入关键字搜索"-->
<!--                     class="on-left" @input="query" debounce="500" v-model="searchForm.promoCode">-->
<!--            </q-input>-->

            <q-select outlined dense square clearable map-options emit-value
                      v-model="searchForm.isUsed" :options="useStatus"
                      input-debounce="0"
                      new-value-mode="add-unique">
              <template v-slot:before>
                <h5>使用情况</h5>
              </template>
            </q-select>

<!--            <q-select outlined dense square clearable map-options emit-value-->
<!--                      v-model="searchForm.isExpiration" :options="isExpiration"-->
<!--                      input-debounce="0"-->
<!--                      new-value-mode="add-unique">-->
<!--              <template v-slot:before>-->
<!--                <h5>是否过期</h5>-->
<!--              </template>-->
<!--            </q-select>-->

            <div class="q-gutter-xs row">
              <q-btn label="搜索" square icon="search" color="primary" @click="query" :loading="loading">
              </q-btn>
              <q-btn label="重置" square icon="search" color="primary" @click="searchForm=[]" :loading="loading">
              </q-btn>
            </div>

            <q-space/>

            <div class="q-gutter-xs">
              <q-btn icon="add" no-wrap color="primary" label="新增" @click="add"/>
              <q-btn icon="add" no-wrap color="primary" label="批量生成" @click="addBatchBe"/>
              <q-btn-dropdown split no-wrap label="导出" icon="file_download" color="primary"
                              v-show="$q.screen.gt.sm"
                              :loading="exporting" @click="exportExcel('兑换码数据')">
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


        <template #body-cell-createdTime="props">
          <q-td :props="props">
            {{ formatDate(props.row.createdTime, "yyyy-MM-dd") }}
          </q-td>
        </template>

        <template #body-cell-promoCode="props">
          <q-td :props="props">
            <q-btn :label="ellipsis(props.row.promoCode,15)" flat square @click="copyText(props.row.promoCode)">
              <q-tooltip>复制</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template #body-cell-genCount="props">
          <q-td :props="props">
            <q-btn :label="ellipsis(props.row.genCount,5)" flat square @click="copyText(props.row.genCount)">
              <q-tooltip>复制</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template #body-cell-isUsed="props">
          <q-td :props="props">
            <q-chip :color="props.row.isUsed ? 'red' : 'teal' ">
              {{ props.row.isUsed === 1 ? '已使用' : '未使用' }}
            </q-chip>
          </q-td>
        </template>
        <template #body-cell-isExpiration="props">
          <q-td :props="props">
            <q-chip :color="props.row.isExpiration ? 'red' : '' ">
              {{ isEx(props.row.expirationDate) }}
            </q-chip>
          </q-td>
        </template>

        <template #body-cell-opt="props">
          <q-td :props="props">
            <q-btn size="sm" v-if="!props.row.isUsed" label="绑定优惠卷"
                   square dense color="primary" icon="attachment" @click="my_EditBefore(props.row)">
            </q-btn>
            <btn-del v-if="!props.row.isUsed" :label="props.row.title" @confirm="del(props.row.promoCodeId)"/>
          </q-td>
        </template>
      </q-table>
    </div>
    <!--    添加单个-->
    <q-dialog maximized flat persistent ref="dialog">
      <q-form @submit="submit" class="dialog_card  q-ma-sm">
        <h5 class="view_title justify-between q-px-md">
          {{ editType }}绑定优惠卷
          <q-btn dense outline round icon="clear" size="sm" v-close-popup/>
        </h5>
        <q-scroll-area class="column" style="height: 80%">
          <div class="row q-col-gutter-x-md dialog_form q-pa-md">
            <div class="col-6">
              <h5>选择优惠卷:
                <q-icon name="?" color="blue">
                  <q-tooltip>只能选择一个优惠卷</q-tooltip>
                </q-icon>
              </h5>
              <q-select outlined dense square clearable use-chips
                        map-options emit-value :options="coupons"
                        v-model="form.couponId"
                        :rules="[requiredTest]">
                <template v-slot:after>
                  <q-btn square label="选择" @click="$refs.couponDialog.show()"></q-btn>
                </template>
              </q-select>
            </div>

            <div class="col-6">
              <h5>选择店铺
                <q-icon name="?" color="blue">
                  <q-tooltip>不可用</q-tooltip>
                </q-icon>
              </h5>
              <q-select disable outlined dense square clearable use-chips
                        map-options emit-value :options="coupons"
                        v-model="form.shopId"
                        :rules="[requiredTest]">
                <template v-slot:after>
                  <q-btn disable square label="选择" @click="$refs.couponDialog.show()"></q-btn>
                </template>
              </q-select>
            </div>


            <div class="col-6">
              <h5>过期时间:</h5>
              <q-input
                  :hint="form.expirationDate"
                  outlined type="date" v-model="form.expirationDate"
                  :rules="[requiredTest]">
              </q-input>
            </div>

          </div>
        </q-scroll-area>
        <div class="row justify-center q-pa-md">
          <q-btn outline color="primary" icon="mdi-close-thick" label="关闭" v-close-popup/>
          <q-btn class="q-mx-sm" color="primary" icon="mdi-check-bold" :loading="loading"
                 label="提交" type="submit"/>
        </div>
      </q-form>
    </q-dialog>
    <!--    添加多个-->
    <q-dialog maximized flat persistent ref="batchDialog">
      <q-form @submit="m_submit" class="dialog_card  q-ma-sm">
        <h5 class="view_title justify-between q-px-md">
          {{ editType }}绑定优惠卷
          <q-btn dense outline round icon="clear" size="sm" v-close-popup/>
        </h5>
        <q-scroll-area class="column" style="height: 80%">
          <div class="row q-col-gutter-x-md dialog_form q-pa-md">
            <div class="col-6">
              <h5>选择优惠卷:
                <q-icon name="?" color="blue">
                  <q-tooltip>只能选择一个优惠卷</q-tooltip>
                </q-icon>
              </h5>
              <q-select outlined dense square clearable use-chips
                        map-options emit-value :options="coupons"
                        v-model="form.couponId"
                        :rules="[requiredTest]">
                <template v-slot:after>
                  <q-btn square label="选择" @click="$refs.couponDialog.show()"></q-btn>
                </template>
              </q-select>
            </div>

            <div class="col-6">
              <h5>选择店铺
                <q-icon name="?" color="blue">
                  <q-tooltip>不可用</q-tooltip>
                </q-icon>
              </h5>
              <q-select disable outlined dense square clearable use-chips
                        map-options emit-value :options="coupons"
                        v-model="form.shopId"
                        :rules="[requiredTest]">
                <template v-slot:after>
                  <q-btn disable square label="选择" @click="$refs.couponDialog.show()"></q-btn>
                </template>
              </q-select>
            </div>

            <div class="col-6" v-if="editType === '批量生成' ">
              <h5>数量(个):
                <q-icon name="?" color="blue">
                  <q-tooltip>{{ ">= 10 <= 10000" }}</q-tooltip>
                </q-icon>
              </h5>
              <q-input outlined type="number" v-model="form.batchCount"
                       :rules="[requiredTest]">
              </q-input>
            </div>

            <div class="col-6">
              <h5>过期时间:</h5>
              <q-input
                  :hint="form.expirationDate"
                  outlined type="date" v-model="form.expirationDate"
                  :rules="[requiredTest]">
              </q-input>
            </div>

          </div>
        </q-scroll-area>
        <div class="row justify-center q-pa-md">
          <q-btn outline color="primary" icon="mdi-close-thick" label="关闭" v-close-popup/>
          <q-btn class="q-mx-sm" color="primary" icon="mdi-check-bold" :loading="loading"
                 label="提交" type="submit"/>
        </div>
      </q-form>
    </q-dialog>

    <couponDialog ref="couponDialog" @selected="selectedCoupon"></couponDialog>

    <!--    批量删除-->
    <confirm ref="confirmDialog" :msg="confirmMsg" @confirm="deleteBe"/>
  </div>

</template>

<script>


import {IndexMixin} from "@/boot/mixins/indexV2";
import {ellipsis, formatDate} from "@/boot/datatype";
import {getDictLabel} from "@/boot/dictionary";
import {requiredTest} from "@/boot/inputTest";
import Confirm from "@/components/confirm.vue";
import BtnDel from "@/components/btndel.vue";
import {defineComponent} from "vue";
import {getDictItem} from "@/boot/api/sys/tool";
import {copyToClipboard} from "quasar";
import {useNotify} from "@/boot/useNotify";
import couponDialog from "@/components/dialog/couponsDialog.vue"

export default defineComponent({
      name: "redeem",
      mixins: [IndexMixin],
      components: {
        BtnDel, Confirm, couponDialog
      },
      data() {
        return {
          coupons: [],
          columns: [
            {name: 'index', align: 'center', label: '序号', field: 'index',},
            {name: "promoCodeId", align: 'center', label: "编号", field: "promoCodeId",},
            {name: "couponId", align: 'center', label: '优惠卷id', field: "couponId",},
            {name: "shopId", align: 'center', label: '店铺id', field: "shopId",},
            {name: "promoCode", align: 'center', label: '兑换码', field: "promoCode",},
            {name: "isUsed", align: 'center', label: '使用情况', field: "isUsed",},
            {name: "genCount", align: 'center', label: '生成批次', field: "genCount",},
            {name: "expirationDate", align: 'center', label: '过期时间', field: "expirationDate",},
            {name: "isExpiration", align: 'center', label: '是否过期', field: "isExpiration",},
            {name: "createdTime", align: 'center', label: '创建时间', field: "createdTime",},
            {name: "coupons", align: 'center', label: '优惠卷', field: "coupons",},
            {name: 'opt', align: 'center', label: '操作', field: 'opt',},],
          imgUrl: `${process.env.BASE_URL}/sys/common/static`,
          url: {
            list: '/shop/coupons/promocodes/list',
            add: '/shop/coupons/promocodes',
            addBatch: '/shop/coupons/promocodes/batch',
            edit: '/shop//coupons/promocodes',
            uploadUrl: '/file/upload',
            delete: '/shop/coupons/promocodes',
            deleteBatch: '/shop/coupons/promocodes',
            exportXlsUrl: '/shop/coupons/pormocodes/export',
          },
          useStatus: [],
          isExpiration: [],
        }
      },
      methods: {
        formatDate,
        ellipsis,
        getDictLabel,
        requiredTest,
        initDict() {
          getDictItem("sys_shop_promo_code").then(res => {
            this.useStatus = res.data
          })
          getDictItem("sys_shop_code_expiration_staus").then(res => {
            this.isExpiration = res.data
          })
          this.group = [
            // "promoCodeId","couponId","shopId",
            "index",
            "promoCode", "isUsed",
            "genCount", "isExpiration",
            "createdTime", "opt"
          ]


        },
        isEx(date) {
          return new Date(date) > new Date() ? formatDate(date, "yyyy-MM-dd") : "过期";

        },
        change(html, txt) {
          this.form.content = html;
          this.form.txtContent = txt;
        },
        copyText(text) {
          copyToClipboard(text)
              .then(() => {
                // 成功!
                useNotify().infoNotify("复制成功!")
              })
              .catch(() => {
                // 失败
              })
        },

        deleted(row) {
          console.log("删除的内容=>", row)
          this.del(row)
        },
        deleteBe(){
          this.selected =  this.selected.map(item=>item.promoCodeId)
          this.deleteBatchPlus()
        },
        my_EditBefore(row) {
          this.form.expirationDate = new Date(formatDate(row.expirationDate,"yyyy-MM-dd"))
          this.edit(row)
        },
        meExportExcel(filename) {
        },
        selectedCoupon(coupon) {
          this.coupons = coupon
        },
        addBatchBe() {
          this.editType = "批量生成"
          this.reset();
          this.$refs.batchDialog.show()

        },
        m_submit() {
          this.loading = true
          this.$axiosPlus.post(this.url.addBatch, this.form).then(res => {
            if (res.flag) {
              useNotify().infoNotify(res.message)
            } else {
              useNotify().negativeNotify(res.message)

            }
            this.$refs.batchDialog.hide();
          }).finally(()=>{
            this.query()
            this.loading = true;
          })

        }
      },
      mounted() {
        this.initDict();
      },


    }
)


</script>

<style scoped lang="css">

</style>
