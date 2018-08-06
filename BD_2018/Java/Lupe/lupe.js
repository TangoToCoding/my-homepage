// lupe.js, (C) Walter Bislin, walter.bislins.ch, Dezember 2004
// include: <script src="x.js" type="text/javascript"></script>
// include: <script src="ic.js" type="text/javascript"></script>

var CLupeObj = null;

// CLupeObj.State's
var CLHidden = 0;
var CLLoading = 1;
var CLZoomIn = 2;
var CLZoomed = 3;
var CLZoomOut = 4;

function CLupe()
{
  if (CLupeObj) return; // only one instance allowed!
  // public properties
  this.BorderColor = 'black';
  this.BorderWidth = 1;
  this.TimeSpan = 500;
  this.TimerInterval = 40; // 25 fps
  this.HideSmall = false; // to hide small image during zoom
  this.TimeModifyFunc = null;
  this.Enabled = true;
  this.VAlign = 'ToMiddle'; // Top, Middle, Bottom, ToMiddle
  this.HAlign = 'ToCenter'; // Left, Center, Right, ToCenter
  this.VMargin = 0;
  this.HMargin = 0;
  // private properties
  this.SmallPosX = 0;
  this.SmallPosY = 0;
  this.SmallWidth = 0;
  this.SmallHeight = 0;
  this.BigPosX = 0;
  this.BigPosY = 0;
  this.BigWidth = 0;
  this.BigHeight = 0;
  this.StartTime = 0;
  this.Timer = null;
  this.BigImgID = -1;
  this.SmallImg = null;
  this.WaitObj = null;
  this.ZoomImg = null;
  this.State = CLHidden;
  this.HtmlWritten = false;
  CLupeObj = this;
}

function CLupePreload() { CLupeObj.Preload(CLupePreload.arguments); }
function CLupePreloadList(aUrlList) { CLupeObj.Preload(aUrlList); }
function CLupeHTML() { CLupeObj.HTML(); }
function CLupeZoom(aImgName,aBigImgUrl) { CLupeObj.Zoom(aImgName,aBigImgUrl); }
function CLupeEnable() { CLupeObj.Enable(); }
function CLupeDisable() { CLupeObj.Disable(); }

CLupe.prototype.Preload = function(aImgUrlList) {
  IC.PreloadImages( aImgUrlList );
}

CLupe.prototype.HTML = function()
{
  if (this.HtmlWritten) return;
  var s = '<img id="ZoomPic" src="" style="position:absolute;visibility:hidden;z-index:100;';
  if (this.BorderWidth > 0) s += 'border:'+this.BorderWidth+'px solid '+this.BorderColor+';';
  s += '" onclick="CLupeObj.UnZoom()" ondblclick="CLupeObj.NewWindow()">'
  document.writeln( s );
  document.writeln( '<div id="ZoomPicWait" '+
    'style="position:absolute;visibility:hidden;z-index:5;background-color:white;color:black;width:125px;height:20px;text-align:center;font-size:10pt;border:1px solid black;">'+
    'Lade Vergrösserung</div>' );
  this.HtmlWritten = true;
}

CLupe.prototype.Zoom = function(aImgName, aBigImgUrl)
{
  if (!this.Enabled) return;
  this.WaitObj = xGetElementById("ZoomPicWait");
  this.ZoomImg = xGetElementById("ZoomPic");
  var bigImgID = IC.FindImage(aBigImgUrl);

  if ((this.State != CLHidden) && (bigImgID != -1) && (bigImgID == this.BigImgID)) {
    if (this.State == CLLoading) {
      xHide( this.WaitObj );
      this.State = CLHidden;
      return;
    }
    if (this.State == CLZoomIn || this.State == CLZoomed) {
      this.UnZoom();
      return;
    }
    // this.State == CLZoomOut
    if (this.Timer) {
      clearTimeout( this.Timer );
      this.Timer = null;
    }
    this.StartTime = xTimeMS() - this.TimeSpan + (xTimeMS() - this.StartTime);
    this.State = CLZoomIn;
    var me = this; // closure -> http://walter.bislins.ch/lexi/closure.html
    this.Timer = setTimeout(function(){me.Enlarge();}, this.TimerInterval);
    return;
  }

  if (this.State == CLLoading) {
    xHide( this.WaitObj );
    this.State = CLHidden;
  }
  else if (this.State != CLHidden) {
    if (this.Timer) {
      clearTimeout( this.Timer );
      this.Timer = null;
    }
    this.HideZoomImg();
  }
  this.SmallImg = xGetElementById(aImgName);
  if ((bigImgID != -1) && IC.IsLoaded(bigImgID)) {
    this.BigImgID = bigImgID;
    this.StartZoom();
  }
  else {
    this.GetSmallImgData();
    var y = (this.SmallHeight - 21);
    xMoveTo( this.WaitObj, this.SmallPosX+3, this.SmallPosY+y );
    xShow( this.WaitObj );
    this.State = CLLoading;
    var me = this;
    this.BigImgID = IC.LoadImage( aBigImgUrl, function(aImgID){me.OnLoad(aImgID);} );
  }
}

