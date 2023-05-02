<template>
  <q-dialog
    v-model="isOpen"
  >
    <q-card style="width: 70%; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">info</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row q-col-gutter-x-md dialog_form q-pa-md">
          <div class="col-6">
            <q-img :src="list.singerPhoto"
                   spinner-color="white"
                   style="width: 80%;height: 80%"
                   img-class="my-custom-image"
                   class="rounded-borders">
            </q-img>
            <q-item-label class="q-gutter-lg q-pa-lg">

              <q-btn outline rounded color="primary" :label="list.singerName" />
              <q-btn outline rounded color="primary" label="专辑"  />
              <q-btn outline rounded color="primary" label="歌曲"  />
            </q-item-label>
          </div>
          <div class="col-6">
            <q-card-section>
              <q-item-label lines="250" caption header overline>
                <q-item v-for="(item,index) in this.list.singerDetails.split('。')"
                        dense clickable exact
                        >
                  {{item.trim()}}
                </q-item>
              </q-item-label>
            </q-card-section>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-teal">
<!--        <q-btn flat label="OK" v-close-popup/>-->
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script>
import {ref} from "vue";
import {IndexMixin} from "boot/mixins";
import {api} from "boot/axios";
import {useNotify} from "src/composables/useNotify";
import {useQuasar} from 'quasar'


export default {
  mixins: [IndexMixin],
  components:{
    MarkdownItVueLight
  },
  data() {
    return {
      test: "sdfasdfsadf",
      columns: [],
      $q: useQuasar(),
      isOpen: ref(false),
      url: {
        list: undefined,
        info: "/singer/"
      }
    }
  },
  methods: {
    changeDialog(id) {
      this.isOpen = !this.isOpen;
      api.get(`${this.url.info}${id}`).then(res => {
        console.log("歌手信息=>", res)

        if (res.code === 200) {
          this.list = res.data
        } else {
          useNotify().negativeNotify(res.message);
        }
      })
    },

  }
}


</script>

<style scoped lang="sass">
.my-custom-image
  filter: blur(1px) sepia()

</style>
