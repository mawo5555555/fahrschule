# Twingo-Bilder per KI erzeugen (Weg 3)

Die App zeigt automatisch `img/stage0.png` bis `img/stage4.png`, sobald sie im Ordner `fahrschule/img/` liegen. Fehlt ein Bild, nimmt sie das einfache 3D-Modell. Die Stufe steigt mit dem Tuning:

| Datei | Wann sichtbar |
|---|---|
| stage0.png | Serie: Stahlfelgen, keine Tönung, nicht tiefer |
| stage1.png | 1 von: Alufelgen, Tönung, tiefer, über 95 PS |
| stage2.png | 2 davon |
| stage3.png | 3 davon |
| stage4.png | alle vier: voll getunt |

## So gehst du vor (damit alle Bilder zusammenpassen)
1. **Basisbild (stage0)** mit Prompt A erzeugen, bis dir Auto, Winkel und Look gefallen.
2. **Die anderen Stufen aus stage0 ableiten:** Das Basisbild im Generator als Referenz hochladen und nur die Änderung beschreiben (Prompt B). So bleiben Winkel, Lack und Hintergrund gleich.
3. Alle als PNG, gleiche Größe (z. B. 1600 × 1000), Dateinamen wie oben, in `fahrschule/img/` legen.

## Prompt A (Basisbild, auf Englisch, die meisten Generatoren verstehen das besser)
> Renault Twingo first generation (1993–2007), front three-quarter view from the left, low camera angle, frog green metallic paint, black bumpers, round headlights, standard steel wheels with hubcaps, license plate "MILANO 1", slightly stylized semi-realistic illustration with clean edges, dark neutral studio background with soft green floor glow, high detail, centered, no text, no people, 16:10

## Prompt B (Stufen, mit stage0 als Referenzbild)
Immer: „Same car, same angle, same background, same paint. Only change: …“
- stage1: „… dark window tint“ (oder alloy wheels, je nachdem welche Änderung zuerst kommt)
- stage2: „… 5-spoke silver alloy wheels and dark window tint“
- stage3: „… alloy wheels, dark tint, lowered suspension close to the ground“
- stage4: „… black multi-spoke deep-dish alloy wheels with red lip, heavy window tint, car lowered, sport exhaust tip, subtle green underglow“

## Hinweise
- Markenname und Logo: Der Twingo ist eine Marke von Renault. Für private Nutzung unkritisch, vor einer Veröffentlichung Nutzungsbedingungen des Generators und Markenrecht prüfen.
- Kennzeichen „MILANO 1“ ist nur Dekoration.
- Wenn die Bilder fertig sind, schick mir den Ordner oder die Dateien, ich prüfe sie in der App.

---
# Unterboden und Armaturenbrett

Gleiches Prinzip: Dateien in `fahrschule/img/` ablegen, die App nimmt sie automatisch.

## Unterboden (Reiter „Unterboden“)
| Datei | Wann |
|---|---|
| under0.png | Serie-Auspuff |
| under1.png | Sport-Endschalldämpfer verbaut |
| under2.png | Fächerkrümmer oder Turbo verbaut |

**Prompt (under0):** Photorealistic view from below of a first-generation Renault Twingo (1993–2007) on a car lift in a dark workshop, slight angle, showing the standard steel exhaust with rear muffler, fuel tank, rear axle, front subframe, engine and gearbox, green body edges visible at the sides, 3:2
**under1 (aus under0 ableiten):** Same car, same angle, same workshop. Only change: polished stainless steel sport rear silencer with a large round tip.
**under2:** Same car, same angle. Only change: stainless 4-2-1 exhaust header and full sport exhaust system, subtle green LED underglow.

## Armaturenbrett (Reiter „Innenraum“)
Basis ist das gemeinfreie Foto `img/dash_real.jpg` (Wikimedia Commons). Als Referenzbild hochladen und ableiten.
| Datei | Wann |
|---|---|
| dash0.png | optional: Serie in besserer Qualität |
| dash1.png | Radio eingebaut |
| dash2.png | + Lautsprecher |
| dash3.png | + Endstufe oder Subwoofer |

**Prompt (dash0):** Same interior, same angle. Restore: crisp, clean, sunny daylight, no fog, studio-quality photo.
**dash1:** Same interior, same angle. Only change: modern Bluetooth head unit with colored display in the radio slot.
**dash2:** Same, plus illuminated speaker grilles on the dashboard and soft green ambient LED lighting.
**dash3:** Same, plus a small amplifier display visible in the center console and sport steering wheel.
