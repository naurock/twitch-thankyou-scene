# Stream Danke — Deutsche Anleitung

Stand: 14.10.2026

# Dein Stream-Abspann.

Lokale Endszene mit neuen Followern und eingegangenen Raids. In 1920 × 1080, mit wechselnden Namensseiten, sanfter Animation und einer gemeinsamen Dankesseite. Keine Subs, Bits oder Affiliate-Funktionen.

<a href="Vorschau.html" class="button">Vorschau mit Beispielnamen öffnen ↗</a>

**Was schon fertig ist:** Overlay, Animation, Ereignissammler und diese Anleitung.  
**Was du einmal einrichtest:** vier Aktionen in streamer.bot, eine Browserquelle in OBS und eine Szenentaste auf dem Stream Deck. Die Dateien konfigurieren deine Programme nicht automatisch.

## 1 · Dateien ablegen

1.  ZIP vollständig entpacken. Der Ordner `Stream-Danke` gehört in deinen Windows-Ordner **Dokumente**. Du kannst diesen mit `Win + R` → `shell:Personal` öffnen. Das funktioniert auch bei einem nach OneDrive umgeleiteten Dokumente-Ordner.
2.  Ergebnis: `Dokumente\Stream-Danke\overlay.html`. Es darf keine zusätzliche verschachtelte Ebene `Stream-Danke\Stream-Danke` geben. Alle Dateien und der Unterordner `streamerbot` bleiben zusammen.
3.  `Vorschau.html` per Doppelklick öffnen. Sie zeigt ausdrücklich markierte, erfundene Namen. Die echte `overlay.html` enthält zunächst nur den allgemeinen Dank.

Anderer Speicherort? In jeder der vier C#-Dateien die Eigenschaft `Folder` durch deinen absoluten Ordner ersetzen. Der Ordner muss beschreibbar sein.

## 2 · Twitch und OBS mit streamer.bot verbinden

In streamer.bot dein eigenes Twitch-Konto als **Broadcaster** verbinden und die OBS-Verbindung einrichten. Für Follower-Ereignisse muss die Twitch-Autorisierung funktionieren; bei fehlenden Ereignissen zuerst das Broadcaster-Konto neu verbinden. Ein Affiliate-Status ist für diesen Abspann nicht nötig.

OBS-WebSocket in OBS unter **Werkzeuge → WebSocket-Servereinstellungen** aktivieren. In streamer.bot unter **Stream Apps → OBS** dieselbe Adresse, denselben Port und dasselbe Passwort eintragen und verbinden. Wenn das bereits eingerichtet ist, die vorhandene Verbindung verwenden. Der eigene WebSocket-Server von streamer.bot wird für dieses Overlay nicht benötigt.

## 3 · Vier Aktionen anlegen

In **Actions** vier neue, aktivierte Aktionen anlegen. Jede Aktion bekommt **genau eine** Sub-Action: **Core → C# → Execute C# Code**. Den vollständigen Inhalt der jeweiligen Datei aus dem Unterordner `streamerbot` hineinkopieren, **Compile** und speichern. Bei fehlender Newtonsoft.Json-Referenz im Codefenster **Find Refs** nutzen und erneut kompilieren.

| Aktion | Code-Datei | Trigger | Wirkung |
| --- | --- | --- | --- |
| Danke · Start | [01-Start.cs.txt](streamerbot/01-Start.cs.txt) | OBS Studio → Streaming Started; Deine aktive OBS-Verbindung auswählen. | Neue, leere Sitzung starten. |
| Danke · Follower | [02-Follower.cs.txt](streamerbot/02-Follower.cs.txt) | Twitch → Channel → Follow | Neuen Follower speichern; pro Sitzung nur einmal. |
| Danke · Raid | [03-Raid.cs.txt](streamerbot/03-Raid.cs.txt) | Twitch → Raid → Raid; Min/Max leer lassen. „Always Run“ aktivieren, falls weitere Raid-Trigger mit Wertebereichen existieren. | Eingehenden Raid mit Name und Zuschauerzahl speichern. |
| Danke · Stop | [04-Stop.cs.txt](streamerbot/04-Stop.cs.txt) | OBS Studio → Streaming Stopped; Dieselbe OBS-Verbindung auswählen. | Sammlung schließen; Namen bleiben sichtbar. |

