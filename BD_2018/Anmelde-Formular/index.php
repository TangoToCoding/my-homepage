<?php
// GammaGroup Kontaktscript
// All rights by Moosa (Klaus Mooser)
// Support gibts hier: (http://www.Neandertaler.net) (Moosa@web.de)
// Version 2.7.

// E-Mail Adresse des Empfängers (Im Normalfall Ihre eigene) einfach zwischen den beiden "" einfügen.
$adresse = "IhrName@IhreDomain.de";

// Soll als Absenderadresse Ihre eigene oder die des Kontaktaufnehmenden benutzt werden?
// Bei manchen Providern ist es zwingend notwendig, dass die eigene benutzt wird
// 0 = eigene 1 = Besucher
$absender = "1";

// Hier kann definiert werden, nach wievielen Zeichen ein automatischer Zeilenumbruch eingefügt werden soll,
// wenn sie $umbruch = "no" eingeben, wird kein automatischer Zeilenumbruch eingefügt.
$umbruch = "70";

//bestimmen der Hintergrundfarbe:
$bgcolor = "#F3F4F5";

//bestimmen der Textfarbe:
$textcolor = "#000000";

//bestimmen der Textfarbe der Fehler:
$fehlercolor = "#FF3300";

// Hier können Sie definieren, was über dem Kontaktformular stehen soll:
$head = "Hier Ihre Überschrift<br>Version 2.7.";

// Bei manchen Webhoster ist es notwendig, dass noch ein zusätzlicher Parameter übergeben wird, der Ihre E-Mail-Adresse
// enthält.
// Bei den meisten Hostern ist dies nicht notwendig, dann müssen Sie zwischen die beiden "" nichts einfügen
// aber z.B. bei Hosteurope ist die Angabe zwingend und dann müssen sie hier eine Ihrem Webpack zugehörige und
// eingerichtete E-Mail-Adresse eintragen, z.B. in dieser Form: $add = "info@ihre_webpack_domain.tld"

// NOCHMAL: Setzen Sie hier nur was ein, wenn Sie wissen das es notwendig ist!!!

$add = "";

// Ab hier sollten Sie nur noch etwas ändern, wenn sie wissen was sie tun,
// bzw. wenn sie noch mehr am Design ändern wollen.

//hier wird die Länge der verschiedenen Eingaben ermittelt
$lengthm = strlen($_POST["send"]["mail"]);
$lengtha = strlen($_POST["send"]["autor"]);
$lengthb = strlen($_POST["send"]["betreff"]);
$lengthn = strlen($_POST["send"]["nachricht"]);

// der Zähler wird auf null gesetzt
$i = "0";

// Je nachdem welche Adresse als Absender benutzt werden soll, wird die Variable beschrieben:
if ($absender == "0") {
	$from = $adresse ; }
else { $from = $_POST["send"]["mail"] ; }

//Nun überprüfen wir die Eingaben auf alle möglichen Fehler (Es muss überall was eingegeben werden,
// die Einträge dürfen eine bestimmte Länge nicht überschreiten und die E-Mail-Adresse muss ein @ enthalten)
// Ausserdem darf im Namensfeld kein @ Zeichen enthalten sein und in der Adresse nicht mehr als eins.
// Das ist notwendig, damit im vierten Parameter keine CC oder BCC Adressen übergeben werden können.
// Und zu guter Letzt werden die Sonderzeichen für die HTML-Ausgabe codiert und die Backslashes aus der Mail entfernt
if(isset($_POST["send"]) && is_array($_POST["send"])) {
	if(empty($_POST["send"]["autor"])) {
		$fautor = "Sie müssen einen Namen eingeben!<br>";
	} else { $fautor = "Name ok!<br>"; $i++; }
	if(empty($_POST["send"]["betreff"])) {
		$fbetreff = "Sie müssen einen Betreff eingeben!<br>";
	} else { $fbetreff = "Betreff ok!<br>"; $i++; }
	if(empty($_POST["send"]["mail"])) {
		$fmail = "Sie müssen Ihre E-Mail-Adresse eingeben!<br>";
	} else { $fmail = "Adresse ok!<br>"; $i++; }
	if(empty($_POST["send"]["nachricht"])) {
		$fnachricht = "Sie müssen eine Nachricht eingeben!<br>";
	} else { $fnachricht = "Nachricht ok!<br>"; $i++; }
	if ($lengthm > "50") {
		$flmail = "Ihre eingegebene E-Mail-Adresse ist zu lang!<br>"; $fmail = ""; }
	else { $i++; }
	if ($lengtha > "30") {
		$flautor = "Ihr eingegebener Name ist zu lang!<br>"; $fautor = ""; }
	else { $i++; }
	if ($lengthb > "150") {
		$flbetreff = "Ihr eingegebener Betreff ist zu lang!<br>"; $fbetreff = ""; }
	else { $i++; }
	if ($lengthn > "60000") {
		$flnachricht = "Ihre eingegebene Nachricht darf nicht mehr<br> als 60000 Zeichen haben! Sie hat: ".$lengthn."<br>"; $fnachricht = ""; }
	else { $i++; }
	if (!strpos($_POST["send"]["mail"], "@") == "false" or substr_count($_POST["send"]["mail"], "@") > 1) {
		$fgmail = "Ihre angegebene E-Mail Adresse ist nicht gültig!<br>"; $fmail = ""; }
	else { $i++; }
	if (substr_count($_POST["send"]["autor"], "@") >= 1) {
		$fgautor = "Aus Sicherheitsgründen darf das Namensfeld kein @ Zeichen enthalten!<br>"; $fautor = "";
	} else { $i++; }
	$str = ":\/,\"";
	if (strcspn($_POST["send"]["mail"], $str) < $lengthm) {
		$fgmail = "Ihre angegebene E-Mail Adresse ist nicht gültig!<br>"; $fmail = "" ;
	} else { $i++ ; }
	if (get_magic_quotes_gpc() == "1") {
		$_POST["send"]["autor"] = stripslashes($_POST["send"]["autor"]);
		$_POST["send"]["betreff"] = stripslashes($_POST["send"]["betreff"]);
		$_POST["send"]["mail"] = stripslashes($_POST["send"]["mail"]);
		$_POST["send"]["nachricht"] = stripslashes($_POST["send"]["nachricht"]);
	}
	$sautor = htmlspecialchars($_POST["send"]["autor"]);
	$sbetreff = htmlspecialchars($_POST["send"]["betreff"]);
	$smail = htmlspecialchars($_POST["send"]["mail"]);
	$snachricht = htmlspecialchars($_POST["send"]["nachricht"]);
}

