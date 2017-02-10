

//事件代理
$('#wrap').on('click','.photo',function(){turn(this)});
//1.翻面控制
function turn(elem){
	var cls = $(elem).attr('class'); //从当前class中提取字符串
	var n = $(elem).attr('id').split('_')[1];//切割当前元素的id 拿到对应按钮的序号
	$('[class*="photo"]')
	//console.log(n);
	if(!/photo_active/.test(cls)){
		return rsort(n);
	}

	if(/photo_front/.test(cls)){//使用正则判断是否点击的当前照片 测试当前元素是否有class为photo_front
		//翻到反面 替换class
		$(elem).addClass('photo_back').removeClass('photo_front');
		$('#nav_'+n).addClass('i_back').siblings('[class*="i_back"]').removeClass('i_back');
	}else if(/photo_back/.test(cls)){
		//翻到正面 替换class
		$(elem).addClass('photo_front').removeClass('photo_back');
		$('#nav_'+n).removeClass('i_back').siblings('[class*="i_back"]').removeClass('i_back');
	}

}

//3.通用函数
//随机生成一个值，支持取值范围 random(min,max);
function random(range){
	var min = range[0];
	var max = range[1];
	var num = parseInt(Math.random()*(max-min+1)+min);
	return num;
}

//4.输出所有海报
var data = data;

function addPhotos(){
	var template = $('#wrap').html(); //获取当前模板
	var html = [];	//新建一个html模板
	var nav = [];	//新建导航按钮
	//遍历出所有海报的信息
		//7.输出按钮，每一个按钮对应一个海报	
	for(var i=0;i<data.length;i++){
		
		var htmlArr = template.replace('{{index}}',i)		//替换模板中的特殊字符串  
							.replace('{{img}}',data[i].img)
							.replace('{{caption}}',data[i].caption)
							.replace('{{desc}}',data[i].desc);
		html.push(htmlArr);
		nav.push(`<span id="nav_${i}" class="i" onclick="turn('#photo_${i}')"></span>`);
	}
	html.push('<div class="nav">'+nav.join('')+'</div>');
	$('#wrap').html(html.join(''));
	rsort(random([0,data.length-1]));
}
addPhotos();

//5.排序海报
function rsort(n){
	var photoArr = $('.photo');  //获取所有.photo 元素
	var photos = [];
	for(var i=0;i<photoArr.length;i++){
		$(photoArr[i]).removeClass('photo_active');
		$(photoArr[i]).removeClass('photo_front');
		$(photoArr[i]).removeClass('photo_back');
		$(photoArr[i]).addClass('photo_front');
		$(photoArr[i]).css('left','');
		$(photoArr[i]).css('top','');
		$(photoArr[i]).css('transform','rotate(0deg) scale(1.4)');
		$('#nav_'+n).siblings('[class*="i_back"]').removeClass('i_back');
		photos.push(photoArr[i]);
	}
	//console.log(n);
	$('#photo_'+n).addClass('photo_active');
	//在一堆photo中截取出选中的图片
	photos.splice(n,1)[0]; 
	
	/*把海报分为左右两部分*/
	var pLeft = photos.splice(0,parseInt(photos.length/2));
	var pRight = photos;
	//console.log(pLeft);
	var ranges = range();
	for(var i in pLeft){ //取出左边的所有
		var photo = pLeft[i];
		//console.log(photo);
		$(photo).css('left',random(ranges.left.x)+'px');
		$(photo).css('top',random(ranges.left.y)+'px');
		$(photo).css('transform','rotate('+random([-150,150])+'deg) scale(1) ');//进阶版 translate(500px,0px)
	}
	for(var i in pRight){
		var photo = pRight[i];
		$(photo).css('left',random(ranges.right.x)+'px');
		$(photo).css('top',random(ranges.right.y)+'px');
		$(photo).css('transform','rotate('+random([-150,150])+'deg) scale(1)');//进阶版/*translate(0px,500px)*/
	}
	
	//当前被激活按钮
	$('#nav_'+n).addClass('i_active').siblings('[class*="i_active"]').removeClass('i_active');
}

//6.计算左右分区的范围	left:{x:[min,max],y:[]} right:{x:[],y:[]}
function range(){
	var range = {left:{x:[],y:[]},right:{x:[],y:[]}};
	var wrap = {
		w:$('#wrap')[0].clientWidth,
		h:$('#wrap')[0].clientHeight
	}
	var photo = {
		w:$('.photo')[0].clientWidth,
		h:$('.photo')[0].clientHeight
	}
	//做分区取值范围
	range.left.x = [0 , wrap.w/2-photo.w/2];
	range.left.y = [0-photo.h , wrap.h];

	range.right.x = [wrap.w/2+photo.w/2 , wrap.w];
	range.right.y = range.left.y;
	return range;
}




