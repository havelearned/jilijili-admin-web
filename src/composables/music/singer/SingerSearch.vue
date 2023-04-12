<template>
  <div style="max-width: 300px">
    <q-select filled bottom-slots
              use-input
              multiple
              map-options
              counter
              use-chips
              clearable
              label="选择歌手"
              new-value-mode="add"
              v-model="model"
              @filter="filterFn"
              @add="add"
              @virtualScroll="scroll"
              :options="options"
              :dense="dense"
              :rules="[value => value && value.length > 0 || '歌手不能为空']"
              :options-dense="denseOpts">
      <template v-slot:before>
        <q-avatar size="lg" rounded>
          <img src="https://cdn.quasar.dev/img/avatar5.jpg">
        </q-avatar>
      </template>
      <template v-slot:hint>
        歌手
      </template>
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            没有查询到歌手
          </q-item-section>
        </q-item>
      </template>
    </q-select>

  </div>

</template>

<script>
import {ref} from 'vue'
import {list} from "src/api/singer";


export default {
  setup() {
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
      singerName: undefined
    }
    const getData = (searchParam) => {
      list(searchParam).then(res => {
        res.data.records.forEach(item => {
          options.value.push({label: item.singerName, value: item.id})
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
      getFinalValues() {
        if (model.value) {
          result.value = model.value.map(item => {
            return item.value + ","
          })
        }
        return result.value
      },
      fillInData(data) {

        if (data) {
          model.value = []
          data.forEach(item => {
            this.model.push({label: item.singerName, value: item.id})
          })
        }

      }

    }
  }
}
</script>

<style scoped>

</style>
