# Dati dinamici per La Gazzetta del Fantacalcio

## 1. Installa il parser Excel

```bash
npm i xlsx
```

## 2. Dove mettere i dati

Con Vite/React, metti i file in:

```txt
public/data/
  app-data.json
  coaches.json
  ratings.json
  Rose_fanta-gang-ad-sian.xlsx
```

I file dentro `public` vengono serviti come asset statici. In questo modo puoi aggiornare JSON e XLSX senza modificare i componenti React.

## 3. Configurazione

`public/data/app-data.json` dice all'app quali file caricare:

```json
{
  "coachesFile": "coaches.json",
  "ratingsFile": "ratings.json",
  "rostersFile": "Rose_fanta-gang-ad-sian.xlsx"
}
```

Se cambi nome al file Excel, aggiorna solo `rostersFile`.

## 4. Formato atteso dell'Excel

Il parser riconosce blocchi come quelli esportati da Fantacalcio:

```txt
Nome Squadra
Ruolo | Calciatore | Squadra | Costo
P     | De Gea     | Fio     | 43
...
Crediti Residui: 48
```

Funziona anche con più squadre affiancate nello stesso foglio, come nel file caricato.

## 5. Nota importante

Un'app React nel browser non può leggere automaticamente l'elenco dei file di una cartella. Per questo serve `app-data.json` come manifesto. Se vuoi davvero leggere una cartella senza manifesto, serve una piccola API backend o uno script Node in fase di build.
