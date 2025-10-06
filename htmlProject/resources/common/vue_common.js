/* ==================== 文字処理 Start ==================== */

/**
 * 空对象判断
 */
function isNullObject(object) {
    if ("object" === (typeof object)) {
        return false
    } else if (null === object || "undefined" === (typeof object)) {
        return true
    } else {
        return false
    }
}

/**
 * 空字符串判断
 */
function isEmpty(str) {
    return "undefined" == (typeof str) || null == str || "" == str 
}

/**
 * 非空字符串判断
 */
function isNotEmpty(str) {
    return !isEmpty(str)
}

/**
 * 正则匹配
 */
function regCheck(str, pattern) {
    let result = false
    if ("eng" == pattern) {
        // \w = [0-9a-zA-Z_]
        result = /[\w\s]+$/.test(str)
    }
    return result
}

function replaceAll(str, befStr, aftStr) {
    return str.split(befStr).join(aftStr)
}

/**
 * 复制数据（不同地址）
 */
function copyObject(originObj) {
    return JSON.parse(JSON.stringify(originObj))
}

/** 数组内是否包含元素
 * @param str 值
 * @param arr 数组
 */
function isInclude(str, arr) {
    if (typeof arr == "object" && arr.length > 0) {
        var incluedeFlag = false;
        $.each(arr, function () {
            if (str == this || incluedeFlag) {
                incluedeFlag = true;
            }
        });
        return incluedeFlag;
    } else {
        return false;
    }
}

function tranColumnToProp(dbColNm, firstUpperFlag) {
    dbColNm = dbColNm.split("_")
    let propertyNm = ""
    for (let i = 0; i < dbColNm.length; i++) {
        let temp = dbColNm[i]
        temp = temp.substring(0, 1).toUpperCase() + temp.substring(1)
        propertyNm += temp
    }
    if (false == firstUpperFlag) {
        propertyNm = propertyNm.substring(0, 1).toLowerCase() + propertyNm.substring(1)
    }
    return propertyNm
}
/* ==================== 文字処理 Start ==================== */

/* ==================== 浏览器相关 Start ==================== */
function getBrowerSize() {
    let pcInfo = {}
    pcInfo["clientWidth"] = document.documentElement.clientWidth
    pcInfo["clientHeight"] = document.documentElement.clientHeight
    return pcInfo
}

/**
 * 复制文本框内的内容
 */
function doCopy(textAreaElementId, jsonStr) {
    let result = false;
    try {
        textareaEle = document.getElementById(textAreaElementId)
        if (!isEmpty(jsonStr)) {
            textareaEle.value = jsonStr
        }
        textareaEle.select()
        document.execCommand('copy')
        result = true
    } catch (e) {
        console.error(e.message)
    }
    return result
}

/**
 * 取得URL中参数
 */
function getUrlParam() {
    let paramText = window.location.search;
    paramText = paramText.replace('?', '');
    paramText = paramText.split('&');
    let paramObj = {};
    $.each(paramText, function () {
        paramObj[this.split('=')[0]] = this.split('=')[1];
    });
    return paramObj;
}
/* ==================== 浏览器相关 End ==================== */

/* ==================== DOM操作関連 Start ==================== */

/**
 * DOM元素作成
 * @param tag HTMLのタグ
 * @param attrInfo 属性OBJ {"id":"t-index1","name":"xxx","class":"xxx",...}
 */
function createElement(tag, attrInfo) {
    let domElement = document.createElement(tag)
    let attrs = Object.keys(attrInfo)
    let noSetAttr = { "innerHTML": "", "value": "", "checked": "" }
    attrs.forEach(attr => {
        //console.log(attr + ":" + attrInfo[attr])
        if (null != noSetAttr[attr]) {
            domElement[attr] = attrInfo[attr]
        } else {
            domElement.setAttribute(attr, attrInfo[attr])
        }
    })
    return domElement
}

/**
 * 親元素に子元素追加作成
 * @param parentEle 親元素
 * @param childEles 子元素配列
 */
function appendChilds(parentEle, childEles) {
    childEles.forEach(child => {
        parentEle.appendChild(child)
    })
}

