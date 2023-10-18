<template>
  <q-page class="cc-admin">
    <div class="col bg-white shadow-2 q-pa-md q-ma-sm">
      <q-table flat color="primary"  class="cross_table my-sticky-header-table"
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
            <q-input
                clearable
                outlined
                dense
                placeholder="请输入关键字搜索"
                class="on-left"
                @input="query"
                debounce="500"
                v-model="searchForm.roleName"
            >
              <template #append>
                <q-btn flat round icon="search" color="primary" @click="query" :loading="loading">
                  <q-tooltip>搜索</q-tooltip>
                </q-btn>
              </template>
            </q-input>


            <q-space/>
            <div class="q-gutter-xs">
              <q-btn icon="add" no-wrap color="primary" label="新建" @click="add"/>
              <q-btn no-wrap v-show="$q.screen.gt.sm" label="导入" icon="file_upload"
                     :loading="importing"
                     color="primary"
                     @click="importExcel"
              >
                <q-tooltip>请选择Excel文件</q-tooltip>
                <q-uploader
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
                  @click="exportExcel('专辑数据')">
                <q-list>

                  <q-item clickable v-close-popup>
                    <q-btn
                        no-wrap
                        v-show="$q.screen.gt.sm"
                        :loading="exporting"
                        label="下载导入模板"
                        icon="file_download"
                        color="primary"
                        @click="meExportExcel('专辑数据导入模板')"
                    />
                  </q-item>
                </q-list>
              </q-btn-dropdown>


              <q-btn
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
          <q-td :props="props" :auto-width="true">
            <q-img fit="cover" :src="props.row.avatar">
              <template v-slot:error>
                {{ props.row.nickname }}
              </template>
            </q-img>
          </q-td>
        </template>

        <template #body-cell-orderStatus="props">
          <q-td :props="props">
            <q-btn flat
                   :color="props.row.orderStatus === '已完成' ? 'green' : 'red'"
                   :label="props.row.orderStatus"/>

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
            <q-btn flat round dense color="primary" icon="edit" @click="my_EditBefore(props.row)">
              <q-tooltip>编辑</q-tooltip>
            </q-btn>
            <btn-del :label="props.row.title" @confirm="deleted(props.row)"/>
          </q-td>
        </template>
      </q-table>
    </div>

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
        // 'orderId',
        // 'userId',
        // 'avatar'
        'nickname', 'orderDate', 'orderStatus', 'totalAmount', 'createdTime', 'opt',]


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