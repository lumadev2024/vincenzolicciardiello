"""Check static pages, local links, metadata, JSON-LD and image dimensions.
Run: python tools/check.py. No external packages required.
"""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
SITE = 'https://www.dottlicciardiello.it'
errors = []
class Page(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.source = source
        self.ids, self.refs, self.images, self.metas = set(), [], [], {}
        self.h1 = self.titles = 0
        self.canon = []
        self.script = False
        self.ld = ''
        self.feed(source.read_text(encoding='utf-8'))
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            if a['id'] in self.ids: errors.append(f'{self.source}: duplicate id {a["id"]}')
            self.ids.add(a['id'])
        if tag == 'h1': self.h1 += 1
        if tag == 'title': self.titles += 1
        if tag == 'meta':
            key = a.get('name', a.get('property'))
            if key: self.metas.setdefault(key, []).append(a.get('content', ''))
        if tag == 'link' and a.get('rel') == 'canonical': self.canon.append(a.get('href'))
        if tag == 'img': self.images.append(a)
        for key in ('src', 'href'):
            if key in a: self.refs.append(a[key])
        if tag == 'script' and a.get('type') == 'application/ld+json': self.script, self.ld = True, ''
    def handle_data(self, data):
        if self.script: self.ld += data
    def handle_endtag(self, tag):
        if tag == 'script' and self.script:
            try: json.loads(self.ld)
            except ValueError: errors.append(f'{self.source}: invalid JSON-LD')
            self.script = False

files = [ROOT / 'index.html', ROOT / '404.html', *ROOT.glob('*/index.html')]
pages = {p.resolve(): Page(p) for p in files}
descriptions, titles = set(), set()
for path, page in pages.items():
    rel = path.relative_to(ROOT)
    if page.h1 != 1 or page.titles != 1: errors.append(f'{rel}: expected one H1 and title')
    if len(page.canon) != 1: errors.append(f'{rel}: expected one canonical')
    if path.name == 'index.html':
        expected = SITE + '/' + (str(rel.parent).replace('\\', '/') + '/' if rel.parent != Path('.') else '')
        if page.canon != [expected]: errors.append(f'{rel}: wrong canonical')
    for key in ('description', 'robots', 'og:title', 'og:description', 'og:image', 'twitter:image'):
        if len(page.metas.get(key, [])) != 1: errors.append(f'{rel}: missing/duplicate {key}')
    if page.metas.get('og:url') != page.canon: errors.append(f'{rel}: OG URL mismatch')
    desc = page.metas.get('description', [''])[0]
    if desc in descriptions: errors.append(f'{rel}: duplicate description')
    descriptions.add(desc)
    for img in page.images:
        if not all(k in img for k in ('alt', 'width', 'height')): errors.append(f'{rel}: image lacks alt/dimensions')
    for ref in page.refs:
        url = urlsplit(ref)
        if url.scheme or url.netloc: continue
        target = (ROOT / unquote(url.path).lstrip('/') if url.path.startswith('/') else path.parent / unquote(url.path)).resolve() if url.path else path
        if target.is_dir(): target = target / 'index.html'
        if not target.exists(): errors.append(f'{rel}: broken local link {ref}')
        elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids: errors.append(f'{rel}: missing anchor {ref}')
    for ref in page.refs:
        if ref.startswith('https://wa.me/'):
            u = urlsplit(ref)
            if u.path != '/393425105288' or not u.query.startswith('text='): errors.append(f'{rel}: invalid WhatsApp link')

sitemap = ET.parse(ROOT / 'sitemap.xml')
urls = [el.text for el in sitemap.findall('.//{*}loc')]
expected_urls = [p.canon[0] for path, p in pages.items() if path.name == 'index.html']
if set(urls) != set(expected_urls): errors.append('Sitemap does not match indexable pages')
if 'Disallow: /' in (ROOT / 'robots.txt').read_text(): errors.append('robots blocks indexing')
if errors:
    print('\n'.join(errors))
    raise SystemExit(1)
print(f'PASS: {len(pages)} pages; local links, anchors, metadata, JSON-LD, images, WhatsApp, sitemap and robots.')
