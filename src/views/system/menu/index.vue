<template>
  <div class="q-pa-md">
    <q-page class="cc-admin">

      <div class="col bg-white shadow-2 q-pa-md">
        <q-table
            color="primary"
            class="cross_table"
            flat
            separator="cell"
            :visible-columns="visibleColumns"
            :columns="columns"
            :rows="list"
            row-key="menuId"
            @request="query"
            hide-bottom
            :rows-per-page-options="[0]">
          <template v-slot:top>
            <div class="row no-wrap full-width">
              <q-input
                  clearable
                  outlined
                  dense
                  placeholder="请输入关键字搜索"
                  class="on-left"
                  @input="query"
                  debounce="500"
                  v-model="searchForm.menuName"
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
              </div>
            </div>
          </template>

          <template v-slot:header="props">
            <q-tr>
              <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td auto-width>
                <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand"
                       v-show="props.row.menuType ==='M'"
                       :icon="props.expand ? 'remove' : 'add'"/>
              </q-td>

              <q-td key="menuId" auto-width>
                <div>{{ props.row.menuId }}</div>
              </q-td>
              <q-td key="menuName" auto-width>
                <div>{{ props.row.menuName }}</div>
              </q-td>
              <q-td key="orderNum">
                <div>{{ props.row.orderNum }}</div>
              </q-td>
              <q-td key="path">
                <div>{{ props.row.path }}</div>
              </q-td>
              <q-td class="ellipsis url-class" key="component">{{ props.row.component }}</q-td>
              <q-td key="menuType">{{ getDictLabel(menuType, props.row.menuType) }}</q-td>
              <q-td key="visible">
                <div>{{ props.row.visible }}</div>
              </q-td>
              <q-td key="status">
                <div>{{ props.row.status }}</div>
              </q-td>
              <q-td key="perms">
                <div>{{ props.row.perms }}</div>
              </q-td>
              <q-td key="icon" :props="props">
                <q-icon :name="props.row.icon" size="sm" color="t-grey"/>
              </q-td>

              <q-td>
                <div key="createdTime">{{ formatDate(props.row.createdTime, "yyyy-MM-dd") }}</div>
              </q-td>

              <q-td key="opt" auto-width>
                <q-btn-group>
                  <q-btn round dense color="primary" icon="add" @click.stop="addChild(props.row)"
                         v-if="props.row.menuType ==='M'">
                    <q-tooltip>添加子菜单</q-tooltip>
                  </q-btn>
                  <q-btn round dense color="yellow" icon="edit" @click.stop="edit(props.row)">
                    <q-tooltip>编辑</q-tooltip>
                  </q-btn>
                  <btn-del :label="props.row.menuName" @confirm="deleted(props.row)"/>
                </q-btn-group>
              </q-td>
            </q-tr>
            <!--   子菜单操作       -->
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <MenuItem v-if="props.row.children" :props="props" :menu="props.row.children"/>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>


      <!--  模态框   -->
      <q-dialog maximized flat persistent ref="dialog">
        <q-form @submit="submit" class="dialog_card  q-ma-sm">
          <h5 class="view_title justify-between q-px-md">
            {{ editType }}菜单信息
            <q-btn dense outline round icon="clear" size="sm" v-close-popup/>
          </h5>
          <q-scroll-area class="column" style="height: 80%">
            <div class="row q-col-gutter-x-md dialog_form q-pa-md">
              <div class="col-6">
                <h5>父菜单Id</h5>
                <q-input outlined dense square clearable v-model="form.parentId"
                         type="number" :rules="[requiredTest]"/>
              </div>
              <div class="col-6">
                <h5>菜单名称:</h5>
                <q-input outlined dense square clearable v-model="form.menuName"
                         type="tel" :rules="[requiredTest]"/>
              </div>
              <div class="col-6">
                <h5>排序:</h5>
                <q-input outlined dense square clearable v-model="form.orderNum"
                         type="number"/>
              </div>
              <div class="col-6">
                <h5>路径:</h5>
                <q-input outlined dense square clearable v-model="form.path"
                         type="text"/>
              </div>

              <div class="col-6">
                <h5>组件位置:</h5>
                <q-input outlined dense square clearable v-model="form.component"
                         type="text"/>
              </div>

              <div class="col-6">
                <h5>菜单类型:</h5>
                <q-select map-options outlined dense square clearable
                          emit-value
                          v-model="form.menuType"
                          :options="menuTypeOption"/>
              </div>

              <div class="col-6">
                <h5>是否可见:</h5>
                <q-toggle
                    false-value="1"
                    true-value="0"
                    v-model="form.visible"/>
              </div>

              <div class="col-6">
                <h5>状态:</h5>
                <q-select map-options outlined dense square clearable
                          emit-value
                          v-model="form.status"
                          :options="menuStatusOption"/>
              </div>

              <div class="col-6">
                <h5>权限标识:</h5>
                <q-input outlined dense square clearable v-model="form.perms"
                         type="text"/>
              </div>

              <div class="col-6">
                <h5>图标名称:</h5>
                <q-input outlined dense square clearable v-model="form.icon"
                         type="text"/>
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
  </div>

  <confirm ref="confirmDialog" :msg="confirmMsg" @confirm="deleteBatch()"/>
