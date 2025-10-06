/** 
 * WEBSQL管理
 */
class webSqlManagement {
  // 构造函数
  constructor() {
    this.db = openDatabase('db_html','1.0','Display Information',5*1024*1024);
    this.setUp = {
      "head" : "",
      "tableWidth" : "",
      "table" : "",
      "condition" : "",
      "paramters" : [],
      "orderBy" : "",
      "pageNo" : "1",
      "pageSize" : "15",
      "orderByTitle" : "",
      "fifter" : "",
      "selectAll" : "true",
    };
  }

  /* 刷入数据 */
  insertData(tableName,recoderObj){
    let colSql = "insert into "+ tableName +"("
    let valSql = " values (";
    let paramters = [];
    $.each(recoderObj,(column,value)=>{
      colSql += column;
      paramters.push(value);
      colSql += ",";
      valSql += "?,";
    });
    // 去除最后一个[,]
    let insertQuery = colSql.substring(0,colSql.length-1) + ")" + valSql.substring(0,valSql.length-1) + ")";
    this.executeQuary(insertQuery,paramters,function(result){debug('更新成功')});
  }

  /* 更新数据 */
  updateDate(tableName,id,recoderObj) {
    // id必须有
    if(isEmpty(id)) {
      alert("更新数据没有ID!")
      return
    }
    let updateQuery = 'UPDATE ' + tableName + " SET ";
    let paramters = [];
    $.each(recoderObj,function(col,value){
      if(!isEmpty(value)){
        updateQuery += col + " = ? ,"
        paramters.push(value);
      }
    });
    updateQuery += ' id = ? WHERE id = ' + id;
    paramters.push(id);
    console.log(updateQuery+paramters);
    this.executeQuary(updateQuery,paramters,function(result){
      if (1 == result.rowsAffected) {
        if(confirm("更新成功,关闭当前窗口吗?")) {
          window.close()
        }
      }
    });
  }
  
  deleteData(tableName,id) {
    // id必须有
    if(isEmpty(id)) {
      alert("更新数据没有ID!")
      return
    }
    let deleteQuary = 'DELETE FROM ' + tableName + " WHERE id = ? ";
    this.executeQuary(deleteQuary,[id],function(result){
      alert("删除成功!")
    });
  }

  /* 执行SQL */
  executeQuary(query,paramters,callback){
    console.log(query);
    this.db.transaction(tx => {
      tx.executeSql(query,paramters,
        (tx,result) => {
          console.log('SQL-success:' + result);
          console.dir(result);
          if (typeof callback == 'function') {
            callback(result);
          }
        },
        (tx,error) => {
          console.log('SQL-filed:' + error.message);
        }
      )
    });
  }

  /* 生成Select文 */
  getSelectQuary(setUp) {
    let sql =setUp.table + " WHERE 1 = 1 ";
    let paramters = [];
    // 检索条件
    if(!isEmpty(setUp.condition)){
      if (typeof setUp.condition == "object") {
        // 传入键值对
        $.each(setUp.condition,function(col,val){
          sql += " and " + col + " = ?";
          paramters.push(val);
        });
      } else {
        // 传入检索文字列
        sql += " and " + setUp.condition;
      }
    }
    // 排序
    if(!isEmpty(setUp.orderBy)){
      sql += " ORDER BY " + setUp.orderBy;
    }
    // 分页
    if(!isEmpty(setUp.pageNo)){
      let start = setUp.pageSize * (setUp.pageNo-1);
      sql += " limit " + start + "," + setUp.pageSize;
    }
    let countSql = "SELECT COUNT(*) AS rstCnt FROM " + sql;
    let mainSql = "SELECT * FROM " + sql;
    setUp.paramters = paramters;
    // 件数
    this.executeQuary(countSql,paramters,function(result){
      let totalCnt = result.rows[0].rstCnt;
      let maxPage = parseInt(totalCnt/setUp.pageSize);
      maxPage = totalCnt%setUp.pageSize > 0 ? maxPage + 1 : maxPage;
      $("#totalPage").html(maxPage);
      $("#currentPageNo").val(setUp.pageNo);
    });
    return mainSql;
  }
  
  createTable(tableName,columns,dataList) {
	  // 对象表创建
	  let dropSql = "DROP TABLE IF EXISTS " + tableName + ";"
	  let createSql = "CREATE TABLE IF NOT EXISTS " + tableName + "(id integer primary key autoincrement,"
	  let columnPart = ""
	  // 字段信息添加到管理表中
	  let insertColPart = "INSERT INTO TABLE_COLUMNS(tableName,"
	  let insertValPart = ""
	  $.each(columns,(index,columnInfo)=>{
		  // 创建表 id integer primary key autoincrement
		  if(index > 0) {
			  createSql += ","
		  }
		  createSql += "`" + columnInfo.column + "` " + columnInfo.type + "(" + columnInfo.length + ") "
		  if("●"==columnInfo.pk) {
			  createSql += " primary key "
		  }
		  // 管理表
		  let indexJ = 0
		  $.each(columnInfo,(K,V)=>{
			  if(index == 0) {
				insertColPart += "`" + K + "`,"
			  }
			  if(indexJ == 0) {
				  insertValPart += "('" +  tableName + "',"
			  }
			  insertValPart += "'" + V + "',"  
			  indexJ ++
		  })
		  insertValPart = insertValPart.substring(0,insertValPart.length-1)
		  insertValPart += "),"
	  })
	  createSql += ")"
	  insertColPart = insertColPart.substring(0,insertColPart.length-1)
	  insertValPart = insertValPart.substring(0,insertValPart.length-1)
	  let insertSql = insertColPart + ") VALUES " + insertValPart
	  
	  // 重新建表
	  this.executeQuary(dropSql)
	  this.executeQuary(createSql)
	  // 删除管理表中之前的设定信息
	  let deleteSql = "DELETE FROM TABLE_COLUMNS WHERE TABLENAME = '" + tableName + "';"
	  this.executeQuary(deleteSql)
	  this.executeQuary(insertSql)

	  //
	  if(!isNullObject(dataList) && dataList.length > 0 && "TABLE_COLUMNS" != tableName) {
		  let columnPart = "INSERT INTO " + tableName + "("
		  let valuesPart = ""
		  // loop list
		  $.each(dataList,(index,data)=>{
			  // loop data attributes
			  let indexJ = 0
			  $.each(data,(K,V)=>{
			  	// カラム
			  	if(0 == index) {
			  		columnPart += "`" + K + "`,"
			  	}
			  	//
			  	if(0 == indexJ) {
			  		valuesPart += "("
			  	}
			      valuesPart += "'" + V + "',"
			      indexJ++
			  })
              valuesPart = valuesPart.substring(0,valuesPart.length-1)
              valuesPart += "),"
		  })
          valuesPart = valuesPart.substring(0,valuesPart.length-1)
          columnPart = columnPart.substring(0,columnPart.length-1)
          columnPart += ") VALUES " + valuesPart
          this.executeQuary(columnPart)
	  }
  }
  
}
