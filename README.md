# Fahrschule 2.0

Web-App (PWA) zum Lernen der Führerschein-Theorie, Klasse B. Zielgruppe: Fahrschüler mit Praxis, aber wenig Lust auf Theorie. Das Lernen wird zum Tuning eines Renault Twingo I.

## Funktionen
- 503 eigene Übungsfragen (keine amtlichen): Vorfahrt-Szenarien mit Animation, Verkehrszeichen, Bremsweg-Zahlen, Warnleuchten, Gefahren-Szenarien, Technik, Recht
- Lernlogik nach Lernforschung: Abruf mit sofortigem Feedback, verteiltes Wiederholen (1/3/7/16 Tage), Fehler-Garage, Sicher/Unsicher/Geraten-Abfrage, Prüfungs-Prognose
- Tagesmissionen, Rang, Streak, Prüfungssimulation (30 Fragen, max. 10 Fehlerpunkte)
- Garage: Teile kaufen, Auto, Unterboden und Innenraum ändern sich mit dem Tuning
- Werkstatt-Aufträge (Reifenwechsel, Kupplung, Motor ausbauen) als Reihenfolge-Aufgaben
- Bremsweg-Labor, Fahrstunden-Tagebuch, Hörmodus, Bericht für den Fahrlehrer
- Offline nutzbar, Daten nur lokal auf dem Gerät (kein Konto, kein Server)

Details zur Recherche: [LERNKONZEPT.md](LERNKONZEPT.md). Bildanleitung: [BILDER-ANLEITUNG.md](BILDER-ANLEITUNG.md).

## Starten
```bash
python3 -m http.server 8791
```
Dann http://localhost:8791 öffnen. Auf dem Handy als App zum Homescreen hinzufügen.

## Hinweise
- Die Fragen sind eigene Übungsfragen und ersetzen nicht die Vorbereitung in der Fahrschule. Der amtliche Fragenkatalog ist urheberrechtlich geschützt und nicht enthalten. Über „Profil → Eigene Fragen importieren“ lassen sich eigene Fragen laden (bleiben lokal).
- Die Fahrzeug-, Unterboden- und Armaturenbrett-Bilder wurden per KI erzeugt (siehe Bildanleitung). Renault und Twingo sind Marken der Renault Group; das Projekt steht in keiner Verbindung zu Renault.
- `img/dash_real.jpg`: „Renault twingo interior“, Wikimedia Commons, gemeinfrei.
- `vendor/three.min.js`: three.js r128, MIT-Lizenz (Copyright Three.js Authors).
