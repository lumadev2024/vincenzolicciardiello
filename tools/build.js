/* Generatore del sito statico. Uso:  node tools/build.js
   Scrive: index.html, le pagine locali, le pagine servizio, 404.html, sitemap.xml, robots.txt.
   Dati reali del professionista: vedi le costanti qui sotto (unico punto da modificare). */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SPRITE = fs.readFileSync(path.join(__dirname, 'partials/sprite.html'), 'utf8').trim();
const DIALOG = fs.readFileSync(path.join(__dirname, 'partials/dialog-analisi.html'), 'utf8').trim();

// ---------- dati ----------
const SITE = 'https://www.dottlicciardiello.it';
const NAME = 'Dott. Vincenzo Licciardiello';
const PHONE = '+39 342 510 5288';
const TEL = '+393425105288';
const MAIL = 'info@dottlicciardiello.com';
const VAT = '10212771215';
const SOCIAL = {
  instagram: 'https://www.instagram.com/nutridoc.licciardiello',
  facebook: 'https://www.facebook.com/share/17cFGZrRC6/',
  tiktok: 'https://www.tiktok.com/@il.nutridoc',
  youtube: 'https://youtube.com/@il.nutridoc',
};
const PRIVACY = 'https://www.iubenda.com/privacy-policy/10830089';
const COOKIE = 'https://www.iubenda.com/privacy-policy/10830089/cookie-policy';

const STUDIOS = {
  pozzuoli: { name: 'Pozzuoli', place: 'Pozzuoli', street: 'Via Campana 266', zip: '80078', region: 'NA', slug: 'nutrizionista-sportivo-pozzuoli', hours: [['Mercoledì', '9:00 - 13:00'], ['Venerdì', '14:00 - 20:00']], spec: [['Wednesday', '09:00', '13:00'], ['Friday', '14:00', '20:00']] },
  qualiano: { name: 'Qualiano', place: 'Qualiano', street: 'Via Canonico Migliaccio 18', zip: '80019', region: 'NA', slug: 'nutrizionista-sportivo-qualiano', hours: [['Martedì', '9:00 - 20:00'], ['Mercoledì', '14:00 - 20:00'], ['Sabato', '9:00 - 13:00']], spec: [['Tuesday', '09:00', '20:00'], ['Wednesday', '14:00', '20:00'], ['Saturday', '09:00', '13:00']] },
  caserta: { name: 'San Nicola la Strada (Caserta)', place: 'Caserta', loc: 'San Nicola la Strada', street: 'Via Eugenio Montale 13', zip: '81020', region: 'CE', slug: 'nutrizionista-sportivo-caserta', hours: [['Orari', 'su appuntamento']], spec: [] },
};
const mapsUrl = (s) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.street} ${s.loc || s.name} ${s.zip}`)}`;
const wa = (t) => `https://wa.me/${TEL.replace('+', '')}?text=${encodeURIComponent(t)}`;
const WA_GEN = wa('Buongiorno Dott. Licciardiello, ho visitato il suo sito e vorrei maggiori informazioni sul percorso di nutrizione sportiva e prenotare una visita.');
const ic = (n) => `<svg class="ic" aria-hidden="true"><use href="#${n}"/></svg>`;
const attr = (o) => Object.entries(o).filter(([, v]) => v).map(([k, v]) => ` data-${k}="${v}"`).join('');

