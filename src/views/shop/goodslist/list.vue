<template>
  <q-page class="cc-admin">
    <div class="col bg-white shadow-2 q-pa-md q-ma-sm">
      <q-table flat color="primary" class="cross_table my-sticky-header-table"
               separator="cell"
               :columns="columns"
               :rows="list"
               row-key="productId"
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
            <div class="column q-pa-xs">
              <q-input outlined dense placeholder="请输入商品名称搜索" class="on-left"
                       @input="query"
                       debounce="500"
                       v-model="searchForm.productName">
                <template #append>
                  <q-btn flat round icon="search" color="primary" @click="query" :loading="loading">
                    <q-tooltip>搜索</q-tooltip>
                  </q-btn>
                </template>
              </q-input>
              <div class="q-pa-xs">
                <q-btn label="搜索" icon="search" color="primary"
                       @click="query" :loading="loading"></q-btn>
                <q-btn icon="clear" label="清空" @click="searchForm={};query()"></q-btn>
              </div>
            </div>
            <div class="column q-pa-xs">
              <div class="row">
                <q-input outlined dense placeholder="最小 ¥" debounce="500"
                         v-model="searchForm.min">
                  <template v-slot:after>
                    <q-icon name="keyboard_arrow_right"></q-icon>
                  </template>

                </q-input>

                <q-input outlined dense placeholder="最大 ¥" debounce="500"
                         v-model="searchForm.max"></q-input>
              </div>
              <q-space/>
              <div class=" row">
                <q-input type="date" outlined dense placeholder="开始时间" debounce="500"
                         v-model="searchForm.createdTime">
                </q-input>
                ~
                <q-input type="date" outlined dense placeholder="结束时间" debounce="500"
                         v-model="searchForm.comparisonTime"></q-input>
              </div>
            </div>

            <div class="q-pa-xs">
              <q-select label="分类" outlined dense square clearable map-options emit-value
                        use-input
                        v-model="searchForm.categoryId" :options="categoriesDict"
                        @filter="dictFilter"
                        input-debounce="0"
                        new-value-mode="add-unique">
              </q-select>
            </div>


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
                  @click="exportExcel('数据')">
                <q-list>

                  <q-item clickable v-close-popup>
                    <q-btn
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


        <template #body-cell-categoryId="props">
          <q-td :props="props" :auto-width="true">
            {{ searchLabel(categoriesDict, props.row.categoryId) }}
          </q-td>
        </template>

        <template #body-cell-price="props">
          <q-td :props="props" :auto-width="true">
            {{ props.row.price }}¥
          </q-td>
        </template>

        <template #body-cell-description="props">
          <q-td :props="props" :auto-width="true">
            {{ ellipsis(props.row.description,24) }}
          </q-td>
        </template>

        <template #body-cell-imageUrl="props">
          <q-td :props="props" :auto-width="true">
            <q-img fit="cover" :src="props.row.imageUrl">
              <template v-slot:error>
                没有图片
              </template>
            </q-img>
          </q-td>
        </template>

        <template #body-cell-createdTime="props">
          <q-td :props="props" :auto-width="true">
            {{ formatDate(props.row.createdTime, "yyyy-MM-dd") }}
          </q-td>
        </template>
        <template #body-cell-updatedTime="props">
          <q-td :props="props" :auto-width="true">
            {{ formatDate(props.row.updatedTime, "yyyy-MM-dd") }}
          </q-td>
        </template>

        <template #body-cell-opt="props">
          <q-td :props="props" :auto-width="true">
            <q-btn flat round dense color="primary" icon="edit" @click="my_EditBefore(props.row)">
              <q-tooltip>编辑</q-tooltip>
            </q-btn>
            <btn-del :label="props.row.title" @confirm="deleted(props.row)"/>
          </q-td>
        </template>
      </q-table>
    </div>

    <!--  添加修改   -->
    <q-dialog maximized flat persistent ref="dialog">
      <q-form @submit="submit" class="dialog_card  q-ma-sm">
        <h5 class="view_title justify-between q-px-md">
          {{ editType }}商品信息
          <q-btn dense outline round icon="clear" size="sm" v-close-popup/>
        </h5>
        <q-scroll-area class="column" style="height: 80%">
          <div class="row q-col-gutter-x-md dialog_form q-pa-md">
            <div class="col-6">
              <h5>商品名称:</h5>
              <q-input outlined dense square clearable v-model="form.productName"
                       type="text" :rules="[requiredTest]"/>
            </div>
            <div class="col-6">
              <h5>商品分类:</h5>
              <q-select outlined dense square clearable map-options emit-value
                        use-input use-chips
                        v-model="form.categoryId" :options="categoriesDict"
                        @filter="dictFilter"
                        input-debounce="0"
                        new-value-mode="add-unique"
                        @new-value="addCategorys"
                        :rules="[requiredTest]">
                <template v-slot:after-options>
                  <q-btn flat label="找不到? 添加分类!"/>
                </template>
              </q-select>
            </div>
            <div class="col-6">
              <h5>介绍:</h5>
              <div class="q-pa-md ">
                <q-btn-toggle
                    v-model="toggleModel"
                    toggle-color="primary"
                    :options="[{label: '网络资源', value: 1},]"
                />
                <div v-if="toggleModel === 0">
                  <q-input outlined dense square clearable v-model="form.description"
                           type="text"/>
                </div>
                <div v-if="toggleModel === 1">
                  <CustomFileUploadComponent :max-files="1"
                                             v-model:urls="form.description" :multiple="false"/>
                </div>

              </div>


            </div>
            <div class="col-6">
              <h5>价格:</h5>
              <q-input outlined dense square clearable hint="保留2位小数"
                       mask="#.##" fill-mask="0" reverse-fill-mask
                       v-model="form.price"
                       :rules="[requiredTest]"/>
            </div>
            <div class="col-6">
              <h5>库存:</h5>
              <q-input mask="##" fill-mask="100" reverse-fill-mask
                       outlined dense square clearable v-model="form.stockQuantity"
                       type="number" :rules="[requiredTest]"/>
            </div>
            <div class="col-12">
              <h5>图片:</h5>
              <CustomFileUploadComponent :max-files="1"
                                         v-model:urls="form.imageUrl" :multiple="false"/>
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
  <confirm ref="confirmDialog" :msg="confirmMsg" @confirm="my_deleteBatch()"/>
