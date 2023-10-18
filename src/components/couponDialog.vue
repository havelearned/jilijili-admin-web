<template>
  <div>
    <q-dialog ref="useDialog" flat persistent>
      <div class="col bg-white shadow-2 q-pa-md q-ma-sm" style="width: 40%;">
        <q-card class="q-pa-lg">
          <q-scroll-area class="column" style="height: 400px">
            <q-table
                title="选择用户" flat color="primary" class="cross_table" separator="cell"
                :columns="columns"
                :rows="list"
                row-key="userId"
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
                  <q-input clearable outlined dense placeholder="请输入关键字搜索" class="on-left" debounce="500"
                           @input="query"
                           v-model="searchForm.username">
                    <template #append>
                      <q-btn flat round icon="search" color="primary" @click="query" :loading="loading">
                        <q-tooltip>搜索</q-tooltip>
                      </q-btn>
                    </template>
                  </q-input>
                  <q-space/>
                </div>
              </template>
            </q-table>
          </q-scroll-area>

          <q-card-actions align="right">
            <q-btn v-close-popup label="取消"/>
            <q-btn color="blue" v-close-popup label="确定" @click="yes"/>
          </q-card-actions>
        </q-card>
      </div>
    </q-dialog>
  </div>
</template>
<script>


import {IndexMixin} from "@/boot/mixins";
import {ellipsis} from "@/boot/datatype";
import {getDictLabel} from "@/boot/dictionary";
import {requiredTest} from "@/boot/inputTest";
import Confirm from "@/components/confirm.vue";
import BtnDel from "@/components/btndel.vue";
import vMdEditor from '@kangc/v-md-editor'
import selected from "@/components/selected.vue";

export default {
  name: "userDialog.vue",
  mixins: [IndexMixin],
  components: {
    selected,
    BtnDel,
    Confirm,
    vMdEditor
  },
  emits: ['selectedUser'],
  data() {
    return {

      columns: [
        {name: 'index', align: 'center', label: '序号', field: 'index',},
        {name: 'userId', align: 'center', label: '用户id', field: 'userId',},
        {name: 'username', align: 'center', label: '用户名称', field: 'username',},
        {name: 'nickname', align: 'center', label: '昵称', field: 'nickname',},
        {name: 'email', align: 'center', label: '邮箱', field: 'email',},
      ],
      userGender: [
        {label: '男', value: 1},
        {label: '女', value: 0},
      ],
      url: {
        list: '/sysUser/list',
      },
    }
  },
  methods: {
    ellipsis,
    getDictLabel,
    requiredTest,
    initDict() {
      this.group = ['index', 'username', 'nickname', 'email']
    },
    change(html, txt) {
      this.form.content = html;
      this.form.txtContent = txt;
    },
    yes() {
      if (this.selected.length <= 0) {
        return
      }
      this.$emit('selectedUser', this.selected.map(item => {
        return {label: item.nickname, value: item.userId}
      }))
    },
    show() {
      this.$refs.useDialog.show();

    },
    hide() {
      this.$refs.useDialog.hide();
    }

  },
  mounted() {
    this.initDict();
  },


}


</script>

<style scoped lang="css">

</style>
