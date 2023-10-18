<template>
  <div>
    <q-card v-show="loading">
      <q-card-section v-for="() in 10">
        <q-skeleton type="text"/>
      </q-card-section>
    </q-card>

    <q-card flat dark v-show="!loading">
      <q-card-section>
        <div class="row">
          <div>{{ ellipsis(file.fileName, 15) }}</div>
          <q-space/>
          <div>
            <q-icon name="exit_to_app" v-on:click=""/>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-h4">操作</div>
        <q-separator/>
        <div class="column">
          <q-btn align="left" flat outline icon="download" label="下载" @click="downloadFile"></q-btn>
          <q-separator size="3px" color="black"/>
          <q-btn align="left" flat outline icon="share" label="分享连接" @click="shardFile"></q-btn>
          <q-separator size="3px" color="black"/>
          <q-btn align="left" flat outline icon="preview" label="预览" @click="showPreview"></q-btn>
          <q-separator size="3px" color="black"/>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="column full-width">
          <q-btn color="red" label="删除" icon="delete" @click="showDialog(1)"></q-btn>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row full-width">
          <q-btn align="left" flat outline label="文件信息"></q-btn>
          <q-space/>
          <q-btn icon="info" flat outline></q-btn>
        </div>
      </q-card-section>
      <q-card-section>
        <table class="">
          <tr>
            <th width="100%">文件:</th>
            <td>{{ ellipsis(file.fileName, 10) }}</td>
          </tr>

          <tr>
            <th width="100%">size:</th>
            <td>{{ file.size }}</td>
          </tr>
          <q-space/>
          <tr>
            <th width="100%">上传时间:</th>
            <td>{{ formatDate(file.createdTime, 'yyyy-MM-dd') }}</td>
          </tr>
          <q-space/>
          <tr>
            <th>Content-Type:</th>
            <td>application/octet-stream</td>
          </tr>
          <q-space/>
        </table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="confirm" persistent>

      <!--   下载文件   -->
      <q-card v-if="dialogType === 3">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">下载文件</span>
          <q-space/>
          <span class="q-ml-sm"><q-btn flat dense size="xs" icon="close" v-close-popup/></span>
        </q-card-section>

        <q-card-section class="row items-center">
          <div>这是一个临时URL，具有用于共享对象的集成访问凭据，有效期最长为7天。
            临时URL在配置的时间限制之后过期。
          </div>
        </q-card-section>

        <q-card-section class="row justify-center items-center q-gutter-md">
          <div class="flex justify-center items-center q-gutter-xs" >
            <q-input class="col-4" filled v-model="expire" type="number" dense="dense" label="天"
                     :rules="[ val => val >= 7 && val <= 30 || '有效期在7-30天之内',]"/>
            <q-input class="col-4" filled  type="number" dense="dense" disable label="小时"
                     :rules="[ val => val >= 23  || '格式错误',]"/>
            <q-input class="col-4" filled  type="number" dense="dense" disable label="分钟"
                     :rules="[ val => val >= 59  || '格式错误',]"/>
          </div>
          <div style="width: 100px;height: 50px">
            <q-btn flat label="确定" @click="shardFile"/>
          </div>
        </q-card-section>

        <q-card-section class="">
          <div class="">
            <q-input :loading="loading" class="col-10" filled v-model="url" type="text" disable dense="dense">
              <template v-slot:after>
                <q-btn class="col-2" flat icon="content_copy" size="xs" @click="copyText(url)"/>
              </template>
            </q-input>
          </div>
        </q-card-section>
      </q-card>

      <!--  预览图片    -->
      <q-card v-if="dialogType===2" class="my-card" style="width: 1080px">
        <div>
          <q-img loading="lazy"
                 :src="url">
          </q-img>
        </div>
        <q-card-section>
          <q-toolbar-title>
            <q-icon name="preview"></q-icon>
            {{ file.fileName }}
          </q-toolbar-title>
        </q-card-section>
        <!--      </div>-->
        <q-separator/>
        <q-card-actions align="right">
          <q-btn v-close-popup flat color="primary" label="已阅"/>
        </q-card-actions>
      </q-card>

      <!--   删除   -->
      <q-card v-if="dialogType === 1">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">确定删除文件:{{ file.fileName }}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="取消" color="primary" v-close-popup/>
          <q-btn flat label="确定" color="primary" v-close-popup @click="delFile"/>
        </q-card-actions>
      </q-card>
    </q-dialog>


  </div>

</template>
<script>
import {defineComponent} from 'vue'
import {ellipsis, formatDate} from "@/boot/datatype";
import Source from "@/boot/api/sys/source"
import {useNotify} from "@/boot/useNotify";
import CommentPreview from "@/components/commentPreview.vue";

export default defineComponent({
  name: "filePreview",
  components: {CommentPreview},
  props: {
    file: {
      default: Object,
      require: false,
    }
  },
  watch: {
    file(newValue) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 300)
    },

  },
  data() {
    return {
      loading: true,
      confirm: false,
      dialogType: 0, // 1 删除, 2预览
      expire: 7,
      url: '',
    }
  },
  methods: {
    ellipsis, formatDate,
    // 下载文件
    downloadFile() {
      this.getUrl(7)
      let a = document.createElement("a");
      a.style.display = 'none';
      a.href = this.url
      a.target = "_blank"; // 在新窗口或标签页中打开链接
      document.body.appendChild(a);
      a.click()
    },
    shardFile() {
      this.loading = true
      this.getUrl(this.expire)
      this.showDialog(3)

    },
    // 获取url
    getUrl(expire) {
      if (!expire) {
        expire = 7
      }
      expire = parseInt(expire)
      Source.downloadFile(this.file.filePath, expire).then(res => {
        if (res.flag) {
          this.url = res.data

        }
      }).catch(error => {
        console.log(error);
      }).finally(() => {
        this.loading = false
      })
    },
    // 预览文件
    showPreview() {
      this.getUrl()
      this.showDialog(2)
    },
    // 删除文件
    delFile() {
      this.showDialog()
      let param = [];
      param.push(this.file)
      Source.delFile(param).then(res => {
        if (res.flag) {
          useNotify().infoNotify(res.message)
        } else {
          useNotify().negativeNotify(res.message)
        }
      }).catch(error => {
        console.log(error)
      }).finally(() => {
        this.headDialog()
        this.$emit("query")
      })
    },
    showDialog(type) {
      this.confirm = true
      this.dialogType = type;
    },
    headDialog() {
      this.confirm = false
      this.dialogType = 0;
    },
    /**
     * 复制文本
     * */
    copyText(text) {

      navigator.clipboard.writeText(text)
          .then(() => {
            useNotify().infoNotify('成功复制到剪贴板')
          })
          .catch((error) => {
            useNotify().warningNotify('复制失败')
          });
    },
  },
  mounted() {

  }
})
</script>

<style scoped>

</style>