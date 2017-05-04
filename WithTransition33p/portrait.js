bEnablePortraitMode = false;
bEnablePortraitVideoFix = false;
if(navigator.userAgent.match(/Opera/i) && navigator.userAgent.match(/PhilipsTV/i) )
//if(navigator.userAgent.match(/Mozilla/i) && navigator.userAgent.match(/Chrome/i) )
{
   	bEnablePortraitMode = true;
   	bEnablePortraitVideoFix = true;
}