// ---------- servizi (pagine SEO) ----------
const SERVICES = {
  'nutrizione-sportiva': {
    short: 'Nutrizione sportiva', card: 'Performance e gara',
    title: 'Nutrizione sportiva per atleti e sportivi | Dott. Licciardiello',
    desc: 'Piani di nutrizione sportiva su misura, costruiti su carichi di allenamento, gare e obiettivi. Visite a Pozzuoli, Qualiano e Caserta. Prenota su WhatsApp.',
    h1: 'Nutrizione sportiva <mark>su misura</mark>',
    lead: 'Un piano alimentare costruito sul tuo sport, sul calendario di allenamenti e gare e sui tuoi obiettivi. Si parte da una visita completa.',
    cardText: 'Alimentazione periodizzata sui carichi di lavoro, con strategie per gare, trasferte e fasi intense della stagione.',
    wa: 'Buongiorno, vorrei informazioni sulla nutrizione sportiva e capire come prenotare una prima visita.',
    body: `<h2 class="h2s">Cos'è la nutrizione sportiva</h2>
<p>È l'adattamento dell'alimentazione a ciò che fai davvero: quanto ti alleni, con quale intensità, in quale fase della stagione. Quello che mangi deve seguire il tuo carico di lavoro, non il contrario.</p>
<h3>Per chi è pensata</h3>
<ul><li>Atleti agonisti e amatori</li><li>Sportivi di squadra e di discipline individuali</li><li>Chi si allena con costanza e vuole migliorare energia, recupero o composizione corporea</li></ul>
<h3>Come costruisco il piano</h3>
<ul><li>Ascolto: sport, ruolo, calendario gare, abitudini alimentari e obiettivi</li><li>Valutazione della composizione corporea con plicometria e impedenziometria</li><li>Piano alimentare periodizzato sui tuoi carichi di allenamento</li><li>Controlli periodici per aggiustare il piano nel corso della stagione</li></ul>
<h3>Gare, trasferte e fasi intense</h3>
<p>Nei percorsi <a href="../#pacchetti">Silver e Gold</a> è previsto il supporto per gare, test e periodi intensi, con strategie dedicate alle trasferte. Il piano resta flessibile: si adatta al calendario, non lo ignora.</p>`,
    faq: [
      ['Devo essere un atleta agonista?', 'No. Il percorso è pensato per chi si allena con costanza, a ogni livello: dall\'amatore all\'agonista. Conta avere un obiettivo concreto legato a allenamento, forma fisica o performance.'],
      ['Il piano cambia durante la stagione?', 'Sì. Il piano è periodizzato e viene aggiornato durante i controlli, in base ai carichi di allenamento e al calendario gare.'],
      ['Come comincio?', 'Scrivimi su WhatsApp: ti indico le disponibilità degli studi e fissiamo la prima visita.'],
    ],
    related: ['composizione-corporea', 'recupero-e-integrazione', 'prima-visita'],
  },
  'composizione-corporea': {
    short: 'Composizione corporea', card: 'Composizione corporea',
    title: 'Dimagrimento e composizione corporea | Dott. Licciardiello',
    desc: 'Ridurre la massa grassa o costruire massa magra in modo sostenibile, senza sacrificare energia e prestazione. Visite a Pozzuoli, Qualiano e Caserta.',
    h1: 'Dimagrimento e <mark>composizione corporea</mark>',
    lead: 'Ridurre la massa grassa o costruire massa magra in modo sostenibile, senza sacrificare energia e prestazione.',
    cardText: 'Ridurre massa grassa o costruire massa magra in modo sostenibile, senza sacrificare energia e prestazione.',
    wa: 'Buongiorno, vorrei informazioni su un percorso per migliorare la composizione corporea e prenotare una visita.',
    body: `<h2 class="h2s">Non conta solo il peso sulla bilancia</h2>
<p>Durante la visita, plicometria e impedenziometria permettono di osservare come è composto il corpo. Così gli obiettivi sono realistici e si possono verificare nel tempo, non solo con il numero sulla bilancia.</p>
<h3>Niente soluzioni drastiche</h3>
<p>Il percorso è sostenibile e integrato con l'allenamento. L'obiettivo è costruire abitudini che puoi mantenere, evitando stravolgimenti inutili che penalizzano energia e recupero.</p>
<h3>Un esempio concreto</h3>
<p>Nel caso di Matteo, pallavolista dopo un infortunio alla spalla, la prima fase è stata una dieta ipocalorica moderata con periodizzazione settimanale dei carboidrati, per ridurre peso e massa grassa senza compromettere la prestazione in gara. <a href="../#caso-studio">Leggi il caso studio</a>.</p>
<p class="note">Risultati individuali, non garantiti: dipendono dalla persona e dal suo punto di partenza.</p>`,
    faq: [
      ['Posso dimagrire senza perdere forza?', 'È l\'obiettivo del percorso: ridurre la massa grassa mantenendo il più possibile energia e prestazione, con un piano calibrato sugli allenamenti. Gli esiti sono individuali.'],
      ['Ogni quanto ci sono i controlli?', 'Dipende dal percorso scelto: nel Bronzo circa uno ogni 3 settimane; Silver e Gold prevedono più controlli (5 e 11).'],
      ['Serve una visita iniziale?', 'Sì, si parte sempre da una visita nutrizionale completa, con valutazione della composizione corporea.'],
    ],
    related: ['nutrizione-sportiva', 'recupero-e-integrazione', 'prima-visita'],
  },
  'recupero-e-integrazione': {
    short: 'Recupero e integrazione', card: 'Recupero e integrazione',
    title: 'Recupero e integrazione sportiva | Dott. Licciardiello',
    desc: 'Alimentazione e integrazione mirata a sostegno di forza, recupero e continuità degli allenamenti. Visite a Pozzuoli, Qualiano e Caserta.',
    h1: 'Recupero e <mark>integrazione sportiva</mark>',
    lead: 'Alimentazione e integrazione mirata a sostegno di forza, recupero e continuità degli allenamenti.',
    cardText: 'Reintegro post-allenamento e integrazione mirata a sostegno di forza, recupero e continuità degli allenamenti.',
    wa: 'Buongiorno, vorrei informazioni su recupero e integrazione sportiva e prenotare una visita.',
    body: `<h2 class="h2s">Recuperare meglio per allenarsi con continuità</h2>
<p>Dopo l'allenamento, il reintegro di una quota controllata di carboidrati sostiene il glicogeno muscolare. È uno dei punti che si definiscono nel piano, in base a sport, carichi e obiettivi.</p>
<h3>Integrazione: solo quando ha senso</h3>
<p>L'integrazione si valuta caso per caso, in rapporto a obiettivi, alimentazione e disciplina. Nel caso di Matteo, ad esempio, creatina e beta-alanina sono state usate a supporto di forza, capacità tampone e recupero neuromuscolare.</p>
<h3>Dopo uno stop o un infortunio</h3>
<p>Un lungo periodo di inattività può cambiare peso, ritmo e fiducia. Il piano accompagna il ritorno graduale, in sinergia con chi segue la tua preparazione.</p>
<p class="note">Dolori o fastidi che persistono vanno sempre valutati da un medico: l'alimentazione è un supporto, non una terapia.</p>`,
    faq: [
      ['Servono sempre gli integratori?', 'No. Si valutano caso per caso e solo quando hanno senso rispetto a obiettivi, alimentazione e sport.'],
      ['Posso chiedere informazioni prima di prenotare?', 'Certo: scrivimi su WhatsApp e ti rispondo con le indicazioni per iniziare.'],
    ],
    related: ['nutrizione-sportiva', 'composizione-corporea', 'prima-visita'],
  },
  'prima-visita': {
    short: 'Prima visita', card: 'La prima visita',
    title: 'Prima visita nutrizionale: come funziona | Dott. Licciardiello',
    desc: 'Come si svolge la prima visita di nutrizione sportiva: colloquio, plicometria, impedenziometria e piano alimentare personalizzato. Pozzuoli, Qualiano, Caserta.',
    h1: 'La prima visita <mark>nutrizionale</mark>',
    lead: 'Una visita completa per capire da dove parti: abitudini, allenamento, composizione corporea e obiettivi.',
    cardText: 'Colloquio, plicometria, impedenziometria e piano personalizzato: come funziona la visita di partenza.',
    wa: 'Buongiorno, vorrei prenotare una prima visita nutrizionale. Quali sono le disponibilità?',
    body: `<h2 class="h2s">Cosa succede durante la visita</h2>
<ol class="steps-list"><li><b>Ti ascolto.</b> Sport, ruolo, calendario gare, abitudini alimentari e obiettivi.</li><li><b>Analizzo il tuo corpo.</b> Plicometria e impedenziometria per fotografare il punto di partenza.</li><li><b>Creo il tuo piano.</b> Un piano alimentare personalizzato, calibrato sul tuo carico di lavoro.</li><li><b>Ti seguo nel tempo.</b> Controlli periodici, secondo il percorso scelto.</li></ol>
<h3>Prima dell'appuntamento</h3>
<p>Per sapere come prepararti alla visita, chiedi indicazioni quando concordi l'appuntamento. Puoi raccontare il tuo sport e il tuo obiettivo durante il colloquio.</p>
<h3>Dove ricevo</h3>
<ul><li><a href="../nutrizionista-sportivo-pozzuoli/">Studio di Pozzuoli</a>, Via Campana 266</li><li><a href="../nutrizionista-sportivo-qualiano/">Studio di Qualiano</a>, Via Canonico Migliaccio 18</li><li><a href="../nutrizionista-sportivo-caserta/">Studio di San Nicola la Strada (Caserta)</a>, Via Eugenio Montale 13, su appuntamento</li></ul>
<h3>Come prenotare</h3>
<p>Scrivimi su WhatsApp o chiama il ${PHONE}: ti indico le disponibilità dello studio più comodo per te.</p>`,
    faq: [
      ['Dove si svolge la visita?', 'In uno dei tre studi: Pozzuoli, Qualiano o San Nicola la Strada (Caserta). Puoi scegliere quello più comodo.'],
      ['Posso prenotare su WhatsApp?', `Sì, scrivendo al ${PHONE}. Puoi anche chiamare lo stesso numero.`],
      ['Dopo la prima visita cosa succede?', 'Ricevi il piano alimentare personalizzato e, in base al percorso scelto, i controlli periodici per aggiustarlo.'],
    ],
    related: ['nutrizione-sportiva', 'composizione-corporea', 'recupero-e-integrazione'],
  },
};
const serviceUrl = (k) => `${SITE}/${k}/`;

