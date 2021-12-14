import React, { useState, useEffect } from 'react'
import "src/css/App.css";
import sourceData from '../data/source.json'
import * as echarts from 'echarts';


//清洗数据
function cleanData(sourceData){
    const fitlerCondition = ['关键字', '概要', '问题类型', '状态', '解决结果', '经办人', '创建日期',  '已更新', '已解决', '修复的版本',  '缺陷引入原因类型', 'BUG类型'];

    //剔除无用字段
    const formatedsourceData =  sourceData.map((item,index)=>{
        let formatedItem:{} = {};
        for ( let key in item){
            fitlerCondition.includes(key) && (formatedItem[key] = item[key])
        }

        formatedItem['创建日期'] = formatedItem?.['创建日期'].slice(0, 10)
        formatedItem['已更新'] = formatedItem?.['创建日期'].slice(0, 10)

        return formatedItem

    })

    console.log(formatedsourceData)
    return formatedsourceData

}

// 统计各版本bug数量
function compileEditionBug(formatedsourceData){

        // 统计版本
        const editionList = Array.from(new Set(formatedsourceData.map((item, index)=>{
            return item['修复的版本']
        })))
    
        console.log(editionList)
    
        // 统计版本加bug数量
        const editionBugList = editionList.map((editionItem,index)=>{
            let formatededitionItem = {
                name: editionItem,
                num: 0
            }
            formatedsourceData.forEach((item, index)=>{
                if(item['修复的版本'] === formatededitionItem.name){
                    formatededitionItem.num++;
                }
            })
            return formatededitionItem
    
        })
        
        editionBugList.sort((before,after)=>{
            return before.num >= after.num ? -1 : 1;
        })
        console.log(editionBugList)

}

// 统计bug类型
function compileBugType(formatedsourceData){

        // 统计bug类型
        const bugTypeList = Array.from(new Set(formatedsourceData.map((item, index)=>{
            return item['缺陷引入原因类型']
        })))
    
        console.log('bugTypeList', bugTypeList)
    
        // 统计版本加bug数量
        const bugTypeWithNumList = bugTypeList.map((bugType,index)=>{
            let formatedbugTypeItem = {
                name: bugType ===''? '未填写': bugType,
                num: 0
            }
    
            formatedsourceData.forEach((item, index)=>{
                if(formatedbugTypeItem.name === '未填写'){
                    if(item['缺陷引入原因类型'] === ''){
                        formatedbugTypeItem.num++;
                    }
                }
                if(item['缺陷引入原因类型'] === formatedbugTypeItem.name){
                    formatedbugTypeItem.num++;
                }
    
            })
    
            return formatedbugTypeItem
    
        })

        bugTypeWithNumList.sort((before,after)=>{
            return before.num >= after.num ? -1 : 1;
        })
    
        console.log('bugTypeWithNumList',bugTypeWithNumList)

}

function renderecharts (data){
    debugger
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom as HTMLElement);
    var option;

    option = {
    title: {
        text: 'Referer of a Website',
        subtext: 'Fake Data',
        left: 'center'
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'left'
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
            shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
        }
    ]
    };
    option && myChart.setOption(option);
}
const App: React.FC = () => {


    const formatedsourceData = cleanData(sourceData);
    compileEditionBug(formatedsourceData);
    compileBugType(formatedsourceData);
    const editionBugList = compileEditionBug(formatedsourceData)

    useEffect(() => {
        renderecharts(editionBugList);
    });
    return (
        <div className="App">
            <div>各项目bug占比</div>
            <div>缺陷类型占比</div>
            <div>当日解决占比</div>
            <div id='main'></div>
        </div>
    );

};

export default App;