/* ==================== DOM操作関連 End ==================== */

/* ==================== 日付・時間処理関連 Start ==================== */

/**
 * 日付フォーマット
 * @param date Data型日付
 * @param ptn フォーマット形(yyyy-mm-dd,mm-dd,...)
 */
function formateDate(date, ptn) {
    let year = date.getFullYear()
    let month = (date.getMonth() + 1)
    month = month < 10 ? "0" + month : month
    let day = date.getDate()
    day = day < 10 ? "0" + day : day
    if ("yyyy-mm-dd" == ptn) {
        return year + "-" + month + "-" + day
    } else if ("mm-dd" == ptn) {
        return month + "-" + day
    } else if ("yyyy-mm" == ptn) {
        return year + "-" + month
    } else if ("dd" == ptn) {
        return day
    } else if ("yyyy/mm/dd" == ptn) {
        return year + "/" + month + "/" + day
    } else if ("yyyy/mm" == ptn) {
        return year + "/" + month
    } else {
        return date.toLocaleDateString()
    }
}

/**
 * 日付フォーマット
 * @param date 文字日付
 * @param ptn フォーマット形(yyyy-mm-dd,mm-dd,...)
 */
function formateStrDate(strDate, ptn) {
    let date = new Date(strDate)
    return formateDate(date, ptn)
}

/**
 * 日付フォーマット
 * @param date 文字日付
 * @param ptn フォーマット形(yyyy-mm-dd,mm-dd,...)
 */
function changeDay(date, kbn, days) {
    let dateObj = date
    if (typeof date !== "object") {
        dateObj = new Date(date)
    }
    if ('pre' == kbn) {
        dateObj.setDate(dateObj.getDate() - days)
        pickDate = formateDate(dateObj, 'yyyy-mm-dd')
    } else if ('next' == kbn) {
        dateObj.setDate(dateObj.getDate() + days)
        pickDate = formateDate(dateObj, 'yyyy-mm-dd')
    }
    return formateStrDate(dateObj, 'yyyy-mm-dd')
}

/**
 * 月末月始日付取得
 * @param date Data型日付
 */
function getMonthStartEndDay(date) {
    let firstDay = formateDate(date, "yyyy-mm") + "-01"
    // 来月の一日前は今月の月末
    let lastDay = new Date(firstDay)
    lastDay.setMonth(lastDay.getMonth() + 1)
    lastDay.setDate(lastDay.getDate() - 1)
    return { "firstDay": firstDay, "lastDay": formateDate(lastDay, "yyyy-mm-dd") }
}

function parseStrTime(time, kbn) {
    time = "2023-01-01 " + time
    if ("mm-dd" == kbn) {
        time = time + ":00"
    }
    timeObj = new Date(time)
    return timeObj
}

/**
 * 月末月始日付取得
 * @param date Data型日付
 */
function getBetweenTime(startTime, endTime, kbn) {
    startTime = parseStrTime(startTime, kbn)
    endTime = parseStrTime(endTime, kbn)
    let seconds = endTime.getTime() - startTime.getTime()
    let hours = parseFloat(seconds / 3600000)
    let minutes = parseFloat(seconds / 60000)
    return minutes
}

/**
 * 将分钟转为小时
 * @param date Data型日付
 */
function trunsMinToHour(minutes) {
    let hours = parseInt(minutes / 60)
    let minute = minutes % 60
    return hours + "H" + minute + "M"
}
/* ==================== 日付・時間処理関連 End ==================== */

/* ==================== 数字処理関連 Start ==================== */

function tenToOther(num, type) {
    return Number(num).toString(type)
}

function otherToTen(num, type) {
    return parseInt(num, type)
}

/**
 * 0-maxNumランダム数取得
 */
function getRandomCnt(maxNum) {
    return Math.floor(Math.random() * maxNum)
}

/* ==================== 数字処理関連 End ==================== */

/* ==================== 配列、対象など処理 Start ==================== */

/**
 * 将数据集合中莫一字段所有值转为不重复的数组
 * @param list 数据集合
 * @param key 属性
 */
