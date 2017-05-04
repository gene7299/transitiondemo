var bEnableTransition = true;
var bEnableResetMarquee = true;
var bEnablePortraitMode = false;
var bEnablePortraitVideoFix = false;
var WithTransitionSpeed = 1;
var changeSpeed = 1000;
//var portraitDegree = 270;
var bEnableReloadTickerNewWay = true;
var bEnableSmartTickerStyle = true;
var bEnableForceRssTextFit = false;
var bEnableRssTemplateReplace = false;
var rssTemplate = '<p>• [Title]</p>&nbsp;&nbsp;';

var jQueryAnimationSpeed = 180;
var bAddingTransition = false;
var transitionSpeed = 1500;
var transitionEffect = 'random'; //random will be OK
var transition_functions = [ 
				//'cube', 
				//'cubeRandom', 
				'block', //-----good
				'cubeStop', 
				'cubeStopRandom', 
				'cubeHide', 
				//'cubeSize',
				'cubeSizeToRight',
				'horizontal',
				'slideLeft', //---
				'showBars', 
				'showBarsRandom', 
				//'tube1',
				//'tube3',
				//'tube10',
				'fade',
				//'fadeFour',
				'paralell',
				'blind',
				'blindHeight',
				'blindWidth',
				//'directionTop',
				//'directionBottom',
				//'directionRight',
				//'directionLeft',
				'toTop',
				'toBottom',
				'toRight',
				'toLeft',				
				//'cubeSpread',
				'cubeSpread3x3',//-----ok
				'glassCube',//-----ok
				'glassBlock',//-----good
				//'circles',
				//'circlesInside',
				//'circlesRotate',
				'cubeShow',//-----ok
				'upBars', //-----ok
				'downBars', //-----ok
				'hideBars',  //-----good
				'swapBars', //-----good
				'swapBarsBack', //-----good
				'swapBlocks',
				//'cut',
				//'swipe',  // not support for MTK PD
				'fade'
			];


var bEnableVideoPreloading = false;
var VideoDelayTime = 0;
if(navigator.userAgent.match(/Opera/i) && navigator.userAgent.match(/PhilipsTV/i) )
{
	bEnableVideoPreloading = true;
	VideoDelayTime = 3000;
}
if(navigator.userAgent.match(/Android/i))
{
	bEnableVideoPreloading = true;
	VideoDelayTime = 1000;
}
if(navigator.userAgent.match(/HAIER_SMNT/i) )
{
	bEnableVideoPreloading = true;
	VideoDelayTime = 0;
}