// x.js, X v3.15.4, Cross-Browser.com DHTML Library
// Copyright (c) 2004 Michael Foster, Licensed LGPL (gnu.org)
// edited (c) 2005 Walter Bislin, walter.bislins.ch

var xOp7Up,xOp6Dn,xIE4Up,xIE4,xIE5,xNN4,xUA=navigator.userAgent.toLowerCase();
if(window.opera){
  var i=xUA.indexOf('opera');
  if(i!=-1){
    var v=parseInt(xUA.charAt(i+6));
    xOp7Up=v>=7;
    xOp6Dn=v<7;
  }
}
else if(navigator.vendor!='KDE' && document.all && xUA.indexOf('msie')!=-1){
  xIE4Up=parseFloat(navigator.appVersion)>=4;
  xIE4=xUA.indexOf('msie 4')!=-1;
  xIE5=xUA.indexOf('msie 5')!=-1;
}
else if(document.layers){xNN4=true;}
xMac=xUA.indexOf('mac')!=-1;

function xDef() {
  for(var i=0; i<arguments.length; ++i){if(typeof(arguments[i])=='undefined') return false;}
  return true;
}
function xFunc() {
  for(var i=0; i<arguments.length; ++i){if(typeof(arguments[i])!='function') return false;}
  return true;
}
function xStr() {
  for(var i=0; i<arguments.length; ++i){if(typeof(arguments[i])!='string') return false;}
  return true;
}
function xNum() {
  for(var i=0; i<arguments.length; ++i){if(typeof(arguments[i])!='number') return false;}
  return true;
}

function xGetElementById(e) {
  if(typeof(e)!='string') return e;
  if(document.getElementById) e=document.getElementById(e);
  else if(document.all) e=document.all[e];
  else e=null;
  return e;
}

function xInnerHTML(e,t) {
  if(!(e=xGetElementById(e))) return '';
  if(xDef(e.innerHTML)) {
    if(xStr(t)) e.innerHTML = t;
    else t=e.innerHTML;
  }
  return t;
}

function xTagName(e) {
  if(!(e=xGetElementById(e))) return;
  return xDef(e.tagName) ? e.tagName.toLowerCase() : 'undefined';
}

function xShow(e) { xVisibility(e, 1); }
function xHide(e) { xVisibility(e, 0); }
function xVisibility(e, bShow)
{
  if(!(e=xGetElementById(e))) return;
  if(e.style && xDef(e.style.visibility)) {
    if (xDef(bShow)) e.style.visibility = bShow ? 'visible' : 'hidden';
    return e.style.visibility;
  }
  return null; // or return an empty string ???
}

function xMoveTo(e,iX,iY) {
  xLeft(e,iX);
  xTop(e,iY);
}

function xLeft(e,iX) {
  if(!(e=xGetElementById(e))) return 0;
  var css=xDef(e.style);
  if (css && xStr(e.style.left)) {
    if(xNum(iX)) e.style.left=iX+'px';
    else {
      iX=parseInt(e.style.left);
      if(isNaN(iX)) iX=0;
    }
  }
  else if(css && xDef(e.style.pixelLeft)) {
    if(xNum(iX)) e.style.pixelLeft=iX;
    else iX=e.style.pixelLeft;
  }
  return iX;
}

function xTop(e,iY) {
  if(!(e=xGetElementById(e))) return 0;
  var css=xDef(e.style);
  if(css && xStr(e.style.top)) {
    if(xNum(iY)) e.style.top=iY+'px';
    else {
      iY=parseInt(e.style.top);
      if(isNaN(iY)) iY=0;
    }
  }
  else if(css && xDef(e.style.pixelTop)) {
    if(xNum(iY)) e.style.pixelTop=iY;
    else iY=e.style.pixelTop;
  }
  return iY;
}

function xOpacity(e,uO) {
  if(!(e=xGetElementById(e))) return 100;
  if(xDef(e.filters) && xDef(e.filters.alpha) && xDef(e.filters.alpha.opacity)) {
    if(xNum(uO)) e.filters.alpha.opacity=uO;
    else uO=e.filters.aplha.opacity;
  } else uO = 100;
  return uO;
}

