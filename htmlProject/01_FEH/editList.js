/**
 * 初始表示，设置字段默认值
 * @param dataList 数据列表
 * @param defValMap 字段-默认值对象
 */
function initializeList(dataList, defValMap) {
    let topFixCount = localStorage.getItem('topFixCount')

    $.each(dataList, (index, data) => {
        // 添加默认值
        $.each(defValMap, (K, V) =>{
            data[K] = isEmpty(data[K]) ? V : data[K] 
        })
        // 添加页面临时编辑属性
        data["editFlag"] = false
        data["topFlag"] = index < topFixCount ? true : false
    })
    return dataList
}

/**
 * 按照特定字段分组并排序
 * @param dataList 数据列表
 * @param groupKey 分组字段
 */
function groupSortList(dataList, groupKey) {
    // 結果Map
    let resultMap = {}
    // 分组
    $.each(dataList, (index, data) => {
        // 属性値がない場合
        if(isEmpty(resultMap[data[groupKey]])) {
            resultMap[data[groupKey]] = {"group" : [data]}
        } else {
            resultMap[data[groupKey]]["group"].push(data)
        }
    })
    // 添加相同人物个数
    let resultArr = []
    let maxCount = 0
    $.each(resultMap, (index, data) => {
        data["sort"] = data.group.length
        if (data.group.length > maxCount) {
            maxCount =  data.group.length
        }
        resultArr.push(data)
    })
    // 初始化时根据角色数排序
    let resultList = sortList(sortGroupCount(resultArr), maxCount)
    return resultList
}

/**
 * 排序替换
 * @param row 行数据
 * @param dataList 数据列表
 * @param index 改数据所在队列下标
 */
function reSortList(row, dataList, index) {
    // 相同人物，替换顺序
    if(row.masterId == dataList[0].masterId) {
        let downIndex = row.favorite
        let downId = row.id
        let temp = copyObject(dataList[0])
        row.topFlag = true
        row.favorite = temp.favorite
        row.id = temp.id
        dataList[0] = copyObject(row)
        
        temp.topFlag = false
        temp.favorite = downIndex
        temp.id = downId
        dataList[index] = copyObject(temp)
        
        return [].concat(dataList)
    }
    row["topFlag"] = true
    let newSortList = []
    let startLine = 0

    // 頭部固定
    for(let i = 0 ; i < dataList.length; i++) {
        let currentRow = dataList[i]
        // 頭部固定行不変
        if (currentRow["topFlag"]) {
            newSortList.push(currentRow)
        } else {
            row["favorite"] = i + 1
            startLine = i
            break
        }
    }
    // 添加置顶行
    newSortList[startLine] = row
    // 之前的行全是置顶行时,结束处理
    if(startLine >= index) {
        alert("warning!")
        return dataList
    }
    // 
    for(let i = startLine; i < dataList.length-1; i++) {
        let currentRow = dataList[i]
        if(i < index) {
            // 选中行之前下移
            currentRow["favorite"] = parseInt(currentRow["favorite"]) + 1
            newSortList.push(currentRow)
        } else if(i >= index){
            // 选中行之后不变
            currentRow = dataList[i + 1]
            newSortList.push(currentRow)
        }
    }
    return newSortList
}

function margeOriginList(sortList,originList) {
    $.each(sortList,(index,row) => {
        let originIndex = parseInt(row.id) -1 
        originList[originIndex] = copyObject(row)
    })
    return originList
}

/**
 * 筛选结果
 *
 * @param dataList 数据列表
 * @param type 筛选方式
 * @param condition 筛选条件
 */
function filterData(dataList, type, condition) {
    if("updFace" == type) {
        $.each(dataList, (index,row) => {
            if (isEmpty(row["faceImgUrl"])) {
                row["editFlag"] = true
            }
        })
    } else if ("updIll" == type) {
        $.each(dataList, (index,row) => {
            if (isEmpty(row["normalImgUrl"])) {
                row["editFlag"] = true
            }
        })
    } else if ("reName" == type) {
        $.each(dataList, (index,row) => {
            if (regCheck(row["titleName"], "eng") || regCheck(row["name"]) || isEmpty(row["imgName"])) {
                row["editFlag"] = true
            }
        })
    } 
    return dataList
}

function regist(dataList){
    let registList = []
    let sameMap = {}
    let masterId = 0
    let topFixCount = 0
    $.each(dataList, (index,row) => {
        // 
        if(row["topFlag"]) {
            topFixCount++
        }
        delete row["editFlag"]
        delete row["topFlag"]
        // id reset
        row.id = index + 1
        if(isEmpty(sameMap[row.name])) {
            masterId ++
            sameMap[row.name] = masterId
            row.masterId = masterId
        } else {
            row.masterId = sameMap[row.name]
        }
        //
        registList.push(copyObject(row))
    })
    //
    localStorage.setItem('topFixCount',topFixCount)
    
    return registList
}

/** private method area */

/** 
 * 按数组里元素个数进行排序
 *
 * @param resultArr 配列数組[]
 */
function sortGroupCount(resultArr) {
    // SORT
    for(let i=0 ; i < resultArr.length -1 ; i++) {
        // 按照相同角色数量从多到少排序
        for (let j=0 ; j< resultArr.length - 1 - i ;j ++) {
            // 冒泡排序
            if (resultArr[j].sort < resultArr[j + 1].sort) {
                let temp = resultArr[j]
                resultArr[j] = resultArr[j + 1]
                resultArr[j + 1] = temp
            }
        }
    }
    return resultArr
}

/**
 * 对数组里对象按找y-x顺序重新放入结果集中
 * row[1]col[1],row[2]col[1]...row[1]col[2],row[2]col[2]...
 * 
 * @param resultArr 配列数組[]
 * @param maxCount 数組中最多元素的数组个数
 */
function sortList(resultArr, maxCount) {
    // 顺序放入结果集中
    let sortList = []
    let startSort = 1
    for(let col=0 ; col < maxCount ; col++) {
        for(let row = 0; row < resultArr.length ; row++) {
            if(resultArr[row]["sort"] > col) {
                data = resultArr[row]["group"][col]
                data["favorite"] = startSort
                data["count"] = resultArr[row]["sort"]
                sortList.push(data)
                startSort++
            }
        }
    }
    return sortList
}