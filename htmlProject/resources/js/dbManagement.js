// DB对象
const webSqlObj = new webSqlManagement();
// 表一览
const tableList = []
// 初始化
var setUp = webSqlObj.setUp;
// 上次执行过的检索SQL
var searchedQuary;
// 上次检索后的结果对象
var selectedData;
// 默认排序
var orderby = 'asc';
// 导出数据DML集合
var resultArrs = []

$(function () {
  // 表一览下拉框
  let index = 0
  $.each(tableInfo, (tableName, tableDetail) => {
    tableList.push(tableName)
    let optionEle = document.createElement("option");
    optionEle.value = tableName + "," + tableDetail.displayWidth;
    optionEle.innerHTML = tableDetail.name;
    if (index == 0) {
      // optionEle.selected = true;
    }
    document.getElementById('selectedTable').appendChild(optionEle);
    index++;
  });
});

/** 创建表
 * 
 */
function createTable() {
  let info = ""
  $.each(tableList,(index,tbl)=>{
	console.log(tbl)
	setUp.table = tbl
	// 建表
	webSqlObj.executeQuary("drop table " + setUp.table);
	let sql = getDDL(setUp.table);
	webSqlObj.executeQuary(sql);
	// 插入数据
	insertDataList();
	info += tableInfo[tbl]['name'] + "表  初始化成功,追加" + tableData[setUp.table].length + "条数据!\n";
  })
  alert(info)
  setUp.table = tableList[0]
}

/** 批量插入数据
 * 
 */
function insertDataList() {
  // 表字段信息
  let tblColumns = tableInfo[setUp.table].columns;
  
  // 根据DB的json情报编辑重新数据,防止Data和DB字段不一致无法插入
  $.each(tableData[setUp.table], (i, recoderObj) => {
    let editDataList = {};
    $.each(tblColumns, (j, colInfo) => {
      let columnNm = colInfo['column'];
      let pro
      if ('object' == typeof recoderObj[columnNm]) {
        editDataList[columnNm] = JSON.stringify(recoderObj[columnNm]);
      } else if (isEmpty(recoderObj[columnNm])){
        editDataList[columnNm] = "";
      } else {
        editDataList[columnNm] = recoderObj[columnNm];
      }
    });
    webSqlObj.insertData(setUp.table, editDataList, false);
  });
}

/** 导出DDL
 * 
 */
function exportDDL() {
  if (isEmpty(setUp.table)) {
    alert('please select table!');
    return;
  }
  let tableName = setUp.table;
  let ddl = getDDL(tableName);
  console.log(ddl);
  //
  $("#consoleArea").html("");
  printDDL(ddl+"\r\n");
  
  console.debug(resultArrs)
  $.each(resultArrs,(i,dmlStr)=>{
    printDDL(dmlStr+"\r\n");
  });
  $("#consoleArea").show();
  //
}

/** 导出表DDL以及初始化数据
 * 
 */
function getDDL(tableName){
  let createTblSql = 'create table if not exists ' + tableName;
  $.each(tableInfo[tableName].columns, function (i) {
    if (i==0) {
      if ("ID" == this.column.toUpperCase()) {
        createTblSql += '(' + this.column + ' ' + this.type + '(' + this.length + ') primary key ';
      } else {
        // DDL中没设id字段则自动自增
        createTblSql += '(id integer primary key autoincrement';
        // 第一行是id以外字段,自动拼接
        createTblSql += ',' + this.column + ' ' + this.type
      }
    } else {
      createTblSql += ',' + this.column + ' ' + this.type
    }
    if (i > 0 && isNotEmpty(this.length)) {
      createTblSql += '(' + this.length + ')';
    }
  });
  createTblSql += ');';
  return createTblSql;
}

/** JSON转为DML
 * 
 */
function getDML(tableName) {
  // 表字段信息
  let tblColumns = tableInfo[tableName].columns;
  // DML
  let insertPart = "insert into " + tableName + " (";
  let resultArr = [];
  let quary = "SELECT * FROM " + tableName;

  webSqlObj.executeQuary(quary, [], function (result) {
    let searchData = tranWebsqlRstMapToList(result.rows)
    $.each(searchData, (i, recoderObj) => {
      // 列名
      let tempPart2 = '';
      let colIndex = 0;
      $.each(recoderObj, (colNm, val) => {
        colIndex++;
        // 列名不包括id
        if ('id' != colNm) {
          // 字段名只取一次
          if (i == 0) {
            insertPart += (tblColumns.length+1) != colIndex ? colNm + "," : colNm
          }
          tempPart2 += (tblColumns.length+1) != colIndex ?  "'" + val +"'," :  "'" + val +"'"
        }
      });
      if (i == 0) {
            resultArr.push(insertPart + ") VALUES " );
            resultArr.push("(" + tempPart2 + ")");
        } else {
          resultArr.push(",(" + tempPart2 + ")");
        }
    });
    console.debug(resultArr)
    // 初始数据json list
    resultArrs = resultArr
  });
}

