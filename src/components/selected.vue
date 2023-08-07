<template>
  <q-badge color="secondary" multi-line class="q-mb-md">
    Model: {{ modelToggle || 'empty' }}
  </q-badge>
  <q-select
      filled use-input use-chips multiple hide-dropdown-icon input-debounce="0"
      new-value-mode="add-unique"

      @add="add"
      @filter="filterFn"
      @newValue="newValue"
      :options="modelOption"
      :loading="loading"
      v-model="modelToggle"
      map-options
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          没有结果,按回车键添加新值
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script>
import {defineComponent, nextTick} from 'vue'
import {useNotify} from "@/boot/useNotify";

export default defineComponent({
  name: "index",
  props: {
    addUrl: {type: String, default: "", required: true},
    listUrl: {type: String, default: "", required: true},
    modelValue: {type: Array, default: [], required: true},
    // 默认:1 歌手选择框,2 专辑选择框, 3歌曲选择框
    selectType: {type: Number, default: 1, required: false}
  },
  emits: ['update:modelValue'],
  watch: {
    value(newValue) {
      this.modelToggle = newValue;
    }
  },
  data() {
    return {
      modelAdd: null,
      modelAddUnique: null,
      value: this.modelValue,
      modelToggle: [],
      modelOption: [],
      loading: false,
      param: {
        name: undefined,
        status: undefined,
        page: 1,
        size: 1000,
      }
    }
  },
  mounted() {
    // 获取歌手名称和名称
    this.initData()
    console.log("this.modelToggle=>", this.modelValue)
  },
  methods: {
    initData() {
      switch (this.selectType) {
        case 1:
          this.initSingerData();
          break;
        case 2:
          this.intiAlbumData();
          break;
        case 3:
          break;
        default:
          useNotify().negativeNotify("选择框类型错误!!!")
          break;
      }
    },
    // 初始化歌手数据
    initSingerData() {
      this.$axios.get(this.listUrl, {params: this.param}).then(res => {
        res.data.records.forEach(item => {
          this.modelOption.push({
            label: item.name,
            value: item.singerId,
          })
        })
      }).catch(error => {
        console.log(error)
      }).finally(() => {
      })
    },
    intiAlbumData() {
      this.$axios.get(this.listUrl, {params: this.param}).then(res => {
        res.data.records.forEach(item => {
          this.modelOption.push({
            label: item.albumName,
            value: item.albumId,
          })
        })
      }).catch(error => {
        console.log(error)
      }).finally(() => {
      })
    },
    changeModelToggle(item) {
      this.modelToggle.push(item)

    },
    filterFn(val, update) {
      if (val === '') {
        update(() => {
          this.modelOption = this.modelOption
        })
        return
      }

      update(() => {
        setTimeout(() => {

          switch (this.selectType) {
            case 1:
              this.updateSinger(val)
              break;
            case 2:
              this.updateAlbum(val)
              break;
            case 3:
              break;
          }
        }, 1000)
      })
    },
    add({index, value}) {
      if (value === '') return
      if (!this.modelToggle.includes(value)) {
        this.modelToggle.push(value);
        this.$emit('update:modelValue', this.modelToggle);
      }

    },
    newValue(val, done) {
      switch (this.selectType) {
        case 1:
          this.addSinger(val, done);
          break;
        case 2:
          this.addAlbum(val, done);
          break;
      }
    },

    // 更新
    updateSinger(val) {
      this.param.name = val
      this.modelOption = []
      this.$axios.get(this.listUrl, {params: this.param}).then(res => {
        res.data.records.forEach(item => {
          this.modelOption.push({
            label: item.name,
            value: item.singerId,
          })
        })
      }).finally(() => {
      })
    },

    updateAlbum(val) {
      this.param.albumName = val
      this.modelOption = []
      this.$axios.get(this.listUrl, {params: this.param}).then(res => {
        res.data.records.forEach(item => {
          this.modelOption.push({
            label: item.albumName,
            value: item.albumId,
          })
        })
      }).finally(() => {
      })
    },

    // 添加
    addSinger(val, done) {
      let data = {
        name: val,
        desc: 'new value'
      }
      this.loading = true
      this.$axios.post(this.addUrl, data).then(res => {
        if (res.flag) {
          useNotify().infoNotify('添加成功')
          val = {
            label: res.data.name,
            value: res.data.singerId
          }
          done(val, 'add-unique')
        }
      }).catch(error => {

      }).finally(() => {
        this.loading = false
      })
    },
    addAlbum(val, done) {
      let data = {
        albumName: val,
        desc: 'new value'
      }
      this.loading = true
      this.$axios.post(this.addUrl, data).then(res => {
        if (res.flag) {
          useNotify().infoNotify('添加成功')
          val = {
            label: res.data.albumName,
            value: res.data.albumId
          }
          done(val, 'add-unique')
        }
      }).catch(error => {

      }).finally(() => {
        this.loading = false
      })
    }
  }
})
</script>

<style scoped>

</style>