function xResizeTo(e,uW,uH) {
  xWidth(e,uW);
  xHeight(e,uH);
}

function xWidth(e,uW) {
  if(!(e=xGetElementById(e))) return 0;
  if (xNum(uW)) {
    if (uW<0) uW = 0;
    else uW=Math.round(uW);
  }
  else uW=-1;
  var css=xDef(e.style);
  if(css && xDef(e.offsetWidth) && xStr(e.style.width)) {
    if(uW>=0) xSetCW(e, uW);
    uW=e.offsetWidth;
  }
  else if(css && xDef(e.style.pixelWidth)) {
    if(uW>=0) e.style.pixelWidth=uW;
    uW=e.style.pixelWidth;
  }
  return uW;
}

function xHeight(e,uH) {
  if(!(e=xGetElementById(e))) return 0;
  if (xNum(uH)) {
    if (uH<0) uH = 0;
    else uH=Math.round(uH);
  }
  else uH=-1;
  var css=xDef(e.style);
  if(css && xDef(e.offsetHeight) && xStr(e.style.height)) {
    if(uH>=0) xSetCH(e, uH);
    uH=e.offsetHeight;
  }
  else if(css && xDef(e.style.pixelHeight)) {
    if(uH>=0) e.style.pixelHeight=uH;
    uH=e.style.pixelHeight;
  }
  return uH;
}

function xGetCS(ele,sP){return parseInt(document.defaultView.getComputedStyle(ele,'').getPropertyValue(sP));}

function xSetCW(ele,uW){
  var pl=0,pr=0,bl=0,br=0;
  if(xDef(document.defaultView) && xDef(document.defaultView.getComputedStyle)){
    pl=xGetCS(ele,'padding-left');
    pr=xGetCS(ele,'padding-right');
    bl=xGetCS(ele,'border-left-width');
    br=xGetCS(ele,'border-right-width');
  }
  else if(xDef(ele.currentStyle,document.compatMode) && (document.compatMode=='CSS1Compat')){
    pl=parseInt(ele.currentStyle.paddingLeft);
    pr=parseInt(ele.currentStyle.paddingRight);
    bl=parseInt(ele.currentStyle.borderLeftWidth);
    br=parseInt(ele.currentStyle.borderRightWidth);
  }
  else if(xDef(ele.offsetWidth,ele.style.width)){
    ele.style.width=uW+'px';
    pl=ele.offsetWidth-uW;
  }
  if(isNaN(pl)) pl=0; if(isNaN(pr)) pr=0; if(isNaN(bl)) bl=0; if(isNaN(br)) br=0;
  var cssW=uW-(pl+pr+bl+br);
  if(isNaN(cssW)||cssW<0) return;
  else ele.style.width=cssW+'px';
}

function xSetCH(ele,uH){
  var pt=0,pb=0,bt=0,bb=0;
  if(xDef(document.defaultView) && xDef(document.defaultView.getComputedStyle)){
    pt=xGetCS(ele,'padding-top');
    pb=xGetCS(ele,'padding-bottom');
    bt=xGetCS(ele,'border-top-width');
    bb=xGetCS(ele,'border-bottom-width');
  }
  else if(xDef(ele.currentStyle,document.compatMode) && (document.compatMode=='CSS1Compat')){
    pt=parseInt(ele.currentStyle.paddingTop);
    pb=parseInt(ele.currentStyle.paddingBottom);
    bt=parseInt(ele.currentStyle.borderTopWidth);
    bb=parseInt(ele.currentStyle.borderBottomWidth);
  }
  else if(xDef(ele.offsetHeight,ele.style.height)){
    ele.style.height=uH+'px';
    pt=ele.offsetHeight-uH;
  }
  if(isNaN(pt)) pt=0; if(isNaN(pb)) pb=0; if(isNaN(bt)) bt=0; if(isNaN(bb)) bb=0;
  var cssH=uH-(pt+pb+bt+bb);
  if(isNaN(cssH)||cssH<0) return;
  else ele.style.height=cssH+'px';
}

