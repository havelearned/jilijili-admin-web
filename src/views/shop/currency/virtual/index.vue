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
          row-key="currencyId"
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
            <div>
              <q-input clearable outlined dense placeholder="请输入用户名称搜索"
                       class="on-left" @input="query" debounce="500"
                       v-model="searchForm.username">
              </q-input>
              <div>
                <q-btn label="搜索" icon="search" color="primary"
                       @click="query" :loading="loading"></q-btn>
                <q-btn icon="clear" label="清空" @click="searchForm={};query()"></q-btn>
              </div>
            </div>


            <q-input clearable outlined dense placeholder="货币名称"
                     class="on-left" @input="query" debounce="500"
                     v-model="searchForm.currencyName">
            </q-input>

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
            </div>
            <div class="row q-pa-xs">
              <q-input type="date" outlined dense placeholder="开始时间" debounce="500"
                       v-model="searchForm.createdTime">
              </q-input>
              ~
              <q-input type="date" outlined dense placeholder="结束时间" debounce="500"
                       v-model="searchForm.comparisonTime"></q-input>
            </div>
            <q-space/>
            <div class="q-gutter-xs">
              <q-btn-dropdown  split no-wrap
                  v-show="$q.screen.gt.sm" disable
                  :loading="exporting"
                  label="导出" icon="file_download" color="primary"
                  @click="exportExcel('用户资产')">
              </q-btn-dropdown>
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


        <template #body-cell-currencyTypes="props">
          <q-td :props="props">
            <div v-if="props.row.currencyTypes">
              <q-icon size="md" name="paid">
              </q-icon>
              <div>
                {{ props.row.currencyTypes.currencyName }}
                ({{ props.row.currencyTypes.currencyCode }})
              </div>
            </div>
          </q-td>
        </template>

        <template #body-cell-sysUser="props">
          <q-td :props="props">
            <div v-if="props.row.sysUser">
              <q-avatar size="md">
                <q-img :src="props.row.sysUser.avatar"/>
              </q-avatar>
              {{ props.row.sysUser.username }}
            </div>
          </q-td>
        </template>

        <template #body-cell-opt="props">
          <q-td :props="props">
            <q-btn flat round dense color="primary" icon="visibility" @click="my_EditBefore(props.row)">
              <q-tooltip>查询总资产</q-tooltip>
            </q-btn>
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
            {name: "currencyId", align: 'center', label: '编号', field: 'currencyId',},
            {
              name: "sysUser", align: 'center', label: '用户', field: 'sysUser',
              format: (val, row) => val.avatar
            },
            {name: "currencyTypes", align: 'center', label: '货币类型', field: 'currencyTypes',},
            {name: "balance", align: 'center', label: '数量(个)', field: 'balance',},
            {name: "updatedTime", align: 'center', label: '更新时间', field: 'updatedTime',},
            {name: 'opt', align: 'center', label: '操作', field: 'opt',},],
          imgUrl: `${process.env.BASE_URL}/sys/common/static`,
          url: {
            list: "/shop/virtualCurrency/list",
            add: '/shop/virtualCurrency',
            edit: '/shop/virtualCurrency',
            uploadUrl: '/file/upload',
            delete: '/shop/virtualCurrency',
            deleteBatch: '/shop/virtualCurrency',
            exportXlsUrl: '/shop/virtualCurrency/list',
          },
        }
      },
      methods: {
        ellipsis,
        getDictLabel,
        requiredTest,
        initDict() {
          this.group = ['index', "sysUser", "currencyTypes", "balance",
            "updatedTime", 'createdTime', 'opt']


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
)


</script>

<style scoped lang="css">

</style>
