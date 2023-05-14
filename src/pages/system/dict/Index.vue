<template>
  <div style="margin: 20px">
    <div class="content rounded-borders">
      <q-markup-table  bordered>
        <thead class="bg-red-1">
        <tr>
          <th colspan="5">
            <div class="row no-wrap items-center">
              <q-img
                style="width: 70px"
                :ratio="1"
                class="rounded-borders"
                src="https://cdn.quasar.dev/img/donuts.png"
              />
              <div class="text-h4 q-ml-md">字典管理</div>
            </div>
          </th>
        </tr>
        </thead>
      </q-markup-table>
    </div>
    <div class="row">
      <div class="col-md-6   col-xs-12 bg-white q-pa-md">
        <q-table
          flat
          color="primary"
          class="cross_table"
          separator="cell"
          :columns="columns"
          :rows="list"
          row-key="dictId"
          :rows-per-page-options="[10, 20, 50, 100]"
          v-model:pagination="pagination"
          @request="query"
          :loading="loading"
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
                v-model="this.searchForm.dictName"
              >
                <template #append>
                  <q-btn flat round icon="search" color="primary" @click="query" :loading="loading">
                    <q-tooltip>搜索</q-tooltip>
                  </q-btn>
                </template>
              </q-input>
              <q-space />
              <div class="q-gutter-xs">
                <q-btn icon="add" no-wrap color="primary" label="新建" @click="add" />
                <q-btn
                  color="primary"
                  label="切换全屏"
                  no-wrap
                  v-show="$q.screen.gt.md"
                  @click="table.toggleFullscreen"
                  :icon="table.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                />
              </div>
            </div>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props"
                  :class="['cursor-pointer', (selected.length === 1 && selected[0].dictId === props.row.dictId)?'bg-cyan-3':'']"
                  @click.native="selectDict(props.row)"
            >
              <q-td key="index" :props="props">{{ props.row.index }}</q-td>
              <q-td key="dictName" :props="props">{{ props.row.dictName }}</q-td>
              <q-td key="dictId" :props="props">{{ props.row.dictType }}</q-td>
              <q-td key="remark" :props="props">{{ ellipsis(props.row.remark,10) }}</q-td>
              <q-td key="opt" :props="props" :auto-width="true">
                <q-btn flat round dense color="primary" icon="edit" @click="edit(props.row)">
                  <q-tooltip>编辑</q-tooltip>
                </q-btn>
                <btn-del :label="props.row.dictName" @confirm="del({id:props.row.dictId})" />
              </q-td>
            </q-tr>
          </template>
        </q-table>

      </div>
      <div class="col-md-6 shadow-2 col-xs-12 bg-white q-pa-md">
        <item :selectedDictArray="selected" />
      </div>

      <q-dialog maximized flat persistent ref="dialog" >
        <q-form @submit="submit" class="dialog_card column bg-white">
          <h5 class="view_title justify-between q-px-md">
            {{ editType }}数据字典
            <q-btn dense outline round icon="clear" size="sm" v-close-popup />
          </h5>
          <q-scroll-area class="col">
            <div class="row q-col-gutter-x-md dialog_form q-pa-md">
              <div class="col-12">
                <h5>
                  <q-icon name="star" color="red" />字典名称：
                </h5>
                <q-input outlined dense v-model="form.dictName" type="text" :rules="[requiredTest]" />
              </div>
              <div class="col-12">
                <h5>
                  <q-icon name="star" color="red" />字典编码：
                </h5>
                <q-input outlined dense v-model="form.dictType" type="text" :rules="[requiredTest]" />
              </div>
              <div class="col-12">
                <h5>描述：</h5>
                <q-input outlined dense v-model="form.remark" type="textarea" :rules="[]" />
              </div>
            </div>
          </q-scroll-area>
          <div class="row justify-center q-pa-md">
            <q-btn outline color="primary" icon="mdi-close-thick" label="关闭" v-close-popup />
            <q-btn class="q-mx-sm" color="primary" icon="mdi-check-bold" label="提交" type="submit" />
          </div>
        </q-form>
      </q-dialog>

    </div>
  </div>

</template>

<script>
import {IndexMixin} from "boot/mixins";
import {letterTest, requiredTest} from "boot/inputTest";
import item from './item.vue';
import BtnDel from "src/composables/btndel.vue";
import PageHeader from "src/composables/page-header.vue";
export default {
  name: "dict",
  mixins: [IndexMixin],
  components:{
    PageHeader,
    BtnDel,
    item,
  },
  data(){
    return {
      splitterModel: 50,
      columns: [
        {
          name: 'index',
          align: 'center',
          label: '序号',
          field: 'index',
        },
        {
          name: 'dictName',
          align: 'left',
          label: '字典名称',
          field: 'dictName',
        },
        {
          name: 'dictId',
          align: 'left',
          label: '字典编码',
          field: 'dictId',
        },
        {
          name: 'remark',
          align: 'left',
          label: '描述',
          field: 'remark',
        },
        {
          name: 'opt',
          align: 'center',
          label: '操作',
          field: 'opt',
        },
      ],
      url: {
        list: '/sys/dict/list',
        add: '/sys/dict/',
        edit: '/sys/dict/',
        delete: '/sys/dict',
        deleteBatch: '/sys/dict/deleteBatch',
        exportXlsUrl: '/sys/dict/exportXls',
        importExcelUrl: '/sys/dict/importExcel',
      },
    }
  },
  methods:{
    requiredTest,
    letterTest,
    selectDict(row) {
      console.log("this.selected:",this.selected)
      console.log("选择的内容:=>",row)
      this.selected.pop();
      this.selected.push(row);
    },
    delAfter() {
      this.selected.pop();
    },
  },
  mounted() {
    this.query();
  },

}
</script>

<style scoped lang="less">
</style>
