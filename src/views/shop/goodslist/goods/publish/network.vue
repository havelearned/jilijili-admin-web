<template>
  <div class="q-pa-md">
    <q-stepper
        v-model="step"
        ref="stepper"
        color="primary"
        header-nav
        animated
    >
      <q-step :name="1"
              title="选择分类"
              icon="settings"
              :error="step < 3"
              :done="step > 1">
        <q-form>
          <q-input label="选择分类" type="text" v-model="form.categoryId"></q-input>
        </q-form>
      </q-step>

      <q-step
          :name="2"
          title="商品标题+轮播图+商品信息"
          caption="Optional"
          icon="create_new_folder"
          :done="step > 2">
        <q-form class="full-width">
          <div class="column q-col-gutter-md ">
            <div class="col-6">
              <h5>商品轮播图:</h5>

              <q-uploader url="http://localhost:4444/upload"
                          label="商品轮播图" multiple batch max-files="10"
                          style="width: 100%;max-height: 400px">
                <template v-slot:list="scope">
                  <q-list separator class="row ">
                    <q-item v-for="file in scope.files" :key="file.__key">
                      <q-item-section>
                        <q-item-label class="full-width ellipsis">
                          {{ file.name }}
                        </q-item-label>

                        <q-item-label caption>
                          Status: {{ file.__status }}
                        </q-item-label>

                        <q-item-label caption>
                          {{ file.__sizeLabel }} / {{ file.__progressLabel }}
                        </q-item-label>
                      </q-item-section>

                      <q-item-section
                          v-if="file.__img"
                          thumbnail
                          class="gt-xs"
                      >
                        <img fit="cover" style="height: 5vmin;width: 5vmin" :src="file.__img.src"/>
                      </q-item-section>

                      <q-item-section top side>
                        <q-btn
                            class="gt-xs"
                            size="12px"
                            flat
                            dense
                            round
                            icon="delete"
                            @click="scope.removeFile(file)"
                        />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </template>
              </q-uploader>

            </div>
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <h5>商品标题:</h5>
                <q-input outlined type="text" v-model="form.productName"></q-input>
              </div>
            </div>
          </div>
        </q-form>
      </q-step>

      <q-step
          :name="3"
          title="设置价格+库存"
          icon="add_comment">
        <q-form class="full-width">
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <h5>售价:</h5>
              <q-input outlined type="text" v-model="form.price"></q-input>
            </div>
            <div class="col-6">
              <h5>库存:</h5>
              <q-input outlined type="text" v-model="form.stockQuantity"></q-input>
            </div>
          </div>
        </q-form>
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn v-if="step !== 3" @click="$refs.stepper.next()" color="primary" :label="step === 3 ? '发布' : '下一步'"/>
          <q-btn v-if="step===3" @click="submit" color="primary" label="发布"/>
          <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="上一步" class="q-ml-sm"/>
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>
<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: "network",
  data() {
    return {
      step: 1,
      form: {},

    }
  },
  methods: {},
  mounted() {
  }

})
</script>

<style scoped>

</style>