// ---------- FAQ home ----------
const FAQ = [
  ['Cosa fa un nutrizionista sportivo?', 'Costruisce un piano alimentare sul tuo sport, sui tuoi carichi di allenamento, sul calendario gare e sui tuoi obiettivi: energia, recupero e composizione corporea. Non una dieta generica, ma una strategia che segue quello che fai davvero.'],
  ['Come si svolge la prima visita?', 'La prima visita è completa: raccolta di storia, abitudini e obiettivi, valutazione della composizione corporea con plicometria e impedenziometria, e costruzione del piano alimentare personalizzato. <a href="prima-visita/">Scopri come funziona</a>.'],
  ['Devo essere un atleta professionista per rivolgermi a te?', 'No. Il percorso è pensato per chi si allena con costanza, a ogni livello: dal praticante amatoriale all\'agonista.'],
  ['Dove ricevi i pazienti?', 'Ho tre studi: Pozzuoli (Via Campana 266), Qualiano (Via Canonico Migliaccio 18) e San Nicola la Strada, vicino Caserta (Via Eugenio Montale 13, su appuntamento).'],
  ['Come prenoto una visita?', `Scrivimi su WhatsApp al ${PHONE} o usa il modulo in pagina: ti rispondo con le disponibilità dello studio più comodo per te.`],
  ['Quanto costa un percorso?', 'Dipende dal pacchetto scelto (Bronzo, Silver o Gold) e dal numero di controlli previsti. Per costi e disponibilità scrivimi su WhatsApp: ti rispondo con tutti i dettagli.'],
  ['Il pacchetto ha una scadenza?', 'Sì: se resti inattivo per più di 6 mesi, il pacchetto non è più valido.'],
  ['I risultati sono garantiti?', 'No. I risultati sono individuali e dipendono dalla persona e dal suo punto di partenza. Il mio impegno è costruire un percorso sostenibile e seguirti nel tempo.'],
];
const faqHtml = (items, rv = true) => items.map(([q, a]) => `<details${rv ? ' class="rv"' : ''}><summary>${q}</summary><div><p>${a}</p></div></details>`).join('\n        ');

// ---------- JSON-LD ----------
const personLd = { '@type': 'Person', '@id': SITE + '/#vincenzo', name: 'Vincenzo Licciardiello', honorificPrefix: 'Dott.', jobTitle: 'Nutrizionista sportivo', url: SITE + '/', image: SITE + '/assets/dottore.webp', sameAs: Object.values(SOCIAL) };
const branchLd = (k) => {
  const s = STUDIOS[k];
  const o = {
    '@type': ['Dietitian', 'LocalBusiness'], '@id': `${SITE}/${s.slug}/#studio`,
    name: `${NAME} - Nutrizionista sportivo ${s.place}`, url: `${SITE}/${s.slug}/`, image: SITE + '/assets/dottore.webp',
    telephone: TEL, email: MAIL, hasMap: mapsUrl(s),
    address: { '@type': 'PostalAddress', streetAddress: s.street, addressLocality: s.loc || s.name, postalCode: s.zip, addressRegion: s.region, addressCountry: 'IT' },
    founder: { '@id': SITE + '/#vincenzo' }, areaServed: s.loc || s.name,
  };
  if (s.spec.length) o.openingHoursSpecification = s.spec.map(([d, a, b]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: d, opens: a, closes: b }));
  return o;
};
const crumbLd = (items) => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: u })) });
const webPageLd = (url, name) => ({ '@type': 'WebPage', '@id': url + '#page', url, name, isPartOf: { '@id': SITE + '/#site' }, about: { '@id': SITE + '/#vincenzo' }, inLanguage: 'it-IT' });
const siteLd = { '@type': 'WebSite', '@id': SITE + '/#site', url: SITE + '/', name: NAME, inLanguage: 'it-IT', publisher: { '@id': SITE + '/#vincenzo' } };

// ---------- shell ----------
const head = ({ title, desc, canon, rel = '', ld, preload = '', noindex = false, body = '' }) => `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'}">
<link rel="canonical" href="${canon}">
<meta name="theme-color" content="#07170f">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${NAME}">
<meta property="og:locale" content="it_IT">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${canon}">
<meta property="og:image" content="${SITE}/assets/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${NAME}, nutrizionista sportivo a Pozzuoli, Qualiano e Caserta">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${SITE}/assets/og-image.jpg">
<link rel="icon" href="${rel}assets/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="${rel}assets/apple-touch-icon.png" sizes="180x180">
<link rel="preload" href="${rel}fonts/anton.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${rel}fonts/josefin.woff2" as="font" type="font/woff2" crossorigin>
${preload}<link rel="stylesheet" href="${rel}style.css">
<script type="application/ld+json">
${JSON.stringify({ '@context': 'https://schema.org', '@graph': ld })}
</script>
</head>
<body${body}>
${SPRITE}
<a class="skip" href="#main">Vai al contenuto</a>
`;

const header = (rel = '', light = false) => `<header class="header">
  <div class="wrap header__in">
    <a class="logo" href="${rel || './'}" aria-label="${NAME}, home"><img src="${rel}assets/${light ? 'logo.webp' : 'logo-bianco.webp'}" width="${light ? '1282' : '800'}" height="${light ? '316' : '213'}" alt="${NAME}, nutrizionista sportivo"></a>
    <button class="burger" type="button" aria-label="Apri il menu" aria-expanded="false" aria-controls="nav">${ic('list')}</button>
    <nav class="nav" id="nav" aria-label="Principale">
      <ul class="nav__list">
        <li><a href="${rel}#servizi">Servizi</a></li>
        <li><a href="${rel}#metodo">Metodo</a></li>
        <li><a href="${rel}#pacchetti">Percorsi</a></li>
        <li><a href="${rel}#studi">Studi</a></li>
        <li><a href="${rel}#faq">FAQ</a></li>
      </ul>
      <a class="btn btn--primary" href="${WA_GEN}" target="_blank" rel="noopener"${attr({ cta: 'header' })}>${ic('whatsapp-logo')}Prenota ora</a>
    </nav>
  </div>
</header>`;

const footer = (rel = '') => `<footer class="footer">
  <div class="wrap">
    <div class="footer__grid">
      <div class="footer__brand">
        <img src="${rel}assets/logo-bianco.webp" width="800" height="213" alt="${NAME}" loading="lazy">
        <p>Nutrizione sportiva personalizzata per atleti e sportivi in provincia di Napoli e Caserta.</p>
        <div class="social">
          <a href="${SOCIAL.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${ic('instagram-logo')}</a>
          <a href="${SOCIAL.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${ic('facebook-logo')}</a>
          <a href="${SOCIAL.tiktok}" target="_blank" rel="noopener" aria-label="TikTok">${ic('tiktok-logo')}</a>
          <a href="${SOCIAL.youtube}" target="_blank" rel="noopener" aria-label="YouTube">${ic('youtube-logo')}</a>
        </div>
      </div>
${Object.values(STUDIOS).map((s) => `      <div><h4>${s.place}</h4><address>${s.street}<br>${s.zip} ${s.loc || s.name} (${s.region})</address><ul>${s.hours.map(([d, h]) => `<li>${d}: ${h}</li>`).join('')}</ul><ul class="footer__links"><li><a href="${rel}${s.slug}/">Nutrizionista a ${s.place}</a></li><li><a href="${mapsUrl(s)}" target="_blank" rel="noopener"${attr({ cta: 'footer', location: s.place.toLowerCase() })}>Indicazioni</a></li></ul></div>`).join('\n')}
    </div>
    <div class="footer__grid footer__grid--2">
      <div><h4>Servizi</h4><ul>${Object.entries(SERVICES).map(([k, v]) => `<li><a href="${rel}${k}/">${v.short}</a></li>`).join('')}</ul></div>
      <div><h4>Contatti</h4><ul><li><a href="${wa('Buongiorno, vorrei informazioni.')}" target="_blank" rel="noopener"${attr({ cta: 'footer' })}>WhatsApp ${PHONE}</a></li><li><a href="tel:${TEL}"${attr({ cta: 'footer' })}>Chiama ${PHONE}</a></li><li><a href="mailto:${MAIL}"${attr({ cta: 'footer' })}>${MAIL}</a></li></ul></div>
      <div><h4>Informazioni</h4><ul><li><a href="${PRIVACY}" target="_blank" rel="noopener">Privacy policy</a></li><li><a href="${COOKIE}" target="_blank" rel="noopener">Cookie policy</a></li></ul></div>
    </div>
    <div class="footer__base"><span>© 2026 Vincenzo Licciardiello, nutrizionista sportivo · P.IVA ${VAT}</span></div>
  </div>
</footer>

<div class="dock" role="navigation" aria-label="Contatto rapido">
  <a class="btn btn--primary" href="${WA_GEN}" target="_blank" rel="noopener"${attr({ cta: 'dock' })}>${ic('whatsapp-logo')}WhatsApp</a>
  <a class="btn btn--call" href="tel:${TEL}"${attr({ cta: 'dock' })}>${ic('phone')}Chiama</a>
</div>
`;