/** 当前行数据插入
 * 
 */
function insertRow(btnEle) {
  let recoderObj = {};
  let rowEle = $(btnEle).parents()[1];
  $.each($(rowEle).find("input"), function () {
    recoderObj[this.name] = this.value;
  });
  webSqlObj.insertData(setUp.table, recoderObj, false);
  reflashTable(searchedQuary);
}

/** 编辑/更新当前行
 * 
 */
function updateRow(id, btnEle) {
  // tr>td>button 通过btn取得tr
  let rowEle = $(btnEle).parents()[1];
  // 一行中所有列
  let tdList = $(rowEle).children();
  let tabNm = setUp.table;
  let columnInfo = transListToMap(tableInfo[tabNm]["columns"],"column",true);
  // 没有输入项目时
  if ($(rowEle).find("input").length <= 1) {
    // 字段信息
    
    // 循环列
    $.each(tdList, function (i, tdEle) {
      // 第一列是id,最后一列是动作区
      if (i > 1 && i < tdList.length - 1) {
        // 取得显示的值
        let val = this.innerHTML;
        // 属性
        let name = this.id.split('-')[1];
        if ('id' == name){
          return true;
        }
        // td清空
        this.innerHTML = '';
        // td中放入对应的输入框元素
        let inputEle;
        let inputType = columnInfo[name]["inputType"];
        inputType = isEmpty(inputType)? "text" : inputType;
        if ("date" == inputType) {
          inputEle = createElement('input', '', 'td-input', name);
          inputEle.type = "date";
        } else {
          inputEle = createElement('input', '', 'td-input', name);
        }
        inputEle.value = val;
        this.appendChild(inputEle);
      }
    });
  } else {
    let recoderObj = {};
    $.each($(rowEle).find("input"), function () {
      if ('checkbox' != this.type) {
        recoderObj[this.name] = this.value;
      }
    });
    webSqlObj.updateDate(setUp.table, id, recoderObj);
    reflashTable(searchedQuary);
  }
}

/** 删除数据
 * 
 */
function deleteRow(id){
  if(confirm("确定要删除吗?")){
    webSqlObj.deleteData(setUp.table, id);
    reflashTable(searchedQuary);
  }
}

/** 表示详细信息
 * 
 */
function getDetailRow(id,btnEle) {
  let loc = popupWinLocation(1150,screen.height)
  let urlParams = "toolbar=no, menubar=no, scrollbars=no, resizable=no,height="+loc.height+",width="+loc.width+",top="+loc.top+",left="+loc.left;
  window.open("addRecoder.html?table=" + setUp.table + "&id=" + id, "", urlParams, false);
}

/** 检索条件初始化
 * 
 */
function tblReSearch(){
  // 重置条件
  $("#currentPageNo").val(1);
  document.getElementById('orderByFlag').checked = true;
  document.getElementById('fifterFlag').checked = true;
  setUp.condition = '';
  // 检索
  searchQuary()
  // 预先设置导出信息
  resultArrs = getDML(setUp.table);
}

/** 检索DB
 * 
 */
function searchQuary() {
  //
  if (isEmpty($("#selectedTable").val())) {
    console.warn("选择表");
    return;
  }
  // 查找对象
  let selectedVal = $("#selectedTable").val();
  // selectedVal=表面,显示宽度
  setUp.table = selectedVal.split(',')[0];
  setUp.tableWidth = selectedVal.split(',')[1] + "px";
  // 每页表示
  setUp.pageSize = $("#pageSize").val();
  // 当前页
  setUp.pageNo = $("#currentPageNo").val();
  // 是否支持排序
  setUp.orderByTitle = document.getElementById('orderByFlag').checked ? 'true' : '';
  // 是否支持筛选
  setUp.fifter = document.getElementById('fifterFlag').checked ? 'true' : '';
  // 排序
  setUp.orderBy = isNotEmpty(tableInfo[setUp.table]['orderby']) ? tableInfo[setUp.table]['orderby'] : '';
  
  // 检索SQL文
  searchedQuary = webSqlObj.getSelectQuary(setUp);
  webSqlObj.executeQuary(searchedQuary, [], function (result) {
    selectedData = result.rows;
    if (selectedData.length > 0) {
      makeTableElement(result, "mianTbl");
    }
  });

  // 跳转页面
  $('#targetUrl').attr('href',tableInfo[setUp.table].indexPage);
  $('#targetUrl').html(tableInfo[setUp.table].indexName);
}

