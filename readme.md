## 环境依赖:   
    npm
    node
    gulp
    sass
    requirejs   
   
## 安装依赖的方法：
	 执行npm install，安装依赖。

## 开发原理
其实很简单，主要归功于scss
``` scss
$base:8;
$base_time: 6s;
/*圈数时间*/
/*动画种类*/
// $animal-list: -1,45,92,134,179,224,269,314;

 $animal-list: 0,315,270,225,180,135,90,45;

@each $animal in $animal-list{	
	@-webkit-keyframes rotate-animate-#{$animal} {
		  from{
	    -webkit-transform: rotate(0deg);
	    transform: rotate(0deg);	    
	  }

	  to{
	     -webkit-transform: rotate((360*$base+$animal) * 1deg);
	    transform: rotate((360*$base+$animal) * 1deg);	   
	  }
	}

	@keyframes rotate-animate-#{$animal} {
	  from{
	    -webkit-transform: rotate(0deg);
	    transform: rotate(0deg);	    
	  }

	  to{
	     -webkit-transform: rotate((360*$base+$animal) * 1deg);
	    transform: rotate((360*$base+$animal) * 1deg);	   
	  }
	}

	.rotate-animate-#{$animal} {
	    -webkit-transform-origin: center;
	    transform-origin: center;
	      -webkit-animation-name: rotate-animate-#{$animal};
			animation-name: rotate-animate-#{$animal};	
	    animation-duration:$base_time;		 
	}

}
```
比较难调的地方是角度的这个数组，要根据实际情况看一下。然后去加载相应的动画名称。

## 命令

###开发模式
  gulp dev 进入开发模式。
### 打包
  gulp 进行打包。

###目录
  1. index.html --转盘页面

### 注意事项：
   1. 文件会依次生成到src的外面，但images文件需要手动拷贝。
   2. scss中的样式编译到src/css中的css还须经过编译。gulp工具会对src/css中进行前缀补全。      
### 欠佳的地方
   1. gulpfile有点乱，md5校验为配置上去。   





	


