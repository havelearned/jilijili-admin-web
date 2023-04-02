import {useNotify} from "src/composables/useNotify";

export const useUpload = () => {
  const attachmentUploaded = (file, xhr) => {
    console.log("attachmentUploaded=====>", file)

  }
  const onRejected = (rejectedEntries) => {
    console.log("rejectedEntries====>", rejectedEntries)
    useNotify().warningNotify(`${rejectedEntries.length} file(s) did not pass validation constraints`)
  }

  const factoryFailed = (info) => {
    console.log("factoryFailed===>", info)
  }
  const uploading = (info) => {
    console.log("uploading====>", info)

  }
  const finish = () => {
    console.log("finish===>")
  }


  return {
    finish,
    uploading,
    factoryFailed,
    attachmentUploaded,
    onRejected
  }
}