/** 换页
 * 
 */
function changePage(procKbn) {
  let currentPage = parseInt($("#currentPageNo").val());
  let maxPage = parseInt($('#totalPage').html());
  if ('pre' == procKbn && currentPage > 1) {
    $("#currentPageNo").val(currentPage - 1);
  } else if ('next' == procKbn && currentPage < maxPage) {
    $("#currentPageNo").val(currentPage + 1);
  } else {
    return;
  }
  searchQuary();
}

/** 自定义检索
 * 
 */
function excuteCustQuery() {
  let sql = $('#custQuery').val();
  let keyword = sql.split(' ')[0];
  if ('select' == keyword) {
    webSqlObj.executeQuary(sql, [], function (result) {
      selectedData = result.rows;
      if (selectedData.length > 0) {
        makeTableElement(result, "mianTbl");
      }
    });
  } else {
    webSqlObj.executeQuary(sql, [], function (result) {
      alert("成功!" + result.rowsAffected + "行被更新");
    });
  }
}

/** 点击列重新排序
 * 
 */
function reSearch(columnName,thEle) {
  // 升降序切换
  orderby = 'asc' == orderby ? 'desc' : 'asc';
  // sql排序文字列
  orderbyQuary = columnName + ' ' + orderby;
  setUp.orderBy = orderbyQuary;
  searchedQuary = webSqlObj.getSelectQuary(setUp);
  reflashTable(searchedQuary);

  // 排序ICON
  let iconSpan = $(thEle).find("span")[0];
  iconSpan.innerHTML = 'asc' == orderby ? ' ↑ ' : ' ↓ ';
}

/** 筛选数据
 * 
 */
function fifterRows(column, inputEle) {
  conditionQuery = column + " like '%" + inputEle.value + "%'";
  setUp.condition = conditionQuery;
  searchedQuary = webSqlObj.getSelectQuary(setUp);
  reflashTable(searchedQuary);
}

/** 刷新结果区域
 * 
 */
function reflashTable(sql) {
  webSqlObj.executeQuary(sql, setUp.paramters, function (result) {
    document.getElementById('detailRows').outerHTML = '';
    document.getElementById('mianTbl').appendChild(createTbody(result));
  });
}

/** 显示检索数据一览
 * 
 */
function makeTableElement(dataList, tblEleId) {
  $("#consoleArea").html("");
  $("#consoleArea").hide()
  // 结果列
  let columns = Object.keys(dataList.rows[0]);
  // 设定参数更新
  setUp.head = columns;
  // Table
  var tableEle = document.getElementById(tblEleId);
  mianTbl.innerHTML = "";
  tableEle.style.width = setUp.tableWidth;
  // Thead
  var thead = createElement("thead", "", "", "");
  // 行
  var tr = createElement("tr", "", "", "");
  // fifter
  var fifterRow = createElement("tr", "", "fifterRow", "");
  // selectAll
  /**/
  if (isNotEmpty(setUp.selectAll)) {
    var th = createElement("th", "", "", "");
    th.style.width = '20px'
    // fifter row
    fifterRow.appendChild(createElement("th", "", "", ""));
    //fifterRow.appendChild(createElement("th", "", "", ""));

    var selectAll = createElement("input", "", "", "selectAll");
    selectAll.type = "checkbox";
    // 全选事件
    selectAll.setAttribute('onclick', 'selectAlll(this)');
    th.appendChild(selectAll);
    tr.appendChild(th);
  }

  // 字段情报
  let tblInfo = transListToMap(tableInfo[setUp.table].columns,"column",true)
  // 结果设定
  $.each(setUp.head, function (i,colunmName) {
    // 排序列样式
    let classNm = isNotEmpty(setUp.orderByTitle) ? "orderbyCol " : "";
    // 是否可见
    let disableFlag = true;
    let colDdlInfo = tblInfo[colunmName];
    let titleNm = this
    if ("ID" == this.toUpperCase()) {
      classNm += "idCol";
    } else {
      titleNm = colDdlInfo["name"]
      disableFlag = undefined == colDdlInfo.listVisable || isNotEmpty(colDdlInfo.listVisable)
      if(!disableFlag){
        return true;
      }
    }
    let th = createElement("th", "", classNm, "");
    th.innerHTML = titleNm;
    // orderBy
    if (isNotEmpty(setUp.orderByTitle)) {
      th.setAttribute('onClick', 'reSearch("' + this + '",this)');
      // 升序降序图标
      let orderIcon = createElement("span", "", "orderIcon", "");
      orderIcon.innerHTML = " ↑ ";
      th.appendChild(orderIcon)
    }
    tr.appendChild(th);

    // fifter
    let fifterTh = createElement("th", "", "", "");
    // 设置id属性,后面追加 更新入力框设定name用
    let inputCol = createElement("input", "", "", "fifter_" + this);
    // 筛选事件
    inputCol.setAttribute('onChange', 'fifterRows("' + this + '",this)')
    fifterTh.appendChild(inputCol);

    fifterRow.appendChild(fifterTh);
  });
  
  // 事件列
  let eventTh = createElement("th", "", "eventCol", "");
  eventTh.innerHTML = 'Action';
  tr.appendChild(eventTh);
  thead.appendChild(tr);
  let fifterActionTh = createElement("th", "", "eventCol", "");
  fifterRow.appendChild(fifterActionTh);

  // 筛选功能设定有
  if (isNotEmpty(setUp.fifter)) {
    thead.appendChild(fifterRow);
  }
  tableEle.appendChild(thead);

  // tbody
  tableEle.appendChild(createTbody(dataList));
}

