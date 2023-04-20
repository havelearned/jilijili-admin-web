<template>
  <div style="min-width: 400px">
    <q-select filled bottom-slots
              use-input
              :multiple="multiple"
              map-options
              counter
              use-chips
              clearable
              new-value-mode="add"
              v-model="model"
              @update:model-value="bindModel"
              @filter="filterFn"
              @add="add"
              @virtualScroll="scroll"
              :options="options"
              :dense="dense"
              :rules="[rules]"
              :options-dense="denseOpts">

      <template v-slot:hint>
      </template>
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            没有查询信息
          </q-item-section>
        </q-item>
      </template>
    </q-select>

  </div>

</template>

<script>
import {ref} from 'vue'
import {api} from "boot/axios"

export default {
  name: "",
  props: {
    multiple: {type: Boolean, required: true, default: true},
    rules: {type: Function, required: false, default: undefined},
    url: {type: String, required: true, default: '/singer/list'},
  },
  setup(props) {
    const model = ref(undefined)
    const options = ref([
      {label: "goolog1", value: 1},
      {label: "goolog2", value: 2},
      {label: "goolog3", value: 3},
      {label: "goolog4", value: 4},
    ])
    const dense = ref(true)
    const denseOpts = ref(true)
    const result = ref('')
    const searchParam = {
      size: 10,
      page: 1,
      singerName: undefined,
      key: undefined
    }
    const getData = (searchParam) => {
      // list(searchParam)
      api.get(props.url, {params: searchParam}).then(res => {
        // FLEX 待修改
        res.data.records.forEach(item => {
          if (item.singerName) {
            options.value.push({label: item.singerName, value: item.id})
          } else {
            options.value.push({label: item.albumName, value: item.id})
          }
        })
      })
    }
    return {
      model, options, dense, denseOpts, result,
      filterFn(val, update, abort) {
        update(() => {
          options.value = []
          searchParam.singerName = val
          searchParam.page = 0
          getData(searchParam);
          options.value = options.value.filter(item => item.label.indexOf(val) > -1)
        })
      },
      add(value) {

      },
      scroll({index, from, to, direction, ref}) {
        if (options.value.length - 1 === index) {
          searchParam.page += 1
          getData(searchParam)
        }
      },
      // 得到字符串id列表
      getFinalValues() {
        if (model.value) {
          result.value = model.value.map(item => {
            return item.value + ","
          })
        }
        return result.value
      },
      // 得到数组对象
      getArrayObject(){
        return model.value
      },
      fillInData(data) {
        if (data) {
          model.value = []
          data.forEach(item => {
            this.model.push({label: item.singerName, value: item.id})
          })
        }
      },
      fileInDataPlus(data){
        model.value = data;
      },
      bindModel(val) {

      }

    }
  }
}
</script>

<style scoped>

</style>
