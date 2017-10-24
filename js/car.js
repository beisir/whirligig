;(function($){
var Car=function(poster){
	var that = this;
	this.poster=poster;// 保存元素节点
	this.uls=this.poster.find(".uls");// 获取ul元素
	this.btnl=this.poster.find(".left");// 获取左边按钮元素
	this.btnr=this.poster.find(".right");// 获取右边按钮元素
	this.lis=this.uls.find("li.lis");	//获取当前ul下的li元素
	if(this.lis.length%2==0){		// 本次效果的必须是奇数;
		this.uls.append(this.lis.first().clone());	//如果是偶数的话把第一张复制一张添加在最后
		this.lis=this.uls.children(); // 添加图片之后从新获取一遍li元素
	}
	this.posterFirst=this.lis.first();//获取li元素的第一张
	this.posterlast=this.lis.last();//获取li元素的最后一张
	this.flag = true;
	this.settings={
		"width":1000,		// 图片的宽度
		"height":400,		// 图片的高度	
		"posrtwidth":600,	// 第一张图片的宽度
		"posrtheight":300,	// 第一张图片的高度
		"scale":0.9,		// 记录显示比列关系	
		"align":"middle",	// 记录排列方式 :上中下
		"speed":600,		// animate动画执行的速度
		"isplay":true,		// 是否定时调用
		"delay":1000		// 定时调用的速度
	}
	// 扩展配置参数,合并默认参数
	$.extend(this.settings,this.getStting())
	// 设置配置参数值
	this.settingVlaue();
	// 设置默认图片排列效果
	this.setPos();

	// 单机按钮事件
	this.btnr.on("click",function(){
		if(that.flag){
			that.flag=false;
			that.rotate('left');
		}
	})
	this.btnl.on("click",function(){//点击左边按钮
		if(that.flag){		//如果flag参数为true
			that.flag=false;		// 并且设置flag为false;解决单机过快bug
			that.rotate('right');	//才开始执行点击事件
		}
	})
	if(this.settings.isplay){
		this.poster.hover(function(){	//当鼠标划入main元素清除定时调用
			clearInterval(that.timer);	
		},function(){			//否则继续调用
			that.isplay();
		}).trigger("mouseleave");// 默认执行离开事件开始调用定时器
	}

}
Car.prototype={
	isplay:function(){		//判断是否指向定时动画
		var that=this;				
		this.timer = setInterval(function(){
			that.btnl.trigger("click");	//trigger方法:自动触发点击事件
		},that.settings.delay);
	},
	// 点击旋转
	rotate:function(dir){//点击的时候执行的方法
		var that=this,	//存储this指向
			zIndexArr=[];	//定义一个数组用来存储每张图的zindex的值，解决兼容问题
		if(dir==="left"){			//如果参数为left证明点击的是左边
			this.lis.each(function(){	//便利所有的li元素
				var self=$(this),	//存储当前元素
					prev=self.prev().get(0)?$(this).prev():that.posterlast,//获取当前图片的上一张:如果上一张没有就获取最后一张
					width=prev.width(),//获取上一张的宽度
					height=prev.height(),//获取上一张的高度
					zIndex=prev.css("zIndex"),//获取上一张的zIndex值
					opacity=prev.css("opacity"),//获取上一张的透明度
					left=prev.css("left"),	//获取上一张的左边距
					top=prev.css("top");	//获取上一张的上边距
					zIndexArr.push(zIndex); //用数组存储当前的图片的zIndex值
				$(this).stop().animate({	//然后为当前图片设置样式动画
					width:width,		//宽为上一张图片的宽度
					height:height,		//高为上一张图片的高度
					zIndex:zIndex,		//zIndex为上一张图片的zIndex
					opacity:opacity,	//透明度为上一张图片的透明度
					left:left,		//左边距为上一张的图片的左边距
					top:top 		//上边距为上一张的上边距
				},that.settings.speed,function(){//动画执行完毕之后的回调函数
					that.flag=true;		// 解决点击速度宽的bug
				})	
			})
			this.lis.each(function(i){	// 当每个li动画执行完毕之后
				$(this).css("zIndex",zIndexArr[i]);	//在为每个li设置层级
			})	
		}else if(dir==="right"){	// 相同的方式如上边相同
			this.lis.each(function(){
				var self=$(this),
					prev=self.next().get(0)?$(this).next():that.posterFirst,
					width=prev.width(),
					height=prev.height(),
					zIndex=prev.css("zIndex"),
					opacity=prev.css("opacity"),
					left=prev.css("left"),
					top=prev.css("top");
					zIndexArr.push(zIndex);
				self.stop().animate({
					width:width,
					height:height,
					// zIndex:zIndex,
					opacity:opacity,
					left:left,
					top:top
				},that.settings.speed,function(){
					that.flag=true;
				});
			})
			this.lis.each(function(i){
				$(this).css("zIndex",zIndexArr[i]);
			})	
		}	
	},
	// 设置剩余图片的位置关系
	setPos:function(){
		var that=this, // 存储this指向
			sliceLi = this.lis.slice(1), // 截取除了第一张图片的剩余图片
			sliceLeng = sliceLi.length/2,// 获取除了第一张图片的其他图片的张数
			rightSclie = sliceLi.slice(0,sliceLeng),//旋转右边的图片:截取除了第一张其他图片的一半	
			leftSlice = sliceLi.slice(sliceLeng),	//旋转左边的图片:截取(除了第一张图和右边的图片)剩余的为左边的图片和右边的张数相同
			level = Math.floor(this.lis.length/2); // 获取所有的图片的张数一半+1:用来设置zIndex值

		var rw=this.settings.posrtwidth,	// 保存配置参数的第一张图片的宽度
			rh=this.settings.posrtheight,	// 保存配置参数的第一张图片的高度
			gap=(this.settings.width-this.settings.posrtwidth)/2/level;	// (main元素的宽度-第一张图片的宽度)/2/获取所有的图片的张数一半+1
		// 设置右边图片的位置关系和宽高度;
		var firstL=(this.settings.width-this.settings.posrtwidth)/2,// 获取第一张图片的距离左边的距离
			firstOfl=firstL+rw;		// 用第一张图片的左边距加上第一张图片的距离:为右边第一张图片的
		rightSclie.each(function(i){//便利截取的右边的图片
			level--;				//因为按钮的层级是3 ，所以图片开始自减		
			rw = rw * that.settings.scale;	// 用上一张图片的宽度替换为:原来的宽度乘设置的百分比
			rh = rh * that.settings.scale;	// 用上一张图片的高度替换为:原来的高度乘设置的百分比	
			var j = i;			// 存储当前下标
			$(this).css({			//为图片设置样式
				zIndex:level,		//图片的层级
				width:rw,			//设置图片的宽度
				height:rh,			//设置图片的高度
				opacity:1/(++j),	//设置图片的透明度:逐渐向下
				left:firstOfl+(++i)*gap-rw,	//设置图片左边距所占据的百分比逐渐自
				top:that.Align(rh)	//设置上边距;
			});
		})
		// 设置左边的位置关系
		var lw = rightSclie.last().width(),
			lh = rightSclie.last().height(),
			loop =  Math.floor(this.lis.length/2);
		leftSlice.each(function(i){
			$(this).css({
				zIndex:i,
				width:lw,
				height:lh,
				opacity:1/loop,
				left:i*gap,
				// top:(that.settings.height-lh)/2
				top:that.Align(lh)
			});
			lw = lw/that.settings.scale;
			lh = lh/that.settings.scale;
			loop--;
		})
	},
	// 设置垂直排列对齐方式
	Align:function(hig){
		var type = this.settings.align,	// 获取配置参数的图片排列方式
			top = 0;			// 定义li距离上边据的初始值
		switch(type){	// 判读配置参数为top||center||bottom
			case "middle":top = (this.settings.height-hig)/2;break;// center的话上边距为:main的高度减去hig/2
			case "top":top = 0;break;// top的话上边距为:main的高度减去hig/2
			case "bottom":top = this.settings.height-hig;break;// bottom的话上边距为:main的高度减去hig/2
			default :top = (this.settings.height-hig)/2;// 如果用户输入错误的话默认为居中
		}
		return top;	// 最后返回top记录的值;
	},
	// 设置配置参数去控制基本的宽度高度
	settingVlaue:function(){		
		var that=this;
		this.poster.css({				//设置main元素的宽高	
			width:this.settings.width,	// 使用配置的参数设置
			height:this.settings.height
		})
		this.uls.css({					// ul和main的宽高相同
			width:this.settings.width,	
			height:this.settings.height
		});
		// 计算左右按钮的宽度
		var w=(this.poster.width()-this.settings.posrtwidth)/2,// (用main元素的宽度减去第一张图片的宽度)/2：就是剩余的空间被按钮占据一半
			h=(this.poster.height()-this.settings.posrtheight)/2;// (用main元素的高度减去第一张图片的高度)/2：就是剩余的空间被按钮占据一半
		this.btnl.css({				// 设置左按钮的宽度和zIndex层级	
			width:w,				// 宽度占据第一张图片之外的左边所有间距
			height:this.settings.height,//高度和main盒子相同
			zIndex:Math.ceil(this.lis.length/2)	//左右各有图片所以按钮的层级是所有的图片的一半+1
		})
		this.btnr.css({
			width:w,				// 设置右按钮的宽度和zIndex层级	
			height:this.settings.height,//高度和main盒子相同
			zIndex:Math.ceil(this.lis.length/2) //左右各有图片,所以按钮的层级是所有的图片的一半+1
		})
		this.posterFirst.css({		// 设置第一张图片的宽高左边距和上边距
			width:this.settings.posrtwidth,		//宽为配置的宽度
			height:this.settings.posrtheight,	//高为配置的高度
			left:w,					// 左边的距离是main的宽度减去第一张图片宽度的一半
			top:h,					// 上边的距离是main的宽度减去第一张图片高度的一半	
			zIndex:Math.floor(this.lis.length/2)//左右各有图片,所以按钮的层级是所有的图片的一半+1
		})
	},

	// 获取人工配置参数
	getStting:function(){				//获取main元素的属性作为默认的参数
		var settings=this.poster.attr("data-setting");// 获取main元素的data-setting的参数
		// 转换为json对象jq方法$.paseJSON() 	
		if(settings&&settings!=""){		// 如果有获取到参数并且参数不等于空的话
			return $.parseJSON(settings);	// 就把参数从字符串使用$.parseJSON这个方法转为json数据返回
		}else{
			return {};		// 否则返回一个空的对象
		}
	}
}
Car.init=function(opt){			// Car这个构造函数下面有init这个方法,用来初始化对象
	var that=this;				// 储存this指向,this指向Car这个构造函数的实例对象
	opt.each(function(){		// 遍历所有的父元素,有几个便实例几个对象;
		new that($(this));		// 并把元素传参给构造函数;
	})

}


window['Car']=Car;				// 自执行函数不会传出参数，所以把Car这个函数在自执行函数中赋值给为window下的方法

})(jQuery);