/** 显示检索结果
 * 
 */
function createTbody(dataList) {
  // 字段情报
  let tblInfo = transListToMap(tableInfo[setUp.table].columns,"column",true)
  // Tbody
  var tbody = createElement("tbody", "detailRows", "", "");
  $.each(dataList.rows, function (i) {
    tr = createElement("tr", "", (i+2)%2 == 1 ? 'alt1' : 'alt2', "");

    // selectAll
	/**/
    if (isNotEmpty(setUp.selectAll)) {
      let selectTd = createElement("td", "", "col-position", "");
      let checkedEle = createElement("input", "", "", "");
      checkedEle.type = "checkbox";
      checkedEle.setAttribute('onchange', 'selectRow(this)');
      selectTd.appendChild(checkedEle);
      tr.appendChild(selectTd);
    }
	
	
    // data
    let j = 0;
    $.each(this, function (key, cell) {
      if("ID" != key.toUpperCase()) {
        let colDdlInfo = tblInfo[key]
        disableFlag = undefined == colDdlInfo.listVisable || isNotEmpty(colDdlInfo.listVisable)
        if (!disableFlag) {
          return true;
        }
      }
      let id = "row" + i + "-" + key;
      let td = createElement("td", id, '', "");
      td.innerHTML = cell;
      tr.appendChild(td);
      j++;
    });
	
	// 事件列
    let eventTd = createElement("td", "", "eventCol", "");
    // 数据的主键ID
    let id = this.id;
    // 更新按钮
    let updateBtn = createElement("button", "", "rowBtn", "");
    updateBtn.style = "button";
    updateBtn.innerHTML = "更新";
    updateBtn.setAttribute('onclick', "updateRow('" + this.id + "',this)");
    eventTd.appendChild(updateBtn);

    // 删除按钮
    let delBtn = createElement("button", "", "rowBtn", "");
    delBtn.style = "button";
    delBtn.innerHTML = "删除";
    delBtn.setAttribute('onclick', "deleteRow('" + this.id + "')");
    eventTd.appendChild(delBtn);
    
    // 详细按钮
    let detailBtn = createElement("button", "", "rowBtn", "");
    detailBtn.style = "button";
    detailBtn.innerHTML = "追踪";
    detailBtn.setAttribute('onclick', "getDetailRow('" + this.id + "',this)");
    eventTd.appendChild(detailBtn);

    tr.appendChild(eventTd);
    // event
    tbody.appendChild(tr);
  });
  return tbody;
}

/** 全选/全不选
 * 
 */
function selectAlll(checkAllEle) {
  $.each($("#detailRows").find("input[type='checkbox']"), function () {
    this.checked = checkAllEle.checked;
    selectRow(this);
  });
}

/** 选中当前行
 * 
 */
function selectRow(checkEle) {
  let classNm = checkEle.checked ? 'selected-row' : '';
  $(checkEle).parents()[1].className = classNm;
}

/** 新加一行
 * 
 */
