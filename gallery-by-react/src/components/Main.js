require('normalize.css/normalize.css');
require('styles/App.styl');

import React from 'react';

//获取图片数据，将图片名信息转成url路径
let imageDatas = require('../data/imageDatas.js');

//利用自执行函数，讲图片名信息转换成图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr){
	for(var i = 0,j = imageDatasArr.length; i < j;i++){
		var oneImageData = imageDatasArr[i];
		oneImageData.imageURL = require('../images/'+oneImageData.fileName);
		imageDatasArr[i] = oneImageData;
	}
	return imageDatasArr;
})(imageDatas);

/*
 *获取区间内的一个随机值
 */
function getRangeRandom(low,high){
	return parseInt(Math.random() * (high - low) + low);  
}

/*
 *获取0~30度之间的任意正负值
 */
function getDegRandom(){
	return (Math.random() > 0.5 ?'' : '-' )+ parseInt(Math.random() * 30);
}

/*
 *画板组件
 */
class ImgFigure extends React.Component {
	
	/*
	 * ImgFigure 的点击处理函数
	 */
	handleClick(e){
		if(this.props.arrange.isCenter){
	      	this.props.inverse();
	    } else {
	      	this.props.center();
	    }
		e.stopPropagation();		//阻止事件冒泡
		e.preventDefault();			//阻止默认点击事件
	}
	
	render() {
	  	
	  	var styleObj = {}
	  	//如果props属性中指定了这张图片的位置，则使用如下
	  	if(this.props.arrange.pos){
	  		styleObj = this.props.arrange.pos;
	  	}
	  	
	  	//如果图片的旋转角度有值并且不为0，添加旋转角度
	  	if(this.props.arrange.rotate){
	  		(['MozTransform','msTransform','WebkitTransform','transform']).forEach(function(value){
	  			styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
	  		}.bind(this));
	  	}
	  	
	  	if(this.props.arrange.isCenter){
	  		styleObj.zIndex = 11;
	  	}
	  	
	  	var imgFigureClassName = 'img-figure';
	  		imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
	  	
	    return (
	      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)} ref ="figure">
	      	<img src={this.props.data.imageURL} alt={this.props.data.title}/>
	      	<figcaption>
	      		<h2 className='img-title'>{this.props.data.title}</h2>
	      		<div className = 'img-back' onClick={this.handleClick.bind(this)}>
		          <p>
		            {this.props.data.desc}
		          </p>
		        </div>
	      	</figcaption>
	      </figure>
	    );
	}
}

/*
 *控制组件 
 */
class ControllerUnit extends React.Component {
	handleClick(e){
		
		//如果点击的是当前正在选中态的按钮，则翻转图片，否则将对应的图片居中
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
		
		e.preventDefault();
		e.stopPropagation();
	}
	render(){
		var controllerUnitClassName = "controller-unit";
		
		//如果对应的是居中图片，显示控制按钮的居中态
		if(this.props.arrange.isCenter){
			controllerUnitClassName += " is-center";
		}
		 // 如果对应翻转的图片
	    if(this.props.arrange.isInverse) {
	      controllerUnitClassName += ' is-inverse';
	    }
		return (
			<span className={controllerUnitClassName} onClick={this.handleClick.bind(this)}></span>
			
		)
	}
}


