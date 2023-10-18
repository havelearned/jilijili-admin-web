<template>
  <div>
    <div class="col bg-white shadow-2 q-pa-md q-ma-sm">
      <q-table
          flat
          color="primary"
          class="cross_table"
          separator="cell"
          :columns="columns"
          :rows="list"
          row-key="currencyTypeId"
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

        <template #body-cell-currencyCode="props">
          <q-td :props="props">
            <q-icon size="md" name="paid"></q-icon>
            {{ props.row.currencyCode }}
          </q-td>
        </template>

        <template #body-cell-opt="props">
          <q-td :props="props">
            <q-btn disable flat round dense color="primary" icon="edit" @click="my_EditBefore(props.row)">
              <q-tooltip>编辑,不可用</q-tooltip>
            </q-btn>
            <!--            <btn-del  :label="props.row.title" @confirm="deleted(props.row)"/>-->
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

              <h5>货币名称:</h5>
              <q-input outlined dense square clearable v-model="form.currencyName"
                       type="tel" :rules="[requiredTest]"/>
            </div>
            <div class="col-6">
              <h5>货币编号:</h5>
              <q-input outlined dense square clearable v-model="form.currencyCode"
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
    <confirm ref="confirmDialog" :msg="confirmMsg" @confirm="deleted"/>
  </div>

</template>

<script>


import {IndexMixin} from "@/boot/mixins/indexV2";
import {ellipsis} from "@/boot/datatype";
import {getDictLabel} from "@/boot/dictionary";
import {requiredTest} from "@/boot/inputTest";
import Confirm from "@/components/confirm.vue";
import BtnDel from "@/components/btndel.vue";
import vMdEditor from '@kangc/v-md-editor'
import selected from "@/components/selected.vue";
import {defineComponent} from "vue";

export default defineComponent({
      name: "song",
      mixins: [IndexMixin],
      components: {
        selected,
        BtnDel,
        Confirm,
        vMdEditor

      },
      data() {
        return {
          columns: [
            {name: 'index', align: 'center', label: '序号', field: 'index',},
            {name: 'currencyTypeId', align: 'center', label: '货币类型编号', field: 'currencyTypeId',},
            {name: 'currencyCode', align: 'center', label: '货币编号', field: 'currencyCode',},
            {name: 'currencyName', align: 'center', label: '货币名称', field: 'currencyName',},
            {name: 'createdTime', align: 'center', label: '创建时间', field: 'createdTime',},
            {name: 'opt', align: 'center', label: '操作', field: 'opt',},],

          imgUrl: `${process.env.BASE_URL}/sys/common/static`,
          url: {
            list: '/shop/currencyTypes/type/list',
            add: '/shop/currencyTypes/type',
            edit: '/shop/currencyTypes/type',
            uploadUrl: '/file/upload',
            deleteBatch: '/shop/currencyTypes/type',
          },
        }
      },
      methods: {
        ellipsis,
        getDictLabel,
        requiredTest,
        initDict() {
          this.group = ['index', 'currencyName', 'currencyCode', 'createdTime', 'opt']

        },
        change(html, txt) {
          this.form.content = html;
          this.form.txtContent = txt;
        },

        deleted(row) {
          this.selected = this.selected.map(item => item.currencyTypeId)
          this.deleteBatchPlus()
          this.selected = []
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
)


</script>

<style scoped lang="css">

</style>
