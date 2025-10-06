const id = isEmpty(getUrlParam()['id']) ? '71' : getUrlParam()['id'];
const webSqlObj = new webSqlManagement();
var setUp = webSqlObj.setUp;
setUp.table = "fgo_servant";
const imgPath = "D:/picture/illustration/fgo/";
// 立绘盒
var illustrationBox = ['Stage1.png', 'Stage2.png', 'Stage3.png', 'Stage4.png'];
// 立绘序列
var imgIndex = 0;
// DB对象
var objectData = {};

// 自动切换
let autoFlag = false;
let autoPlay = setInterval(function () {
  if (!autoFlag) {
    clearInterval(autoPlay);
  } else {
    imgIndex = imgIndex == illustrationBox.length - 1 ? 0 : imgIndex+1;
    setIllustration(imgIndex,$('ul li')[imgIndex]);
  }
}, 2000);
// 面板开关
var dashboardFlag = true;

$(function () {
  // 取得数据
  console.log(id);
  initPageById(id);
  // 左右切换图片动作注册
  $(document).on('keydown', function (event) {
    imgIndex = getNextIndex(event,imgIndex);
    setIllustration(imgIndex, $('ul li')[imgIndex]);
  });
});

/** 
 * 取得DB数据
 */
function initPageById(id, name) {
  imgIndex = 0;
  webSqlObj.executeQuary('select * from ' + setUp.table + ' where id = ?', [id], (data) => {
    objectData = data.rows[0];
    setIllustration(imgIndex, $('ul li')[imgIndex]);
  });
  initPage(name);
}

/** 
 * 设置信息
 */
function setImage(index) {
  let imgSrc = "url('" + imgPath + objectData.imgName + '/' + illustrationBox[index]+ "')";
  $("#activity").css('background-image', imgSrc);
}

/** 
 * 设置不同立绘 
 */
function setIllustration(index, liEle) {
  $('ul li').attr('class', '');
  setImage(index);
  $(liEle).attr('class', 'li-active');
}

/** 检索功能
 */
function fifterResult(inputEle) {
  $('#resultArea').show();
  let val = inputEle.value;
  let likeVal = "'%" + val + "%'";
  let sql = "select * from " + setUp.table + " where ";
  sql += "id = ? or name like " + likeVal + " or lower(imgName) like " + likeVal + " limit 0,10 ";
  webSqlObj.executeQuary(sql, [val], (result) => {
    showSearchList(result);
  });
}
