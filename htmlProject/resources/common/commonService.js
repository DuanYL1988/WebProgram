(function ($) {
  $.extend(true, window, {
      'ajaxGet': ajaxGet,
      'ajaxPost': ajaxPost,
      'getValByKey':getValByKey,
      'isEmpty':isEmpty,
      'isNotEmpty':isNotEmpty,
      'isInclude':isInclude,
      'strArrMixed' : strArrMixed,
      'insUpdMapList':insUpdMapList,
      'createOptions':createOptions,
      'createCheck':createCheck,
      'createImg':createImg,
      'createElement':createElement,
      'appendChildren':appendChildren,
      'createTable':createTable,
      'editSelectPart' : editSelectPart,
      'popupMsg':popupMsg,
      'popupWinLocation' : popupWinLocation,
      'closePopupWindow':closePopupWindow,
      'formateDateYMDHMslash':formateDateYMDHMslash,
      'transListToMap':transListToMap,
      'transGirdToMap':transGirdToMap,
      'tranWebsqlRstMapToList' : tranWebsqlRstMapToList,
      'fifterList':fifterList,
      'checkUser':checkUser,
      'formateDateStr':formateDateStr,
      'autoWidth' : autoWidth,
      'compareDate':compareDate,
      'getNearDate' : getNearDate,
      'replaceZero':replaceZero,
      'findDict' : findDict,
      'getUrlParam':getUrlParam,
      'logout' : logout,
      'getInputJsonInDiv':getInputJsonInDiv,
      'doValidation':doValidation,
      'excuteSql' : excuteSql,
      'downloadImg' : downloadImg,
      'debug' : debug
  });
  
  function ajaxGet(url,jsonData,callback){
      $.ajax({
            type : 'GET',
            url :url,
            data :jsonData,
            dataType : 'json',
            success : callback,
            error:function(data){
                alert(JSON.stringify(data))
            }
        });
  }
  
  function ajaxPost(url,jsonData,callback){
      $.ajax({
            type : 'POST',
            url :url,
            contentType: 'application/json;charset=UTF-8',
            data :JSON.stringify(jsonData),
            dataType : 'JSON',
            success : callback,
            error:function(data){
                alert(JSON.stringify(data));
            }
        });
  }
  
  function getValByKey(key) {
      var value;
      jQuery.i18n.properties({
          name : "message",
          path : "/myapp/resources/",
          language : "",
          mode : "map",
          callback : function() {
              value = jQuery.i18n.prop(key);
          }
      });
      return value;
  }
  
  function isEmpty(arg) {
      arg = $.trim(arg);
      if (typeof arg == 'undefined') {
          return true;
      } else {
          if (typeof arg == 'object') {
              return false;
          } else if (''==arg || null == arg || 'null' == arg || 'NaN' == arg) {
              return true;
          }
          return false;
      }
  }
  
  function isNotEmpty(arg) {
      var rslt = isEmpty(arg) ? false : true;
      return rslt;
  }
  
  /** 数组内是否包含元素
   * @param str 值
   * @param arr 数组
   */
  function isInclude(str,arr) {
    if (typeof arr == "object" && arr.length > 0) {
      var incluedeFlag = false;
      $.each(arr,function(){
        if (str == this || incluedeFlag) {
          incluedeFlag = true;
        }
      });
      return incluedeFlag;
    } else {
      return false;
    }
  }

  /**
   * 判断两个数组是否有交集
   * @param {数组1} arr1 
   * @param {数组2} arr2 
   */
   function strArrMixed(arr1,arr2) {
    let mixedFlg = false;
    arr1.forEach(str1 => {
      if (!mixedFlg) {
        arr2.forEach(str2 => {
          if (str1 == str2) {
            mixedFlg = true;
          }
        });
      }
    });
    return mixedFlg;
  }

  /** 更新数组map
   *
   * @param MapObj 
   * @param key 
   * @param value 
   */
  function insUpdMapList(MapObj,key,value) {
    if (isEmpty(value)) {
      return;
    }
    if (isEmpty(MapObj[key])) {
      MapObj[key] = [value];
    } else {
      MapObj[key].push(value);
    }
  }
  
  /** 生成<option>标签
   *
   * @param ele <option>的父标签,如<select><dataset>
   * @param arrs 内容集合,格式[{"code":"A","value":"NM"},{"code":"B","value":"NM2"}]
   */
  function createOptions(ele,arrs,firstBlank,selectedVal){
    ele.innerHTML = '';
    if (isNotEmpty(firstBlank)) {
      let optionEle = createElement("option","","");
      ele.appendChild(optionEle);
    }
    $.each(arrs,function(){
      let optionEle = createElement("option","","");
      optionEle.value = this.code;
      optionEle.innerHTML = this.value;
      // 默认选择
      if(isNotEmpty(selectedVal) && selectedVal == this.code) {
        optionEle.selected = true
      }
      ele.appendChild(optionEle);
    });
  }
  
  /** 生成单选,复选框
   *
   * @param eleInfo Radio或Checkbox的属性对象{"id":test,"name":"hero.imgSrc",...}
   * @param infoList 内容集合,格式[{"code":"A","value":"NM"},{"code":"B",,"value":"NM2"}]
   * @param parentEle Radio或Checkbox存放位置的父标签
   */
  function createCheck(eleInfo,infoList,parentEle) {
    if (isEmpty(infoList)){
      // 没有设定内容时设置默认值
      infoList = [{"code":"1","value":"Yes"}];
      if ("radio" == eleInfo.type){
        infoList.push({"code":"0","value":"No"});
      }
    }
    
    $.each(infoList,function(){
      var gpEle = createElement("div","","checkItem");
      gpEle.style.display = ""
      var inputEle = createElement("input","","");
      inputEle.name = eleInfo.name;
      inputEle.className = eleInfo.classNm;
      inputEle.id = eleInfo.id;
      inputEle.type = eleInfo.type;
      inputEle.value = this.code;
      // readOnly
      if (eleInfo.readonly) {
        inputEle.setAttribute("disabled","");
      }
      // require
      if (isNotEmpty(eleInfo.require)) {
        inputEle.setAttribute("notempty","true");
      }
      gpEle.appendChild(inputEle);
      
      var labelEle = createElement("label","","");
      labelEle.innerHTML = this.value;
      labelEle.style.width = "auto";
      gpEle.appendChild(labelEle);
      
      parentEle.appendChild(gpEle);
    });
    
    // 只读
    var displayEle = createElement("span","","displayOnly");
    parentEle.appendChild(displayEle);
  }
  
  /** 创建图片元素<img>
   * @param arg js对象,值
   */
  function createImg(path,id,classNm,name){
      var imgEle = createElement('img',id,classNm,name);
      imgEle.src = path;
      return imgEle;
  }
  
  /** 创建html元素<img>
   * @param arg js对象,值
   */
  function createElement(type,id,classNm,name) {
    var ele = document.createElement(type);
    createAttr(ele,"id",id);
    createAttr(ele,"className",classNm);
    createAttr(ele,"name",name);
    return ele;
  }

  /** 往父元素中添加子元素集合
   * @parenetElement 父元素
   * @childrenElementArrs 子元素集合[element1,element2,...]
   */
  function appendChildren(parenetElement,childrenElementArrs){
    $.each(childrenElementArrs,(i,obj)=>{
      parenetElement.appendChild(childrenElementArrs[i]);
    });
  }
  
  function createTable(paramObj,dataList){
    console.log(dataList);
    // Table
    var tableEle = createElement("table","","","");
    tableEle.setAttribute("cellspacing",0);
    tableEle.border = "1";
    tableEle.style.width = paramObj.width;
    tableEle.id = paramObj.id;
    
    // Thead
    var thead = createElement("thead","","","");
    var tr = createElement("tr","","","");
    // selectAll
    if (isNotEmpty(paramObj.selectAll)) {
      var th = createElement("th","","","");
      var selectAll = createElement("input","","","selectAll");
      selectAll.type = "checkbox";
      $(selectAll).on("click",function(){
        var tblEle = $(this).parents("table")[0];
        var checkCnt = $(tblEle).find("input[type='checkbox']");
        $(checkCnt).attr("checked",this.checked);
      });
      th.appendChild(selectAll);
      tr.appendChild(th);
    }
    $.each(paramObj.head,function(){
      var th = createElement("th","","","");
      th.innerHTML = this;
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    tableEle.appendChild(thead);
    
    // Tbody
    var tbody = createElement("tbody","","","");
    $.each(dataList,function(){
      tr = createElement("tr","","","");
      // selectAll
      if (isNotEmpty(paramObj.selectAll)) {
        var selectTd = createElement("td","","","");
        var checkedEle = createElement("input","","","");
        checkedEle.type = "checkbox";
        selectTd.appendChild(checkedEle);
        tr.appendChild(selectTd);
      }
      // data
      $.each(this,function(j,cell){
        var td = createElement("td","","","");
        td.innerHTML = cell;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    
    });
    tableEle.appendChild(tbody);
    return tableEle;
  }
  
  /** 设置元素属性
   * @param elementObj 对象
   * @param attrNm 属性
   * @param attrValue 值
   */
  function createAttr(elementObj,attrNm,attrValue){
    if (isNotEmpty(attrValue)){
      elementObj[attrNm] = attrValue;
    }
  }
  
  /** 日期转换Data→yyyy/MM/DD HH:MI
  * @param dateVal Data型日期值
  */
  function formateDateYMDHMslash(dateVal) {
    var rst = dateVal.getFullYear();
    rst += "-" + (parseInt(dateVal.getMonth()) +1);
    rst += "-" + dateVal.getDate();
    rst += "T" + dateVal.getHours();
    var sec = dateVal.getSeconds();
    if (parseInt(sec)<10) {
      sec = "0" + sec;
    }
    rst += ":" + sec;
    return rst;
  }
  
  /** 显示错误提示区域块
   *
   */
  function popupMsg(errorMsg){
    $("#popup").show(50);
    $("#errorMsg").html(errorMsg);
  }
  
  /** popup画面居中
   *
   */
  function popupWinLocation(w,h){
    let c_width = screen.width
    let c_height = screen.height
    w = parseInt(w)
    h = parseInt(h)
    let lft = c_width > w ? (c_width - w)/2 : 0
    let tp = c_height > h ? (c_height - h)/2 : 0
    return {'width':w,'height':h,'left':lft ,'top' : tp}
  }
  
  /** 编辑select部分
   *
   */
  function editSelectPart(columns,tableNm){
    let quary = 'select ';
    if('array'!=typeof(columns) && 'object'!=typeof(columns)) {
      quary += '*'
    } else {
      quary += ' id '
      columns.forEach(column=>{
        quary += ',' + column['column'] + ' as ' + column['propertyName'] 
      })
    }
    quary += ' from ' + tableNm + ' where 1=1 '
    return quary;
  }

  /** 关闭错误提示区域
   *
   */
  function closePopupWindow() {
    $("#errorMsg").html("");
    $("#popup").hide();
  }
  
  /** 输入验证
   *
   */
  function doValidation(docAreaEle){
    // 清空
    $(".error").prop('class','');
    $("#errorMsg").html("");
    $("#messageArea").hide();
    let errorMsg = "";
    // 首个出错项目取得焦点
    let firstFlag = false;
    // 验证区域
    let partFlag = isNotEmpty(docAreaEle);

    
    // 取得输入元素
    let inputEleList;
    if (partFlag) {
      inputEleList = $(docAreaEle).find("input,select");
    } else {
      inputEleList = $("input,select");
    }

    
    $.each(inputEleList,function(){
      // 非活性的不进行验证
      if(!this.disabled && 'none'!=$(this).parents()[1].style.display) {
        let titleEle = $(this).prev()[0];
        let title = titleEle.innerHTML;
        let nessaryFlg = isNotEmpty(this.attributes["data-necessary"]) ? this.attributes["data-necessary"].value : "false";
        let tag = this.tagName;
        let type = isNotEmpty(this.attributes["type"]) ? this.attributes["type"].value : "";
        let selectedEle = isInclude(type,["radio","checkbox"]);

        // 必须输入验证
        if("true" == nessaryFlg && (isEmpty(this.value) || (selectedEle && !this.checked))) {
          this.placeholder = 'please input value!';
          this.className = this.className + "error";

          if (tag=="SELECT" || isInclude(type,["radio","checkbox"])) {
            title += "未选择<br>";
          } else {
            title += "未输入<br>";
          }

          errorMsg += title;
          if (!firstFlag) {
            this.focus();
            firstFlag = true;
          }
        }
        
        // 属性验证
        let propertyTypeFlg =  isNotEmpty(this.attributes["data-property"]) ? this.attributes["data-property"].value : "";
        if(isNotEmpty(propertyTypeFlg) && isNotEmpty(this.value)) {
          title += "格式不正确<br>";
          let property = propertyTypeFlg.value;
          errorMsg += title;
          // TODO
          if (!firstFlag) {
            this.focus();
            firstFlag = true;
          }
        }
      }
    });

    //
    console.log(errorMsg);
    $("#errorMsg").html(errorMsg);
    $("#messageArea").show();

    //
    if(!firstFlag) {
      return false;
    } else {
      popupMsg(errorMsg);
      return true;
    }
  }
  
  /** 
   * 将list进行group处理成map
   * 
   * @param dataList 集合数据
   * @param mapKey 分组字段
   * @param singleFlag 单独对象
   */
  function transListToMap(dataList,mapKey,singleFlag) {
    var resultMap = {};
    $.each(dataList,function(i,data){
      var keyValue = data[mapKey];
      // map中存在check
      if(isEmpty(resultMap[keyValue])) {
        resultMap[keyValue] = [];
      }
      // 不重复flag
      if (singleFlag) {
        resultMap[keyValue] = data;
        return;
      } else if (isNotEmpty(keyValue) && '99'!=keyValue){
        resultMap[keyValue].push(data);
      }
    });
    return resultMap;
  }
  
 /**
  * 多对多网状结构转换为某一属性的1对多Map
  * 
  * @param dataList 元数据集合
  * @param attrId Group化项目名
  * @param strSplit 分割符
  * @param uniqueList 属性集合List
  */
  function transGirdToMap(dataList,attrId,strSplit,uniqueList){
    var resultMap = {};
    var code = 1;
    $.each(dataList,function(i,data){
      var attrList;
      if (isNotEmpty(strSplit)) {
        attrList = data[attrId].split(strSplit);
      } else {
        attrList = data[attrId];
      }
      // 循环属性
      $.each(attrList,function(j,attr){
        if (isEmpty(resultMap[attr])) {
          resultMap[attr] = [];
          resultMap[attr].push(data.id);
          uniqueList.push({"code":code++,"value":attr});
        } else {
          resultMap[attr].push(data.id);
        }
      });
    });
    return resultMap;
  }

  function tranWebsqlRstMapToList(returnData) {
    let returnList = []
    $.each(returnData,(K,V)=>{
      returnList.push(V)
    })
    return returnList
  }

  /**
   * 筛选列表
   * @param {数据列表} list 
   * @param {筛选条件} condition 
   */
  function fifterList(list,condition) {
    // 循环条件
    $.each(condition,(K,V)=>{
      // 将list转为条件Kev为单位的Map,取得list进行迭代
      list = transListToMap(list,K,false)[V];
    });
    return list;
  }
  
  /** 
   * 取得get请求url中的参数
   * @return 参数对象{'key' : value1 ,'key2' : value2}
   */
  function getUrlParam(){
    let paramText = window.location.search;
    paramText = paramText.replace('?','');
    paramText = paramText.split('&');
    let paramObj = {};
    $.each(paramText,function(){
      paramObj[this.split('=')[0]] = this.split('=')[1];
    });
    return paramObj;
  }

  /**
   * 取得DIV内输入内容
   * @param {DIV的ID} divEleID 
   * @returns 
   */
  function getInputJsonInDiv(divEleID){
    let jsonData = {};
    $.each($("#"+divEleID+"").find("input[type='number']"),function(i,obj){
      let value = $(obj).val();
      if (isNotEmpty(value)) {
        jsonData[$(obj).attr('name')] = value; 
      }
    });
    console.log(jsonData);
    return jsonData;
  }

  function checkUser(user) {
    if (!isNotEmpty(user)) {
      alert("没有用户信息,请确认用户!");
      window.close();
    }
  }

  /** 转换日期为字符串 
   * @param {日期类型} date 
   * @param {日期字符串格式区分} kbn (ymd:yyyy-mm-dd,md:mm/dd ...)
   * @returns 
   */
  function formateDateStr(date, kbn) {
    if ('string' == typeof(date)){
      date = new Date(date)
    }
    let year = date.getFullYear();
    let month = replaceZero(date.getMonth()+1, 2, '0');
    let day = replaceZero(date.getDate(), 2, '0');
    let cDate = date.getFullYear() + "-" + month + "-" + day;
    let cTime = replaceZero(date.getHours(), 2, '0') + ":" + replaceZero(date.getMinutes(), 2, '0');
    if ("ymd" == kbn) {
      return cDate;
    } else if ("md" == kbn) {
      return month + "/" + day;
    } else if ("hms" == kbn) {
      return cTime
    } else {
      return cDate + "T" + cTime;
    }
  }

  /** 自动设置宽度
   * @param {value} 值
   * @returns 
   */
  function autoWidth(value){
    if(isEmpty(value)) {
      return "100%"
    } else {
      return value.length + "px";
    }
  }

  /** 比较日期
   * @param {date1} 日期1字符串
   * @param {date2} 日期2字符串
   * @returns date2>date1 ? true : false
   */
  function compareDate(date1,date2) {
    let dt1 = new Date(date1)
    let dt2 = new Date(date2)
    return dt2-dt1 > 0
  }
  
  /** 取得隔天日期
   * @param {dateStr} 当前日期
   * @param {kbn} 区分
   * @returns kbn = next ? 后一天 : 前一天
   */
  function getNearDate(dateStr,kbn){
    let date = new Date(dateStr)
    if ("next" == kbn) {
      date = +date + 1000 * 60 * 60 * 24
    } else {
      date = date - 1000 * 60 *60 * 24
    }
    date = new Date(date)
    return formateDateStr(date,'ymd')
  }

  /**
   * 补位
   * @param {需要补位的对象} num 
   * @param {补充致位数} fillLength 
   * @param {补充字符} fillChar 
   * @returns 
   */
  function replaceZero(num,fillLength,fillChar) {
    let rst = num + "";
    while(rst.length<fillLength){
        rst = fillChar + num;
    }
    return rst
  }

  function findDict(code,prop,defaultVal){
    return isNotEmpty(tableData['dict'][code]) ? tableData['dict'][code][prop] : defaultVal;
  }

  function debug(object) {
    console.debug(JSON.stringify(object))
  }

  function logout(targetUrl){
    if (confirm("确认退出吗?")) {
        window.location = targetUrl
    }
  }
  
  /**
   * 通用执行SQL
   * @param {websql对象实例} webSqlObj 
   * @param {检索SQL} quary 
   * @param {检索条件数组} params 
   * @param {回调函数} callback 
   */
  function excuteSql(webSqlObj,quary,params,callback){
    webSqlObj.executeQuary(quary,params,callback);
  }
  
  /**
   * 下载图片
   * @param {图片链接地址} src 
   * @param {保存图片名} imgName 
   */
  function downloadImg(src,imgName){
    var x = new XMLHttpRequest();
    x.open("GET",src,true);
    x.responseType = 'blob';
    x.onload=function(e){
      var url = window.URL.createObjectURL(x.response)
      let a = createElement('a','','','')
      a.href = url
      a.download = imgName
      a.click()
    }
    x.send()
  }

  $.fn.serializeObject = function(){
      var jsonObj = {};
      var formParam = this.serializeArray();
      $.each(formParam,function(){
        if ("undefined" != this.name) {
          var keyName = this.name.split('.');
          if(keyName.length>1){
              var innerObjKey = keyName[0];
              if(jsonObj.hasOwnProperty(innerObjKey)){
                  jsonObj[this.name.split('.')[0]][this.name.split('.')[1]] = this.value || '';
              } else {
                  jsonObj[this.name.split('.')[0]] = {};
                  jsonObj[this.name.split('.')[0]][this.name.split('.')[1]] = this.value || '';
              }
          } else {
              if(jsonObj.hasOwnProperty(this.name)){
                jsonObj[this.name].push(this.value || '');
              } else {
                jsonObj[this.name] = this.value;
              }
          }
        }
      });
      return jsonObj;
  }
  
})(jQuery);
