<!--
showtime=20;
showct=1;
var ns=(document.layers);
var ie=(document.all);
var w3=(document.getElementById && !ie);
adCount=0;

function initShow(){
if(!ns && !ie && !w3) return;
if(ie) adDiv=eval('document.all.timedpopup.style');
else if(ns) adDiv=eval('document.layers["timedpopup"]');
else if(w3) adDiv=eval('document.getElementById("timedpopup").style');
randAd=Math.ceil(Math.random()*showct);
if (ie||w3)
adDiv.visibility="visible";
else
adDiv.visibility ="show";
if(randAd==1) showShow();
}

function showShow(){
if(adCount<showtime*10){adCount+=1;
if (ie){documentWidth =document.body.offsetWidth/2+document.body.scrollLeft+80;
documentHeight =document.body.offsetHeight/2+document.body.scrollTop-20;}
else if (ns){documentWidth=window.innerWidth/2+window.pageXOffset-20;
documentHeight=window.innerHeight/2+window.pageYOffset-20;}
else if (w3){documentWidth=self.innerWidth/2+window.pageXOffset-20;
documentHeight=self.innerHeight/2+window.pageYOffset-20;}
adDiv.left=documentWidth-200;adDiv.top =documentHeight-200;

setTimeout("showShow()",100);}else endShow();
}

function endShow(){
if (ie||w3)
adDiv.display="none";
else
adDiv.visibility ="hide";
}

onload=initShow;
//End-->