</template>

<script>


import {IndexMixin} from "@/boot/mixins/indexV2";
import {ellipsis, formatDate, searchLabel} from "@/boot/datatype";
import {getDictLabel} from "@/boot/dictionary";
import {requiredTest} from "@/boot/inputTest";
import Confirm from "@/components/confirm.vue";
import BtnDel from "@/components/btndel.vue";
import vMdEditor from '@kangc/v-md-editor'
import selected from "@/components/selected.vue";
import {addCategory, getCategoriesListDict} from "@/boot/api/shop/products";
import CustomFileUploadComponent from "@/components/customFileUploadComponent.vue";
import {useNotify} from "@/boot/useNotify";

export default {
  name: "song",
  mixins: [IndexMixin],
  components: {
    CustomFileUploadComponent,
    selected,
    BtnDel,
    Confirm,
    vMdEditor

  },
  data() {
    return {
      toggleModel: 0,

      categoriesDict: [],
      columns: [
        {name: 'index', align: 'center', label: '序号', field: 'index',},
        {name: 'productId', align: 'center', label: '商品id', field: 'productId',},
        {name: 'categoryId', align: 'center', label: '商品分类', field: 'categoryId',},
        {name: 'productName', align: 'center', label: '商品名称', field: 'productName',},
        {name: 'description', align: 'center', label: '信息', field: 'description',},
        {name: 'price', align: 'center', label: '价格', field: 'price',},
        {name: 'stockQuantity', align: 'center', label: '库存', field: 'stockQuantity',},
        {name: 'imageUrl', align: 'center', label: '图片|封面', field: 'imageUrl',},
        {name: 'createdTime', align: 'center', label: '创建时间', field: 'createdTime',},
        {name: 'updatedTime', align: 'center', label: '上次修改时间', field: 'updatedTime',},
        {name: 'opt', align: 'center', label: '操作', field: 'opt',},],
      showQuery: true,
      // headers: [{name: 'Authorization', value: localStorage.Authorization}],
      // uploadUrl: `${import.meta.env.VITE_BASEURL}/upload/multiple/oss/image`,
      photoMode: null,
      imgUrl: `${process.env.BASE_URL}/sys/common/static`,
      url: {
        list: '/shop/products/list',
        add: '/shop/products',
        edit: '/shop/products',
        uploadUrl: '/file/upload',
        delete: '/shop/products',
        deleteBatch: '/shop/products',
        exportXlsUrl: '/shop/products/export',
        importExcelUrl: '/shop/products/import',
        getImportTemplate: '/shop/products/get/exportTemplate',
      },
    }
  },
  methods: {
    searchLabel,
    formatDate,
    ellipsis,
    getDictLabel,
    requiredTest,
    initDict() {
      this.group =['index','categoryId','productName','description','price','stockQuantity','imageUrl','createdTime','updatedTime','opt',]
      this.getCategoryList();

    },
    // _submit() {
    //   console.log(this.form);
    //
    // },
    /**
     * 得到商品分类信息
     * @param {Object} param 是一个对象
     */
    getCategoryList(param) {
      param = {
        ...param,
        size: 1000,
      }
      getCategoriesListDict(param).then(res => {
        this.categoriesDict = res.data.records
      })
    },
    // 分类过滤
    dictFilter(val, update) {
      if (val === '') {
        update(() => {
          this.getCategoryList()
        })
        return
      }

      update(() => {
        setTimeout(() => {
          this.getCategoryList({title: val})
        }, 500)

      })
    },
    my_deleteBatch() {
      this.selected = this.selected.map(item => item.productId)
      this.deleteBatchPlus()
      this.selected = []
    },
    // 添加分类
    addCategorys(value, down) {
      down(value)
      let param = {
        title: value,
      }
      addCategory(param).then(res => {
        if (res.flag) {
          console.log(res)
          let category = res.data
          this.categoriesDict.push({
            label: category.categoryName,
            value: category.categoryId
          })
        } else {
          useNotify().negativeNotify(res.message)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    change(html, txt) {
      this.form.content = html;
      this.form.txtContent = txt;
    },
    deleted(row) {
      this.delPlus(row.productId)
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