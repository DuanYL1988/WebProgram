// 定义绘制对象
let barChart, pieChart;
// DB
const webSqlObj = new webSqlManagement();
// 根据结果统计
const countByResult = "select " +
    "main.RESULT_LEVEL1 as key" +
        " , count(main.RESULT_LEVEL1) as count " +
    " from " +
        " student  " +
        " left join communication main  " +
            " on student.id = main.student_id  " +
        " inner join (  " +
            " select " +
                " student_id " +
                " , max(times) as lastTime  " +
            " from " +
                " communication  " +
            " group by " +
                " student_id " +
        " ) sub  " +
            " on main.student_id = sub.student_id  " +
            " and main.times = sub.lastTime  " +
    " group by " +
        " main.RESULT_LEVEL1";
        
// 原因分析
const reasonQuary = "select " +
    "main.RESULT_LEVEL1 as main " +
        ", case main.RESULT_LEVEL2  " +
            "when '' then '其他原因'  " +
            "else main.RESULT_LEVEL2  " +
            "end as key " +
        ", count(*) as count  " +
    "from " +
        "student  " +
        "left join communication main  " +
            "on student.id = main.student_id  " +
        "inner join (  " +
            "select " +
                "student_id " +
                ", max(times) as lastTime  " +
            "from " +
                "communication  " +
            "group by " +
                "student_id " +
        ") sub  " +
            "on main.student_id = sub.student_id  " +
            "and main.times = sub.lastTime  " +
    "group by " +
        "main.RESULT_LEVEL1 " +
        ", main.RESULT_LEVEL2";

// 根据学校统计
const countBySchool = "select " +
    "student.SCHOOL_NAME as key " +
      ", main.RESULT_LEVEL1 as barName " +
      ", count(main.RESULT_LEVEL1) as count " +
    "from " +
    "student  " +
    "left join communication main  " +
        "on student.id = main.student_id  " +
    "inner join (  " +
        "select " +
            "student_id " +
            ", max(times) as lastTime  " +
        "from " +
            "communication  " +
        "group by " +
            "student_id " +
        ") sub  " +
        "on main.student_id = sub.student_id  " +
        "and main.times = sub.lastTime  " +
        "and student.SCHOOL_NAME <> '' " +
    "group by " +
      "student.SCHOOL_NAME " +
      ", main.RESULT_LEVEL1  " +
    "order by " +
      "1 ";

// 结果集合
const schoolTmp = {"决定入学" : 0,"有兴趣" : 0,"犹豫不决" : 0,"联系不上" : 0}

$(function() {
  // 按结果统计
  webSqlObj.executeQuary(countByResult,[],(result)=>{
    let drawObj = transToPieData(tranWebsqlRstMapToList(result.rows))
    drawPieChart('countByResult',drawObj,"按结果统计")
  });
  // 原因分析
  webSqlObj.executeQuary(reasonQuary,[],(result)=>{
    let drawObj = transReasonToPieData(tranWebsqlRstMapToList(result.rows))
    let index = 1
    $.each(drawObj,(reason,data) => {
      drawPieChart('countByResult'+index,data,reason)
      index ++
    })
  });
  // 按学校分类
  webSqlObj.executeQuary(countBySchool,[],(result)=>{
    searchData = tranWebsqlRstMapToList(result.rows)
    let drawObj = transToBarsData(searchData)
    drawBarsChart('countBySchool',drawObj,schoolTmp,"按学校分类")
  });
});

/**
 * 饼状图数据编辑
 */
function transToPieData(originData){
  // 顺带统计数据
  let totalCount = 0
  let kindStr = ""
  
  let result = {}
  $.each(originData,(index,data)=>{
    result[data.key] = data.count
    totalCount += parseInt(data.count)
    kindStr += " " + data.key + ": <span class='count'>" + data.count + "</span> 份"
  })
  
  // 总数
  $("#totalCount").html(totalCount)
  $("#resultStr").html(kindStr)
  // 
  return result
}

/**
 * 饼状图数据编辑2
 */
function transReasonToPieData(originData) {
  
  let result = {}
  // 循环结果
  $.each(originData,(index,row) => {
    // 根据原因分组
    let data = isEmpty(result[row.main]) ? {} : result[row.main]
    data[row.key] = row.count
    result[row.main] = data
  })
  return result
}

/**
 * 编辑柱状图数据
 */
