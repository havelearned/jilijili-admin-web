import ellipsisvalue from '@/components/ellipsisvalue.vue';

import {info} from "@/boot/msg";


export const IndexMixin = {
    components: {
        ellipsisvalue,
    },
    data() {
        return {
            localApi: this.$axios,
            maximized: false,
            dialogSize: 'dialog_card column',
            showQuery: true,
            tableLabel: '展开',
            loading: false,
            importing: false,
            exporting: false,
            confirmMsg: '',
            selected: [],
            list: [],
            form: {},
            emptyForm: {},
            searchForm: {},
            key: '',
            catalog: '',
            pagination: {
                page: 1,
                size: 10,
                rowsPerPage: 10,
                rowsNumber: 99,
            },
            editType: '',
            uploadUrl: '/file/upload',
            group: [],
        };
    },
    methods: {
        queryParam() {
            return {};
        },
        beforeQuery() {
            return true;
        },
        query(props) {
            if (!this.beforeQuery()) {
                return false;
            }
            if (props && props.pagination) {
                console.log("props.pagination===>", props.pagination)
                this.pagination = props.pagination;
            }
            this.loading = true;
            return this.$axios.get(this.url.list, {
                params: {
                    ...this.queryParam(),
                    ...this.searchForm,
                    keyword: this.key,
                    catalog: this.catalog,
                    page: this.pagination.page,
                    size: this.pagination.rowsPerPage,
                }
            }).then((r) => {
                if (!r.data) return
                this.list = r.data.records.map((v, i) => {
                    if (r.data.current > 1) {
                        v.index = (r.data.current - 1) * r.data.size + (i + 1);
                    } else {
                        v.index = i + 1;
                    }
                    return v;
                });
                this.pagination.rowsNumber = r.data.total;
            }).catch(error => {
            }).finally(() => {
                this.loading = false;
            });
        },
        reset() {
            this.form = {...this.emptyForm};
        },
        del({id}) {
            this.loading = true;
            return this.$axios.delete(`${this.url.delete}`, {
                data: {idList: id}
            }).then((r) => {
                info(r.message);
                this.delAfter();
            }).finally(() => {
                this.query();
            });
        },
        delPlus(id) {
            this.loading = true;
            let idList = []
            idList.push(id)
            return this.$axios.delete(`${this.url.delete}`, {
                data: idList
            }).then((r) => {
                info(r.message);
                this.delAfter();
            }).finally(() => {
                this.query();
            });
        },
        delAfter() {

        },
        showConfirm() {
            this.confirmMsg = `确认删除这 ${this.selected.length} 条记录吗？`;
            this.$refs.confirmDialog.show();
        },
        deleteBatch() {
            this.loading = true;
            return this.$axios.delete(this.url.deleteBatch, {
                params: {idList: this.selected.toString()}
            }).then((r) => {
                info(r.message);
                this.selected = [];
            }).finally(() => {
                this.query();
            });
        },
        deleteBatchPlus() {
            this.loading = true;
            return this.$axios.delete(this.url.deleteBatch, {
                data: this.selected
            }).then((r) => {
                info(r.message);
                this.selected = [];
            }).finally(() => {
                this.query();
            });
        },
        addBefore() {
            this.form = {}
            this.form.desc = undefined // 临时解决方式
            this.form.lyric = undefined // 临时解决方式

            return true;
        },
        ellipsis(value, vlength = 25) {
            if (!value) {
                return '';
            }
            if (value.length > vlength) {
                return `${value.slice(0, vlength)}...`;
            }
            return value;
        },
        byteToMegaByte(value) {
            value = value / 1024
            value = value / 1024
            return value.toFixed(2) + " mb"
        },
        add() {
            this.editType = '新建';
            this.reset();
            if (this.addBefore()) {
                this.$refs.dialog.show();
            }
            this.addAfter();
        },
        addAfter() {

        },
        editBefore() {
            return true;
        },
        edit(p) {
            console.log("编辑=>", p)
            if (this.editBefore(p)) {
                this.editType = '编辑';
                this.form = {
                    ...p,
                };
                this.$refs.dialog.show();
            }
            this.editAfter();
        },
        editAfter() {

        },
        importExcel() {
            this.$refs.excelUploader.pickFiles();
        },
        importedExcel({xhr}) {
            this.$refs.excelUploader.removeUploadedFiles();
            const {response} = xhr;
            const res = JSON.parse(response);
            if (res.code === 200) {
                this.$info(res.message);
            } else {
                this.$error(res.message);
            }
            this.query();
        },
        exportExcel(fileName) {
            if (!fileName || typeof fileName !== 'string') {
                fileName = '导出文件';
            }
            this.exporting = true;

            let url = `${this.url.exportXlsUrl}/${this.selected.toString()}`
            let modifiedUrl = url.replace(/\/$/, '');

            this.$downFile(modifiedUrl, {
                // ...this.queryParam(),
                // ...this.searchForm,
                // keyword: this.key,
                // catalog: this.catalog,


                // pageNo: 1,
                // pageSize: 1000,
            }).then((data) => {
                if (!data) {
                    this.$message.warning('文件下载失败');
                    return;
                }
                if (typeof window.navigator.msSaveBlob !== 'undefined') {
                    window.navigator.msSaveBlob(new Blob([data], {type: 'application/vnd.ms-excel'}), `${fileName}.xls`);
                } else {
                    const url = window.URL.createObjectURL(new Blob([data], {type: 'application/vnd.ms-excel'}));
                    const link = document.createElement('a');
                    link.style.display = 'none';
                    link.href = url;
                    link.setAttribute('download', `${fileName}.xls`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link); // 下载完成移除元素
                    window.URL.revokeObjectURL(url); // 释放掉blob对象
                }
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.exporting = false;
            });
        },

        delFile({url}) {
            this.fileList = this.fileList.filter((v) => v.url !== url);
        },
        submit() {
            let q;
            console.log("提交的表单=>", this.form)
            if (this.editType === '新建') {
                q = this.$axios.post(this.url.add, this.form);
            } else {
                console.log("更新表单=>", this.url.edit, this.form)
                q = this.$axios.put(this.url.edit, this.form);
            }
            return q.then((r) => {

                info(r.message);
                this.$refs.dialog.hide();
            }).finally(() => {
                this.query();
            });
        },
        searchReset() {
            this.searchForm = {};
            this.query();
        },
        show() {
            this.showQuery = true;
            this.tableLabel = '收起';
        },
        hide() {
            this.showQuery = false;
            this.tableLabel = '展开';
        },
        copy(p) {
            this.$q.dialog({
                title: '复制',
                message: '请输新的名称',
                prompt: {
                    model: '',
                    outlined: true,
                    isValid: (val) => val.length > 2,
                    type: 'text',
                },
                cancel: true,
                persistent: true,
            }).onOk((data) => {
                this.$axios.post(`${this.url.copy}?id=${p.id}&name=${data}`, {}).then((r) => {
                    this.$info(r.message);
                    this.query();
                });
            });
        },
    },
    mounted() {
        this.searchForm = {};
        if (this.$q.platform.is.mobile) {
            this.dialogSize = 'dialog_tool column';
            this.maximized = true;
        } else {
            this.dialogSize = 'dialog_card column';
            this.maximized = false;
        }
        this.query();
    },
    created() {
        this.columns.forEach(({name}) => {
            this.group.push(name);
            this.emptyForm[name] = null;
        });
    },
    computed: {
        importExcelUrlFull() {
            return process.env.BASE_URL + this.url.importExcelUrl;
        },
    },

};