function xClientWidth()
{
  var w=0;
  if(xOp6Dn) w=window.innerWidth;
  else if(document.compatMode == 'CSS1Compat' && !window.opera && document.documentElement && document.documentElement.clientWidth)
    w=document.documentElement.clientWidth;
  else if(document.body && document.body.clientWidth)
    w=document.body.clientWidth;
  else if(xDef(window.innerWidth,window.innerHeight,document.height)) {
    w=window.innerWidth;
    if(document.height>window.innerHeight) w-=16;
  }
  return w;
}

function xClientHeight()
{
  var h=0;
  if(xOp6Dn) h=window.innerHeight;
  else if(document.compatMode == 'CSS1Compat' && !window.opera && document.documentElement && document.documentElement.clientHeight)
    h=document.documentElement.clientHeight;
  else if(document.body && document.body.clientHeight)
    h=document.body.clientHeight;
  else if(xDef(window.innerWidth,window.innerHeight,document.width)) {
    h=window.innerHeight;
    if(document.width>window.innerWidth) h-=16;
  }
  return h;
}

function xPageX(e) {
  if (!(e=xGetElementById(e))) return 0;
  var x = 0;
  while (e) {
    if (xDef(e.offsetLeft)) x += e.offsetLeft;
    e = xDef(e.offsetParent) ? e.offsetParent : null;
  }
  return x;
}

function xPageY(e) {
  if (!(e=xGetElementById(e))) return 0;
  var y = 0;
  while (e) {
    if (xDef(e.offsetTop)) y += e.offsetTop;
    e = xDef(e.offsetParent) ? e.offsetParent : null;
  }
  return y;
}

function xScrollLeft(e, bWin)
{
  var offset=0;
  if (!xDef(e) || bWin || e == document || e.tagName.toLowerCase() == 'html' || e.tagName.toLowerCase() == 'body') {
    var w = window;
    if (bWin && e) w = e;
    if(w.document.documentElement && w.document.documentElement.scrollLeft) offset=w.document.documentElement.scrollLeft;
    else if(w.document.body && xDef(w.document.body.scrollLeft)) offset=w.document.body.scrollLeft;
  }
  else {
    e = xGetElementById(e);
    if (e && xNum(e.scrollLeft)) offset = e.scrollLeft;
  }
  return offset;
}

function xScrollTop(e, bWin)
{
  var offset=0;
  if (!xDef(e) || bWin || e == document || e.tagName.toLowerCase() == 'html' || e.tagName.toLowerCase() == 'body') {
    var w = window;
    if (bWin && e) w = e;
    if(w.document.documentElement && w.document.documentElement.scrollTop) offset=w.document.documentElement.scrollTop;
    else if(w.document.body && xDef(w.document.body.scrollTop)) offset=w.document.body.scrollTop;
  }
  else {
    e = xGetElementById(e);
    if (e && xNum(e.scrollTop)) offset = e.scrollTop;
  }
  return offset;
}

function xZIndex(e,uZ)
{
  if(!(e=xGetElementById(e))) return 0;
  if(e.style && xDef(e.style.zIndex)) {
    if(xNum(uZ)) e.style.zIndex=uZ;
    uZ=parseInt(e.style.zIndex);
  }
  return uZ;
}

function xCursor(e,c)
{
  if(!(e=xGetElementById(e))) return '';
  if(e.style && xDef(e.style.cursor)) {
    if(xStr(c)) e.style.cursor=c;
    c=e.style.cursor;
  }
  return c;
}

function xStyle(e,sStyle,sVal) {
  if(!(e=xGetElementById(e))) return '';
  if(e.style && xStr(sStyle) && xDef(e.style[sStyle])) {
    if(xDef(sVal)) e.style[sStyle]=sVal;
    else sVal=e.style[sStyle];
  }
  return sVal;
}

