"""Check every static route and asset target, plus the global direct-navigation index."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote, urljoin
from collections import Counter
import json
R=Path('dist');missing={};checked=0
archived_missing={};archived_checked=0;excluded_archives={}
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
 directory=p.relative_to(R).parts[0]
 archived=directory in ('exam-sources','source-originals')
 if archived:excluded_archives[directory]=excluded_archives.get(directory,0)+1
 if directory=='exam-sources':continue # Exact archived document, not a site navigation route.
 base='/'+p.relative_to(R).as_posix().removesuffix('index.html')
 for href in Links(p.read_text()).links:
  if href.startswith(('#','mailto:','tel:','data:','javascript:')):continue
  target=urljoin(base,href)
  if archived:
   archived_checked+=1
   if not exists(target):archived_missing.setdefault(target,[]).append(p.relative_to(R).as_posix())
  else:
   checked+=1
   if not exists(target):missing.setdefault(target,[]).append(p.relative_to(R).as_posix())
index=json.loads((R/'data/everything.json').read_text())
for x in index:
 if not exists(x['href']):missing.setdefault(x['href'],[]).append('Everything index')
corpus=json.loads((R/'source-corpus/index.json').read_text())
expected_sources={f'/sources/{source["id"]}/' for source in corpus['files']}
indexed_sources=Counter(x['href'] for x in index if x['href'].startswith('/sources/') and x['href']!='/sources/')
source_coverage={'corpusComplete':corpus.get('summary',{}).get('complete') is True,
 'expectedSourceEntries':len(expected_sources),'indexedSourceEntries':sum(indexed_sources.values()),
 'missingSourceEntries':sorted(expected_sources-indexed_sources.keys()),
 'unexpectedSourceEntries':sorted(indexed_sources.keys()-expected_sources),
 'duplicateSourceEntries':sorted(href for href,count in indexed_sources.items() if count!=1)}
source_coverage_failed=(not source_coverage['corpusComplete'] or any(source_coverage[key] for key in
 ('missingSourceEntries','unexpectedSourceEntries','duplicateSourceEntries')))
summarise=lambda targets:{k:{'count':len(v),'examples':v[:3]}for k,v in targets.items()}
result={'checkedHtmlTargets':checked,'directIndexEntries':len(index),'missingTargets':summarise(missing),
 'sourceIndexCoverage':source_coverage,
 'excludedArchivedHtmlCount':sum(excluded_archives.values()),'excludedArchivedHtmlByDirectory':excluded_archives,
 'archiveOnlyLinkCheck':{'directory':'source-originals','checkedHtmlTargets':archived_checked,
  'missingTargets':summarise(archived_missing),
  'context':'Byte-exact archived HTML documents retain original relative attachment and iLearn chapter links. Their dependencies were not supplied at those relative paths. These are reported separately from generated site navigation; original bytes have not been rewritten.'}}
Path('reports/rebuild-links.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2));raise SystemExit(bool(missing) or source_coverage_failed)
