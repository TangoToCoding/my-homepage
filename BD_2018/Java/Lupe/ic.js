// Copyright Januar 2005, Walter Bislin, walter.bislins.ch
// class CImgCache --------------------------------------------------------------------------------------

var IC = new CImgCache();

// State Constants
var ICLoadPending = 0;
var ICLoading = 1;
var ICLoaded = 2;
var ICError = 3;
var ICAbort = 4;

function CImgCache() {
  // public
  this.CheckLoadInterval  = 100; // ms
  this.MaxNLoading = 1;
  this.MaxNPrioLoading = 1;
  this.LoadDelay = 0;  // for debugging
  this.EnableStatusDisplay = true;
  // public read only
  this.NImages = 0;
  this.NLoading = 0;
  this.NUnloaded = 0;
  this.NError = 0;
  this.NAbort = 0;
  this.NLoaded = 0;
  this.Images = new Array();
  // private
  this.ErrorMsg = '';
  this.OnAllLoaded = new xCallbackChain();
  this.OnImgLoaded = new xCallbackChain();
  this.OnLoadCalling = false;
  this.LoadNextCalling = false;
  this.PrioList = new Array();
  this.Timer = null;
  var me = this;
  this.OnCheckLoaded = function() { me.CheckLoaded(); }
}

CImgCache.prototype.AddOnAllLoaded = function(aFunc) { this.OnAllLoaded.Add(aFunc); }
CImgCache.prototype.AddOnImgLoaded = function(aFunc) { this.OnImgLoaded.Add(aFunc); }

CImgCache.prototype.IsValid = function(aImageID) {
  return ((aImageID >= 0) && (aImageID < this.NImages));
}

CImgCache.prototype.PreloadImages = function( aUrls, aRoot )
{
  if (!xDef(aRoot)) aRoot = '';
  for (i = 0; i < aUrls.length; i++) {
    if (aUrls[i]) this.PreloadImage( aRoot+aUrls[i] );
  }
}

CImgCache.prototype.PreloadImage = function( aUrl, aOnLoadFunc )
// returns an ImageID.
{
  var id = this.FindImage(aUrl);
  if (id >= 0) {
    var img = this.Images[id];
    if (!xDef(aOnLoadFunc)) aOnLoadFunc = this.Images[id].OnLoadFunc;
    if (img.CacheState == ICError || img.CacheState == ICAbort) {
      this.ReloadImage( id, aOnLoadFunc );
    } else {
      this.Images[id].OnLoadFunc = aOnLoadFunc;
    }
  } else {
    if (!xDef(aOnLoadFunc)) aOnLoadFunc = null;
    id = this.AddImage( aUrl, aOnLoadFunc );
  }
  this.LoadNext();
  return id;
}

CImgCache.prototype.LoadImage = function( aUrl, aOnLoadFunc )
// load an image with higher priority
// returns an ImageID.
{
  var id = this.FindImage(aUrl);
  if (id >= 0) {
    var img = this.Images[id];
    if (!xDef(aOnLoadFunc)) aOnLoadFunc = this.Images[id].OnLoadFunc;
    if (img.CacheState == ICError || img.CacheState == ICAbort) {
      this.ReloadImage( id, aOnLoadFunc );
    } else {
      this.Images[id].OnLoadFunc = aOnLoadFunc;
    }
  } else {
    if (!xDef(aOnLoadFunc)) aOnLoadFunc = null;
    id = this.AddImage( aUrl, aOnLoadFunc );
  }
  if (this.Images[id].CacheState == ICLoadPending && !this.InPrioList(id))
    this.PrioList[this.PrioList.length] = id;
  this.LoadNext();
  return id;
}

CImgCache.prototype.ReloadImage = function( aImgID, aOnLoadFunc )
{
  var img = this.Images[aImgID];
  img.OnLoadFunc = aOnLoadFunc;
  if (img.CacheState != ICLoadPending) {
    img.CacheState = ICLoadPending;
    this.NUnloaded++;
    this.DisplayStatus();
  }
}

CImgCache.prototype.FindImage = function( aUrl ) {
  for (var i = 0; i < this.NImages; i++) {
    if (this.Images[i].CacheUrl == aUrl) return i;
  }
  return -1;
}

CImgCache.prototype.Image = function(aImageID) {
  return this.Images[aImageID];
}

CImgCache.prototype.ImageByUrl = function(aUrl) {
  var imgID = this.FindImage(aUrl);
  return (imgID >= 0) ? this.Image(imgID) : null;
}

CImgCache.prototype.GetNUnloaded = function() {
  this.CheckLoaded();
  return this.NUnloaded;
}

CImgCache.prototype.IsLoaded = function(aImageID) {
  return (this.IsValid(aImageID) && (this.Images[aImageID].CacheState == ICLoaded));
}

CImgCache.prototype.IsLoadedByUrl = function(aUrl) {
  // Sucht das Bild aUrl im Cache und testet, ob es ganz geladen ist.
  var imgID = this.FindImage(aUrl);
  if (imgID >= 0) return this.IsLoaded(imgID);
  return false;
}

CImgCache.prototype.ImageState = function(aImageID) {
  return (this.Images[aImageID].CacheState);
}

CImgCache.prototype.ImageStateByUrl = function(aUrl) {
  var imgID = this.FindImage(aUrl);
  if (imgID >= 0) return this.ImageState(imgID);
  return -1;
}

CImgCache.prototype.ImageUrl = function(aImageID) {
  return this.Image(aImageID).CacheUrl;
}