function transToBarsData(originData){
  let result = {}
  originData = tranWebsqlRstMapToList(originData)
  $.each(originData,(index,data)=>{
    // 学校名为key
    let keyName = data.key
    // 初始化或取得
    let dataObj = isEmpty(result[keyName]) ? JSON.parse(JSON.stringify(schoolTmp)) : result[keyName]
    dataObj[data.barName] = data.count
    result[keyName] = dataObj
  })
  
    // 顺带统计数据
  let schoolInfoStr = ''
  $.each(result,(key,obj)=>{
    schoolInfoStr += "<span class='schoolName'>&nbsp;&nbsp;&nbsp;&nbsp;" + key + "</span> : 共有"
    let schoolTotal = 0
    let kindStr = ''
    $.each(obj,(k,v) => {
      if (v > 0) {
        kindStr += " " + k + ": <span class='count'>" + v + "</span> 份"
        schoolTotal += parseInt(v)
      }
    })
    schoolInfoStr += " <span class='totalCnt'>" + schoolTotal + "</span> 份,其中" + kindStr +"<br>"
  })
  $("#schoolInfoStr").html(schoolInfoStr)
  
  return result
}

/**
 * 饼状图
 */
function drawPieChart(eleId,darwObj,title) {
  ctxPie = document.getElementById(eleId).getContext("2d");
  ctxPie.clearRect(0, 0, 750, 300);
  // 饼状图数据构造
  var configs = {
    "type" : "pie",
    "data": {
      "labels": [],
      "datasets": [
        {
          "data": [],
          "backgroundColor": [],
        },/* 中间部分
        {
          "data": [getSum(darwObj.count)],
          "backgroundColor": ["white"],
          "labels": []
        }*/
      ]
    },
    "options": {
      "responsive": false,
      "maintainAspectRatio": true,
      "title" : {display : true, text:title},
    }
  };
  
  // 每次循环生成一个饼状部分
  $.each(darwObj,(key,val) => {
    // 放入标题
    configs.data.labels.push(key);
    // 放入数据
    configs.data.datasets[0].data.push(val);
    // 生成随机颜色
    configs.data.datasets[0].backgroundColor.push(getRandomColor());
  })
  
  pieChart = new Chart(ctxPie, configs);
}

/**
 * 绘制多根柱状图
 * @param {画图区域元素ID} eleId 
 * @param {数据} dataObj 
 */
function drawBarsChart(eleId,dataObj,dataTemp,title) {
  // 取得区域对象
  ctxBar = document.getElementById(eleId).getContext("2d");
  // 配置
  configBar = {
    type: "bar",
    data: {
      labels: [],
      datasets: []
    },
    options: {
      responsive: false,
      maintainAspectRatio : true,
      "title" : {display : true, text:title}
    }
  };

  // 收入柱(几个柱子就需要定义几个柱子对象)
  let baseBar = {
    label: '',
    data: [],
    backgroundColor: [],
    borderColor: [],
    borderWidth: 1
  };
  
  let barList = {}
  
    // 颜色
    let color = getRandomColorArr(5)
  // 循环数据集合
  $.each(dataObj,(key,obj)=>{
    // 分组(X轴)
    configBar.data.labels.push(key);
    let cololIndex = 0
    // 数据
    $.each(dataTemp,(title,val) => {
      let inputBar = isEmpty(barList[title]) ? JSON.parse(JSON.stringify(baseBar)) : barList[title]
      inputBar.label = title
      inputBar.backgroundColor.push(color[cololIndex]);
      let num = isEmpty(obj[title]) ? 0 : obj[title]
      inputBar.data.push(num);
      barList[title] = inputBar
      cololIndex++
    })
  });
  
  $.each(barList,(i,bar) => {
    configBar.data.datasets.push(bar);
  })
  
  // 生成柱状图
  barChart = new Chart(ctxBar, configBar);
}

/**
 * 绘制线图
 * @param {画图区域元素ID} eleId 
 * @param {数据} dataObj 
 */
function drawLineChart(eleId,obj) {
  ctxLine = document.getElementById(eleId).getContext("2d");
  
  configLine = {
    type: "line",
    data: {
      labels: obj.title,
      datasets: []
    },
    options: {
      responsive: false,
      maintainAspectRatio : true
    }
  };
  $.each(obj.data,function(){
    var dataset = {
      label: this.name,
      data: this.data,
      fill: false,
      borderColor: getRandomColor(),
      lineTension: 0.1
    }
    configLine.data.datasets.push(dataset);
  })

  console.debug("线图")
  console.debug(configBar)
  lineChart = new Chart(ctxLine, configLine);
}

function getRandomColorArr(len) {
  let colors = []
  for(let i = 0; i < len ; i++) {
    colors.push(getRandomColor())
  }
  return colors
}

/**
 * 生成随机颜色
 */
function getRandomColor(alpha){
  var color = "rgb(" + Math.ceil(Math.random()*255) +","+Math.ceil(Math.random()*255) + "," +Math.ceil(Math.random()*255);
  alpha = isEmpty(alpha) ? 1 : alpha
  return color +"," + alpha + ")";
}