// HTML-Tree functions

function xParent(e, bNode) {
  if (!(e=xGetElementById(e))) return null;
  var p=null;
  if (!bNode && xDef(e.offsetParent)) p=e.offsetParent;
  else if (xDef(e.parentNode)) p=e.parentNode;
  else if (xDef(e.parentElement)) p=e.parentElement;
  return p;
}

function xCreateElement(sTag) {
  if (document.createElement) return document.createElement(sTag);
  else return null;
}

function xCreateTextNode(s) {
  if (document.createTextNode) return document.createTextNode(s);
  else return null;
}

function xHasChildNodes(oParent) {
  if (oParent.hasChildNodes) return oParent.hasChildNodes();
  else return false;
}

function xChildNodes(oParent) {
  if (oParent.childNodes) return oParent.childNodes;
  else return [];
}

function xAppendChild(oParent, oChild) {
  if (oParent.appendChild) return oParent.appendChild(oChild);
  else return null;
}

function xInsertBefore(oParent, oChild, oRef) {
  if (oParent.insertBefore) return oParent.insertBefore(oChild,oRef);
  else return oChild;
}

function xRemoveChild(oParent, oChild) {
  if (oParent.removeChild) return oParent.removeChild(oChild);
  else return oChild;
}

function xGetElementsByTagName(t,p)
{
  var list = null;
  t = t || '*';
  p = p || document;
  if (xIE4 || xIE5) {
    if (t == '*') list = p.all;
    else list = p.all.tags(t);
  }
  else if (p.getElementsByTagName) list = p.getElementsByTagName(t);
  return list || new Array();
}

// xAddEventListener, Copyright 2001-2005 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL

function xAddEventListener(e,eT,eL,cap)
{
  if(!(e=xGetElementById(e))) return;
  eT=eT.toLowerCase();
  if((!xIE4Up && !xOp7Up) && e==window) {
    if(eT=='resize') { window.xPCW=xClientWidth(); window.xPCH=xClientHeight(); window.xREL=eL; xResizeEvent(); return; }
    if(eT=='scroll') { window.xPSL=xScrollLeft(); window.xPST=xScrollTop(); window.xSEL=eL; xScrollEvent(); return; }
  }
  var eh='e.on'+eT+'=eL';
  if(e.addEventListener) e.addEventListener(eT,eL,cap);
  else if(e.attachEvent) e.attachEvent('on'+eT,eL);
  else eval(eh);
}
// called only from the above
function xResizeEvent()
{
  if (window.xREL) setTimeout('xResizeEvent()', 250);
  var cw = xClientWidth(), ch = xClientHeight();
  if (window.xPCW != cw || window.xPCH != ch) { window.xPCW = cw; window.xPCH = ch; if (window.xREL) window.xREL(); }
}
function xScrollEvent()
{
  if (window.xSEL) setTimeout('xScrollEvent()', 250);
  var sl = xScrollLeft(), st = xScrollTop();
  if (window.xPSL != sl || window.xPST != st) { window.xPSL = sl; window.xPST = st; if (window.xSEL) window.xSEL(); }
}

function xRemoveEventListener(e,eT,eL,cap)
{
  if(!(e=xGetElementById(e))) return;
  eT=eT.toLowerCase();
  if((!xIE4Up && !xOp7Up) && e==window) {
    if(eT=='resize') { window.xREL=null; return; }
    if(eT=='scroll') { window.xSEL=null; return; }
  }
  var eh='e.on'+eT+'=null';
  if(e.removeEventListener) e.removeEventListener(eT,eL,cap);
  else if(e.detachEvent) e.detachEvent('on'+eT,eL);
  else eval(eh);
}