const docSizes = '(max-width: 900px) 310px, (max-width: 1280px) 32vw, 400px';
const docSrcset = rel => `${rel}assets/dottore-cutout-480.webp 480w, ${rel}assets/dottore-cutout-720.webp 720w, ${rel}assets/dottore-cutout.webp 909w`;
const stage = (rel, alt) => `<div class="hero__stage"><div class="hero__card" aria-hidden="true"><span class="hero__orb"></span><span class="hero__ring"></span></div><img class="hero__doc" src="${rel}assets/dottore-cutout.webp" srcset="${docSrcset(rel)}" sizes="${docSizes}" width="909" height="1356" alt="${alt}" loading="eager" fetchpriority="high"></div>`;
const preloadDoc = rel => `<link rel="preload" href="${rel}assets/dottore-cutout.webp" imagesrcset="${docSrcset(rel)}" imagesizes="${docSizes}" as="image" type="image/webp" fetchpriority="high">\n`;
const waBtn = ({ href, label, cls = 'btn--primary', cta, service, location, icon = 'whatsapp-logo', style = '' }) => `<a class="btn ${cls}" href="${href}" target="_blank" rel="noopener"${attr({ cta, service, location })}${style ? ` style="${style}"` : ''}>${ic(icon)}${label}</a>`;
const write = (rel, content) => { const f = path.join(ROOT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, content); };

// ============ HOME ============
const homeLd = [siteLd, webPageLd(SITE + '/', 'Nutrizionista sportivo a Pozzuoli, Qualiano e Caserta'), personLd, branchLd('pozzuoli'), branchLd('qualiano'), branchLd('caserta')];