function getCodesInColumns(list, key) {
    let codes = {}
    $.each(list, (index, recode) => {
        codes[recode[key]] = ""
    })
    let result = []
    $.each(codes, (K, V) => {
        result.push(K)
    })
    return result
}

/**
 * 将websql执行结果ResultSet转为数组列表
 * @param websqlResultset {0:{},1:{}}
 */
function transSQLResultSetToArray(websqlResultset) {
    let resultArr = []
    $.each(websqlResultset, (index, record) => {
        resultArr.push(record)
    })
    return resultArr
}

/**
 * List[]を特定カラムの値を元にMap<{"colUm"},List[]>に変換
 * @param data List[Object,Object,Object,...]
 * @param colNm Objectの属性Attr
 */
function groupListByCol(data, colNm) {
    let result = {}
    $.each(data, (index, recode) => {
        let colVal = recode[colNm]
        if (isNullObject(result[colVal])) {
            result[colVal] = []
        }
        result[colVal].push(recode)
    })
    return result
}

/**
 * 将list转为唯一值map
 * @param {数据集合} list 
 * @param {唯一值字段} column 
 * @returns 
 */
function transListToMap(list, column) {
    let result = {}
    $.each(list, (index, recode) => {
        let keyColumn = recode[column]
        keyColumn = keyColumn.replace(/_/g,'')
        result[keyColumn] = recode
    })
    return result
}

function sortListByColumns(list, column) {
    let tempMapList = groupListByCol(list, column)
    let result = []
    $.each(tempMapList, (name, list) => {
        result = result.concat(list)
    })
    return result
}

/**
 * Map<Key,Object>のKey配列取得
 */
function getGroupKeys(data) {
    let keys = []
    $.each(data, (index, column) => {
        keys.push(index)
    })
    return keys
}

/**
 * 条件満たすデータを引き出す
 * @param list 配列List[Object,Object,Object,...]
 * @param condition 検索条件{"Key":value}
 * @param type["OR":一つ満たす,"OR"以外:全部満たす]
 */
function filterAndCondtion(list, condition, type) {
    let result = []
    // データループ
    $.each(list, (index, record) => {
        // 条件ループ
        let pushFlag = "OR" === type ? false : true
        if (("OR" !== type && pushFlag) || ("OR" === type && !pushFlag)) {
            $.each(condition, (K, V) => {
                // 一つ満たすると追加
                if ("OR" === type) {
                    pushFlag = true
                    // 全部満たさないと追加しない
                } else if ("OR" !== type) {
                    if ("null" === V && isNotEmpty(record[K])) {
                        pushFlag = false
                    } else if ("notnull" === V && isEmpty(record[K])) {
                        pushFlag = false
                    } else if ("null" !== V && "notnull" !== V && record[K].indexOf(V) < 0) {
                        pushFlag = false
                    }
                }
            })
        }
        if (pushFlag) {
            result.push(record)
        }
    })
    return result
}

/**
 * 复合排序
 */
function sortByCol(list, column, type) {
    list.sort((a, b) => {
        if (isEmpty(a[column])) {
            a[column] = 99
        }
        if (isEmpty(b[column])) {
            b[column] = 99
        }
        if ("desc" == type) {
            return parseInt(a[column]) < parseInt(b[column]) ? 1 : -1;
        } else {
            return parseInt(a[column]) > parseInt(b[column]) ? 1 : -1;
        }
    })
    return list
}

/**
 * 将数组转为以,分割的文字列
 * @param array 数组
 * @param holdLastComma 是否保留最后一位分隔符,
 */
function transArrToStr(array, holdLastComma) {
    let resultStr = ""
    $.each(array, (index, str) => {
        console.log(typeof str)
        resultStr += str + ","
    })
    // 去除最后一位【,】
    if (array.length > 0 && !holdLastComma) {
        resultStr = resultStr.substring(0, resultStr.length - 1)
    }
    return resultStr
}

/**
 * 给初始一览数据设置编辑flag
 * @param list 表示的Table列表
 * @param base 复制源数据
 * @param mode 是否保留源数据
 */
