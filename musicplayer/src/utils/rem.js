function setHTMLFont(designWidth) {

	var isHasStyle = document.getElementById('style');
	if (isHasStyle) {
		isHasStyle.remove();
	}

	console.log('rem');
	//手机端最大安全尺寸 640px
	var maxWidth = 640;
	var minWidth = 320;

	//获取html页面宽度
	var htmlWidth = document.documentElement.getBoundingClientRect().width;

	console.log('htmlWidth ==> ', htmlWidth);

	var fontSize;

	if (htmlWidth > maxWidth) {
		//ipad, pc
		fontSize = 100;
	} else {
		//手机端
		designWidth = designWidth == undefined ? maxWidth : designWidth <= minWidth ? minWidth : designWidth >= maxWidth ? maxWidth : designWidth;

		fontSize = htmlWidth / maxWidth * 100;


	}

	
	//创建sytyle
	var style = document.createElement('style');

	style.setAttribute('id', 'style');

	style.type = 'text/css';

	style.innerHTML = 'html{font-size:' + fontSize + 'px !important}';

	document.getElementsByTagName('head')[0].appendChild(style);

}

window.onresize = function () {
	setHTMLFont();
}

export default setHTMLFont;
