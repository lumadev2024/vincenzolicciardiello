# Ottimizzazione del sito Licciardiello

Aggiornamento hero interne: le tre pagine studio e le quattro pagine servizio usano ora fondo bianco, titolo verde scuro, testo scuro, breadcrumb leggibile e header bianco con logo a colori. Anche il menu mobile e il ritratto sono adattati alla palette chiara. La homepage conserva la hero scura. Build, controlli statici e test delle interazioni superati dopo la modifica; verifica visiva nel browser ancora da effettuare.

Il progetto è un sito statico italiano di lead generation per un professionista locale. La conversione principale è la richiesta di visita su WhatsApp; telefono, email e indicazioni stradali sono azioni secondarie. È stata mantenuta l'identità verde scuro/arancio, senza framework o dipendenze frontend aggiuntive.

## File e contenuti

- Aggiornati: `index.html`, le tre pagine `nutrizionista-sportivo-*/index.html`, `style.css`, `main.js`, `sitemap.xml`, `robots.txt`.
- Presenti e completati: `nutrizione-sportiva/`, `composizione-corporea/`, `recupero-e-integrazione/`, `prima-visita/`, `404.html`.
- Generazione condivisa: `tools/build.js` e `tools/partials/`. Modificare testi, contatti e metadata nel generatore e poi eseguire `node tools/build.js`; i file HTML vengono rigenerati.
- Verifiche aggiunte: `tools/check.py`, `tools/check-interactions.js`.
- Asset aggiunti: ritratti WebP a 480/720/800 px, favicon PNG 32 px e icona Apple 180 px; `tools/optimize-images.py` ne permette la rigenerazione con Pillow. `assets/og-image.jpg` è la preview social 1200 × 630.
- Configurazione hosting presente: `vercel.json` e `.vercelignore`. Si applica soltanto se il sito viene ospitato su Vercel.

## UX, mobile e conversioni

Hero con proposta concreta, città e accesso WhatsApp. Trust bar basata su dati esistenti, card che conducono a pagine servizio, percorso di visita e contatti per ogni sede. Footer con indirizzi, orari, telefono, email, servizi e policy esistenti. FAQ specifiche per sede e approfondimenti collegati tra loro.

Corretti logo troppo largo, hero interna forzata a due colonne e gestione delle griglie. CTA con altezza minima di 44 px, barra mobile WhatsApp/Chiama con safe area e spazio riservato sotto il contenuto. La barra compare dopo 320 px di scroll ed è esclusa dalla navigazione da tastiera quando nascosta.

Menu mobile con stato ARIA, chiusura con Escape, gestione del focus e contenuto nascosto non raggiungibile da tastiera. Il dialog usa la semantica nativa. Focus visibile anche nei campi, errori associati al nome, messaggi di stato accessibili, fallback se WhatsApp non apre e protezione da doppio invio.

Il modulo prepara un messaggio: non prenota automaticamente e non conferma l'invio al professionista. Sono presenti istruzioni per rileggerlo prima di inviarlo, link privacy e alternativa senza JavaScript.

## SEO e performance

Title e description distinti, canonical e Open Graph coerenti, Twitter Card, breadcrumb, collegamenti interni, sitemap delle otto pagine indicizzabili e 404 con noindex. Nessuna modifica agli URL locali già presenti. Il riferimento a Caserta distingue l'indirizzo reale di San Nicola la Strada.

JSON-LD: WebSite, WebPage, Person, Dietitian/LocalBusiness delle sedi e BreadcrumbList. Nessun rating, prezzo o qualifica aggiunto senza dati. Non viene generato FAQPage.

Font locali con swap, caricamento prioritario del ritratto hero con preload responsive, immagini sotto la fold lazy, dimensioni dichiarate, srcset dei ritratti. Nessuno script analytics o widget di terze parti aggiunto. Contenuti visibili senza animazioni di ingresso; reduced motion rispettato.

| URL | Intento principale |
| --- | --- |
| `/` | Professionista, offerta e scelta del percorso |
| `/nutrizione-sportiva/` | Alimentazione per allenamento e gare |
| `/composizione-corporea/` | Obiettivi di peso e composizione corporea |
| `/recupero-e-integrazione/` | Informazioni sul supporto nutrizionale al recupero |
| `/prima-visita/` | Comprendere la visita e contattare il professionista |
| `/nutrizionista-sportivo-pozzuoli/` | Sede reale di Pozzuoli |
| `/nutrizionista-sportivo-qualiano/` | Sede reale di Qualiano |
| `/nutrizionista-sportivo-caserta/` | Sede reale di San Nicola la Strada, vicino Caserta |

Funnel: ricerca → homepage/pagina sede/servizio → comprensione → metodo e testimonianze esistenti → approfondimento → scelta sede → WhatsApp/telefono.

## Tracking

Eventi `site:conversion`: cta_click, service_view, service_click, service_cta_click, whatsapp_click, phone_click, email_click, booking_click, location_click, review_cta_click, form_start, contact_form_submit.

Payload: event, page_path, cta_location, service, location. Non contiene nome, testo libero, sport, email, numero del visitatore o URL del messaggio. Gli eventi restano locali e non vengono automaticamente inoltrati. Collegare un solo adapter GA4 oppure GTM dopo avere definito provider e gestione del consenso; evitare di inoltrare contemporaneamente tramite entrambi. contact_form_submit indica la preparazione del messaggio, non un lead acquisito; booking_click indica un clic, non una prenotazione confermata.

## Verifiche e limiti

- `node tools/build.js`: passa, otto pagine principali generate.
- `node --check main.js` e `node --check tools/build.js`: passano.
- `python tools/check.py`: passa su nove pagine inclusa la 404; link locali, ancore, metadata, JSON-LD, dimensioni/alt, WhatsApp, sitemap e robots.
- `node tools/check-interactions.js`: passa; menu, Escape/focus, validazione, encoding WhatsApp, protezione da doppio invio e assenza di dati personali negli eventi.
- Lint dedicato e typecheck: non configurati; nessun progetto TypeScript. Il controllo di sintassi non sostituisce un lint completo.
- Browser integrato non disponibile (nessun browser connesso): layout alle dieci larghezze richieste, console, contrasto effettivo, navigazione completa e CLS non verificati dal vivo. Nessun punteggio Lighthouse o valore Core Web Vitals dichiarato.
- Redirect di protocollo/host e risposta HTTP 404 richiedono verifica sul server reale. Non è stato effettuato alcun deploy.

## Dati mancanti / TODO

Nessun segnaposto inventato nel sito. Prima della pubblicazione restano da confermare: fonte e autorizzazione delle testimonianze già presenti; qualifiche/formazione/iscrizione professionale; fotografie reali delle sedi; correttezza e attualità di contatti, orari, pacchetti e condizioni già nel progetto; titolarità e attualità delle policy esterne. Mancano identificativi e configurazione consenso di un eventuale GA4/GTM.

Non sono state inventate foto delle sedi, certificazioni, stelle, recensioni o dati legali. Le informazioni operative non documentate sulla preparazione alla prima visita sono state sostituite con l'invito a chiedere indicazioni quando si concorda l'appuntamento.