const home = head({
  title: 'Nutrizionista sportivo | Dott. Licciardiello',
  desc: 'Nutrizionista sportivo a Pozzuoli, Qualiano e Caserta: piani alimentari su misura per atleti e sportivi, su carichi di lavoro e gare. Prenota su WhatsApp.',
  canon: SITE + '/', ld: homeLd, preload: preloadDoc(''),
}) + header('') + `

<main id="main">
  <section class="hero" id="top">
    <div class="wrap hero__grid">
      <div>
        <span class="kicker rv">Pozzuoli · Qualiano · Caserta</span>
        <h1 class="rv">Nutrizionista sportivo per <mark>rendere di più</mark></h1>
        <p class="hero__sub rv" style="--i:1">Piani alimentari su misura per <strong>atleti e sportivi</strong>, costruiti sui tuoi carichi di lavoro, sulle gare e sui tuoi obiettivi fisici. Si parte da una visita completa.</p>
        <div class="hero__cta rv" style="--i:2">
          ${waBtn({ href: WA_GEN, label: 'Prenota su WhatsApp', cls: 'btn--primary btn--lg', cta: 'hero' })}
          <a class="btn btn--line btn--lg" href="#pacchetti" style="color:#fff"${attr({ cta: 'hero' })}>Vedi i percorsi${ic('arrow-right')}</a>
        </div>
      </div>
      <div class="hero__art rv" style="--i:1">
        ${stage('', 'Il dott. Vincenzo Licciardiello, nutrizionista sportivo, in camice a braccia incrociate')}
        <div class="hero__badge"><b>Dott. Licciardiello</b><span>Nutrizionista sportivo</span></div>
      </div>
    </div>
  </section>

  <section class="trust" aria-label="In sintesi">
    <ul class="wrap trust__list">
      <li><b>3 studi</b><span>Pozzuoli, Qualiano, Caserta</span></li>
      <li><b>Visita completa</b><span>Plicometria e impedenziometria</span></li>
      <li><b>Piano su misura</b><span>Calibrato su carichi e gare</span></li>
      <li><b>3 percorsi</b><span>Bronzo, Silver, Gold</span></li>
    </ul>
  </section>

  <section class="sec" id="servizi">
    <div class="wrap">
      <span class="eyebrow rv">Come ti aiuto</span>
      <h2 class="rv">Nutrizione sportiva su misura per i tuoi obiettivi</h2>
      <p class="sec__lead rv">Che tu giochi un campionato, ti alleni per una gara o voglia cambiare composizione corporea, il piano parte da te e dal tuo calendario.</p>
      <div class="cards">
${Object.entries(SERVICES).map(([k, v], i) => `        <article class="card rv" style="--i:${i}"><span class="card__n" aria-hidden="true">0${i + 1}</span><h3>${v.card}</h3><p>${v.cardText}</p><a class="link" href="${k}/"${attr({ cta: 'service-card', service: k, event: 'service_click' })}>Scopri ${v.short.toLowerCase()} ${ic('arrow-right')}</a></article>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="sec sec--dark" id="performance">
    <div class="wrap">
      <span class="eyebrow rv">Se ti alleni forte, ma mangi a caso</span>
      <h2 class="rv">Cosa succede quando l'alimentazione non regge i tuoi allenamenti</h2>
      <p class="sec__lead rv">Una dieta improvvisata sabota il lavoro che fai in palestra e sul campo.</p>
      <div class="problem__grid">
        <div class="problem__img rv"><img src="assets/stanco.webp" width="1344" height="768" alt="Atleta steso su un tappetino in palestra, esausto dopo l'allenamento" loading="lazy"></div>
        <div>
          <ol class="problem__list">
            <li class="rv"><h3>Cali di energia in gara e in allenamento</h3><p>Arrivi a metà seduta già scarico e perdi lucidità nei momenti decisivi.</p></li>
            <li class="rv"><h3>Recupero lento, muscoli sempre affaticati</h3><p>Dolori che non passano, gambe pesanti, la sensazione di non ricaricare mai.</p></li>
            <li class="rv"><h3>Infiammazioni e fastidi che tornano</h3><p>Tendiniti e dolori articolari che frenano i tuoi progressi.</p></li>
          </ol>
          <div class="rv" style="margin-top:2.5rem">${waBtn({ href: WA_GEN, label: 'Risolvi con un piano su misura', cls: 'btn--primary btn--lg', cta: 'problem' })}</div>
        </div>
      </div>
    </div>
  </section>

  <section class="sec sec--tint" id="metodo">
    <div class="wrap">
      <span class="eyebrow rv">Il metodo</span>
      <h2 class="rv">Dal caso al metodo in 4 passi</h2>
      <p class="sec__lead rv">Non una dieta generica: una strategia costruita su carichi di lavoro, gare e obiettivi. Smetti di improvvisare e ragiona da atleta.</p>
      <ol class="steps">
        <li class="step rv"><h3>Ti ascolto</h3><p>Sport, ruolo, calendario gare, abitudini e obiettivi: si parte da te.</p></li>
        <li class="step rv" style="--i:1"><h3>Analizzo il tuo corpo</h3><p>Visita completa con plicometria e impedenziometria per fotografare il punto di partenza.</p></li>
        <li class="step rv" style="--i:2"><h3>Creo il tuo piano</h3><p>Alimentazione calibrata sul tuo sport: quello che mangi segue il tuo carico di lavoro.</p></li>
        <li class="step rv" style="--i:3"><h3>Ti seguo nel tempo</h3><p>Controlli periodici per mantenere la condizione e gestire integrazione e recupero.</p></li>
      </ol>
      <div class="method__cta rv">${waBtn({ href: wa('Buongiorno, vorrei prenotare la prima visita nutrizionale.'), label: 'Inizia dalla prima visita', cls: 'btn--primary btn--lg', cta: 'method' })}<p><a class="link" href="prima-visita/"${attr({ cta: 'method', service: 'prima-visita' })}>Come funziona la prima visita ${ic('arrow-right')}</a></p></div>
    </div>
  </section>

  <section class="sec sec--green" id="caso-studio">
    <div class="wrap case__grid">
      <div class="case__photo rv"><img src="assets/matteo-800.webp" srcset="assets/matteo-480.webp 480w, assets/matteo-800.webp 800w, assets/matteo.webp 1707w" sizes="(max-width: 900px) min(420px, calc(100vw - 32px)), 430px" width="1707" height="2560" alt="Matteo con un pallone da pallavolo all'aperto" loading="lazy"></div>
      <div>
        <span class="eyebrow rv">Caso studio</span>
        <p class="case__quote rv">Quando cambi strategia, cambi risultati.</p>
        <p class="case__meta rv">Matteo, pallavolista, 28 anni. Percorso iniziato ad aprile 2025.</p>
        <div class="case__text rv">
          <p>Dopo un infortunio serio alla spalla, un intervento e mesi di stop, avevo perso ritmo, fiducia e controllo. E avevo preso molto peso. Ho deciso di non "provare", ma di cambiare direzione.</p>
          <p>Niente soluzioni drastiche: un'alimentazione completa, sostenibile, integrata con l'allenamento. Mese dopo mese mi sono sentito più forte, più leggero, più sicuro. In campo e fuori.</p>
        </div>
        <div class="case__actions rv"><button class="btn btn--line btn--light" type="button" data-open="analisi">${ic('arrow-up-right')}Leggi l'analisi del dottore</button></div>
        <p class="case__note rv">Risultati individuali, non garantiti. Ogni percorso dipende dalla persona e dal suo punto di partenza.</p>
      </div>
    </div>
  </section>

  <section class="sec" id="recensioni">
    <div class="wrap">
      <span class="eyebrow rv">Cosa dicono i pazienti</span>
      <h2 class="rv">L'esperienza di chi si è fatto seguire</h2>
      <div class="reviews__cols">
        <figure class="review rv"><blockquote>Visita più completa mai vista: plicometria e impedenziometria, piano alimentare completamente adattato alle mie esigenze.</blockquote><figcaption><span class="review__ini" aria-hidden="true">GC</span><div>Giada Carotenuto<span>Paziente</span></div></figcaption></figure>
        <figure class="review rv" style="--i:1"><blockquote>Professionista competente e appassionato. Conosce la materia di cui parla e trasferisce la sua competenza in modo impeccabile.</blockquote><figcaption><span class="review__ini" aria-hidden="true">AF</span><div>Antonio Ferraro<span>Paziente</span></div></figcaption></figure>
        <figure class="review rv" style="--i:2"><blockquote>Non si tratta di una dieta standard, ma di una rieducazione alimentare che corregge a dovere le abitudini senza inutili stravolgimenti.</blockquote><figcaption><span class="review__ini" aria-hidden="true">S</span><div>Simone<span>Paziente</span></div></figcaption></figure>
        <figure class="review rv"><blockquote>Professionista competente e preparato, capace di spiegare ogni aspetto in modo chiaro e dettagliato.</blockquote><figcaption><span class="review__ini" aria-hidden="true">TE</span><div>Tullio È.<span>Paziente</span></div></figcaption></figure>
        <figure class="review rv" style="--i:1"><blockquote>Ho apprezzato molto la sua sincerità e l'approccio orientato a un cambiamento duraturo.</blockquote><figcaption><span class="review__ini" aria-hidden="true">DD</span><div>Dora D.<span>Paziente</span></div></figcaption></figure>
        <figure class="review rv" style="--i:2"><blockquote>Sempre disponibile, attento e preparatissimo, riesce a creare un percorso personalizzato che tiene davvero conto degli obiettivi della persona.</blockquote><figcaption><span class="review__ini" aria-hidden="true">SB</span><div>Simona Belato<span>Paziente</span></div></figcaption></figure>
      </div>
      <div class="panel rv">
        <div><h3>Hai dubbi prima della visita?</h3><p>Nessuna dieta drastica, nessun obbligo: scrivimi la tua situazione e ti rispondo con calma. Non serve essere un atleta professionista.</p></div>
        ${waBtn({ href: wa('Buongiorno, ho alcuni dubbi prima di prenotare e vorrei parlarle del mio caso.'), label: 'Parlami del tuo caso', cls: 'btn--primary btn--lg', cta: 'reviews' })}
      </div>
    </div>
  </section>

  <section class="sec sec--tint" id="pacchetti">
    <div class="wrap">
      <span class="eyebrow rv">Percorsi</span>
      <h2 class="rv">Scegli il tuo percorso di nutrizione sportiva</h2>
      <p class="sec__lead rv">Dal primo approccio strutturato al supporto costante. Per costi e disponibilità scrivimi su WhatsApp.</p>
      <div class="packs">
        <article class="pack pack--bronze rv">
          <div><span class="pack__tag">Rinasci</span><h3>Bronzo</h3><p class="pack__for">Per iniziare con un metodo strutturato e costruire basi solide.</p></div>
          <ul><li>1 visita nutrizionale completa</li><li>2 controlli, circa uno ogni 3 settimane</li><li>Piano alimentare personalizzato</li><li>Indicazioni pratiche su pasti e spesa</li><li>Consulenze singole extra</li></ul>
          <a class="btn btn--line" href="${wa('Buongiorno, vorrei informazioni sul Pacchetto Bronzo.')}" target="_blank" rel="noopener"${attr({ cta: 'pack', service: 'bronzo' })}>Info sul Bronzo</a>
        </article>
        <article class="pack pack--silver rv" style="--i:1">
          <div><span class="pack__tag">Cresci</span><h3>Silver</h3><p class="pack__for">Per chi si allena con costanza e vuole consolidare risultati e performance.</p></div>
          <ul><li>1 visita nutrizionale completa</li><li>5 controlli</li><li>Piano nutrizionale periodizzato</li><li>Aggiustamenti sui tuoi allenamenti</li><li>Supporto per gare, test e periodi intensi</li><li>Consulenze singole extra</li></ul>
          <a class="btn btn--line" href="${wa('Buongiorno, vorrei informazioni sul Pacchetto Silver.')}" target="_blank" rel="noopener"${attr({ cta: 'pack', service: 'silver' })}>Info sul Silver</a>
        </article>
        <article class="pack pack--top rv" style="--i:2">
          <div><span class="pack__tag">Corri forte</span><h3>Gold</h3><p class="pack__for">Per atleti evoluti per cui la performance è una priorità concreta.</p></div>
          <ul><li>1 visita nutrizionale completa</li><li>11 controlli</li><li>Gestione nutrizionale a 360 gradi</li><li>Monitoraggio continuo degli allenamenti</li><li>Strategie per gare, trasferte e fasi intense</li><li>Contatto diretto e prioritario</li></ul>
          <a class="btn btn--primary" href="${wa('Buongiorno, vorrei informazioni sul Pacchetto Gold.')}" target="_blank" rel="noopener"${attr({ cta: 'pack', service: 'gold' })}>Info sul Gold</a>
        </article>
      </div>
      <p class="packs__note rv">Se resti inattivo per più di 6 mesi, il pacchetto non è più valido.</p>
    </div>
  </section>

  <section class="sec" id="studi">
    <div class="wrap">
      <span class="eyebrow rv">Dove ricevo</span>
      <h2 class="rv">Nutrizionista a Pozzuoli, Qualiano e Caserta</h2>
      <p class="sec__lead rv">Tre studi in provincia di Napoli e Caserta: scegli quello più comodo.</p>
      <div class="studios">
