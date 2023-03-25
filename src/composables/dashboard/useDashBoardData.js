import {ref} from "vue";


export const useDashBoardData=()=>{

  // 流量数据
  const flowData=ref([
    {
      id:'free ',
      title:"免费流量",
      flowFigures:8848,
      proportion:"10%",
      pieChart:{
        xAxis: {
          data: ['免费流量']
        },
        yAxis: {},
        series: [
          {
            type: 'bar',
            data: [23]
          }
        ]
      },
    },
    {
      id:'pay',
      title:"付费流量",
      flowFigures:8848,
      proportion:"10%",
      pieChart:{
        xAxis: {
          data: ['免费流量']
        },
        yAxis: {},
        series: [
          {
            type: 'bar',
            data: [23]
          }
        ]
      },
    },
    {
      id:"outer",
      title:"其他流量",
      flowFigures:8848,
      proportion:"10%",
      pieChart:{
        xAxis: {
          data: ['免费流量']
        },
        yAxis: {},
        series: [
          {
            type: 'bar',
            data: [23]
          }
        ]
      },
    }
  ])

  // 动态排序柱状图
  const trendsData=[]
  const realtimeSort =ref({
      id:"realtimeSort",
      pieChart:{
        xAxis: {
          max: 'dataMax'
        },
        yAxis: {
          type: 'category',
          data: ['A', 'B', 'C', 'D', 'E'],
          inverse: true,
          animationDuration: 300,
          animationDurationUpdate: 300,
          max: 2 // only the largest 3 bars will be displayed
        },
        series: [
          {
            realtimeSort: true,
            name: 'X',
            type: 'bar',
            data: trendsData,
            label: {
              show: true,
              position: 'right',
              valueAnimation: true
            }
          }
        ],
        legend: {
          show: true
        },
        animationDuration: 3000,
        animationDurationUpdate: 3000,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear'
      }}
  )
  for (let i = 0; i < 5; ++i) {
    trendsData.push(Math.round(Math.random() * 200));
  }

  return {
    flowData,
    realtimeSort

  }

}
