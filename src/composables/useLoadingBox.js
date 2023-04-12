import {useQuasar} from "quasar";



export const useLoadingBox = () => {
  const $q = useQuasar()

  const loadingShow = (message) => {
    $q.loading.show({
      message: message,
      spinnerColor: 'primary'
    })
  }

  const loadingHide= ()=>{
    $q.loading.hide()
  }


  return {
    loadingShow,
    loadingHide,
  }
}
