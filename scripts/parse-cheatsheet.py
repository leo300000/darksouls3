"""Convertit l'index.html de ZKjellberg/dark-souls-3-cheat-sheet (MIT) en JSON structuré.
Usage : python3 -I scripts/parse-cheatsheet.py <chemin/index.html> <sortie.json>
"""
import json, re, sys, html as htmlmod
from html.parser import HTMLParser
from urllib.parse import unquote

src, out = sys.argv[1], sys.argv[2]
doc = open(src, encoding="utf-8").read()

def wiki_slug(href):
    m = re.search(r'fextralife\.com/(.+)$', href or '')
    if not m: return None
    return unquote(m.group(1)).replace('+', ' ').strip()

class LiParser(HTMLParser):
    """Découpe un <li> en segments texte / lien."""
    def __init__(self):
        super().__init__(); self.segs=[]; self.href=None; self.buf=''
    def handle_starttag(self, tag, attrs):
        if tag=='a':
            self.flush(); self.href=dict(attrs).get('href')
    def handle_endtag(self, tag):
        if tag=='a':
            name=self.buf.replace('\xa0',' ').strip()
            if name: self.segs.append({'link':name,'wiki':wiki_slug(self.href)})
            self.buf=''; self.href=None
    def handle_data(self, d): self.buf+=d
    def flush(self):
        if self.buf:
            self.segs.append({'t':self.buf.replace('\xa0',' ')})
        self.buf=''
    def result(self):
        self.flush()
        # fusion des segments texte consécutifs
        res=[]
        for s in self.segs:
            if 't' in s and res and 't' in res[-1]: res[-1]['t']+=s['t']
            else: res.append(s)
        return res

def parse_li(inner):
    p=LiParser(); p.feed(inner); return p.result()

def tab(name):
    i=doc.find('id="%s"'%name); j=doc.find('class="tab-pane', i+10)
    return doc[i:j if j>0 else len(doc)]

LI=re.compile(r'<li data-id="([^"]+)"(?: class="([^"]*)")?>(.*?)</li>', re.S)
def items(block):
    res=[]
    for m in LI.finditer(block):
        cls=(m.group(2) or '').split()
        res.append({'id':m.group(1),
                    'tags':[c[2:] for c in cls if c.startswith('f_')],
                    'ng':next((c[2:] for c in cls if c.startswith('s_')),None),
                    'segments':parse_li(m.group(3))})
    return res

def h3_sections(block):
    parts=re.split(r'(<h3 id="[^"]+">.*?</h3>)', block, flags=re.S)
    res=[]
    for k in range(1,len(parts),2):
        hid=re.search(r'id="([^"]+)"',parts[k]).group(1)
        title=re.sub(r'<[^>]+>','',re.sub(r'<span.*?</span>','',parts[k])).strip()
        body=parts[k+1]
        sub=[]
        h4s=re.split(r'(<h4>.*?</h4>)', body, flags=re.S)
        if len(h4s)>1:
            for q in range(1,len(h4s),2):
                sub.append({'title':htmlmod.unescape(re.sub(r'<[^>]+>','',h4s[q])).strip(),'items':items(h4s[q+1])})
        res.append({'id':hid,'title':htmlmod.unescape(title),'items':items(body),'groups':sub})
    return res

data={'source':{'name':'Dark Souls 3 Cheat Sheet','author':'Zachary Kjellberg & contributeurs',
                'url':'https://github.com/ZKjellberg/dark-souls-3-cheat-sheet','license':'MIT'},
      'playthrough':h3_sections(tab('tabPlaythrough')),
      'checklists':h3_sections(tab('tabChecklists')),
      'weapons':h3_sections(tab('tabWeaponsShields')),
      'armors':h3_sections(tab('tabArmors')),
      'misc':h3_sections(tab('tabMisc'))}
json.dump(data, open(out,'w',encoding='utf-8'), ensure_ascii=False, indent=0)
for k in ['playthrough','checklists','weapons','armors','misc']:
    print(k, [(s['id'],len(s['items']),len(s['groups'])) for s in data[k]])
