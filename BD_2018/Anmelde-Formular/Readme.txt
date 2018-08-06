// Dies ist die Version 2.7 nicht die Version 0.5, es wäre aber zu kompliziert gewesen bei allen Downloadseiten die Angaben zu ändern. Deshalb habe ich die neue Zip Datei genauso benannt wie die Alte.

GammaGroup Kontaktscript Version 2.7 --- www.Neandertaler.net

!!!----
Um das GammaGroup Kontaktscript verwenden zu können muss ein SMTP-Server aktiv sein. Wenn Sie nicht wissen ob dies der Fall ist, laden sie das Script einfach einmal hoch und testen Sie es.
!!!----


Installation--------

1. Zip Datei entpacken
2. Die Datei index.php öffnen und anpassen (sollte genügend kommentiert sein)
3. Datei auf den Server hochladen
4. um das Script zu benutzen muss die Datei index.php aufgerufen werden.

!!!-----Wichtig:

Die Copyright Hinweise dürfen nicht entfernt werden.

Das Script darf beliebig verändert werden, solange die Copyright Hinweise unten bestehen UND sichtbar bleiben.

Das Script darf nicht ohne Einwilligung des Autors zum Download angeboten werden.

Das Script wurde geschrieben von Klaus Mooser. Bei Fragen, Fehlern oder Anregungen könnt ihr
mich ganz einfach per mail Moosa@web.de oder www.Neandertaler.net kontaktieren.

Ich freue mich über jedes Feedback und jeden Verbesserungsvorschlag.

Ich übernehme KEINE Haftung für Fehler irgendwelcher Art. Das Nutzen geschieht auf eigene Verantwortung.

Vielen Dank an tk aus dem Hosteurope-Forum für die vielen Verbesserungsvorschläge und die Kritik. Manchmal ist die Wahrheit zwar nicht das was man hören möchte, aber ohne ihn hätte ich mir wahrscheinlich nicht die Mühe gemacht auch die vielen Kleinigkeiten zu ändern :-)

Klaus Mooser
Moosa@web.de
http://www.Neandertaler.net

Neu in der Version 2.7:
- nach dem erfolgreichen Abschicken der Nachricht, werden die Textfelder geleert.

Neu in der Version 2.6:
- Ab sofort gibt es parallel zwei Versionen, eine mit HTML-Grundgerüst und eine ohne. Die Version ohne kann man dann bequem in bestehende Seiten einbauen.
- Der Dateiname kann nun problemlos geändert werden, da das Script sich selber per PHP_SELF aufruft.
- Es kann optional ein fünfter Parameter in der Mail-Funktion verwendet werden, dies ist z.B. für Hosteurope-Kunden nützlich.

Neu in der Version 2.5:
- Falls nötig, kann ein additional parameter angegeben werden
- HTML-Sonderzeichen werden durch ihre Entitäten (&lt;,&gt; etc.) ersetzt
- Einfache Anführungszeichen können nun benutzt werden
- wenn magic_quotes sind, werden die Backslashes wieder entfernt

Neu in der Version 2.1:
- Durch entsprechende Angaben im Namens- und Autorenfeld hätten (in begrenztem Umfang) (B)CC-Mails verschickt werden können. Diese Sicherheitslücke wird durch Kontrolle der @-Zeichen geschlossen.

Neu  in der Version 2.0:
- das Script wurde komplett neu geschrieben
- das Script besteht nur noch aus EINER einzigen Datei
- das Script ist HTML 4.01 strict und CSS valide
- es kann eingestellt werden, wer als Absender eingetragen werden soll
- die Zeilenumbrüche können flexibel eingestellt werden
- Bei Fehlern wird das Script wieder angezeigt, ohne das die Daten verloren gehen
- register_long_arrays kann auf off gestellt sein
- keine Verwendung von short_open_tags mehr

Neu in der Version 1.0:
- register_globals kann auf off gestellt sein

Neu in der Version 0.8.2:
- Banner entfernt
- Weniger ist mehr (ein paar Tabellen rausgenommen)
- Copyright Hinweise verkleinert


Neu in der Version 0.8.1:
- Neues Design
- Die E-Mail Adresse die der Besucher eingibt wird als Absender benutzt.
- E-Mail Adresse wird auf Gültigkeit überprüft
- Es müssen alle Felder ausgefüllt werden.