${Object.entries(STUDIOS).map(([k, s], i) => `        <article class="studio rv" style="--i:${i}"><h3>${s.name}</h3><address>${s.street}, ${s.zip} ${s.loc || s.name} (${s.region})</address><dl>${s.hours.map(([d, h]) => `<dt>${d}</dt><dd>${h}</dd>`).join('')}</dl><div class="studio__cta">${waBtn({ href: wa(`Buongiorno, vorrei informazioni e disponibilità per lo studio di ${s.place}.`), label: `Scrivi allo studio di ${s.place}`, cls: 'btn--primary', cta: 'studio-card', location: k })}</div><div class="studio__links"><a class="link" href="${s.slug}/"${attr({ cta: 'studio-card', location: k })}>Pagina dello studio</a><a class="link" href="${mapsUrl(s)}" target="_blank" rel="noopener"${attr({ cta: 'studio-card', location: k })}>Indicazioni</a></div></article>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="sec sec--tint" id="faq">
    <div class="wrap">
      <span class="eyebrow rv">Domande frequenti</span>
      <h2 class="rv">Hai dei dubbi? Qui le risposte</h2>
      <div class="faq">
        ${faqHtml(FAQ)}
      </div>
    </div>
  </section>

  <section class="sec sec--dark contact" id="contatti">
    <div class="wrap contact__grid">
      <div>
        <span class="eyebrow rv">Contattami</span>
        <h2 class="rv">Scegli lo studio e richiedi la tua visita</h2>
        <p class="sec__lead rv">Raccontami il tuo obiettivo e vediamo insieme se il mio percorso fa per te. Ti rispondo su WhatsApp.</p>
        <div class="contact__studios rv">
${Object.entries(STUDIOS).map(([k, s]) => `          ${waBtn({ href: wa(`Buongiorno, vorrei informazioni e disponibilità per lo studio di ${s.place}.`), label: `Scrivi allo studio di ${s.place}`, cls: 'btn--line btn--light', cta: 'contact', location: k })}`).join('\n')}
        </div>
        <ul class="contact__lines rv">
          <li><a href="tel:${TEL}"${attr({ cta: 'contact' })}>${ic('phone')}${PHONE}</a></li>
          <li><a href="mailto:${MAIL}"${attr({ cta: 'contact' })}>${ic('envelope-simple')}${MAIL}</a></li>
        </ul>
      </div>
      <form class="form rv" id="wa-form" style="--i:1" novalidate>
        <h3>Richiedi la tua visita</h3>
        <div class="form__row">
          <label for="f-nome">Nome<input id="f-nome" name="nome" autocomplete="given-name" required aria-describedby="form-status"></label>
          <label for="f-sport">Sport praticato<input id="f-sport" name="sport" placeholder="es. pallavolo, corsa"></label>
        </div>
        <label for="f-obiettivo">Obiettivo
          <select id="f-obiettivo" name="obiettivo">
            <option>Migliorare la performance</option>
            <option>Perdere peso / massa grassa</option>
            <option>Aumentare la massa muscolare</option>
            <option>Recupero dopo infortunio</option>
            <option>Altro</option>
          </select>
        </label>
        <label for="f-studio">Studio preferito
          <select id="f-studio" name="studio">
            <option data-location="pozzuoli">Pozzuoli</option>
            <option data-location="qualiano">Qualiano</option>
            <option data-location="caserta">San Nicola la Strada (Caserta)</option>
            <option data-location="">Non lo so ancora</option>
          </select>
        </label>
        <label for="f-msg">Messaggio (facoltativo)<textarea id="f-msg" name="msg"></textarea></label>
        <p class="form__msg is-ok" id="form-status" role="status" aria-live="polite"></p>
        <a class="link" id="form-fallback" href="#" target="_blank" rel="noopener" data-cta="form-fallback" hidden>Apri il messaggio su WhatsApp</a>
        <button class="btn btn--primary btn--lg" type="submit">${ic('whatsapp-logo')}Invia su WhatsApp</button>
        <small>Il sito prepara il messaggio senza salvarlo. L'invio avviene su WhatsApp: puoi rileggerlo prima di inviarlo. Evita di inserire referti o informazioni sanitarie nel messaggio. <a href="${PRIVACY}" target="_blank" rel="noopener">Leggi la privacy policy</a>.</small>
        <noscript><p>Per prenotare senza JavaScript, <a href="${WA_GEN}" target="_blank" rel="noopener">scrivi direttamente su WhatsApp</a> o chiama <a href="tel:${TEL}">${PHONE}</a>.</p></noscript>
      </form>
    </div>
  </section>
</main>

` + footer('') + `
${DIALOG}

<script src="main.js" defer></script>
</body>
</html>
`;
write('index.html', home);

// ============ PAGINE SERVIZIO ============
const relatedLinks = (keys, rel) => keys.map((k) => `<li><a class="link" href="${rel}${k}/"${attr({ cta: 'related', service: k })}>${SERVICES[k].short}</a></li>`).join('');
for (const [k, v] of Object.entries(SERVICES)) {
  const url = serviceUrl(k);
  const ld = [siteLd, webPageLd(url, v.title), personLd,
    { '@type': 'Service', '@id': url + '#service', name: v.short, description: v.desc, serviceType: v.short, url, provider: { '@id': SITE + '/#vincenzo' }, areaServed: ['Pozzuoli', 'Qualiano', 'San Nicola la Strada', 'Caserta'] },
    crumbLd([['Home', SITE + '/'], [v.short, url]])];
  const page = head({ title: v.title, desc: v.desc, canon: url, rel: '../', ld, preload: preloadDoc('../'), body: ' class="page--internal"' + attr({ service: k }) }) + header('../', true) + `

<main id="main">
  <section class="hero">
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="../">Home</a> / ${v.short}</nav>
      <div class="hero__grid">
        <div>
          <span class="kicker">Nutrizione sportiva</span>
          <h1>${v.h1}</h1>
          <p class="hero__sub">${v.lead}</p>
          <div class="hero__cta">${waBtn({ href: wa(v.wa), label: 'Chiedi informazioni', cls: 'btn--primary btn--lg', cta: 'service-hero', service: k })}<a class="btn btn--line btn--lg" href="tel:${TEL}"${attr({ cta: 'service-hero', service: k })}>${ic('phone')}${PHONE}</a></div>
        </div>
        <div class="hero__art">${stage('../', `Il dott. Vincenzo Licciardiello, nutrizionista sportivo: ${v.short.toLowerCase()}`)}</div>
      </div>
    </div>
  </section>

  <section class="sec">
    <div class="wrap local__grid">
      <div class="prose">
        ${v.body}
        <p class="note">Le informazioni di questa pagina hanno scopo divulgativo e non sostituiscono il parere del professionista.</p>
      </div>
      <aside class="local__aside">
        <div class="studio"><h3>Parliamone</h3><p>Scrivimi su WhatsApp: ti rispondo con le disponibilità degli studi di Pozzuoli, Qualiano e Caserta.</p><div class="studio__cta">${waBtn({ href: wa(v.wa), label: 'Scrivimi su WhatsApp', cta: 'service-aside', service: k })}</div></div>
        <div class="studio"><h3>Approfondisci</h3><ul class="chips">${relatedLinks(v.related, '../')}</ul></div>
        <div class="studio"><h3>Dove ricevo</h3><ul class="chips">${Object.values(STUDIOS).map((s) => `<li><a class="link" href="../${s.slug}/"${attr({ cta: 'related', location: s.place.toLowerCase() })}>Nutrizionista a ${s.place}</a></li>`).join('')}</ul></div>
      </aside>
    </div>
  </section>

  <section class="sec sec--tint" id="faq">
    <div class="wrap">
      <span class="eyebrow">Domande frequenti</span>
      <h2>${v.short}: le domande più comuni</h2>
      <div class="faq">
        ${faqHtml(v.faq, false)}
      </div>
    </div>
  </section>

  <section class="sec sec--dark">
    <div class="wrap" style="text-align:center">
      <h2 style="margin-inline:auto">Smetti di improvvisare. Nutriti da atleta.</h2>
      <p class="sec__lead" style="margin-inline:auto">Raccontami il tuo obiettivo: ti rispondo con le disponibilità degli studi.</p>
      <div style="margin-top:2rem">${waBtn({ href: wa(v.wa), label: 'Prenota su WhatsApp', cls: 'btn--primary btn--lg', cta: 'service-final', service: k })}</div>
    </div>
  </section>
</main>

` + footer('../') + `
<script src="../main.js" defer></script>
</body>
</html>
`;
  write(`${k}/index.html`, page);
}

// ============ PAGINE LOCALI ============
const CITY = {
  pozzuoli: {
    h1: 'Nutrizionista sportivo a <mark>Pozzuoli</mark>',
    title: 'Nutrizionista sportivo a Pozzuoli | Dott. Licciardiello',
    desc: 'Nutrizionista sportivo a Pozzuoli, Via Campana 266: visita completa e piano alimentare su misura per atleti e sportivi. Mercoledì e venerdì. Prenota ora.',
    lead: 'Nel mio studio di Pozzuoli ricevo atleti e sportivi dei Campi Flegrei e dell\'area occidentale di Napoli che vogliono un piano alimentare costruito sul proprio sport.',
    near: 'Pozzuoli, Bacoli, Monte di Procida, Quarto e Napoli ovest',
    access: 'Lo studio si trova in Via Campana 266, a Pozzuoli.',
    faq: [
      ['Dove si trova lo studio di Pozzuoli?', 'In Via Campana 266, 80078 Pozzuoli (NA). Trovi il link alle indicazioni stradali in questa pagina.'],
      ['Quando riceve lo studio di Pozzuoli?', 'Il mercoledì dalle 9:00 alle 13:00 e il venerdì dalle 14:00 alle 20:00.'],
      ['Come prenoto a Pozzuoli?', `Scrivimi su WhatsApp al ${PHONE} indicando che preferisci lo studio di Pozzuoli: ti rispondo con le disponibilità.`],
    ],
  },
  qualiano: {
    h1: 'Nutrizionista sportivo a <mark>Qualiano</mark>',
    title: 'Nutrizionista sportivo a Qualiano | Dott. Licciardiello',
    desc: 'Nutrizionista sportivo a Qualiano, Via Canonico Migliaccio 18: piani alimentari su misura per atleti e sportivi. Martedì, mercoledì e sabato. Prenota ora.',
    lead: 'Nello studio di Qualiano seguo atleti e sportivi dell\'area a nord di Napoli con piani alimentari costruiti su carichi di lavoro, gare e obiettivi.',
    near: 'Qualiano, Giugliano, Villaricca, Calvizzano, Mugnano e Marano',
    access: 'Lo studio si trova in Via Canonico Migliaccio 18, a Qualiano.',
    faq: [
      ['Dove si trova lo studio di Qualiano?', 'In Via Canonico Migliaccio 18, 80019 Qualiano (NA). Trovi il link alle indicazioni stradali in questa pagina.'],
      ['Quando riceve lo studio di Qualiano?', 'Il martedì dalle 9:00 alle 20:00, il mercoledì dalle 14:00 alle 20:00 e il sabato dalle 9:00 alle 13:00.'],
      ['Come prenoto a Qualiano?', `Scrivimi su WhatsApp al ${PHONE} indicando che preferisci lo studio di Qualiano: ti rispondo con le disponibilità.`],
    ],
  },
  caserta: {
    h1: 'Nutrizionista sportivo a <mark>Caserta</mark>',
    title: 'Nutrizionista sportivo a Caserta | Dott. Licciardiello',
    desc: 'Nutrizionista sportivo a Caserta (San Nicola la Strada, Via Eugenio Montale 13): piani su misura per atleti e sportivi. Visite su appuntamento. Prenota ora.',
    lead: 'Nello studio di San Nicola la Strada, alle porte di Caserta, ricevo su appuntamento atleti e sportivi che cercano un percorso di nutrizione sportiva personalizzato.',
    near: 'Caserta, San Nicola la Strada, Marcianise, Maddaloni, Casagiove e Santa Maria Capua Vetere',
    access: 'Lo studio si trova in Via Eugenio Montale 13, a San Nicola la Strada (Caserta).',
    faq: [
      ['Dove si trova lo studio di Caserta?', 'In Via Eugenio Montale 13, 81020 San Nicola la Strada (CE), alle porte di Caserta. Trovi il link alle indicazioni stradali in questa pagina.'],
      ['Quando riceve lo studio di Caserta?', 'Su appuntamento: scrivimi per concordare giorno e orario.'],
      ['Come prenoto a Caserta?', `Scrivimi su WhatsApp al ${PHONE} indicando che preferisci lo studio di San Nicola la Strada (Caserta): ti rispondo con le disponibilità.`],
    ],
  },
};
for (const [k, c] of Object.entries(CITY)) {
  const s = STUDIOS[k];
  const url = `${SITE}/${s.slug}/`;
  const msg = wa(`Buongiorno, vorrei prenotare una visita nello studio di ${s.place}.`);
  const others = Object.entries(STUDIOS).filter(([o]) => o !== k);
  const ld = [siteLd, webPageLd(url, c.title), personLd, branchLd(k), crumbLd([['Home', SITE + '/'], [`Nutrizionista sportivo ${s.place}`, url]])];
  const page = head({ title: c.title, desc: c.desc, canon: url, rel: '../', ld, preload: preloadDoc('../'), body: ' class="page--internal"' + attr({ location: k }) }) + header('../', true) + `

<main id="main">
  <section class="hero">
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="../">Home</a> / Nutrizionista sportivo ${s.place}</nav>
      <div class="hero__grid">
        <div>
          <span class="kicker">${s.name}</span>
          <h1>${c.h1}</h1>
          <p class="hero__sub">${c.lead}</p>
          <div class="hero__cta">
            ${waBtn({ href: msg, label: `Scrivi allo studio di ${s.place}`, cls: 'btn--primary btn--lg', cta: 'city-hero', location: k })}
            <a class="btn btn--line btn--lg" href="tel:${TEL}"${attr({ cta: 'city-hero', location: k })}>${ic('phone')}${PHONE}</a>
          </div>
        </div>
        <div class="hero__art">${stage('../', `Il dott. Vincenzo Licciardiello, nutrizionista sportivo a ${s.place}`)}</div>
      </div>
    </div>
  </section>

  <section class="sec">
    <div class="wrap local__grid">
      <div class="prose">
        <h2 class="h2s">Nutrizione sportiva a ${s.place}: come lavoriamo</h2>
        <p>Sono il dott. Vincenzo Licciardiello, nutrizionista sportivo. ${c.access} Seguo persone di ${c.near}.</p>
        <p>Non propongo diete generiche: ogni piano è costruito sul tuo sport, sui tuoi carichi di allenamento, sul calendario gare e sui tuoi obiettivi fisici.</p>
        <h3>La prima visita</h3>
        <ul>
          <li>Raccolta di storia, abitudini alimentari e obiettivi</li>
          <li>Valutazione della composizione corporea con plicometria e impedenziometria</li>
          <li>Piano alimentare personalizzato, calibrato sul tuo carico di lavoro</li>
          <li>Indicazioni pratiche su pasti, spesa e integrazione</li>
        </ul>
        <p><a href="../prima-visita/">Scopri come funziona la prima visita</a>.</p>
        <h3>Di cosa mi occupo</h3>
        <ul>${Object.entries(SERVICES).filter(([sk]) => sk !== 'prima-visita').map(([sk, sv]) => `<li><a href="../${sk}/">${sv.short}</a></li>`).join('')}</ul>
        <p>Scopri anche i <a href="../#pacchetti">percorsi Bronzo, Silver e Gold</a>.</p>
        <p class="note">Risultati individuali, non garantiti: dipendono dalla persona e dal suo punto di partenza.</p>
      </div>
      <aside class="local__aside">
        <div class="studio"><h3>Studio di ${s.place}</h3><address>${s.street}, ${s.zip} ${s.loc || s.name} (${s.region})</address><dl>${s.hours.map(([d, h]) => `<dt>${d}</dt><dd>${h}</dd>`).join('')}</dl><div class="studio__links"><a class="link" href="${mapsUrl(s)}" target="_blank" rel="noopener"${attr({ cta: 'city-aside', location: k })}>Indicazioni stradali</a></div></div>
        ${waBtn({ href: msg, label: 'Prenota su WhatsApp', cls: 'btn--primary btn--lg', cta: 'city-aside', location: k })}
        <div class="studio"><h3>Altri studi</h3><ul class="chips">${others.map(([, o]) => `<li><a class="link" href="../${o.slug}/">Nutrizionista a ${o.place}</a></li>`).join('')}</ul></div>
      </aside>
    </div>
  </section>

  <section class="sec sec--tint" id="faq">
    <div class="wrap">
      <span class="eyebrow">Domande frequenti</span>
      <h2>Lo studio di ${s.place}: informazioni utili</h2>
      <div class="faq">
        ${faqHtml(c.faq, false)}
      </div>
    </div>
  </section>

  <section class="sec sec--dark">
    <div class="wrap" style="text-align:center">
      <h2 style="margin-inline:auto">Smetti di improvvisare. Nutriti da atleta.</h2>
      <p class="sec__lead" style="margin-inline:auto">Scrivimi il tuo obiettivo e ti rispondo con le disponibilità dello studio di ${s.place}.</p>
      <div style="margin-top:2rem">${waBtn({ href: msg, label: `Prenota a ${s.place}`, cls: 'btn--primary btn--lg', cta: 'city-final', location: k })}</div>
    </div>
  </section>
</main>

` + footer('../') + `
<script src="../main.js" defer></script>
</body>
</html>
`;
  write(`${s.slug}/index.html`, page);
}

// ============ 404 ============
write('404.html', head({ title: 'Pagina non trovata | Dott. Licciardiello', desc: 'La pagina cercata non esiste. Torna alla home del sito del Dott. Licciardiello.', canon: SITE + '/', ld: [], noindex: true, rel: '/' }) + header('/') + `
<main id="main">
  <section class="hero"><div class="wrap" style="padding:calc(var(--hh) + 3rem) 0 5rem"><span class="kicker">Errore 404</span><h1>Pagina non trovata</h1><p class="hero__sub">Il link che hai seguito non esiste più o è stato spostato.</p><div class="hero__cta"><a class="btn btn--primary btn--lg" href="/">Torna alla home</a>${waBtn({ href: WA_GEN, label: 'Scrivimi su WhatsApp', cls: 'btn--line btn--lg', cta: '404', style: 'color:#fff' })}</div></div></section>
</main>
` + footer('/') + `
<script src="/main.js" defer></script>
</body>
</html>
`);

// ============ sitemap / robots ============
const today = new Date().toISOString().slice(0, 10);
const urls = [['/', '1.0'], ...Object.keys(SERVICES).map((k) => [`/${k}/`, '0.8']), ...Object.values(STUDIOS).map((s) => [`/${s.slug}/`, '0.8'])];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, p]) => `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod><priority>${p}</priority></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log('build ok:', 1 + Object.keys(SERVICES).length + Object.keys(CITY).length, 'pagine');