function toEditableList(list, idKey) {
    let result = {}
    //let result = []
    $.each(list, (index, record) => {
        record["editFlag"] = false
        record["updateType"] = ""
        record["id"] = index + 1
        if (isEmpty(idKey)) {
            result[index + 1] = record
        } else {
            result[record[idKey]] = record
        }
    })
    return result
}

/**
 * 列表中追加一列
 * @param list 表示的Table列表
 * @param base 复制源数据
 * @param mode 是否保留源数据
 * @param nextVal 自增主键
 */
function copyLine(list, base, nextVal) {
    let newLine = copyObject(base)
    if (!isEmpty(nextVal)) {
        newLine["id"] = nextVal
    }
    newLine["editFlag"] = true // 可编辑
    newLine["updateType"] = "insert" // 更新模式:追加
    list.push(newLine)
    return newLine
}

/**
 * 清楚数据的值
 * @param data 源数据
 */
function cleanData(data) {
    let result = {}
    $.each(data, (K, V) => {
        result[K] = ""
    })
    return result
}

/**
 * 给初始一览数据清除编辑flag
 * @param list 表示的Table列表
 * @param base 复制源数据
 * @param mode 是否保留源数据
 */
function removeEditFlag(list) {
    $.each(list, (index, record) => {
        delete record["editFlag"]
        delete record["updateType"]
    })
    return list
}

function mergeEditDataToOriginList(editList, originList, groubKey) {
    let originMap = groupListByCol(originList, groubKey)
    let editMap = groupListByCol(editList, groubKey)
    console.log(editList)
    $.each(editMap, (key, recordArr) => {
        let record = recordArr[0]
        if ("update" == record["updateType"] || "insert" == record["updateType"] || record.editFlag) {
            originMap[record[groubKey]] = [record]
        }
    })
    let result = []
    $.each(originMap, (index, rec) => {
        result.push(rec[0])
    })
    return result
}


/* ==================== 配列、対象など処理 End ==================== */

/* ==================== データ更新内容Studioに出力 Start ==================== */
/**
 * 控制台输出json
 * @param paramName 属性名
 * @param list 数据集合
 */
function jsonPrint(paramName, list) {
    let jsonStr = "[\r\n"
    $.each(list, (index, record) => {
        let comma = (index == list.length - 1) ? "\r\n" : ",\r\n"
        jsonStr += "\t" + JSON.stringify(record) + comma
    })
    jsonStr += "]"
    console.log("const " + paramName + " = " + jsonStr)
    return jsonStr
}

function transTagStrToArr(name, list, tagColNm) {
    let map = {}
    let transFlag = false
    $.each(list, (index, recode) => {
        // 初期化
        if (!transFlag) {
            console.log(typeof recode[tagColNm])
            if (isEmpty(recode[tagColNm])) {
                recode[tagColNm] = []
            } else {
                if ("object" == typeof recode[tagColNm]) {
                    transFlag = true
                    return
                }
                let tags = recode[tagColNm].split(",")
                recode[tagColNm] = tags
            }
            map[recode.id] = recode
        }
    })
    if (!transFlag) {
        return margeEditDataToJson(name, list, map)
    }
}

/**
 * 页面上更新的内容生产最新的静态json
 *
 * @param name 变量名
 * @param jsonData JSON文件里的json数据
 * @param pageData 页面上更新的json数据
 */
function margeEditDataToJson(name, jsonData, pageData) {
    let index = jsonData.length + 1
    // Concat開始
    let jsonStr = "const " + name + " = [" + "\r\n"
    // Concatループ
    $.each(jsonData, (index, record) => {
        // データ更新無し、元のまま
        if (isNullObject(pageData[record.id])) {
            jsonStr += JSON.stringify(record) + ",\r\n"
        } else {
            jsonStr += JSON.stringify(pageData[record.id]) + ",\r\n"
        }
    })

    // Concat終了
    jsonStr += "],\r\n    "
    console.log(jsonStr)
    return jsonStr
}
/* ==================== データ更新内容Studioに出力 End ==================== */