function xEvent(evt) // object prototype
{
  this.Init(evt);
}
xEvent.prototype.Init = function(evt)
{
  var e = evt || window.event;
  if(!e) return;
  if(e.type) this.type = e.type;
  if(e.target) this.target = e.target;
  else if(e.srcElement) this.target = e.srcElement;

  // Section B
  if (e.relatedTarget) this.relatedTarget = e.relatedTarget;
  else if (e.type == 'mouseover' && e.fromElement) this.relatedTarget = e.fromElement;
  else if (e.type == 'mouseout') this.relatedTarget = e.toElement;
  // End Section B

  if(xOp6Dn) { this.pageX = e.clientX; this.pageY = e.clientY; }
  else if(xDef(e.pageX,e.pageY)) { this.pageX = e.pageX; this.pageY = e.pageY; }
  else if(xDef(e.clientX,e.clientY)) { this.pageX = e.clientX + xScrollLeft(); this.pageY = e.clientY + xScrollTop(); }

  // Section A
  if (xDef(e.offsetX,e.offsetY)) {
    this.offsetX = e.offsetX;
    this.offsetY = e.offsetY;
  }
  else if (xDef(e.layerX,e.layerY)) {
    this.offsetX = e.layerX;
    this.offsetY = e.layerY;
  }
  else {
    this.offsetX = this.pageX - xPageX(this.target);
    this.offsetY = this.pageY - xPageY(this.target);
  }
  // End Section A

  if (e.keyCode) { this.keyCode = e.keyCode; } // for moz/fb, if keyCode==0 use which
  else if (xDef(e.which) && e.type.indexOf('key')!=-1) { this.keyCode = e.which; }

  this.shiftKey = e.shiftKey;
  this.ctrlKey = e.ctrlKey;
  this.altKey = e.altKey;
  return this;
}

function xCallbackChain() {
  this.Callback = null;
  this.Active = false;
}

xCallbackChain.prototype.Add = function( aFunc ) {
  aFunc.NextCallback = this.Callback;
  this.Callback = aFunc;
}

xCallbackChain.prototype.Call = function( aArg ) {
  if (this.Active) return; // prevent recursion
  this.Active = true;
  var cb = this.Callback;
  while (cb) {
    cb(aArg); cb = cb.NextCallback;
  }
  this.Active = false;
}

function xOnLoad( aFunc ) {
  var oldLoadFunc = window.onload;
  window.onload = function() {
    aFunc();
    if (oldLoadFunc) oldLoadFunc();
  }
}

function xOnUnload( aFunc ) {
  var oldUnloadFunc = window.onunload;
  window.onunload = function() {
    aFunc();
    if (oldUnloadFunc) oldUnloadFunc();
  }
}

function xTimeMS() { var date = new Date(); return date.getTime(); }

function xImage(aImgFilename) {
  var img = new Image;
  img.src = aImgFilename;
  return img;
}

function xChangeImage(aImgID,aImg) {
  var img = xGetElementById(aImgID);
  if (img) img.src = aImg.src;
}

// var b1Img = new xMultiImage( 'b1', 'stuff/b1_up.gif', 'stuff/b1_down.gif' );
//
// <a href="next.html" onmouseover="b1Img.Show(1)" onmouseout="b1Img.Show(0)">
// <img id="b1" src="stuff/b1_up.gif" width="123" height="45" alt="next"></a>

function xMultiImage(aImgID) {
  this.ImgID = aImgID;
  this.Images = new Array();
  var a = xMultiImage.arguments;
  for (var i = 1; i < a.length; i++) {
    this.Images[i-1] = xImage(a[i]);
  }
}

xMultiImage.prototype.Show = function( aImageNumber ) {
  xChangeImage(this.ImgID,this.Images[aImageNumber]);
}

var xDbgMess = '';
var xDbgSep = '\n';
function xDbg( aMess ) { if (aMess) xDbgMess += aMess + xDbgSep; else alert(xDbgMess); }

// uses a <textarea id="xdbgout" style="width:100%" rows=12></textarea>

function xDbgOut(x) {
  var o = xGetElementById('xdbgout');
  if (o) o.value = x;
}

function xDbgApp(x) {
  var o = xGetElementById('xdbgout');
  if (o) o.value += x+'\n';
}

