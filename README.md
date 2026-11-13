# Poss-ible

Il blog personale di Pietro: politica, tecnologia e cultura.
Sito statico in HTML e CSS, con tema chiaro/scuro. Nessun framework, nessuna build.

## Struttura

- `index.html` — home con l'elenco di saggi e note, filtrabile per sezione
- `chi-sono.html` — la pagina "Chi sono"
- `articoli/` — un file HTML per ogni saggio (`_modello.html` è il modello da copiare)
- `style.css`, `theme.js` — grafica, tema scuro, filtri, tempo di lettura

## Scrivere

**Nuovo saggio**
1. Copia `articoli/_modello.html` e rinominalo (es. `articoli/il-mio-titolo.html`).
2. Cambia data, sezione, titolo, sottotitolo e testo.
3. In `index.html` copia un blocco `<li data-kind="saggio">`, mettilo in cima e aggiorna link, data, titolo, riassunto e sezione.

**Nuova nota**
In `index.html` copia un blocco `<li data-kind="nota">`, mettilo in cima e cambia data, testo e sezione.

Sezioni possibili (`data-cat`): `politica`, `tecnologia`, `cultura`.

## Pubblicazione

Il sito è servito da GitHub Pages dal branch `main` (cartella `/`).
Ogni modifica caricata su `main` va online in un paio di minuti.
