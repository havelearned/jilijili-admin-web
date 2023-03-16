
// 常用的模态框显示和隐藏
export const useToggleDialog = (show)=>{
  const toggleDialog =()=>{
    show.value = !show.value;
  }


  return {
    toggleDialog,
  }
}
