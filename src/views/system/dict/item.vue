<template>
  <div>
    <q-table
        virtual-scroll
        flat
        color="primary"
        class="cross_table"
        separator="cell"
        :columns="columns"
        :rows="list"
        :visible-columns="group"
        row-key="dictItemId"
        :rows-per-page-options="[10,20,50,100]"
        selection="multiple"
        v-model:selected="selected"

    >
      <template v-slot:top="table">
        <q-input
            clearable
            outlined
            dense
            placeholder="请输入关键字搜索"
            class="on-left"
            @input="query"
            debounce="500"
            v-model="searchForm.itemLabel"
        >
          <template #append>
            <q-btn flat round icon="search" color="primary" @click="query" :loading="loading">
              <q-tooltip>搜索</q-tooltip>
            </q-btn>
          </template>
        </q-input>
        <q-space/>
        <div class="q-gutter-xs">
          <q-btn icon="add" no-wrap color="primary" label="新建" @click="before('添加')"/>
        </div>
      </template>


      <template #body-cell-opt="props">
        <q-td :props="props" :auto-width="true">
          <q-btn flat round dense color="primary" icon="edit" @click="before('修改',props.row)">
            <q-tooltip>编辑</q-tooltip>
          </q-btn>
          <btn-del :label="props.row.itemLabel" @confirm="delPlus(props.row.dictItemId)"/>
        </q-td>
      </template>

    </q-table>


    <q-dialog maximized flat persistent ref="itemDialog">
      <q-form @submit="submit" class="dialog_card  q-ma-sm">
        <h5 class="view_title justify-between q-px-md">
          {{ addOrEdit }}字典信息
          <q-btn dense outline round icon="clear" size="sm" v-close-popup/>
        </h5>
        <q-scroll-area class="column" style="height: 80%">
          <div class="row q-col-gutter-x-md dialog_form q-pa-md">
            <div class="col-6">
              <h5>标签:</h5>
              <q-input outlined dense square clearable v-model="form.itemLabel"
                       type="tel" :rules="[requiredTest]"/>
            </div>
            <div class="col-6">
              <h5>数据值:</h5>
              <q-input outlined dense square clearable v-model="form.itemValue"
                       type="tel" :rules="[requiredTest]"/>
            </div>
            <div class="col-6">
              <h5>状态:</h5>
              <q-select map-options emit-value
                        v-model="form.status" filled
                        :rules="[requiredTest]"
                        :options="[{label:'正常',value:1},{label:'禁用',value:0}]">
              </q-select>
            </div>
            <div class="col-6">
              <h5>排序:</h5>
              <q-input outlined dense square clearable v-model="form.itemOrder"
                       type="tel"/>
            </div>
          </div>
        </q-scroll-area>
        <div class="row justify-center q-pa-md">
          <q-btn outline color="primary" icon="mdi-close-thick" label="关闭" v-close-popup/>
          <q-btn class="q-mx-sm" color="primary" icon="mdi-check-bold" :loading="loading" label="提交"
                 type="submit"/>
        </div>
      </q-form>
    </q-dialog>


  </div>
</template>

<script>
import {defineComponent} from 'vue'
import {addDictItem, delDictItem, getDictItemList} from "@/boot/api/sys/tool"
import {requiredTest} from "@/boot/inputTest";
import {useNotify} from "@/boot/useNotify";
import BtnDel from "@/components/btndel.vue";

export default defineComponent({
  name: "item",
  components: {BtnDel},
  props: ["dictItem"],
  watch: {
    dictItem(newVal) {
      console.log(newVal)
      this.searchForm = {
        dictionaryType: this.dictItem.dictionaryType,
        size: 100
      }
      this.query()
    }
  },
  data() {
    return {
      group:['dictionaryType','itemLabel','itemValue','itemOrder','status','opt',],
      form: {},
      searchForm: {},
      list: [],
      addOrEdit: '添加',
      loading: false,
      selected: [],
      columns: [
        {name: 'dictItemId', align: 'center', label: '字典id', field: 'dictItemId',},
        {name: 'dictionaryType', align: 'center', label: '类型', field: 'dictionaryType',},
        {name: 'itemLabel', align: 'center', label: '标签名称', field: 'itemLabel',},
        {name: 'itemValue', align: 'center', label: '数据值', field: 'itemValue',},
        {name: 'itemOrder', align: 'center', label: '排序', field: 'itemOrder',},
        {name: 'status', align: 'center', label: '数据状态', field: 'status',},
        {name: 'opt', align: 'center', label: '操作', field: 'opt',},],
      url: {
        list: '/sysTool/dict/item',
        add: '/sysTool/dict/item',
        edit: '/sysTool/dict/item',
        deleteBatch: '/sysTool/dict',
      },
    }
  },
  created() {

  },
  methods: {
    requiredTest,
    before(openType,row) {
      if (!this.dictItem.dictionaryType) {
        useNotify().warningNotify("请先选择字典")
      } else {
        if (openType === '添加') {
          this.addBefore()
        } else {
          this.editBefore(row)
        }

      }
    },
    addBefore() {
      this.addOrEdit = "添加"
      this.$refs.itemDialog.show()

    },
    editBefore(row) {
      this.form = row
      this.addOrEdit = "修改"
      this.$refs.itemDialog.show()
    },
    query() {

      getDictItemList(this.searchForm).then(res => {
        this.list = res.data.records
      })
    },
    submit() {
      this.form.dictionaryType = this.dictItem.dictionaryType
      console.log("提交的表单=>", this.form)
      this.add()
    },
    add() {
      addDictItem(this.form).then(res => {
        this.loading = true
        if (res.flag) {
          useNotify().infoNotify(res.message)
        }
      }).catch(error => {
        useNotify().negativeNotify(error)
        console.log(error)
      }).finally(() => {
        this.form = {}
        this.loading = false
        this.$refs.itemDialog.hide()
        this.query()
      })
    },

    delPlus(id) {
      this.selected.push(id)
      console.log("删除的Id=>",this.selected)
      delDictItem(this.selected).then(res=>{
        useNotify().infoNotify(res.message)
      }).finally(()=>{
        this.query()
        this.selected=[]
      })
    }


  }
})
</script>

<style scoped>

</style>