<template>
  <q-page class="cc-admin">
    <div class="col bg-white shadow-2 q-pa-md q-ma-sm">
      <q-table flat color="primary" class="cross_table my-sticky-header-table"
               separator="cell"
               :columns="columns"
               :rows="list"
               row-key="orderId"
               v-model:pagination="pagination"
               :visible-columns="group"
               @request="query"
               :rows-per-page-options="[10,20,50,100]"
               :loading="loading"
               selection="multiple"
               v-model:selected="selected"
      >
        <template v-slot:top="table">
          <div class="row no-wrap full-width">
            <div class="column q-pa-xs q-gutter-xs">
              <q-input outlined dense placeholder="请输入订单编号搜索" class="on-left"
                       @input="query"
                       debounce="500"
                       v-model="searchForm.orderId">
                <template #append>
                  <q-btn flat round icon="search" color="primary" @click="query" :loading="loading">
                    <q-tooltip>搜索</q-tooltip>
                  </q-btn>
                </template>
              </q-input>
              <q-input outlined dense placeholder="用户编号" class="on-left"
                       @input="query"
                       debounce="500"
                       v-model="searchForm.userId">
              </q-input>
              <div class="q-pa-xs q-gutter-xs">
                <q-btn label="搜索" icon="search" color="primary"
                       @click="query" :loading="loading"></q-btn>
                <q-btn icon="clear" label="清空" @click="searchForm={};query()"></q-btn>
              </div>
            </div>
            <div class="column q-pa-xs q-gutter-xs">
              <div class="row">
                <q-input outlined dense placeholder="订单总金额 ¥" debounce="500"
                         v-model="searchForm.min">
                  <template v-slot:after>
                    <q-icon name="keyboard_arrow_right"></q-icon>
                  </template>
                </q-input>
                <q-input outlined dense placeholder="范围 ¥" debounce="500"
                         v-model="searchForm.max"></q-input>
              </div>

              <div class=" row">
                <q-input type="date" outlined dense placeholder="开始时间" debounce="500"
                         v-model="searchForm.createdTime">
                  <template v-slot:after>
                    <q-icon name="keyboard_arrow_right"></q-icon>
                  </template>
                </q-input>
                <q-input type="date" outlined dense placeholder="结束时间" debounce="500"
                         v-model="searchForm.comparisonTime"></q-input>
              </div>
            </div>

            <div class="q-pa-xs">
              <q-select hint="订单状态" outlined dense square clearable map-options emit-value
                        v-model="searchForm.orderStatus" :options="orderStatusDict"
                        input-debounce="0"
                        new-value-mode="add-unique">
              </q-select>
            </div>


            <q-space/>
            <div class="q-gutter-xs">
              <q-btn icon="add" disable no-wrap color="primary" label="新建" @click="add"/>
              <q-btn disable no-wrap v-show="$q.screen.gt.sm" label="导入" icon="file_upload"
                     :loading="importing"
                     color="primary"
                     @click="importExcel"
              >
                <q-tooltip>请选择Excel文件</q-tooltip>
                <q-uploader
                    disable
                    auto-upload
                    ref="excelUploader"
                    :max-files="1"
                    class="hidden"
                    :url="url.importExcelUrl"
                    field-name="file"
                    accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    @uploaded="importedExcel"
                />
              </q-btn>
              <q-btn-dropdown

                  split
                  no-wrap
                  v-show="$q.screen.gt.sm"
                  :loading="exporting"
                  label="导出"
                  icon="file_download"
                  color="primary"
                  @click="exportExcel('数据')">
                <q-list>

                  <q-item clickable v-close-popup>
                    <q-btn
                        disable
                        no-wrap
                        v-show="$q.screen.gt.sm"
                        :loading="exporting"
                        label="下载导入模板"
                        icon="file_download"
                        color="primary"
                        @click="meExportExcel('数据导入模板')"
                    />
                  </q-item>
                </q-list>
              </q-btn-dropdown>

              <q-btn
                  disable
                  :disable="selected.length === 0"
                  no-wrap
                  v-show="$q.screen.gt.md"
                  color="negative"
                  label="批量删除"
                  @click="showConfirm()"
                  icon="delete"
              />
              <q-btn
                  color="primary"
                  label="切换全屏"
                  no-wrap
                  v-show="$q.screen.gt.md"
                  @click="table.toggleFullscreen"
                  :icon="table.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              />
              <q-btn-dropdown
                  color="primary"
                  label="自选列"
                  icon="view_list"
                  no-wrap
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


        <template #body-cell-index="props">
          <q-td :props="props">
            {{ props.row.index }}
          </q-td>
        </template>

        <template #body-cell-nickname="props">
          <q-td :props="props" :auto-width="true" @dblclick="my_Copy(props.row.userId)">
            <q-img fit="cover" :src="props.row.avatar">
              <template v-slot:error>
                {{ props.row.nickname }}
              </template>
            </q-img>
            <q-tooltip>双击复制用户id</q-tooltip>
          </q-td>
        </template>

        <template #body-cell-orderStatus="props">
          <q-td :props="props">
            <q-btn flat :color="props.row.orderStatus === '1' ? 'green' : 'red'"
                   :label="props.row.orderStatus === 1? '已完成':
                   props.row.orderStatus === 3 ? '过期' : '待支付'"/>

          </q-td>
        </template>

        <template #body-cell-totalAmount="props">
          <q-td :props="props">
            <q-btn flat
                   :color="props.row.totalAmount >= 100 ? 'green' : 'red'"
                   :label="props.row.totalAmount"/>

          </q-td>
        </template>
        <template #body-cell-orderDate="props">
          <q-td :props="props">
            {{ formatDate(props.row.orderDate, 'yyyy-MM-dd') }}
          </q-td>
        </template>
        <template #body-cell-createdTime="props">
          <q-td :props="props">
            {{ formatDate(props.row.orderDate, 'yyyy-MM-dd') }}
          </q-td>
        </template>


        <template #body-cell-opt="props">
          <q-td :props="props" auto-width>
            <q-btn flat round dense color="primary" icon="info" @click="my_EditBefore(props.row)">
              <q-tooltip>订单详情</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <!--    info dialog-->
    <q-dialog flat persistent ref="infoDialog">
      <div class="dialog_card  q-ma-sm">
        <h5 class="view_title justify-between q-px-md">
          订单详情
          <q-btn color="black" dense outline round icon="clear" size="sm" v-close-popup/>
        </h5>
        <q-scroll-area style="height: 80%">
          <q-carousel animated v-model="slide" infinite style="width: 100%;height: 100%">
            <q-carousel-slide :name="2">
            </q-carousel-slide>
            <q-carousel-slide :name="1" class=" ">
              <!--              -->
              <q-markup-table class="" separator="cell" wrap-cells dense bordered>
                <thead>
                <tr>
                  <th class="text-center">订单id</th>
                  <th class="text-center">用户名称</th>
                  <th class="text-center">下单时间</th>
                  <th class="text-center">总金额</th>
                  <th class="text-center">订单状态</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td class="text-center">{{ form.orderId }}</td>
                  <td class="text-center">
                    <q-avatar>
                      <q-img :src="form.user.avatar">
                        <template v-slot:error>

                        </template>
                      </q-img>
                    </q-avatar>
                    {{ form.user.nickname }}
                  </td>
                  <td class="text-center">{{ form.createdTime }}</td>
                  <td class="text-center"> {{ form.totalAmount }} 💴</td>
                  <td class="text-center">{{ form.orderStatus }}</td>
                </tr>
                </tbody>
              </q-markup-table>

              <q-markup-table class="q-ma-md" separator="cell" wrap-cells dense bordered>
                <thead class="bg-black">
                <tr>
                  <th colspan="6">
                    <div class="row no-wrap items-center">
                      <q-img style="width: 70px" :ratio="1" class="rounded-borders"
                             src="https://cdn.quasar.dev/img/donuts.png"/>
                      <div class="text-h4 q-ml-md text-black">商品详情</div>
                    </div>
                  </th>
                </tr>
                <tr>
                  <th class="text-center">商品</th>
                  <th class="text-center">商品图片</th>
                  <th class="text-center">单价</th>
                  <th class="text-center">类型</th>
                  <th class="text-center">数量</th>
                  <th class="text-center">总价格</th>
                </tr>
                </thead>
                <tbody>

                <tr v-for="(orderItem,index) in form.ordersItem" :key="orderItem.itemId">
                  <td class="text-center" v-if="orderItem.products">{{ orderItem.products.productName }}</td>
                  <td class="text-center" v-if="orderItem.products">
                    <q-img :src="orderItem.products.imageUrl" fit="cover">
                      <template v-slot:error>
                        图片加载中....
                      </template>
                    </q-img>
                  </td>
                  <td class="text-center" v-if="orderItem.products">{{ orderItem.products.price }}</td>
                  <td class="text-center" v-if="orderItem.categories">{{ orderItem.categories.categoryName }}</td>
                  <td class="text-center">{{ orderItem.quantity }}</td>
                  <td class="text-center">{{ orderItem.subtotal }}</td>
                </tr>


                </tbody>
              </q-markup-table>
            </q-carousel-slide>
            <q-carousel-slide :name="3">
            </q-carousel-slide>
          </q-carousel>
        </q-scroll-area>

        <div class="row justify-center q-pa-md">
          <q-btn-toggle glossy v-model="slide"
                        :options="[{ label: '订单信息', value: 1 },{ label: '用户信息', value: 3 }]"/>
          <q-btn outline color="primary" icon="close" label="关闭"
                 v-close-popup/>
        </div>
      </div>
    </q-dialog>

    <!--  模态框   -->
    <q-dialog maximized flat persistent ref="dialog">
      <q-form @submit="submit" class="dialog_card  q-ma-sm">
        <h5 class="view_title justify-between q-px-md">
          {{ editType }}角色信息
          <q-btn dense outline round icon="clear" size="sm" v-close-popup/>
        </h5>
        <q-scroll-area class="column" style="height: 80%">
          <div class="row q-col-gutter-x-md dialog_form q-pa-md">
            <div class="col-6">
              <div>
                <div>
                  <q-inner-loading :showing="visible">
                    <q-spinner-gears size="50px" color="primary"/>
                  </q-inner-loading>
                  <h5>角色标识:</h5>
                  <q-input outlined dense square clearable v-model="form.roleName"
                           type="tel" :rules="[requiredTest]"/>
                </div>
              </div>
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

  </q-page>
  <confirm ref="confirmDialog" :msg="confirmMsg" @confirm="deleteBatch()"/>