/* ==================== 加密处理 Start ==================== */

/**
 * 获取RSA键
 */
function getRSAKey(cryptico, keyStr) {
    return cryptico.generateRSAKey(keyStr, 1024)
}

/**
 * 获取加密后文本
 */
function getEncryptStr(cryptico, str, keyStr) {
    let RSAkey = getRSAKey(cryptico, keyStr)
    let publicKey = cryptico.publicKeyString(RSAkey)
    let testKey = cryptico.encrypt(str, publicKey);
    let encryptStr = testKey.cipher
    console.log("加密后:" + encryptStr + "长度:" + encryptStr.length)
    return encryptStr
}

/**
 * 获取解密后文本
 */
function getDecryptStr(cryptico, encryptStr, keyStr) {
    let RSAkey = getRSAKey(cryptico, keyStr)
    let decryptStr = cryptico.decrypt(encryptStr, RSAkey)
    console.log(decryptStr)
    return decryptStr.plaintext
}

/* ==================== 加密处理 End ==================== */

function getCategoryList(codeList, category) {
    let resultArr = []
    $.each(codeList, (index, data) => {
        let march = data.application + "_" + data.categoryId
        if (category == march) {
            resultArr.push(data)
        }
    })
    return resultArr
}

function getCodeByColumnInfo(codeList, columnCode, dataCode) {
    let condition = { "code": dataCode }
    if (columnCode.indexOf("_") > 0) {
        condition["application"] = columnCode.split("_")[0]
        condition["categoryId"] = columnCode.split("_")[1]
    }
    let result = filterAndCondtion(codeList, condition, "and")
    if (result.length == 0) {
        delete condition["code"]
        condition["name"] = dataCode
        result = filterAndCondtion(codeList, condition, "and")
    }
    return result.length > 0 ? result[0]["name"] : "-"
}


/* ==================== 刮削处理 End ==================== */
/**
 * 获取解密后文本
 *
 * @param dom DOM文档
 * @param tagName 标签名
 * @param index 下标顺序
 * @param fileType 扩展名
 *
 */
function getImgSrc(dom, tagName, index, fileType) {
    let imgDom = $(dom).find(tagName)[index]
    let url = $(imgDom).attr("src")
    if (isEmpty(url) || url.indexOf(fileType) < 0) {
        console.warn("url:" + url + ",type:" + fileType)
        return url
    }
    return url.split(fileType)[0] + fileType
}

function getStrFromTag(dom, tagName, index, attr) {
    let childDom = $(dom).find(tagName)[index]
    if ("html" !== attr) {
        return $(childDom).attr(attr)
    } else {
        return $(childDom).html()
    }
}

function getTdChildStr(dom, tdIndex, childTag, childIndex, attr, fileType) {
    let tdEle = $(dom).find("td")[tdIndex]
    let childEle = $(tdEle).find(childTag)[childIndex]
    if ("html" == attr) {
        return $(childEle).html()
    } else if ("src" == attr && "imagetag" == childTag) {
        let url = $(childEle).attr("src")
        if (isEmpty(url) || url.indexOf(fileType) < 0) {
            console.warn("url:" + url + ",type:" + fileType)
            return url
        }
        return url.split(fileType)[0] + fileType
    } else {
        return $(childEle).attr(attr)
    }
}

/**
 * 下载图片
 *
 * @param link 图片地址
 * @param picName 保存文件名
 *
 */
function downloadImage(link, picName) {
    let img = new Image()
    img.setAttribute('crossOrigin', 'Anonymous')
    img.onload = function () {
        let canvas = document.createElement('canvas')
        let context = canvas.getContext('2d')
        canvas.width = img.width
        canvas.height = img.height
        context.drawImage(img, 0, 0, img.width, img.height)
        let url = canvas.toDataURL('images/png')
        let a = document.createElement('a')
        let event = new MouseEvent('click')
        a.download = picName || 'default.png'
        a.href = url
        a.dispatchEvent(event)
    }
    img.src = link + '?v=' + Date.now()
}
/* ==================== 加密处理 End ==================== */