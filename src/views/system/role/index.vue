<template>
  <q-splitter
      v-model="splitterModel"
      style="height: 80vmin">
    <template v-slot:before>
      <div class="col shadow-2 q-pa-md q-ma-sm">
        <q-table
            flat
            title="角色管理"
            color="primary"
            class="cross_table"
            separator="cell"
            :columns="columns"
            :rows="list"
            row-key="roleId"
            v-model:pagination="pagination"
            :visible-columns="group"
            @request="query"
            :rows-per-page-options="[10,20,50,100]"
            :loading="loading"
            selection="multiple"
            v-model:selected="selected"
        >
          <template v-slot:top="table">
            <div class="row q-gutter-xs full-width">
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
                    @click="my_deleted()"
                    icon="delete_sweep"
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

          <template #body-cell-opt="props">
            <q-td :props="props" :auto-width="true">
              <q-btn flat round dense color="primary" icon="new_releases" @click="openRoleEditDialog(props.row)">
                <q-tooltip>绑定菜单</q-tooltip>
              </q-btn>
              <q-btn flat round dense color="primary" icon="edit" @click="my_EditBefore(props.row)">
                <q-tooltip>编辑</q-tooltip>
              </q-btn>
              <btn-del :label="props.row.title" @confirm="my_deleted(props.row)"/>
            </q-td>
          </template>
        </q-table>
      </div>
      <!--  修改权限模态框   -->
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

    </template>

    <template v-slot:separator>
      <q-avatar color="primary" text-color="white" size="40px" icon="drag_indicator" />
    </template>

    <template v-slot:after>
     <item :currentRole="currentRole" />
    </template>

  </q-splitter>
  <confirm ref="confirmDialog" :msg="confirmMsg" @confirm="my_deleted()"/>
</template>

<script>


import {IndexMixin} from "@/boot/mixins";
import {ellipsis} from "@/boot/datatype";
import {getDictLabel} from "@/boot/dictionary";
import {requiredTest} from "@/boot/inputTest";
import Confirm from "@/components/confirm.vue";
import BtnDel from "@/components/btndel.vue";
import vMdEditor from '@kangc/v-md-editor'
import Menu from "@/boot/api/sys/menu"
import Role from "@/boot/api/sys/role"
import selected from "@/components/selected.vue";
import columnSelection from "@/components/columnSelection.vue"
import {useNotify} from "@/boot/useNotify";
import Item from "@/views/system/role/menu/item.vue";

export default {
  name: "song",
  mixins: [IndexMixin],
  components: {
    Item,
    selected,
    BtnDel,
    Confirm,
    vMdEditor,
    columnSelection
  },

  data() {
    return {
      currentRole:{},
      splitterModel:60,
      columns: [
        {name: 'index', align: 'center', label: '序号', field: 'index',},
        {name: 'roleId', align: 'center', label: '角色id', field: 'roleId',},
        {name: 'roleName', align: 'center', label: '角色标识', field: 'roleName',},
        {name: 'title', align: 'center', label: '角色名称', field: 'title',},
        {name: 'createdTime', align: 'center', label: '创建时间', field: 'createdTime',

        },
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
      visible: false,
      roleDialog: false,

    }
  },
  methods: {
    ellipsis,
    getDictLabel,
    requiredTest,
    initDict() {
      this.group = ['index','roleName','title','createdTime','opt',]
    },

    // 打开角色权限配置弹窗前
    openRoleEditDialog(row) {
      this.currentRole = row;
    },
    change(html, txt) {
      this.form.content = html;
      this.form.txtContent = txt;
    },

    my_deleted(row) {
      if (row) {
        Role.deleteRole(Array.of(row.roleId)).then(res => {
          useNotify().infoNotify(res.message)
        }).finally(() => {
          this.query()
        })
      } else {
        let roleIds = this.selected.map(item => item.roleId)
        Role.deleteRole(roleIds).then(res => {
          useNotify().infoNotify(res.message)
        }).finally(() => {
          this.query()
        })
      }


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

<style scoped lang="css">

</style>
