<template>
  <div style="margin-left: 60px">
    <q-tr class="q-ma-md">
      <q-th v-for="col in columns"
            :key="col.name" :props="props">{{ col.label }}
      </q-th>
    </q-tr>
    <q-tr :props="props" v-for="(item,index) in menu">
      <q-td auto-width>
        <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand"
               v-show="item.menuType ==='M'"
               :icon="props.expand ? 'remove' : 'add'"/>
      </q-td>
      <q-td key="menuId" auto-width>
        <div>{{ item.menuId }}</div>
      </q-td>
      <q-td key="menuName" auto-width>
        <div>{{ item.menuName }}</div>
      </q-td>
      <q-td key="orderNum" auto-width>
        <div>{{ item.orderNum }}</div>
      </q-td>
      <q-td key="path" auto-width>
        <div>{{ item.path }}</div>
      </q-td>
      <q-td auto-width key="component">{{ item.component }}</q-td>
      <q-td auto-width key="menuType">{{ getDictLabel(menuType, item.menuType) }}</q-td>
      <q-td auto-width key="visible">
        <div>{{ item.visible }}</div>
      </q-td>
      <q-td auto-width key="status">
        <div>{{ item.status }}</div>
      </q-td>
      <q-td auto-width key="perms">
        <div>{{ item.perms }}</div>
      </q-td>
      <q-td auto-width key="icon" :props="props">
        <q-icon :name="item.icon" size="sm" color="t-grey"/>
      </q-td>

      <q-td auto-width>
        <div key="createdTime">{{ formatDate(item.createdTime, "yyyy-MM-dd") }}</div>
      </q-td>

      <q-td key="opt" auto-width>
        <q-btn-group push spread>
          <q-btn flat round dense color="primary" icon="add" @click.stop="addChild(item)"
                 v-if="item.menuType ==='M'">
            <q-tooltip>添加子菜单</q-tooltip>
          </q-btn>
          <q-btn flat round dense color="primary" icon="edit" @click.stop="my_edit(item)">
            <q-tooltip>编辑</q-tooltip>
          </q-btn>
          <btn-del :label="item.menuName" @confirm="del({id:item.menuId})"/>
        </q-btn-group>
      </q-td>
    </q-tr>
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
  <confirm ref="confirmDialog" :msg="confirmMsg" @confirm="deleteBatch()"/>
</template>

<script>
import {getter, formatter, getDictLabel} from '@/boot/dictionary';
import BtnDel from "@/components/btndel.vue";
import {formatDate} from "@/boot/datatype";
import Confirm from "@/components/confirm.vue";
import {IndexMixin} from "@/boot/mixins";
import {requiredTest} from "@/boot/inputTest";

export default {
  name: 'menu-item',
  mixins: [IndexMixin],
  components: {Confirm, BtnDel},
  props: {
    menu: { //  子菜单
      type: Object,
      required: true,
    },
    props: { // 当前菜单
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      columns: [
        {name: 'index', align: 'center', label: '展开/收缩', field: 'index',},
        {name: 'menuId', align: 'center', label: '菜单id', field: 'menuId',},
        {name: 'menuName', align: 'center', label: '菜单名称', field: 'menuName',},
        {name: 'orderNum', align: 'center', label: '排序', field: 'orderNum',},
        {name: 'path', align: 'center', label: '路径', field: 'path',},
        {name: 'component', align: 'center', label: '组件路径', field: 'component',},
        // {name: 'query', align: 'center', label: '查询参数', field: 'query',},
        // {name: 'isCache', align: 'center', label: '是否缓存', field: 'isCache',},
        {name: 'menuType', align: 'center', label: '菜单类型', field: 'menuType',},
        {name: 'visible', align: 'center', label: '是否可见', field: 'visible',},
        {name: 'status', align: 'center', label: '菜单状态', field: 'status',},
        {name: 'perms', align: 'center', label: '权限标识', field: 'perms',},
        {name: 'icon', align: 'center', label: '图标', field: 'icon',},
        {name: 'createdTime', align: 'center', label: '创建时间', field: 'createdTime',},
        {name: 'opt', align: 'center', label: '操作', field: 'opt',},],
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
      menuType: formatter('menuType'),
      icons: getter('icon'),
      menuTypeOption: [
        {label: '目录', value: 'M'},
        {label: '菜单', value: 'C'},
        {label: '按钮', value: 'F'},
      ],
      menuStatusOption: [
        {label: "禁止", value: '1'},
        {label: "正常", value: '0'},
      ],
    };
  },

  methods: {
    requiredTest,
    formatDate,
    addChild(menu, menuType = 1) {
      this.$emit('addChild', menu, menuType);
    },
    my_edit(menu) {
      this.edit(menu)
    },
    del(menu) {
      this.$emit('del', menu);
    },
    getDictLabel,
    toggleExpand(menu) {
      this.$emit('toggleExpand', menu);
    },
  },
  created() {
  },
  mounted() {

  },
};
</script>
<style>
</style>
