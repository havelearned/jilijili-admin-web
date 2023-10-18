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

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
            </q-td>
            <q-td
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
            >
              {{ col.value }}
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="text-left">This is expand slot for row above: {{ props.row.name }}.</div>
            </q-td>
          </q-tr>
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


import {IndexMixin} from "@/boot/mixins";
import {ellipsis} from "@/boot/datatype";
import {getDictLabel} from "@/boot/dictionary";
import {requiredTest} from "@/boot/inputTest";
import Confirm from "@/components/confirm.vue";
import BtnDel from "@/components/btndel.vue";
import {defineComponent} from "vue";

export default defineComponent({
      name: "song",
      mixins: [IndexMixin],
      components: {
        BtnDel,Confirm,
      },
      data() {
        return {
          columns: [
            {name: 'index', align: 'center', label: '序号', field: 'index',},
            {name: 'roleId', align: 'center', label: '角色id', field: 'roleId',},
            {name: 'roleName', align: 'center', label: '角色标识', field: 'roleName',},
            {name: 'title', align: 'center', label: '角色名称', field: 'title',},
            {name: 'createdTime', align: 'center', label: '创建时间', field: 'createdTime',},
            {name: 'opt', align: 'center', label: '操作', field: 'opt',},],
          imgUrl: `${process.env.BASE_URL}/sys/common/static`,
          url: {
            list: '/sysUser/role/list',
            add: '/sysUser/role',
            edit: '/sysUser/role',
            uploadUrl: '/file/upload',
            delete: '/sysUser/role',
            deleteBatch: '/sysUser/role',
            exportXlsUrl: '/sysUser/role/export',
            importExcelUrl: '/sysUser/role/import',
            getImportTemplate: '/sysUser/role/get/exportTemplate',
          },
        }
      },
      methods: {
        ellipsis,
        getDictLabel,
        requiredTest,
        initDict() {


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
