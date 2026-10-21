"""Check every static route and asset target, plus the global direct-navigation index."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote, urljoin
import json
R=Path('dist');missing={};checked=0
class Links(HTMLParser):
 def handle_starttag(self,tag,attrs):
  for k,v in attrs:
   if v and ((tag=='a'and k=='href')or(tag in ['script','img']and k=='src')or(tag=='link'and k=='href')):self.links.append(v)
 def __init__(self,s):super().__init__();self.links=[];self.feed(s)
def exists(url):
 u=urlsplit(url)
 if u.scheme or u.netloc:return True
 path=unquote(u.path).lstrip('/')
 if not path:return True
 p=R/path
 return p.is_file()or(p/'index.html').is_file()or(p/'index.json').is_file()
for p in R.rglob('*.html'):
 if p.relative_to(R).parts[0]=='exam-sources':continue # Exact archived document, not a site navigation route.
 base='/'+p.relative_to(R).as_posix().removesuffix('index.html')
 for href in Links(p.read_text()).links:
  if href.startswith(('#','mailto:','tel:','data:','javascript:')):continue
  checked+=1;target=urljoin(base,href)
  if not exists(target):missing.setdefault(target,[]).append(p.relative_to(R).as_posix())
index=json.loads((R/'data/everything.json').read_text())
for x in index:
 if not exists(x['href']):missing.setdefault(x['href'],[]).append('Everything index')
result={'checkedHtmlTargets':checked,'directIndexEntries':len(index),'missingTargets':{k:{'count':len(v),'examples':v[:3]}for k,v in missing.items()}}
Path('reports/rebuild-links.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2));raise SystemExit(bool(missing))