//Wenn alles korrekt eingegeben wurde, wird die Mail nun erst formatiert und dann verschickt
if(isset($_POST["send"]) && is_array($_POST["send"])) {
	if ($i == "11") {
		$autor = $_POST["send"]["autor"];
		if ($umbruch == "no") {
			$texto = $_POST["send"]["nachricht"] ;
			}
		else { $texto = wordwrap( $_POST["send"]["nachricht"], $umbruch ); }
		$_POST["text"] = $_POST["send"]["autor"]." mit der Mail Adresse: ".$_POST["send"]["mail"]." hat ihnen folgende Nachricht gesendet: \n \n $texto";
		$fautor = "<h2>Ihre Mail wurde versendet!</h2>";
		$fbetreff = "";
		$fmail = "";
		$fnachricht = "";
// Und ab dafür... je nachdem mit oder ohne additional_parameters
		if(empty($add)) {
			$addp = "";
			if (@mail($adresse, $_POST['send']['betreff'], $_POST['text'], "From: \"$autor\" <$from>")) {
				$fautor = "<h2>Ihre Mail wurde versendet!</h2>";
				unset($sautor);
				unset($sbetreff);
				unset($smail);
				unset($snachricht);
			} else {
				$fautor = "<h2>Fehler! Mail konnte nicht gesendet werden</h2>"; }
		} else {
			if (@mail($adresse, $_POST['send']['betreff'], $_POST['text'], "From: \"$autor\" <$from>", "-f $add")) {
				$fautor = "<h2>Ihre Mail wurde versendet!</h2>";
				unset($sautor);
				unset($sbetreff);
				unset($smail);
				unset($snachricht);
			}
			else {
				$fautor = "<h2>Fehler! Mail konnte nicht gesendet werden</h2>"; }
		 }
   	}
}
// Hier kommt nun das eigentliche Formular in HTML + CSS
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
        "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<style type="text/css"><!--
body {
 font-family:Verdana,sans-serif;
 font-size:12px;
 color:<?php echo $textcolor ; ?>;
 background-color:<?php echo $bgcolor ; ?>;
 text-align:center;
}
a:link, a:visited, a:active {
  text-decoration:underline;
  font-weight:bold;
  color:#000000;
  font-size:10px;
}
a:hover {
 color:#8B0000;
}
h1 {
 font-size:18px;
 margin-top:30px;
}
h2 {
 font-size:18px;
}
.formular {
 margin:0px auto;
 width:480px;
 border:1px solid #000000;
 text-align:left;
}
.fehler {
 color:<?php echo $fehlercolor ; ?>;
 text-align:left;
}
.box {
 margin-top:10px;
}
.um {
 margin-left:105px;
}
.bez {
 float:left;
 text-align:left;
 width:9.5em;
 line-height:25px;
}
input {
 margin-top:5px;
}
.nachricht {
 clear:both;
 text-align:center;
}
.copy {
 font-size:10px;
 position:relative;top:30px;
}
//--></style>
<title></title>
<meta name='author' content='Klaus Mooser'>
<meta http-equiv='Content-Type' content='text/html; charset=ISO-8859-1'>
</head>
<body>
<h1><?php echo $head ; ?></h1>
<form class="formular" action="<?php echo $PHP_SELF;?>" method="post" target="_self">
<div class="fehler"><?php echo $fautor ; echo $fbetreff ; echo $fmail ; echo $fnachricht ; echo $flautor ; echo $flbetreff ; echo $flnachricht ; echo $flmail ; echo $fgmail ; echo $fgautor ;?></div>
<div class="box">
     <div class="um">
		<div class="bez"><label for="autor">Ihr Name:</label></div>
		<div><input name='send[autor]' type='text' id="autor" size='20' value="<?php echo $sautor ; ?>"></div>
     </div>
     <div class="um">
		<div class="bez"><label for="betreff">Betreff:</label></div>
		<div><input name='send[betreff]' type='text' id="betreff" size='20' value="<?php echo $sbetreff ; ?>"></div>
     </div>
     <div class="um">
		<div class="bez"><label for="mail">E-Mail Adresse:</label></div>
		<div><input name='send[mail]' type='text' id="mail" size='20' value="<?php echo $smail ; ?>"></div>
     </div>
</div>

<div class="nachricht">
		 <br><label for="nachricht">Ihre Nachricht:</label><br><textarea name='send[nachricht]' id="nachricht" rows='10' cols='40'><?php echo $snachricht ;?></textarea><br>
  		<input type='submit' value='Absenden'><p></p>
</div>
</form>

<div class="copy">
	&copy; by <a href='http://www.Neandertaler.net'>www.Neandertaler.net</a> 2005
	<br>
</div>
<p></p>
</body>
</html>