</template>

<script>


import {IndexMixin} from "@/boot/mixins";
import {ellipsis, formatDate} from "@/boot/datatype";
import {requiredTest} from "@/boot/inputTest";
import Confirm from "@/components/confirm.vue";
import BtnDel from "@/components/btndel.vue";
import MenuItem from "@/views/system/menu/item.vue";
import {formatter, getDictLabel} from "@/boot/dictionary";
import {useNotify} from "@/boot/useNotify";

export default {
  name: "SysMenu",
  mixins: [IndexMixin],
  components: {
    MenuItem,
    BtnDel,
    Confirm,
  },
  data() {
    return {
      menuType: formatter('menuType'),
      visibleColumns: ['index','menuId','menuName','orderNum','path','component','menuType','visible','status','perms','icon','createdTime','opt',],
      columns: [
        // {name: 'query', align: 'center', label: '查询参数', field: 'query',},
        // {name: 'isCache', align: 'center', label: '是否缓存', field: 'isCache',},
        {name: 'index', align: 'center', label: '展开/收缩', field: 'index',},
        {name: 'menuId', align: 'center', label: '菜单id', field: 'menuId',},
        {name: 'parentId', align: 'center', label: '上级菜单', field: 'parentId',},
        {name: 'menuName', align: 'center', label: '菜单名称', field: 'menuName',},
        {name: 'orderNum', align: 'center', label: '排序', field: 'orderNum',},
        {name: 'path', align: 'center', label: '路径', field: 'path',},
        {name: 'component', align: 'center', label: '组件路径', field: 'component',},
        {name: 'menuType', align: 'center', label: '菜单类型', field: 'menuType',},
        {name: 'visible', align: 'center', label: '是否可见', field: 'visible',},
        {name: 'status', align: 'center', label: '菜单状态', field: 'status',},
        {name: 'perms', align: 'center', label: '权限标识', field: 'perms',},
        {name: 'icon', align: 'center', label: '图标', field: 'icon',},
        {name: 'createdTime', align: 'center', label: '创建时间', field: 'createdTime',},
        {name: 'opt', align: 'center', label: '操作', field: 'opt',},],
      showQuery: true,
      // headers: [{name: 'Authorization', value: localStorage.Authorization}],
      // uploadUrl: `${import.meta.env.VITE_BASEURL}/upload/multiple/oss/image`,
      expanded: null,
      menuTypeOption: [
        {label: '目录', value: 'M'},
        {label: '菜单', value: 'C'},
        {label: '按钮', value: 'F'},
      ],
      menuStatusOption: [
        {label: "禁止", value: '1'},
        {label: "正常", value: '0'},
      ],
      imgUrl: `${process.env.BASE_URL}/sys/common/static`,
      url: {
        list: '/sysMenu/list',
        add: '/sysMenu',
        edit: '/sysMenu',
        uploadUrl: '/file/upload',
        delete: '/sysMenu',
        deleteBatch: '/sysMenu',
        exportXlsUrl: '/sysMenu/export',
        importExcelUrl: '/sysMenu/import',
        getImportTemplate: '/sysMenu/get/exportTemplate',
      },
      isMouseOver: false,
      visible: false,
      modelAdd: null,
      modelAddUnique: null,
      modelToggle: null,
      singerOption: []
    }
  },
  methods: {
    formatDate,
    getDictLabel,
    ellipsis,

    requiredTest,
    initDict() {
    },
    change(html, txt) {
      this.form.content = html;
      this.form.txtContent = txt;
    },
    deleted(row) {
      console.log("删除的内容=>", row)
      let data = []
      data.push(row.menuId)
      this.$axios.delete(`/sysMenu`, {data: data}).then(res => {
        if (res) {
          useNotify().infoNotify(res.message)
        }
      }).catch(error => {
        console.log(error)
      }).finally(() => {
        this.query()
        this.notifyMenuUpdated()
      })
    },
    my_EditBefore(row) {
      this.edit(row)
    },
    addChild(p, menuType = 1) {
      this.editType = '新建';
      this.reset();
      this.parent = p;
      this.form.parentId = p.id;
      this.form.menuType = menuType;
      this.$refs.dialog.show();

    },
    toggleExpand(menu) {
      console.log("toggleExpand=>", menu)
    },
    notifyMenuUpdated() {
      useNotify().warningNotify("菜单信息已更改,请重新登录!!!")
    }


  },
  mounted() {
    this.initDict();
  },


}


</script>

<style scoped lang="css">

</style>
