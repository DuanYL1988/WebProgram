/**
 * 左右按鍵切換图片
 * 
 * @param {键盘按下时间} event 
 * @param {图片下标} imgIndex 
 * @returns 
 */
function getNextIndex(event,imgIndex) {
    if (event.keyCode == 37 || event.keyCode == 65) {
        imgIndex = imgIndex == 0 ? illustrationBox.length - 1 : imgIndex - 1;
      } else if (event.keyCode == 39 || event.keyCode == 68) {
        imgIndex = imgIndex == illustrationBox.length - 1 ? 0 : imgIndex + 1;
      } 
      return imgIndex;
}

/**
 * 重置页面
 */
function initPage(name){
    $('#resultArea').html("");
    $('#resultArea').hide();
    if (isNotEmpty(name)) {
      $("#searchTxt").val(name);
    }
}

/**
 * 备选项目
 * 
 * @param {备选检索结果} result 
 */
function showSearchList(result) {
    document.getElementById('resultArea').innerHTML = "";
    $.each(result.rows, (index, servant) => {
      let divEle = createElement('div', '', 'resultEow', '');
      divEle.innerHTML = servant.name + " - " + servant.classType;
      divEle.setAttribute('onclick', "initPageById(" + servant.id + ",'" + servant.name + "')");
      document.getElementById('resultArea').appendChild(divEle);
    });
}

function showSetup(){
	let displayStatus = $("#setupDiv").css("display");
	"none" == displayStatus ? $("#setupDiv").show() : $("#setupDiv").hide();
}
  
function setPageStyle() {
  getInputJsonInDiv('displayArea');
}