class AppComponent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
		    imgArrangeArr: [
		        /*
		        {
			        pos: {
			            left: 0,
			            right: 0
			        },
			        rotate: 0,  	 	//旋转角度
			        isInverse: false, 	//图片正反面
			        isCenter:false 		//图片默认不居中
			        }
		        */
		    ]
		};
		this.Constant = {				//常量KEY  存储图片的分布范围
			centerPos:{					//中间的分布范围
				left:0,
				right:0
			},
			hPosRange:{					//水平方向的分布范围
				leftSecX:[0,0],			//左分区X的取值
				rightSecX:[0,0],		//右分区X的取值
				y:[0,0]					//y轴的取值范围
			},
			vPosRange:{					//垂直方向的分布范围
				x:[0,0],				//x轴的取值范围
				topY:[0,0]
			}
		};
		
	}
	
	//组建加载以后，为每张图片计算其位置的范围
	componentDidMount(){
		//拿到舞台的大小
		var stageDom = this.refs.stage,
			stageW = stageDom.scrollWidth,
			stageH = stageDom.scrollHeight,
			halfStageW = parseInt(stageW / 2),
			halfStageH = parseInt(stageH / 2);
			
		//拿到一个图片画布的大小
		var imgFigureDOM = this.refs.imgFigure0.refs.figure,
			imageW = imgFigureDOM.scrollWidth,
			imageH = imgFigureDOM.scrollHeight,
			halfImageW = parseInt(imageW / 2),
			halfImageH = parseInt(imageH / 2);
			
		//计算中心图片的位置点
		this.Constant.centerPos = {
			left:halfStageW - halfImageW,
			top:halfStageH - halfImageH
		}
		/* 左右两侧的排布位置的范围 */
		//左侧最左侧的范围
		this.Constant.hPosRange.leftSecX[0] = -halfImageW;
		//左侧最右侧的范围
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImageW*3;
		//右侧最左侧的范围
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImageW;
		//右侧最右边的范围
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImageW;
		//垂直最上面的范围
		this.Constant.hPosRange.y[0] = -halfImageH;
		//垂直最下边的范围
		this.Constant.hPosRange.y[1] = stageH - halfImageH;
		
		/* 上侧区域图片排布位置的范围 */
		this.Constant.vPosRange.topY[0] = -halfImageH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImageH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imageW;
		this.Constant.vPosRange.x[1] = halfStageW;
		
		this.rearrange(0);
	}
	
	/*
	 * 翻转图片
	 * @params index 输入当前被执行inverse操作的图片对应的index
	 * @return {Function} 这是一个闭包函数，其内return一个真正等待被执行的函数
	 */
	inverse(index){
		return function(){
			var imgArrangeArr = this.state.imgArrangeArr;
			imgArrangeArr[index].isInverse = !imgArrangeArr[index].isInverse;
			this.setState({
				imgArrangeArr: imgArrangeArr
			});
		}.bind(this)
	}
	
	/*
  	 * 利用rearrange函数，居中对应index的图片
  	 * @param index ，需要居中的图片index
  	 * @return {Function}
  	 */
	center(index){
	    return function(){
	      	this.rearrange(index);
	    }.bind(this);
	}
	
	/*
	 *重新布局所有图片,指定居中排布哪个图片
	 */
	rearrange(centerIndex){
		var imgArrangeArr = this.state.imgArrangeArr,
			centerPos = this.Constant.centerPos,
			hPosRange = this.Constant.hPosRange,
			vPosRange = this.Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,
			
		//上侧区域的图片分布
			imgArrangeTopArr = [],
			topImgNum = Math.floor(Math.random() * 2), //取一个 或者都不取
			topImgSpliceIndex = 0,
			imgArrangeCenterArr = imgArrangeArr.splice(centerIndex,1); //中心图片的状态
			
		//居中centerIndex 的图片,居中的centerIndex的图片不需要旋转	
		imgArrangeCenterArr[0] = {
			pos: centerPos,
			rotate: 0,
			isCenter: true
		};
		
		//取出要布局上侧的图片的状态信息
		topImgSpliceIndex = Math.ceil(Math.random() * (imgArrangeArr.length - topImgNum));
		imgArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex,topImgNum);
		
		//布局位于上侧的图片
		imgArrangeTopArr.forEach(function(value,index){
			imgArrangeTopArr[index] = {
				pos:{
					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
				},
				rotate:getDegRandom(),
				isCenter: false
			}
		});
		
		//布局左右两侧的图片
		for(var i = 0,j = imgArrangeArr.length, k = j / 2; i < j; i++){
			var hPosRangeLORX = null; //零时变量 左區域或者右区域的X的取值范围
			
			//前半部分布局左边，右半部分布局右边
			if(i < k ){
				hPosRangeLORX = hPosRangeLeftSecX;
			}else{
				hPosRangeLORX = hPosRangeRightSecX;
			}
			
			imgArrangeArr[i] = {
				pos:{
					top : getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
					left : getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
				},
				rotate:getDegRandom(),
				isCenter: false
			}
		}
		//debugger;
		
		//重新合并回图片数组
		if(imgArrangeTopArr && imgArrangeTopArr[0]){
			imgArrangeArr.splice(topImgSpliceIndex,0,imgArrangeTopArr[0]);
		}
		imgArrangeArr.splice(centerIndex,0,imgArrangeCenterArr[0]);
		this.setState({
			imgArrangeArr: imgArrangeArr
		});
	}
	
	
  	render() {
	  	var controllerUnits = [],
	  		imgFigures = [];
	  	
	  	imageDatas.forEach(function(value,index){
	  		
			if(!this.state.imgArrangeArr[index]){
	  			this.state.imgArrangeArr[index] = {
	  				pos:{
	  					left:0,
	  					top:0
	  				},
	  				rotate:0,
	  				isInverse: false,
	  				isCenter: false
	  			}
	  		}
	  		imgFigures.push(
	  			<ImgFigure 
		  			data={value}
		  			ref={'imgFigure'+index} 
		  			arrange={this.state.imgArrangeArr[index]} 
		  			key={index}
		  			inverse={this.inverse(index).bind(this)}
		  			center={this.center(index).bind(this)}
	  			/>
	  		);
	  		controllerUnits.push(
	  			<ControllerUnit 
	  				arrange={this.state.imgArrangeArr[index]} 
		  			key={index}
		  			inverse={this.inverse(index).bind(this)}
		  			center={this.center(index).bind(this)}
	  			/>);
	  		
	  	}.bind(this));
	    return (
	      <section className='stage' ref='stage'>
	      	<section className='img-sec'>
	      		{imgFigures}
	      	</section>
	      	<nav className='controller-nav'>
	      		{controllerUnits}
	      	</nav>
	      </section>
	    );
  	}
}

AppComponent.defaultProps = {};

export default AppComponent;//暴露js模块
