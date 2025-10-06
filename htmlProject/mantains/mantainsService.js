/**
 * 编辑拷贝的数据,只保留列表可见的字段值
 * @Param rowData 复制的行数据
 * @Param tableName 表名
 * @Param columnConf 字段配置信息
 */
function editNewRow(rowData,copyData,tableName,columnConf) {
    // 通用部分
    $.each(columnConf,(index,column)=>{
        if("●"!==column.listVisable) {
            rowData[column.propertyName] = ""
        }
    })
    // 单独处理部分
    if("FIREEMBLEM_HERO"==tableName) {
        // 重置标签
        rowData["specTag"] = ""
        // 相同英雄,使用同一个masterId
        rowData["masterId"] = copyData["masterId"]
    }
    rowData["updateType"] = "insert"
    rowData["editFlag"] = true
    return rowData
}

/**
 * 将json中属性值转驼峰或大写
 * @Param jsonDataList json文件数据集合
 * @Param columnConf 字段配置信息
 * @Param transType [true:驼峰转大写,false:大写转驼峰]
 */
function editJsonFile(jsonDataList,columnConf,transType,tableName){
    let result = []
    $.each(jsonDataList,(index,record)=>{
        // loopColumn
        let idKey = transType ? "No" : "no"
        let newRec = {}
        newRec[idKey] = index + 1

        $.each(columnConf,(jndex,column)=>{
            // property⇒column
            if(transType) {
                // add column
                if(isEmpty(record[column.propertyName])) {
                    newRec[column.column] = isEmpty(record[column.column]) ?  "" : record[column.column]
                } else {                                
                    newRec[column.column] = isEmpty(record[column.propertyName]) ? record[column.column] : record[column.propertyName]
                }
                
            // column⇒property
            } else {
                // add column
                if(isEmpty(record[column.column])) {
                    newRec[column.propertyName] = isEmpty(record[column.propertyName]) ?  "" : record[column.propertyName]
                } else {                                
                    newRec[column.propertyName] = isEmpty(record[column.column]) ? record[column.propertyName] : record[column.column]
                }
            }
        })
        
        // 编辑数据
        editRowData(newRec,tableName)
        
        // 微信小程序数据删除不要字段
        if("FIREEMBLEM_HERO"==tableName){
            // 攻击力格式化
            newRec.atk = (parseInt(newRec.atk) + parseInt(newRec.weaponPower)) + "(" + newRec.weaponPower + ")"
            delete newRec.masterId
            delete newRec.nameJp
            delete newRec.cutInImg
            delete newRec.spriteImg
            delete newRec.artImg
            delete newRec.blessing
            delete newRec.heroType
            delete newRec.weaponPower
            delete newRec.race
            delete newRec.skillCd
            delete newRec.skillName
            delete newRec.skillIcon
            delete newRec.limitPlus
            delete newRec.dragonFlower
            delete newRec.rank
            if("1" == newRec.pickFlag) {
                result.push(newRec)
            }
        } else if ("AZURLANE"==tableName){
            delete newRec.nameJp
            delete newRec.illustrator
            delete newRec.localFlag
            delete newRec.localSkinList
            delete newRec.localArtImg
            delete newRec.linkNm
            delete newRec.Rarity
            delete newRec.Classification
            delete newRec.Faction
            result.push(newRec)
        }
    })
    return result
}

/**
 * 按规则编辑更新数据
 * @Param newRec 编辑数据
 * @Param tableName 表名
 */
function editRowData(newRec,tableName) {
    // 火纹的时候
    if("FIREEMBLEM_HERO"==tableName){   

    }
    
    if("MENU"==tableName) {
        newRec["defaultLink"] = "1" == newRec["defaultLink"] ? "1" : "0"
    }
    
    if("FGO_SERVANT"==tableName) {
        let imgName = newRec["imgName"]
        imgName = imgName.replaceAll("(","_")
        imgName = imgName.replaceAll(")","")
        imgName = imgName.replaceAll(" ","")
        newRec["imgName"] = imgName
    }
}

/** ========== 私有方法部分 ========== */
function splitImgurl(data,column,splitStr) {
    if(data[column].indexOf(splitStr) > 0) {
        data[column] = data[column].split(splitStr)[0] + splitStr
    }
}