function addLine() {
  // 取得一条基础行
  let tbody = document.getElementById('detailRows');
  let rowEle = $(tbody).children()[0];

  // 新加一行
  let newRow = createElement("tr", "", "", "");

  // 列数(最后一列添加按钮)
  let maxLength = $(rowEle).children().length;

  $.each($(rowEle).children(), function (i, tdEle) {
    // 列
    let newTd = createElement("td", "", "", "");
    // 选择框和ID列不处理,最后一列添加按钮
    if (i > 1 && i < maxLength-1) {
      // 将基础列的表中列名取出设置name属性
      let name = tdEle.id.split("-")[1];
      let inputEle = createElement("input", "", "", name);
      // 自适应宽度
      inputEle.style.width = tdEle.clientWidth - 10 + "px";
      // 默认值
      inputEle.value = tdEle.innerHTML;
      // 清空内容放入输入框
      newTd.innerHTML = "";
      newTd.appendChild(inputEle);

    } else if (i == maxLength-1) {
      // 往DB追加按钮
      let addBtn = createElement("button", "", "rowBtn", "");
      addBtn.style = "button";
      addBtn.innerHTML = "追加";
      addBtn.setAttribute('onclick', "insertRow(this)");
      newTd.appendChild(addBtn);
    }
    newRow.appendChild(newTd);
  });
  tbody.appendChild(newRow);
}

/** 下拉框从codeMaster中取值设定选项
 * 
 */
function getOptionsFromCodeMaster(selectEle, categoryId) {
  let sql = "select * from CODE_MASTER WHERE categoryId = ? ";
  webSqlObj.executeQuary(sql, [categoryId], function (result) {
    selectEle.appendChild(createElement('option', '', '', ''));
    $.each(result.rows, function () {
      let optionEle = createElement('option', '', '', '');
      optionEle.value = this.code;
      optionEle.innerHTML = this.value;
      selectEle.appendChild(optionEle);
    })
  });
}

/**  控制台打印检索结果的json
 * 
 */
function printJsonData() {
  $("#consoleArea").html("");
  let resultStr = '';
  let rows = 0;
  let returnType = $("input[name='json']:checked").val()
  $.each(selectedData, (i,obj) => {
    let resultRec = {}
    if ('1'!==returnType) {
      delete obj.id
      resultRec = obj
    } else {
      resultRec = {'id':obj.id}
      $.each(tableInfo[setUp.table]['columns'],(idex,col)=>{
        if(isNotEmpty(col['disabled'])){
          resultRec[col['propertyName']] = obj[col['column']]
        }
      })
    }
    if (rows == selectedData.length - 1) {
      resultStr += '    ' + JSON.stringify(resultRec) + '\r\n';
    } else {
      resultStr += '    ' + JSON.stringify(resultRec) + ',\r\n';
    }
    rows++;
  });
  if (isNotEmpty(resultStr)) {
    resultStr = '[\r\n' + resultStr + '  ]';
    $("#consoleArea").html(resultStr);
  }
  $("#consoleArea").show();
  $("#consoleArea").css('height', rows * 18 + 'px');
}

/**  控制台打印检索结果的DML
 * 
 */
function printDML() {
  $("#consoleArea").html("");
  // insert part
  let cols = []
  let quary = "insert into " + setUp.table + "(";
  let colPart = ""
  $.each(selectedData[0],(K,V) => {
    colPart += "," + K
    cols.push(K)
  })
  colPart = colPart.substring(1)
  quary += colPart + ") values\r\n"
  let valPart = ""
  $.each(selectedData, (i,obj) => {
    let valS = ""
    $.each(cols,(k,v)=>{
      let value = obj[v]+""
      value = value.replace("'","''")
      value = 'null' == value ? '-' : value
      valS += ",'" + value + "'"
    })
    valPart += ",(" + valS.substring(1) + ")\r\n"
  });
  quary += valPart.substring(1)
  $("#consoleArea").html(quary);
  $("#consoleArea").show();
  $("#consoleArea").css('height', '500px');
  return;
}

/**  控制台打印检索结果CSV
 * 
 */
function printCSV() {
  $("#consoleArea").html("");
  // column line
  let cols = []
  let titlePart = "";
  $.each(selectedData[0],(K,V) => {
    if('id'==K) {
      return true
    }
    titlePart += "\t" + K
    cols.push(K)
  })
  titlePart = titlePart.substring(1)
  let csvInfo = titlePart + "\r\n"
  let valPart = ""

  $.each(selectedData, (i,obj) => {
    let valS = ""
    $.each(cols,(k,v)=>{
      valS += "\t" + obj[v]
    })
    valPart += valS.substring(1) + "\r\n"
  });
  csvInfo += valPart
  $("#consoleArea").html(csvInfo);
  $("#consoleArea").show();
  $("#consoleArea").css('height', '500px');
  return;
}

function printDDL(str){
  $("#consoleArea").html($("#consoleArea").html()+str);
}