CLupe.prototype.Enable = function() { this.Enabled = true; }
CLupe.prototype.Disable = function() { this.Enabled = false; }

CLupe.prototype.GetSmallImgData = function()
{
  this.SmallWidth = this.SmallImg.width + 2*this.BorderWidth;
  this.SmallHeight = this.SmallImg.height + 2*this.BorderWidth;
  this.SmallPosX = xPageX(this.SmallImg) + (xWidth(this.SmallImg)-this.SmallWidth)/2; // Ränder berücksichtigen
  this.SmallPosY = xPageY(this.SmallImg) + (xHeight(this.SmallImg)-this.SmallHeight)/2;
}

CLupe.prototype.OnLoad = function( aImgID )
{
  if ((this.State == CLLoading) && (this.BigImgID == aImgID)) {
    this.StartZoom();
  }
}

CLupe.prototype.Range = function( aValue, aMin, aMax ) {
  return aMin + (aMax-aMin)*aValue;
}

CLupe.prototype.StartZoom = function()
{
  this.BigImg = IC.Image(this.BigImgID);
  this.ZoomImg.src = this.BigImg.src;
  this.GetSmallImgData();
  this.BigWidth = this.BigImg.width + 2*this.BorderWidth;
  this.BigHeight = this.BigImg.height + 2*this.BorderWidth;
  if ((this.SmallWidth >= this.BigWidth) || (this.SmallHeight >= this.BigHeight)) return;
  // assert: this.BigImg is greater than this.SmallImg

  var clW = xClientWidth();
  var clX = xScrollLeft();
  if (this.HAlign == 'Left') {
    this.BigPosX = this.HMargin;
    // move big image into client range
    if ((this.BigPosX+this.BigWidth) > (clX+clW)) this.BigPosX = (clX+clW) - this.BigWidth;
    if ((this.BigPosX)               < (clX)    ) this.BigPosX =  clX;
  } else if (this.HAlign == 'Right') {
    this.BigPosX = (clX+clW) - this.BigWidth - this.HMargin;
    // move big image into client range
    if ((this.BigPosX) < (clX)) this.BigPosX =  clX;
  } else {
    // compute big position: move big image according to its size rel. to the windows range
    // to the center of the windows range (client range). As smaller the image, as farther away
    // from the center.
    var dxCenter = 1;
    if (this.BigWidth <= clW) {
      // assert: this.BigImg width full inside client range
      dxCenter = (this.BigWidth-this.SmallWidth)/(clW-this.SmallWidth);
      if (dxCenter < 0) dxCenter = 0;
    }
    if (this.HAlign == 'Center') dxCenter = 1;
    var cxBig = clW / 2;
    var cxSmall = this.SmallPosX-clX + (this.SmallWidth/2);
    var cx = dxCenter*(cxBig-cxSmall)+cxSmall;
    this.BigPosX = clX + cx - this.BigWidth/2;
    if (this.BigPosX < 0) this.BigPosX = 0;
    if (this.BigWidth <= clW) {
      // move big image into client range
      if ((this.BigPosX+this.BigWidth) > (clX+clW)) this.BigPosX = (clX+clW) - this.BigWidth;
      if ((this.BigPosX)               < (clX)    ) this.BigPosX =  clX;
    }
  }
  var clH = xClientHeight();
  var clY = xScrollTop();
  if (this.VAlign == 'Top') {
    this.BigPosY = this.VMargin;
    // move big image into client range
    if ((this.BigPosY+this.BigHeight) > (clY+clH)) this.BigPosY = (clY+clH) - this.BigHeight;
    if ((this.BigPosY)                < (clY)    ) this.BigPosY =  clY;
  } else if (this.VAlign == 'Bottom') {
    this.BigPosY = (clY+clH) - this.BigHeight - this.VMargin;
    // move big image into client range
    if ((this.BigPosY) < (clY)) this.BigPosY =  clY;
  } else {
    var dyCenter = 1;
    if (this.BigHeight <= clH) {
      // assert: this.BigImg height full inside client range
      dyCenter = (this.BigHeight-this.SmallHeight)/(clH-this.SmallHeight);
      if (dyCenter < 0) dyCenter = 0;
    }
    if (this.VAlign == 'Middle') dyCenter = 1;
    var cyBig = clH / 2;
    var cySmall = this.SmallPosY-clY + (this.SmallHeight/2);
    var cy = dyCenter*(cyBig-cySmall)+cySmall;
    this.BigPosY = clY + cy - this.BigHeight/2;
    if (this.BigPosY < 0) this.BigPosY = 0;
    if (this.BigHeight <= clH) {
      // move big image into client range
      if ((this.BigPosY+this.BigHeight) > (clY+clH)) this.BigPosY = (clY+clH) - this.BigHeight;
      if ((this.BigPosY)                < (clY)    ) this.BigPosY =  clY;
    }
  }
  this.StartTime = xTimeMS();
  var me = this; // closure -> http://walter.bislins.ch/lexi/closure.html
  this.Timer = setTimeout(function(){me.Enlarge();}, this.TimerInterval);
}