Die Bezeichnungen können je nach Version leicht abweichen. Beim Raid ist ausdrücklich der **eingehende „Raid“** gemeint. „Raid Start“ und „Raid Send“ betreffen ausgehende Raids.

**Vor jedem Stream:** streamer.bot muss laufen und mit Twitch und OBS verbunden sein, bevor du in OBS den Stream startest. Das Start-Ereignis leert die vorherige Liste. Jeder erneute tatsächliche OBS-Streamstart beginnt eine neue Sitzung – auch wenn du kurz gestoppt hast.  
  
**Bereits live beim Einrichten?** Einmal *Danke · Start* über den Trigger → *Test Trigger* ausführen. Erst danach eintreffende Ereignisse werden gesammelt. Vergangene Ereignisse werden nicht nachgeladen.

## 4 · OBS-Endszene erstellen

1.  Neue Szene mit dem Namen **Ende · Danke** anlegen.
2.  Quelle hinzufügen → **Browser** → Name **Danke-Abspann**.
3.  **Lokale Datei** aktivieren und `Dokumente\Stream-Danke\overlay.html` auswählen. Für den echten Stream keine Vorschau-Datei verwenden.
4.  Breite **1920**, Höhe **1080**, 30 FPS reichen aus. Bei einer kleineren OBS-Leinwand: Rechtsklick auf Quelle → Transformieren → An Bildschirm anpassen.
5.  **Browser aktualisieren, wenn Szene aktiv wird** aktivieren. Optional auch **Quelle herunterfahren, wenn nicht sichtbar**. Die Sammlung läuft in streamer.bot weiter, selbst wenn diese Quelle ausgeschaltet ist.

Die Szene spielt alle Follower in Gruppen von acht und alle Raids in Gruppen von drei ab. Danach erscheint ein Dank an alle Zuschauenden. Der Ablauf wiederholt sich. Leere Kategorien werden übersprungen. Neue Einträge erscheinen beim nächsten Seitenwechsel. Die Datei wird alle zwei Sekunden eingelesen. Ohne Ereignisse bleibt der allgemeine Dank. Musik ist nicht enthalten; eine eigene Audioquelle kannst du ergänzen.

## 5 · Stream-Deck-Taste „Danke“

1.  In der Stream-Deck-App eine Taste aus dem OBS-Studio-Plugin wählen: **Szene / Scene**.
2.  Deine Szenensammlung und **Ende · Danke** auswählen. Titel **DANKE** setzen.
3.  Am Streamende drücken: OBS zeigt den Abspann. Den Stream weiterlaufen lassen, bis alle Namen zu sehen waren. Erst danach den Stream beenden.

Bei aktiviertem OBS-Studiomodus gegebenenfalls noch **Preview to Program** bzw. deinen Übergang auslösen. Das Verhalten einmal in einer lokalen Probe prüfen.

Die Taste wechselt nur die Szene. Sie beendet den Stream nicht und löscht keine Namen. Der Zähler *01 / 04* unten rechts zeigt, wie viele Abspannseiten aktuell vorhanden sind. Bei 12 Sekunden pro Seite dauern vier Seiten etwa 48 Sekunden.

## 6 · Kurzer Funktionstest vor dem ersten Stream

