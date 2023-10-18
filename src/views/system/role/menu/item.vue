<template>
  <div class="q-ma-md column">
    <div class="row">
      <q-toolbar-title>
        绑定菜单
      </q-toolbar-title>
      <q-space/>

      <div>
        <q-tr>
          <q-td>{{currentRole.roleName}}</q-td>
          <q-td>{{currentRole.title}}</q-td>
        </q-tr>
      </div>
      <q-space/>

    </div>
    <div class="q-pa-md row q-col-gutter-sm">

      <q-tree class="col-12 col-sm-6"
              :nodes="nodes"
              node-key="menuId"
              label-key="menuName"
              accordion
              tick-strategy="strict"
              dense
              v-model:selected="selected"
              v-model:ticked="ticked"
              v-model:expanded="expanded">
      </q-tree>
      <div class="col-12 col-sm-6 q-gutter-sm">
        <q-btn-group>
          <q-btn :loading="loading" color="blue" @click="bindMenu" label="绑定"/>
          <q-btn disable label="全选"/>
          <q-btn disable label="全不选"/>
        </q-btn-group>
        <q-separator spaced/>
        <div class="text-h6">Selected</div>
        <div>{{ selected }}</div>

        <q-separator spaced/>

        <div class="text-h6">Ticked</div>
        <div>
          <div v-for="tick in ticked" :key="`ticked-${tick}`">
            {{ tick }}
          </div>
        </div>

        <q-separator spaced/>

        <div class="text-h6">Expanded</div>
        <div>
          <div v-for="expand in expanded" :key="`expanded-${expand}`">
            {{ expand }}
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Menu from "@/boot/api/sys/menu";
import {useNotify} from "@/boot/useNotify";

export default {
  props: {
    currentRole: {}
  },
  watch: {
    currentRole(newVal) {

      // console.log(newVal)
      this.searchForm = newVal
      this.query(this.searchForm)
    }
  },
  data() {
    return {
      loading:false,
      searchForm: {},
      from: {},
      nodes: [], // 菜单数据
      selected: [], // 当前选中的菜单
      ticked: [], // 勾选的菜单
      expanded: [], // 展开的菜单
    }
  },
  methods: {
    bindMenu() {
      this.loading =true
      this.searchForm = {
        menuIds: this.ticked,
        roleId: this.currentRole.roleId,
        menuId: null
      }
      Menu.bindingMenuAndRole(this.searchForm).then(res => {
        if (res.flag) {
          useNotify().infoNotify(res.message)
        } else {
          useNotify().negativeNotify(res.message)
        }
      }).catch(error => {
        console.log(error)
      }).finally(() => {
        this.searchForm = {}
        this.query()
        this.loading =false
      })
    },
    query() {
      Menu.getRoleMenuList(this.currentRole.roleId).then(res => {
        if (res.flag) {
          this.nodes = res.data.treeMenu
          this.ticked = res.data.ticked
          this.expanded = res.data.expanded
        }
      })

    }
  },
}
</script>