</template>

<script>


import {IndexMixin} from "@/boot/mixins/indexV2";
import {ellipsis, formatDate, getFileName} from "@/boot/datatype";
import {getDictLabel} from "@/boot/dictionary";
import {requiredTest} from "@/boot/inputTest";
import Confirm from "@/components/confirm.vue";
import BtnDel from "@/components/btndel.vue";

import selected from "@/components/selected.vue";
import {copyToClipboard} from "quasar";
import {useNotify} from "@/boot/useNotify";
import {queryOrderInfoById} from "@/boot/api/shop/orders";

export default {
  name: "orderlist",
  mixins: [IndexMixin],
  components: {
    selected,
    BtnDel,
    Confirm,


  },
  data() {
    return {
      slide: 1,
      orderStatusDict: [
        {label: '已完成', value: 1},
        {label: '待支付', value: 2},
        {label: '过期', value: 3},
      ],
      columns: [
        {name: 'index', align: 'center', label: '序号', field: 'index',},
        {name: 'orderId', align: 'center', label: '订单id', field: 'orderId',},
        {name: 'userId', align: 'center', label: '用户id', field: 'userId',},
        {name: 'nickname', align: 'center', label: '用户名称', field: 'nickname',},
        {name: 'avatar', align: 'center', label: '用户头像', field: 'avatar',},
        {name: 'orderDate', align: 'center', label: '过期时间', field: 'orderDate',},
        {name: 'orderStatus', align: 'center', label: '订单状态', field: 'orderStatus',},
        {name: 'totalAmount', align: 'center', label: '总金额', field: 'totalAmount',},
        {name: 'createdTime', align: 'center', label: '创建时间', field: 'createdTime',},
        {name: 'opt', align: 'center', label: '操作', field: 'opt',},],
      showQuery: true,
      // headers: [{name: 'Authorization', value: localStorage.Authorization}],
      // uploadUrl: `${import.meta.env.VITE_BASEURL}/upload/multiple/oss/image`,
      photoMode: null,
      imgUrl: `${process.env.BASE_URL}/sys/common/static`,
      url: {
        list: '/shop/orders/list',
        add: '/shop/orders',
        edit: '/shop/orders',
        uploadUrl: '/file/upload',
        delete: '/shop/orders',
        deleteBatch: '/shop/orders',
        exportXlsUrl: '/sysUser/role/export',
        importExcelUrl: '/sysUser/role/import',
        getImportTemplate: '/sysUser/role/get/exportTemplate',
      },

    }
  },
  methods: {
    formatDate,
    getFileName,
    ellipsis,
    getDictLabel,
    requiredTest,
    initDict() {
      this.group = ['index',
        'orderId',
        // 'userId',
        // 'avatar'
        'nickname', 'orderDate', 'orderStatus', 'totalAmount', 'createdTime', 'opt',]


    },
    my_Copy(text) {
      copyToClipboard(text)
          .then(() => {
            // 成功!
            useNotify().infoNotify("复制成功!")
          })
          .catch(() => {
            // 失败
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
      queryOrderInfoById(row.orderId).then(res => {
        if (res.data) {
          this.form = res.data
          console.log(this.form)
          this.$refs.infoDialog.show();
        } else {
          useNotify().infoNotify("该订单无数据")
        }
      }).catch(error => {
        console.log(error)
      })

    },
    meExportExcel(filename) {
      let tempUrl = this.url.exportXlsUrl
      this.url.exportXlsUrl = this.url.getImportTemplate
      this.exportExcel(filename)
      this.url.exportXlsUrl = tempUrl;

    },
  },
  mounted() {
    this.initDict();
  },


}


</script>


<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 68vmin

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: white

  thead tr th
    position: sticky
    z-index: 1

  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
















  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>