/**
 * 图像对象
 */
class baseImage extends DocumentFragment {
  constructor(src) {
    // html元素
    super();
    // 图片元素
    this.img = createImg(src);
    // 图片的点击事件
    this.img.addEventListener('click', (e) => {
      this.clickEvent(e);
    });
    this.img.addEventListener('mouseover', (e) => {
      this.hoverEvent(e);
    });
    this.img.addEventListener('mouseout', (e) => {
      this.loseFocus(e);
    });
  }
  clickEvent() { }
  hoverEvent() { }
  loseFocus() { }
}

/**
 * 头像立绘图片
 */
class faceElement extends baseImage {
  constructor(data, basePath, imgNm) {
    let src = basePath + data.imgName + "/" + imgNm;
    super(src);
    this.data = data;
  }
  handle() {
    return this;
  }

  clickEvent(e) {
    /* 22/08/20
     * 追加页面来源 data.pageType
     */
    let param = 'id=' + this.data.id;
    
    let width = isNotEmpty(this.data.detailWidth) ? this.data.detailWidth : 600;
    let height = isNotEmpty(this.data.detailHeight) ? this.data.detailHeight : 900;
    let targetUrl = isNotEmpty(this.data.targetUrl) ? this.data.targetUrl : "detail.html";
    
    let loc = popupWinLocation(width,height)

    let urlParams = "toolbar=no, menubar=no, scrollbars=no, resizable=no,height=" + height + " , width= " + width + " , top=" + loc.top + " , left=" + loc.left + " ";
    window.open(targetUrl + '?' + param, "", urlParams, false);
  }

  /* 表示简易数据悬浮窗 */
  hoverEvent(e) {
    let _left = e.clientX;
    let _top = e.clientY;
    //console.dir(_left + "," + _top);
    let hover = document.getElementById('hoverWindow');
    $(hover).find("#selectedInfo").html(this.data.imgName);
    _left = _left > 1000 ? _left - 250 : _left + 25;
    _top = _top > 600 ? _top - 50 : _top + 20;
    $(hover).css('left', _left + "px");
    $(hover).css('top', _top + "px");
    $(hover).css('display', 'grid');/**/
  }

  /* 隐藏简易数据悬浮窗 */
  loseFocus(e) {
    $('#hoverWindow').hide();
  }
}