1.  In streamer.bot den Start-Trigger per **Test Trigger** auslösen. Im Ordner erscheint `session.json`; `data.js` wird aktualisiert.
2.  Follow-Trigger und Raid-Trigger jeweils testen. Die Ereignisse müssen einen Namen (`user` oder `userName`) mitbringen; Raid zusätzlich `viewers`. Die Trigger-Tests liefern abhängig von der Version Beispielwerte. Fehlen sie, kannst du vorübergehend eine *Set Argument*-Sub-Action vor den Code setzen: `user = Testgast`, `userName = testgast`, `userId = test-001` und beim Raid `viewers = 7`. Diese Test-Sub-Actions anschließend unbedingt entfernen.
3.  In OBS zur Endszene wechseln: Name und Raid-Zahl kontrollieren. Wegwechseln, weitere Testereignisse auslösen, zurückwechseln. Auch die zwischenzeitlich gesammelten Einträge sollen sichtbar sein.
4.  Stop-Trigger testen: Ein anschließender Follow-Test darf nicht mehr aufgenommen werden. Vorhandene Namen bleiben stehen.
5.  **Testnamen entfernen:** Start-Trigger noch einmal testen, dann Stop-Trigger testen. Die Liste ist jetzt leer. Der nächste echte Streamstart öffnet die Sammlung automatisch.

## Texte und Farben ändern

`config.js` mit einem Texteditor öffnen. Dort stehen Kanalname bzw. Kopfzeile, Untertitel, Fußtext, Dauer je Seite sowie zwei Akzentfarben. Speichern und die OBS-Browserquelle aktualisieren. Das mitgelieferte Kanallogo liegt in `logo.png`. Das Layout verwendet Orange, Anthrazit und warmes Weiß. Alle Schriften sind serifenlos und nicht kursiv. Schriftarten sind lokal verfügbare Systemschriften; das Overlay lädt keine externen Schriftarten oder Skripte.

Die Optionen `accent` und `warmAccent` ändern die Akzentfarben. Der orange Hintergrundverlauf ist separat in `style.css` definiert und wird dadurch nicht automatisch angepasst.

## Wenn etwas fehlt

- **Vorschau funktioniert, echte Namen fehlen:** Start-Aktion ausführen, Twitch-Verbindung und Trigger prüfen. Im streamer.bot-Log nach `[Stream-Danke]` suchen. `session.json` zeigt, ob Ereignisse ankommen.
- **Fehler „overlay.html fehlt“:** Der Ordner ist nicht im tatsächlichen Windows-Dokumente-Ordner. Mit `shell:Personal` prüfen oder `Folder` in allen vier Aktionen anpassen.
- **Namen gespeichert, OBS bleibt leer:** Liegen `overlay.html` und die aktualisierte `data.js` wirklich im selben Ordner? Quelle einmal manuell aktualisieren.
- **Nach einem Absturz:** Der Datensatz überlebt Neustarts. War streamer.bot beim Stoppen nicht verbunden, kann die Sitzung noch als aktiv markiert sein: *Danke · Stop* testen, um das Sammeln zu beenden. *Danke · Start* löscht bewusst den bisherigen Stand.
- **Streamer.bot war offline:** Ereignisse während dieser Zeit kann dieser Sammler nicht nachträglich rekonstruieren.
- **Beschädigte session.json:** Vorhandene Datei sichern. Danach Start-Aktion ausführen, um eine neue Sitzung zu beginnen. Der Sammler ersetzt beschädigte Sitzungen bei Follow/Raid nicht stillschweigend.

## Technik und geprüfter Umfang

Softwarestand 1.1 · 01.10.2026. Dokumentationsupdate · 14.10.2026. Die Programmdateien wurden dabei nicht geändert. Jede Ausgabedatei wird atomar ersetzt; die beiden Dateien werden nacheinander und nicht als gemeinsame Transaktion geschrieben. Die C#-Aktionen schreiben Namen lokal in `session.json` und `data.js`. Sie senden keine Chatnachrichten. Dateien werden atomar ersetzt, gleichzeitige Schreibvorgänge über eine Sperre geordnet. Follower werden dedupliziert, mehrere echte Raids desselben Kanals bleiben einzelne Einträge. Die Vorschau verändert keine Sitzungsdaten.

Die begleitende Datei `PRUEFUNG.txt` beschreibt die ausgeführten Tests. Ein echter Twitch-Event und die Ausführung in deiner installierten streamer.bot-/OBS-Version müssen bei der Einrichtung geprüft werden.

## Haftungsausschluss

