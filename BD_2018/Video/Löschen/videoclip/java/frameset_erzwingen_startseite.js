<!--
if (self != top)
{
top.location.href=self.location.href;
}
var frameset_geladen = "okay";
function laden()
{
if(self.location.search.length > 0)
{
var Search_Laenge = self.location.search.length;
var info_url = self.location.search.substring(1,Search_Laenge);
self.NAMEDESFRAMES.location.href = "startseite.html"+info_url;
}
}
//-->

