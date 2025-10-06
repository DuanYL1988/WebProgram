/**
 * 生成导航link
 */
function initNav() {
    let navEle = document.getElementById("navigation");
    $.each($("h2"), (index, titleEle) => {
        let liEle = document.createElement("li");
        let link = document.createElement("a");
        $(link).attr("href", "#" + titleEle.id);
        $(link).html(titleEle.innerHTML);
        liEle.appendChild(link);
        navEle.appendChild(liEle);
    });
}

/**
 * 生成html显示效果的原始代码
 * @param {Div的class属性名} className 
 */
function htmlCode(className) {
    // 取得代码div
    $.each($('.' + className), (index, objEle) => {
        let sourceTbl = document.createElement("table");
        $(sourceTbl).attr("cellspacing", "0");
        $(sourceTbl).attr("border", "0");
        $(sourceTbl).attr("class", "code_sample");

        // 代码处理
        let displayTxt = objEle.innerHTML.trim();
        // 尖括号转移
        displayTxt = displayTxt.replaceAll('<', '&lt;');
        displayTxt = displayTxt.replaceAll('>', '&gt;');
        // 括号转移
        displayTxt = displayTxt.replaceAll('(', '&#40;');
        displayTxt = displayTxt.replaceAll(')', '&#41;');

        // 换行
        let temp = displayTxt.split(/[(\r\n)\r\n]+/);
        let tblStr = "";

        $.each(temp, (i, txt) => {
            tblStr += "<tr "
            if ((i + 2) % 2 == 0) {
                tblStr += "class='alt1' >";
            } else {
                tblStr += "class='alt2' >";
            }
            tblStr += "<td class='rowNo'>" + (i + 1) + ".</td><td><code>" + txt + "</tr>";
        });
        sourceTbl.innerHTML = tblStr;
        objEle.appendChild(sourceTbl);
    });
}

/**
 * 生成CSS显示效果的原始代码
 * @param {Div的class属性名} className 
 */
function cssCode(className) {

    // 取得代码div
    $.each($("."+className),function(index,element){
        // style code
        let styleStr = $(element).children()[0].style;
        console.log(styleStr);
        //
        $.each(styleStr,(K,V) => {
            console.log(K + ":" +V);
        });

    });
}

