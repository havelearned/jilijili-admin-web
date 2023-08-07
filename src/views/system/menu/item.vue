<template>
  <q-tr>
    <q-td key="index" :props="props" >
      <q-btn v-if="menu.menuType === 'M'" dense round flat
             :icon="menu.menuType === 'M' ? 'expand' : 'compress'"
             @click="toggleExpand(menu.children)"></q-btn>
      <q-tooltip v-if="menu.menuType === 'M'">{{(menu.menuType === 'M') ? '展開' : '收縮'}}</q-tooltip>
    </q-td>
    <q-td key="menuId">
      <div >{{ menu.menuId }}</div>
    </q-td>
    <q-td key="menuName">
      <div >{{ menu.menuName }}</div>
    </q-td>
    <q-td key="orderNum">
      <div >{{ menu.orderNum }}</div>
    </q-td>
    <q-td key="path">
      <div >{{ menu.path }}</div>
    </q-td>
    <q-td class="ellipsis url-class" key="component">{{ menu.component }}</q-td>
    <q-td key="menuType" >{{ getDictLabel(menuType, menu.menuType) }}</q-td>
    <q-td key="visible">
      <div >{{ menu.visible }}</div>
    </q-td>
    <q-td key="status">
      <div >{{ menu.status }}</div>
    </q-td>
    <q-td key="perms">
      <div >{{ menu.perms }}</div>
    </q-td>
    <q-td  key="icon" :props="props">
      <q-icon :name="menu.icon" size="sm" color="t-grey"/>
    </q-td>

    <q-td>
      <div key="createdTime" >{{ menu.createdTime }}</div>
    </q-td>

    <q-td key="opt" :props="props" >
      <q-btn-group push spread>
        <q-btn flat round dense color="primary" icon="add" @click.stop="addChild(menu)"
               v-if="menu.menuType ==='M'">
          <q-tooltip>添加子菜单</q-tooltip>
        </q-btn>
        <q-btn flat round dense color="primary" icon="edit" @click.stop="edit(menu)">
          <q-tooltip>编辑</q-tooltip>
        </q-btn>
        <btn-del :label="menu.menuName" @confirm="del({id:menu.menuId})"/>
      </q-btn-group>

    </q-td>
  </q-tr>
</template>

<script>
import {getter, formatter, getDictLabel} from '@/boot/dictionary';
import BtnDel from "@/components/btndel.vue";

export default {
  name: 'menu-item',
  components: {BtnDel},
  props: {
    menu: {
      type: Object,
      required: true,
    },
    props: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      menuType: formatter('menuType'),
      icons: getter('icon'),
    };
  },
  watch: {},
  computed: {
    paddingLeft() {
      if (this.menu.parentId > 1) {
        return {
          paddingLeft: `${(this.menu.level - 1) * 40}px`,
        };
      }
      return {};
    },
  },
  methods: {
    addChild(menu, menuType = 1) {
      this.$emit('addChild', menu, menuType);
    },
    edit(menu) {
      this.$emit('edit', menu);
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
<style >
</style>
