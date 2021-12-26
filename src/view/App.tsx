import React, { useState, useEffect } from 'react'
import 'src/css/App.css'
import sourceData from '../data/source.json'
import * as echarts from 'echarts'
import { Table } from 'antd'

//清洗数据
function cleanData(sourceData) {
  const fitlerCondition = [
    '关键字',
    '概要',
    '问题类型',
    '状态',
    '解决结果',
    '经办人',
    '创建日期',
    '已更新',
    '已解决',
    '修复的版本',
    '缺陷引入原因类型',
    'BUG类型',
    '链接的问题',
  ]

  //剔除无用字段
  const formatedsourceData = sourceData.map((item, index) => {
    let formatedItem: {} = {}
    for (let key in item) {
      fitlerCondition.includes(key) && (formatedItem[key] = item[key])
    }

    formatedItem['创建日期'] = formatedItem?.['创建日期'].slice(0, 10)
    formatedItem['已更新'] = formatedItem?.['创建日期'].slice(0, 10)

    return formatedItem
  })

  console.log(formatedsourceData)
  return formatedsourceData
}
const formatedsourceData = cleanData(sourceData)

function filter(type) {
  // 统计版本
  const typelist = Array.from(
    new Set(
      formatedsourceData.map((item, index) => {
        return item[type]
      }),
    ),
  )

  console.log('typelist', typelist)

  // 统计版本加bug数量
  const numList = typelist.map((item, index) => {
    let formatedItem = {
      name: item,
      value: 0,
    }
    formatedsourceData.forEach((item, index) => {
      if (formatedItem.name === '未填写' && type === '缺陷引入原因类型') {
        if (item['缺陷引入原因类型'] === '') {
          formatedsourceData.value++
        }
      }
      if (item[type] === formatedItem.name) {
        formatedItem.value++
      }
    })
    return formatedItem
  })

  numList.sort((before, after) => {
    return before.value >= after.value ? -1 : 1
  })
  console.log(numList)
  return numList
}

function getdata(type, type2, data) {
  var arr = Array.from(
    new Set(
      formatedsourceData.map((item, index) => {
        return {
          type: item[type],
          type2: item[type2],
        }
      }),
    ),
  )

  arr.map(e =>{
      if((e as Object || {})[type2] === data){
        debugger
        return e
      }
  })
  return arr
}

function renderEcharts(data, container: string) {
  // debugger
  var chartDom = document.getElementById(container)
  var myChart = echarts.init(chartDom as HTMLElement)
  var option

  option = {
    title: {
      text: 'Referer of a Website',
      subtext: 'Fake Data',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
  option && myChart.setOption(option)
}
const App: React.FC = () => {
  console.log('test', getdata('链接的问题', '经办人', '倪永炜'))
  const columns1 = [
    {
      title: '版本',
      dataIndex: 'name',
    },
    {
      title: 'bug数量',
      dataIndex: 'value',
    },
  ]
  const columns2 = [
    {
      title: 'bug类型',
      dataIndex: 'name',
    },
    {
      title: 'bug数量',
      dataIndex: 'value',
    },
  ]
  const columns3 = [
    {
      title: 'bug经办人',
      dataIndex: 'name',
    },
    {
      title: 'bug数量',
      dataIndex: 'value',
    },
  ]

  const editionBugList = filter('修复的版本')
  const bugTypeWithNumList = filter('缺陷引入原因类型')
  const personTypeWithNumList = filter('经办人')
  // debugger
  useEffect(() => {
    renderEcharts(editionBugList, 'main1')
    renderEcharts(bugTypeWithNumList, 'main2')
    renderEcharts(personTypeWithNumList, 'main3')
  })
  return (
    <div className="App">
      <div>各项目bug占比</div>
      <Table columns={columns1} dataSource={editionBugList} pagination={false} />
      <div id="main1"></div>

      <div>缺陷类型占比</div>
      <Table columns={columns2} dataSource={bugTypeWithNumList} pagination={false} />
      <div id="main2"></div>

      <div>当日解决占比</div>
      <Table columns={columns3} dataSource={personTypeWithNumList}  pagination={false} />
      <div id="main3"></div>
    </div>
  )
}

export default App