// private:

CImgCache.prototype.DisplayStatus = function()
{
  var s = '';
  if (this.NUnloaded > 0 || this.NError > 0 || this.NAbort > 0) {
    s += 'Bilder zu laden: noch ' + this.NUnloaded + ' von ' + this.NImages + '. ';
    if (this.NError > 0 || this.NAbort > 0) {
      s += '(Geladen: ' + this.NLoaded + '; ';
      s += 'Fehler: ' + this.NError + '; ';
      s += 'Abbruch: ' + this.NAbort + ')';
    }
    // s += this.ErrorMsg;
  }
  if (this.EnableStatusDisplay) window.status = s;
}

CImgCache.prototype.AddImage = function( aUrl, aOnLoadFunc )
{
  var id = this.NImages;
  var img = new Image();
  img.CacheUrl = aUrl;
  img.CacheState = ICLoadPending;
  img.OnLoadFunc = aOnLoadFunc;
  img.WasLoaded = false;
  img.WasError = false;
  img.WasAbort = false;
  img.onload = function() { this.WasLoaded = true; }
  img.onerror = function() { this.WasError = true; }
  img.onabort = function() { this.WasAbrort = true; }
  this.Images[id] = img;
  this.NUnloaded++;
  this.NImages++;
  this.DisplayStatus();
  return id;
}

CImgCache.prototype.InPrioList = function( aImageID ) {
  for (var i = 0; i < this.PrioList.length; i++) {
    if (this.PrioList[i] == aImageID) return true;
  }
  return false;
}

CImgCache.prototype.LoadNext = function()
{
  if (this.NUnloaded == 0 || this.LoadNextCalling) return;
  this.LoadNextCalling = true;
  while ((this.NUnloaded > 0) && (this.PrioList.length > 0) && (this.NLoading < this.MaxNPrioLoading)) {
    var id = this.PrioList.shift();
    this.StartLoading(id);
  }
  while ((this.NUnloaded > 0) && (this.NLoading < this.MaxNLoading)) {
    var id = this.FindLoadPending();
    this.StartLoading(id);
  }
  this.LoadNextCalling = false;
}

CImgCache.prototype.FindLoadPending = function(){
  for (var id = 0; id < this.Images.length; id++) {
    if (this.Images[id].CacheState == ICLoadPending) return id;
  }
  return -1;
}

CImgCache.prototype.StartLoading = function( aImageID ) {
  if (this.Timer) {
    clearTimeout( this.Timer );
    this.Timer = null;
  }
  var img = this.Images[aImageID];
  if (img.CacheState == ICLoadPending || img.CacheState == ICAbort) {
    this.NLoading++;
    this.DisplayStatus();
    img.CacheState = ICLoading;
    if (this.LoadDelay > 0) {
      setTimeout( function(){ img.src = img.CacheUrl; }, this.LoadDelay );
    } else {
      img.src = img.CacheUrl;
    }
  }
  // only start timer if not loading completed in statement obove!!!
  if (this.NLoading > 0 && this.Timer == null) {
    this.Timer = setTimeout( this.OnCheckLoaded, this.CheckLoadInterval );
  }
}

CImgCache.prototype.CheckLoaded = function()
{
  if (this.Timer) {
    clearTimeout( this.Timer );
    this.Timer = null;
  }
  for (var id = 0; id < this.NImages; id++) {
    var img = this.Images[id];
    if (img.CacheState == ICLoading) {
      if (img.complete || img.WasLoaded) {
        this.OnLoad( id ); // may call LoadNext and set the timer!!!
      }
      if (img.WasError) {
        this.OnError( id );
      }
      if (img.WasAbort) {
        this.OnAbort( id );
      }
    }
  }
  if (this.NLoading > 0 && this.Timer == null) {
    this.Timer = setTimeout( this.OnCheckLoaded, this.CheckLoadInterval );
  }
}

CImgCache.prototype.OnImage = function( aImageID )
{
  this.NLoading--;
  this.NUnloaded--;
  this.DisplayStatus();
  this.OnImgLoaded.Call( aImageID );
  if (this.NUnloaded == 0) {
    this.OnAllLoaded.Call();
  } else {
    this.LoadNext();
  }
}

CImgCache.prototype.OnLoad = function( aImageID )
{
  if (this.Images[aImageID].CacheState != ICLoading) return;
  this.NLoaded++;
  this.DisplayStatus();
  this.Images[aImageID].CacheState = ICLoaded;
  this.CallLoadedFunc( aImageID );
  this.OnImage( aImageID );
}

CImgCache.prototype.OnError = function( aImageID )
{
  if (this.Images[aImageID].CacheState != ICLoading) return;
  this.NError++;
  this.ErrorMsg += ' Error loading ' + this.Images[aImageID].src;
  this.DisplayStatus();
  this.Images[aImageID].CacheState = ICError;
  this.OnImage( aImageID );
}

CImgCache.prototype.OnAbort = function( aImageID )
{
  if (this.Images[aImageID].CacheState != ICLoading) return;
  this.NAbort++;
  this.DisplayStatus();
  this.Images[aImageID].CacheState = ICAbort;
  this.OnImage( aImageID );
}

CImgCache.prototype.CallLoadedFunc = function( aImageID ) {
  // prevents recursion!
  var img = this.Images[aImageID];
  if (!this.OnLoadCalling && img.OnLoadFunc) {
    this.OnLoadCalling = true;
    img.OnLoadFunc( aImageID );
    this.OnLoadCalling = false;
  }
}

