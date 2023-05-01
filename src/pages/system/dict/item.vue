<template>
  <div>
    <q-table
      flat
      color="primary"
      class="cross_table"
      separator="cell"
      :columns="columns"
      :rows="list"
      row-key="dictType"
      :loading="loading"
      :rows-per-page-options="[10, 20, 50, 100]"
      v-model:pagination="pagination"
      @request="query"
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
            v-model="key"
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
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge
            @click.native="changeStatus(props.row)"
            :class="['cursor-pointer',props.value === 1?'bg-blue':'bg-grey']"
          >{{ props.row.status === 1 ? '启用' : '停用' }}
          </q-badge>

        </q-td>
      </template>
      <template #body-cell-opt="props">
        <q-td :props="props" :auto-width="true">
          <q-btn flat round dense color="primary" icon="edit" @click="edit(props.row)">
            <q-tooltip>编辑</q-tooltip>
          </q-btn>
          <btn-del :label="props.row.dictLabel" @confirm="del({id:props.row.dictCode})"/>
        </q-td>
      </template>
    </q-table>
    <q-dialog maximized flat persistent ref="dialog">
      <q-form @submit="submit" class="dialog_card column bg-white">
        <h5 class="view_title justify-between q-px-md">
          {{ editType }}字典列表
          <q-btn dense outline round icon="clear" size="sm" v-close-popup/>
        </h5>
        <q-scroll-area class="col">
          <div class="row q-col-gutter-x-md dialog_form q-pa-md">
            <div class="col-12">
              <h5>字典项文本：</h5>
              <q-input
                outlined
                dense
                v-model="form.dictLabel"
                type="text"
                autofocus
                :rules="[requiredTest]"
              />
            </div>
            <div class="col-12">
              <h5>字典项值：</h5>
              <q-input outlined dense v-model="form.dictValue" type="text"
                       :rules="[requiredTest]"/>
            </div>
            <div class="col-12">
              <h5>描述：</h5>
              <q-input outlined dense v-model="form.remark" type="text" :rules="[]"/>
            </div>
            <div class="col-12">
              <h5>排序：</h5>
              <q-input
                outlined
                dense
                v-model="form.dictSort"
                type="number"
                :rules="[requiredTest]"
              />
            </div>
            <div class="col-12">
              <h5>状态：</h5>
              <q-toggle v-model="form.status" :true-value="1" :false-value="0"/>
            </div>
          </div>
        </q-scroll-area>
        <div class="row justify-center q-pa-md">
          <q-btn outline color="primary" icon="mdi-close-thick" label="关闭" v-close-popup/>
          <q-btn class="q-mx-sm" color="primary" icon="mdi-check-bold" label="提交" type="submit"/>
        </div>
      </q-form>
    </q-dialog>
  </div>
</template>

<script>
import {requiredTest} from 'boot/inputTest';
import {IndexMixin} from 'boot/mixins';
import {useNotify} from "src/composables/useNotify";
import BtnDel from "src/composables/btndel.vue";

export default {
  name: 'SysDictItem',
  components: {BtnDel},
  mixins: [IndexMixin],
  props: {
    selectedDictArray: Array,
  },
  data() {
    return {
      columns: [
        {
          name: 'index',
          align: 'center',
          label: '序号',
          field: 'index',
        },
        {
          name: 'dictLabel', align: 'left', label: '字典项文本', field: 'dictLabel',
        },
        {
          name: 'dictValue', align: 'left', label: '字典项值', field: 'dictValue',
        },
        {
          name: 'dictSort', align: 'left', label: '排序', field: 'dictSort',
        },
        {
          name: 'status', align: 'left', label: '状态', field: 'status',
        },
        {
          name: 'opt',
          label: '操作',
          field: 'id',
          align: 'center',
        },
      ],
      url: {
        list: '/sys/dict/item/list',
        add: '/sys/dict/item/',
        edit: '/sys/dict/item/',
        delete: '/sys/dict/item',
        deleteBatch: '/sys/dict/item/',
        changeSysDictItemStatus: '/sys/dict/item/status',
        exportXlsUrl: '/sys/dictItem/exportXls',
        importExcelUrl: '/sys/dictItem/importExcel',
      },
    };
  },
  methods: {
    requiredTest,
    queryParam() {
      console.log("this.selectedDictArray=>", this.selectedDictArray)
      const sel = this.selectedDictArray[0];
      return {
        dictType: sel.dictType,
      };
    },
    beforeQuery() {
      return this.selectedDictArray.length === 1;
    },
    addBefore() {
      if (this.selectedDictArray.length === 1) {
        this.form.dictId = this.selectedDictArray[0].dictId;
        this.form.dictType = this.selectedDictArray[0].dictType
        this.form.dictSort = 100;
        this.form.status = 1;
        console.log("添加表单=>")
        return true;
      }
      useNotify('请先选择字典');
      return false;
    },
    changeStatus(row) {
      this.localApi.put(this.url.changeSysDictItemStatus, row)
        .then((r) => {
          useNotify(r);
        }).finally(() => {
        this.query();
      });
    },
  },
  watch: {
    selectedDictArray: {
      handler() {
        if (this.selectedDictArray.length === 1) {
          this.key = '';
          this.query();
        } else {
          this.list = [];
        }
      },
      deep: true,
    },
  },
};
</script>

<style lang="stylus"></style>