CLupe.prototype.Enlarge = function()
{
  if (this.Timer) {
    clearTimeout(this.Timer);
    this.Timer = null;
  }
  var param = (xTimeMS() - this.StartTime) / this.TimeSpan;
  var eom = param >= 1;
  if (param > 1) param = 1;
  if (this.TimeModifyFunc) param = this.TimeModifyFunc(param);
  if (param < 0) param = 0;
  if (param > 1) param = 1;
  var x = this.Range( param, this.SmallPosX, this.BigPosX );
  var y = this.Range( param, this.SmallPosY, this.BigPosY );
  var w = this.Range( param, this.SmallWidth, this.BigWidth );
  var h = this.Range( param, this.SmallHeight, this.BigHeight );
  xMoveTo( this.ZoomImg, x, y );
  xResizeTo( this.ZoomImg, w, h );
  if (this.State != CLZoomIn) {
    xHide( this.WaitObj );
    xShow( this.ZoomImg );
    if (this.HideSmall) xHide( this.SmallImg );
    this.State = CLZoomIn;
  }
  var me = this;
  if (eom)
  {
    this.State = CLZoomed;
    this.Timer = setTimeout(function(){me.CheckOutOfWindow();}, 200);
  }
  else
  {
    this.Timer = setTimeout(function(){me.Enlarge();}, this.TimerInterval);
  }
}

CLupe.prototype.CheckOutOfWindow = function()
{
  var space = (xClientHeight()-this.BigHeight) / 2;
  var newY = xScrollTop() + space;
  var toleranz;
  if (space > 0) {
    toleranz = space + (this.BigHeight * 2 / 3);
  } else {
    toleranz = -space + (xClientHeight() * 2 / 3);
  }
  if (Math.abs(newY-this.BigPosY) > toleranz) {
    this.UnZoom();
    return;
  }
  var me = this;
  this.Timer = setTimeout(function(){me.CheckOutOfWindow();}, 200);
}

CLupe.prototype.NewWindow = function()
{
  if (this.HideSmall) xShow( this.SmallImg );
  xHide( this.ZoomImg );
  xMoveTo( this.ZoomImg, 0, 0 );
  xResizeTo( this.ZoomImg, 0, 0 );
  this.State = CLHidden;
  location.href = IC.ImageUrl(this.BigImgID);
}

CLupe.prototype.UnZoom = function()
{
  if (this.State == CLHidden || this.State == CLZoomOut) return;
  if (this.State == CLLoading) {
    xHide( this.WaitObj );
    this.State = CLHidden;
    return;
  }
  if (this.Timer) {
    clearTimeout(this.Timer);
    this.Timer = null;
  }
  this.SmallPosX = xPageX(this.SmallImg) + (xWidth(this.SmallImg)-this.SmallWidth)/2; // Ränder berücksichtigen
  this.SmallPosY = xPageY(this.SmallImg) + (xHeight(this.SmallImg)-this.SmallHeight)/2;
  if (this.State == CLZoomIn) {
    this.StartTime = xTimeMS() - this.TimeSpan + (xTimeMS() - this.StartTime);
  } else {
    this.StartTime = xTimeMS();
  }
  this.State = CLZoomOut;
  var me = this; // closure -> http://walter.bislins.ch/lexi/closure.html
  this.Timer = setTimeout(function(){me.Shrink();}, this.TimerInterval);
}

CLupe.prototype.HideZoomImg = function()
{
  if (this.HideSmall) xShow( this.SmallImg );
  xHide( this.ZoomImg );
  xMoveTo( this.ZoomImg, 0, 0 );
  xResizeTo( this.ZoomImg, 0, 0 );
  this.State = CLHidden;
}

CLupe.prototype.Shrink = function()
{
  if (this.Timer) {
    clearTimeout(this.Timer);
    this.Timer = null;
  }
  var param = (xTimeMS() - this.StartTime) / this.TimeSpan;
  var eom = param >= 1;
  if (param > 1) param = 1;
  if (this.TimeModifyFunc) param = this.TimeModifyFunc(param);
  if (param < 0) param = 0;
  if (param > 1) param = 1;
  var x = this.Range( param, this.BigPosX, this.SmallPosX );
  var y = this.Range( param, this.BigPosY, this.SmallPosY );
  var w = this.Range( param, this.BigWidth, this.SmallWidth );
  var h = this.Range( param, this.BigHeight, this.SmallHeight );
  xMoveTo( this.ZoomImg, x, y );
  xResizeTo( this.ZoomImg, w, h );
  if (eom)
  {
    this.HideZoomImg();
  }
  else
  {
    xMoveTo( this.ZoomImg, x, y );
    xResizeTo( this.ZoomImg, w, h );
    var me = this; // closure -> http://walter.bislins.ch/lexi/closure.html
    this.Timer = setTimeout(function(){me.Shrink();}, this.TimerInterval);
  }
}

CLupeObj = new CLupe();

CLupeObj.TimeModifyFunc = function( aValue ) { return (0.5 - 0.5 * Math.cos(Math.PI*aValue)); }
