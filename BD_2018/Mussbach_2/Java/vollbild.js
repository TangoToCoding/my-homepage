<!--
/*** Browser und Versionsnummer bestimmen ***/
var BrowserName = navigator.appName;
var BrowserVersion = navigator.appVersion;
var VersionShort = BrowserVersion.substr(0, 1);
/*** Seite in obersten Frame laden ***/
if(frames)
{
if(top.frames.length > 0)
top.location.href=self.location;
}
/*** oder Noframe-Browser automatisch weiterleiten ***/
/*** (falls eine Noframe-Alternative existiert) ***/

/*** Vollbild erzwingen ***/
window.moveTo(0, 0);
var high = screen.height;
var wide = screen.width;
if(VersionShort > 3)
{
window.moveTo(0, 0);
if(BrowserName == "Netscape")
{
window.outerHeight = high;
window.outerWidth = wide;
}
else if(BrowserName == "Microsoft Internet Explorer")
{
window.resizeTo(wide, high);
}
}
//-->