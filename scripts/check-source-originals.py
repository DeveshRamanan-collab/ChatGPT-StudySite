#!/usr/bin/env python3
"""Independently reconstruct every public original and verify exact byte hashes."""
from pathlib import Path
from urllib.parse import unquote, urlsplit
import hashlib
import json
import sys

root=Path(__file__).resolve().parents[1]
index=json.loads((root/'public/source-corpus/index.json').read_text())
failures=[];checked=0;parts_checked=0;bytes_checked=0;largest=0
for source in index['files']:
    descriptor=source.get('originalDownload')
    if source.get('extractionStatus')=='audiovisual-not-reviewed':continue
    if not descriptor:
        failures.append({'id':source['id'],'reason':'Missing original download descriptor'});continue
    complete=hashlib.sha256();length=0
    for part in descriptor['parts']:
        url=urlsplit(part['url'])
        if url.scheme or url.netloc or not url.path.startswith('/source-originals/'):
            failures.append({'id':source['id'],'reason':'Unexpected part URL'});continue
        path=root/'public'/unquote(url.path).lstrip('/')
        if not path.is_file():
            failures.append({'id':source['id'],'reason':'Missing original part','path':str(path.relative_to(root))});continue
        data=path.read_bytes();digest=hashlib.sha256(data).hexdigest();largest=max(largest,len(data));parts_checked+=1
        if len(data)!=part['bytes'] or digest!=part['sha256']:
            failures.append({'id':source['id'],'reason':'Part size/hash mismatch','part':part['url']})
        complete.update(data);length+=len(data)
    if length!=descriptor['bytes'] or complete.hexdigest()!=descriptor['sha256'] or descriptor['sha256']!=source['sha256']:
        failures.append({'id':source['id'],'reason':'Reassembled original does not match source byte hash'})
    checked+=1;bytes_checked+=length
result={'method':'Reassemble committed parts and independently compare SHA-256 and byte size to original descriptors',
  'checkedOriginals':checked,'checkedParts':parts_checked,'checkedBytes':bytes_checked,'largestPartBytes':largest,
  'unreviewedAudiovisualRecords':index['summary'].get('unreviewedMedia',0),'failures':failures,
  'limits':'Checks exact original-file bytes. It does not certify OCR, audiovisual content or legal paraphrases.'}
(root/'reports/source-originals-audit.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2));sys.exit(bool(failures))
