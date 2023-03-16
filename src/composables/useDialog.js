import {Dialog} from 'quasar'

export const useDialog =()=>{

  const confirmDialog=(title,message)=>{
    return new Promise((resolve, reject)=>{
      Dialog.create({
        dark:true,
        title:title,
        message:message,
        position:"top",
        ok:"确定",
        cancel: "取消",
        persistent: true
      }).onOk(() => {
        resolve(1)

      }).onCancel(() => {
        resolve(0)

      }).onDismiss(() => {
        resolve(-1)

      })

    })

  }

  return {
    confirmDialog
  }

}
