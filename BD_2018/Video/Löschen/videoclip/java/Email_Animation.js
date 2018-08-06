<!--
//Stuff to change!--
msg="click here<br><B>Email: Evamape@aol.com</b>";
mail="mailto:Evamape@aol.com";
speed=1;
fsze="2";

fnt="Arial";

//----------------------------------

Y=0,X=0,my=0,mx=0,angle=0,dy=0,dx=0,tmr=null;
ns=(document.layers)?1:0;
off=(document.layers)?'hide':'hidden';
on=(document.layers)?'show':'visible';
if (ns)
document.write('<layer name=n top=0 left=0><font face='+fnt+' size='+fsze+'><a href='+mail+'>'+msg+'</a></font></layer>');
else{
document.write('<div id="c" style="position:absolute"><div style="position:relative">');
document.write('<div id="i" style="position:absolute;width:200px;height:30px"><font face='+fnt+' size='+fsze+'><a href='+mail+'>'+msg+'</a></font></div>');
document.write('</div></div>');
}
if (ns){
window.captureEvents(Event.MOUSEMOVE);
function nMouse(evnt){
my=evnt.pageY+20;mx=evnt.pageX
}
}
else{
function iMouse(){
my=event.y+20;mx=event.x;
}
}
function stalk(){
if (ns) window.onMouseMove=nMouse;
else {document.onmousemove=iMouse;c.style.top=document.body.scrollTop}
var layer=(document.layers)?document.n:i.style;
Y=my-dy;X=mx-dx;
angle=Math.round(Math.atan2(Y,X)*180/Math.PI);
if (angle < 0) angle += 360;
y = Math.round(speed*Math.sin(angle*Math.PI/180));x = Math.round(speed*Math.cos(angle*Math.PI/180));
dy+=y;dx+=x;
if ((dy > my-speed*2) && (dx > mx-speed*2) && (dy < my+speed*2) && (dx < mx+speed*2))
{clearTimeout(tmr);layer.visibility=off;}
else{layer.visibility=on;layer.top=dy;layer.left=dx}
tmr=setTimeout('stalk()',10);
}
stalk();
//-->