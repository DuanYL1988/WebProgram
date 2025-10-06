/**
 * 绘制线图
 * @param {eleId} 绘制画布ElementId 
 * @param {object} 绘制数据 
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
        borderColor: getRandomColor()+")",
        lineTension: 0.1
      }
      configLine.data.datasets.push(dataset);
    })
  
    lineChart = new Chart(ctxLine, configLine);
  }

  /**
 * 生成随机颜色
 */
function getRandomColor(){
    var color = "rgb(" + Math.ceil(Math.random()*255) +","+Math.ceil(Math.random()*255) + "," +Math.ceil(Math.random()*255);
    return color;
  }