Software und Dokumentation werden ohne Zusicherung einer bestimmten Funktion, Verfügbarkeit, Vollständigkeit oder Eignung bereitgestellt. Änderungen an Twitch, OBS Studio, streamer.bot oder anderen Abhängigkeiten können die Funktion beeinflussen. Vor dem Live-Einsatz die Einrichtung testen und eigene Konfigurationen sichern.

Soweit gesetzlich zulässig, übernehmen Autoren und Rechteinhaber keine Haftung für Schäden, Datenverlust, Streamunterbrechungen oder entgangene Einnahmen aus der Nutzung. Zwingende gesetzliche Ansprüche und nicht abdingbare Haftung bleiben unberührt. Insbesondere werden Haftung für Vorsatz, grobe Fahrlässigkeit sowie Verletzungen von Leben, Körper oder Gesundheit nicht ausgeschlossen. Dieser allgemeine Hinweis ersetzt keine individuelle rechtliche Prüfung.

## Open-Source-Lizenz und Marken

Der eigene Projektcode und diese Dokumentation werden unter der **MIT-Lizenz (SPDX: MIT)** bereitgestellt. Sie erlaubt Nutzung, Änderung und Weitergabe, auch kommerziell, unter Beibehaltung der erforderlichen Copyright- und Lizenzhinweise. Den vollständigen, maßgeblichen englischen Lizenztext findest du in [LICENSE](LICENSE). Diese deutsche Zusammenfassung ersetzt ihn nicht.

**Das Kanallogo `logo.png` ist ausdrücklich ausgenommen.** Es darf mit diesem Originalpaket als zugehöriges Kanalasset verwendet werden; daraus folgt keine freie Lizenz zur eigenständigen Weitergabe, Bearbeitung oder Nutzung als eigenes Branding. Wer das Projekt für einen anderen Kanal verwendet, ersetzt es durch ein eigenes oder entsprechend lizenziertes Logo. Bei öffentlicher Weitergabe das persönliche Logo entfernen, sofern keine gesonderte Freigabe des Rechteinhabers vorliegt.

Fremdsoftware, Systemschriften und andere Drittbestandteile behalten ihre jeweiligen Lizenzen. Dieses Paket enthält keine Installation von OBS Studio, streamer.bot oder Stream Deck. Genannte Produktnamen und Marken gehören ihren jeweiligen Rechteinhabern. Das Projekt ist unabhängig und behauptet keine offizielle Unterstützung oder Verbindung. Weitere Hinweise: [NOTICE.txt](NOTICE.txt).

## Datenschutz und Weitergabe

Followernamen und Raidnamen werden im Stream sichtbar. `session.json` und `data.js` enthalten die lokale Sitzung; gespeichert werden auch Nutzerkennungen und bei Raids Zuschauerzahl sowie UTC-Zeitpunkt. Stop schließt die Sammlung, löscht sie aber nicht. Der nächste Start ersetzt die vorherige Sitzung. Vor Weitergabe eigene Sitzungsdaten, Zugangsdaten und persönliche Pfade entfernen; für `data.js` wieder den leeren Auslieferungsstand verwenden. Ein Neustart allein löscht die Sitzung nicht.

## Offizielle Referenzen

**Offizielle Referenzen / Official references**

[Follower-Trigger](https://docs.streamer.bot/api/triggers/twitch/channel/follow) · [Eingehender Raid](https://docs.streamer.bot/api/triggers/twitch/raid/raid) · [OBS-Streamstart](https://docs.streamer.bot/api/triggers/obs-studio/streaming-started) · [OBS-Streamstopp](https://docs.streamer.bot/api/triggers/obs-studio/streaming-stopped) · [C#-Sub-Action](https://docs.streamer.bot/api/sub-actions/core/csharp/execute-csharp-code) · [OBS-Browserquelle](https://obsproject.com/kb/browser-source) · [Elgato: OBS-Integration](https://help.elgato.com/hc/en-us/articles/360028239431--Elgato-Stream-Deck-OBS-Studio-Integration)
