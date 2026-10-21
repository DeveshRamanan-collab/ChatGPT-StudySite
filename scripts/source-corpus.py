#!/usr/bin/env python3
"""Extract retained originals without rewriting their text; checkpoint by byte hash.

Machine OCR remains explicitly unverified. This script never changes originals.
Normal site builds consume its committed output and do not need Python or OCR.
"""
import argparse
import concurrent.futures as futures
import hashlib
import io
import json
import os
from pathlib import Path
import posixpath
import re
import subprocess
import tempfile
import time
import zipfile
import xml.etree.ElementTree as ET

VERSION = '2026-10-21-restored-v1'
NS = {'a':'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p':'http://schemas.openxmlformats.org/presentationml/2006/main',
      'r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
      'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
TEXT_EXT = {'.md','.txt','.yaml','.yml','.json','.csv','.tsv','.html','.htm','.xml','.vtt','.srt','.tex'}
IMAGE_EXT = {'.png','.jpg','.jpeg','.webp','.tif','.tiff','.bmp','.gif'}
MEDIA_EXT = {'.mp4','.mov','.m4a','.mp3','.wav','.webm'}

def sha(data): return hashlib.sha256(data).hexdigest()
def localname(tag): return tag.rsplit('}',1)[-1]
def atomic_json(path, data):
    tmp=path.with_name(path.name+'.'+str(os.getpid())+'.tmp')
    tmp.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
    tmp.replace(path)

def rels(z, part):
    rp=posixpath.join(posixpath.dirname(part),'_rels',posixpath.basename(part)+'.rels')
    if rp not in z.namelist():return {}
    result={}
    for x in ET.fromstring(z.read(rp)):
        external=x.attrib.get('TargetMode')=='External';target=x.attrib.get('Target','')
        result[x.attrib['Id']]={'target':target if external else posixpath.normpath(posixpath.join(posixpath.dirname(part),target)).lstrip('/'),
          'type':x.attrib.get('Type','').rsplit('/',1)[-1],'external':external}
    return result

def xml_text(root, word=False):
    """Stored paragraphs/runs, including empty paragraphs, explicit tabs/breaks."""
    namespace=NS['w'] if word else NS['a'];paragraphs=[]
    for p in root.iter('{'+namespace+'}p'):
        parts=[]
        for el in p.iter():
            tag=localname(el.tag)
            if tag in (('t','delText') if word else ('t',)):parts.append(el.text or '')
            elif tag=='tab':parts.append('\t')
            elif tag in ('br','cr'):parts.append('\n')
            elif word and tag=='noBreakHyphen':parts.append('\u2011')
            elif word and tag=='softHyphen':parts.append('\u00ad')
            elif word and tag=='sym':
                value=el.attrib.get('{'+NS['w']+'}char')
                if value:
                    try:parts.append(chr(int(value,16)))
                    except ValueError:pass
        paragraphs.append(''.join(parts))
    return '\n'.join(paragraphs)

def add_section(out,label,text,method,origin,**extra):
    if text=='' and not extra.get('imageUrl'):return
    base='s-'+sha((origin+'\0'+label).encode())[:20];ident=base;number=1
    existing={section['id'] for section in out}
    while ident in existing:
        number+=1;ident=base+'-'+str(number)
    out.append({'id':ident,'label':label,'text':text,'characters':len(text),
      'textSha256':sha(text.encode()),'method':method,'origin':origin,**extra})

def unique_section_ids(record):
    """Retain repeated source occurrences while making each anchor unambiguous."""
    existing=set()
    for section in record.get('sections',[]):
        base=section['id'];ident=base;number=1
        while ident in existing:
            number+=1;ident=base+'-'+str(number)
        section['id']=ident;existing.add(ident)
    return record

def store_visual(data, asset_root):
    from PIL import Image
    ident=sha(data);dest=asset_root/(ident+'.webp')
    if not dest.exists():
        try:
            im=Image.open(io.BytesIO(data));im.load()
            if im.mode not in ('RGB','RGBA'):im=im.convert('RGBA')
            # Fast lossless encoding preserves the same pixels as method 4.
            buf=io.BytesIO();im.save(buf,format='WEBP',lossless=True,method=0)
            tmp=dest.with_name(dest.name+'.'+str(os.getpid())+'.tmp');tmp.write_bytes(buf.getvalue());tmp.replace(dest)
        except Exception:
            ext='svg' if b'<svg' in data[:500] else 'bin';dest=asset_root/(ident+'.'+ext)
            dest.write_bytes(data)
    return '/source-corpus/images/'+dest.name

def ocr_bytes(data,cache):
    from PIL import Image
    key=sha(data);dest=cache/(key+'.json')
    if dest.exists():
        try:
            previous=json.loads(dest.read_text())
            if previous.get('status')!='ocr-error':return previous
        except (ValueError,OSError):pass
    try:
        if b'<svg' in data[:1000]:
            import fitz
            document=fitz.open(stream=data,filetype='svg');data=document[0].get_pixmap(matrix=fitz.Matrix(2,2),alpha=False).tobytes('png')
        im=Image.open(io.BytesIO(data));im.load()
        if im.width<80 or im.height<30:return {'text':'','status':'small-image','words':0}
        if im.width*im.height>16000000:im.thumbnail((4000,4000))
        if im.mode not in ('L','RGB'):im=im.convert('RGB')
        with tempfile.TemporaryDirectory(prefix='source-ocr-') as td:
            p=Path(td)/'input.png';im.save(p)
            run=subprocess.run(['tesseract',str(p),'stdout','-l','eng','--psm','11','tsv'],capture_output=True,text=True,timeout=60,env={**os.environ,'OMP_THREAD_LIMIT':'1'})
            words=[];conf=[];text=[];previous=None
            for row in run.stdout.splitlines()[1:]:
                values=row.split('\t',11)
                if len(values)<12 or not values[11]:continue
                line=tuple(values[1:5])
                if text:text.append('\n' if line!=previous else ' ')
                text.append(values[11]);previous=line;words.append(values[11])
                try:
                    n=float(values[10])
                    if n>=0:conf.append(n)
                except ValueError:pass
            result={'text':''.join(text),'meanConfidence':round(sum(conf)/len(conf),2) if conf else None,
              'words':len(words),'status':'machine-ocr-unverified','engine':'tesseract eng psm11'}
    except Exception as exc:result={'text':'','status':'ocr-error','error':str(exc),'words':0}
    atomic_json(dest,result);return result

def pdf_extract(path,sections,warnings,cache,assets,prefix='Page',ocr=True):
    import fitz
    doc=fitz.open(path);ocr_count=0
    for n,page in enumerate(doc,1):
        origin=f'{prefix.lower()}:{n}';text=page.get_text('text',sort=False)
        add_section(sections,f'{prefix} {n}',text,'pdf-text-layer',origin,page=n)
        image_area=sum(fitz.Rect(x['bbox']).get_area() for x in page.get_image_info())
        coverage=image_area/max(1,page.rect.get_area())
        pix=page.get_pixmap(matrix=fitz.Matrix(1.4,1.4),alpha=False);data=pix.tobytes('png')
        visual=store_visual(data,assets)
        if ocr and (len(text.strip())<60 or coverage>.10):
            result=ocr_bytes(data,cache);ocr_count+=1
            add_section(sections,f'{prefix} {n} rendered text (machine OCR)',result.get('text',''),'machine-ocr',origin+':ocr',page=n,ocr=result,imageUrl=visual)
        else:add_section(sections,f'{prefix} {n} original visual','', 'rendered-original',origin+':visual',page=n,imageUrl=visual)
    return {'pages':len(doc),'ocrPages':ocr_count}

def office_visuals(path,sections,warnings,cache,assets):
    try:
        with tempfile.TemporaryDirectory(prefix='source-office-') as td:
            target=Path(td)
            run=subprocess.run(['soffice','-env:UserInstallation=file://'+td+'/profile','--headless','--convert-to','pdf','--outdir',td,str(path.resolve())],capture_output=True,text=True,timeout=120)
            pdfs=list(target.glob('*.pdf'))
            if run.returncode or not pdfs:
                warnings.append('Office visual conversion unavailable; use the exact original file for layout and diagrams.');return {}
            return pdf_extract(pdfs[0],sections,warnings,cache,assets,prefix='Rendered slide' if path.suffix.lower()=='.pptx' else 'Rendered document page',ocr=False)
    except Exception as exc:
        warnings.append('Office visual conversion unavailable: '+str(exc));return {}

def pptx_extract(path,sections,warnings,cache,assets):
    mismatches=0;slide_map=[];embedded=[]
    with zipfile.ZipFile(path) as z:
        embedded=[{'part':part,'bytes':z.getinfo(part).file_size} for part in z.namelist() if part.startswith('ppt/media/') and Path(part).suffix.lower() in MEDIA_EXT]
        pres=ET.fromstring(z.read('ppt/presentation.xml'));pr=rels(z,'ppt/presentation.xml')
        for n,node in enumerate(pres.findall('.//p:sldId',NS),1):
            part=pr.get(node.attrib.get('{'+NS['r']+'}id'),{}).get('target')
            if not part or part not in z.namelist():warnings.append('Missing presentation slide relationship');continue
            rr=rels(z,part);add_section(sections,f'Slide {n}',xml_text(ET.fromstring(z.read(part))),'ooxml-text',part,slide=n)
            for rel in rr.values():
                target=rel['target']
                if rel['external']:add_section(sections,f'Slide {n} hyperlink',target,'ooxml-relationship',part+'#'+target,slide=n)
                elif rel['type']=='notesSlide' and target in z.namelist():
                    number=re.search(r'(\d+)\.xml$',part)
                    if number and target!='ppt/notesSlides/notesSlide'+number.group(1)+'.xml':mismatches+=1
                    add_section(sections,f'Slide {n} speaker notes',xml_text(ET.fromstring(z.read(target))),'ooxml-text',target,slide=n)
                elif rel['type'] in ('chart','diagramData') and target in z.namelist():
                    chart=ET.fromstring(z.read(target));text=xml_text(chart)
                    if rel['type']=='chart':text+='\n'+'\n'.join(x.text or '' for x in chart.iter() if localname(x.tag)=='v')
                    add_section(sections,f'Slide {n} chart or diagram data',text,'ooxml-text',target,slide=n)
                elif rel['type']=='image' and target in z.namelist():
                    data=z.read(target);result=ocr_bytes(data,cache)
                    add_section(sections,f'Slide {n} embedded image (machine OCR)',result.get('text',''),'machine-ocr',target+'#slide'+str(n),slide=n,ocr=result,imageUrl=store_visual(data,assets))
            slide_map.append({'number':n,'part':part,'notes':[v['target'] for v in rr.values() if v['type']=='notesSlide']})
    warnings.append('Stored slide and note text is preserved. Embedded-image OCR is machine transcription; inspect the original visual for exact lettering, numbering and punctuation.')
    if embedded:warnings.append('Embedded audiovisual media is preserved inside the original deck but has not been played or transcribed in this audit.')
    return {'slides':slide_map,'wrongFilenameNoteMappings':mismatches,'unreviewedEmbeddedMedia':embedded}

def docx_extract(path,sections,warnings,cache,assets):
    with zipfile.ZipFile(path) as z:
        parts=[p for p in z.namelist() if re.match(r'^word/(document|header\d+|footer\d+|footnotes|endnotes|comments)\.xml$',p)]
        for part in sorted(parts,key=lambda p:(p!='word/document.xml',p)):
            doc=ET.fromstring(z.read(part));add_section(sections,part.replace('word/','').replace('.xml',''),xml_text(doc,True),'ooxml-text',part)
            fields='\n'.join(x.text or '' for x in doc.iter() if localname(x.tag)=='instrText')
            add_section(sections,part+' field instructions',fields,'ooxml-field',part+'#fields')
            for rel in rels(z,part).values():
                if rel['external']:add_section(sections,'Document hyperlink',rel['target'],'ooxml-relationship',part+'#'+rel['target'])
        if 'word/numbering.xml' in z.namelist():
            doc=ET.fromstring(z.read('word/numbering.xml'));numbers=[]
            for el in doc.iter():
                if localname(el.tag) in ('lvlText','numFmt','start'):numbers.append(localname(el.tag)+': '+el.attrib.get('{'+NS['w']+'}val',''))
            add_section(sections,'Automatic numbering definitions','\n'.join(numbers),'ooxml-list-definition','word/numbering.xml')
        for part in z.namelist():
            if part.startswith('word/media/'):
                data=z.read(part);result=ocr_bytes(data,cache)
                add_section(sections,'Embedded image (machine OCR)',result.get('text',''),'machine-ocr',part,ocr=result,imageUrl=store_visual(data,assets))
    warnings.append('Stored document text is preserved. Automatic list numbering and layout are also available in the original/rendered document. Image OCR is not visually verified.')

def retain_original(path,digest):
    dest=Path(ORIGINAL_ROOT);dest.mkdir(parents=True,exist_ok=True)
    limit=4*1024*1024;length=path.stat().st_size;parts=[]
    with path.open('rb') as source:
        number=0
        while True:
            block=source.read(limit)
            if not block:break
            number+=1
            name=digest+(path.suffix.lower() if length<=limit else f'.part{number:03d}.bin')
            target=dest/name;block_sha=sha(block)
            if not target.exists() or target.stat().st_size!=len(block) or sha(target.read_bytes())!=block_sha:
                temporary=target.with_name(target.name+'.'+str(os.getpid())+'.tmp');temporary.write_bytes(block);temporary.replace(target)
            parts.append({'url':'/source-originals/'+name,'bytes':len(block),'sha256':block_sha})
    result={'filename':path.name,'bytes':length,'sha256':digest,'parts':parts}
    if len(parts)==1:result['url']=parts[0]['url']
    return result

def repair_vector_ocr(record,path,outdir,cache):
    errors=[s for s in record.get('sections',[]) if s.get('ocr',{}).get('status')=='ocr-error']
    if not errors or path.suffix.lower() not in ('.pptx','.docx'):return record
    with zipfile.ZipFile(path) as z:
        for section in errors:
            part=section['origin'].split('#',1)[0]
            if part not in z.namelist():continue
            result=ocr_bytes(z.read(part),cache)
            if result.get('status')=='ocr-error' and section.get('slide'):
                visual=next((s for s in record['sections'] if s.get('page')==section['slide'] and s['method']=='rendered-original' and s.get('imageUrl')),None)
                if visual:
                    raster=outdir/'images'/visual['imageUrl'].rsplit('/',1)[-1]
                    result=ocr_bytes(raster.read_bytes(),cache)
                    result['fallbackScope']='entire rendered slide; embedded vector image could not be rasterised independently'
                    section['label']=f"Slide {section['slide']} full visual OCR fallback for embedded vector"
                    section['imageUrl']=visual['imageUrl']
                    note='One embedded vector image uses explicitly labelled full-slide OCR as a fallback; consult the exact original deck for its independent artwork.'
                    if note not in record['warnings']:record['warnings'].append(note)
            section.update({'text':result.get('text',''),'characters':len(result.get('text','')),
              'textSha256':sha(result.get('text','').encode()),'ocr':result})
    record['characters']=sum(s['characters'] for s in record['sections'])
    return record

def extract_file(job,outdir,cache,render_office):
    path=Path(job['localPath']);data=path.read_bytes();digest=sha(data);dest=outdir/'files'/(digest+'.json')
    if dest.exists():
        try:
            previous=json.loads(dest.read_text())
            if previous.get('extractorVersion')==VERSION:
                previous=unique_section_ids(repair_vector_ocr(previous,path,outdir,cache))
                previous['originalDownload']=retain_original(path,digest);atomic_json(dest,previous);return previous
        except (ValueError,OSError):pass
    sections=[];warnings=[];details={};ext=path.suffix.lower();assets=outdir/'images'
    try:
        if ext in TEXT_EXT:
            encoding='utf-8'
            try:text=data.decode(encoding)
            except UnicodeDecodeError:
                encoding='utf-16' if data.startswith((b'\xff\xfe',b'\xfe\xff')) else 'cp1252';text=data.decode(encoding);warnings.append('Decoded as '+encoding)
            add_section(sections,'Complete source text',text,'literal-text','file',encoding=encoding)
        elif ext=='.pdf':
            details=pdf_extract(path,sections,warnings,cache,assets)
            warnings.append('PDF text-layer reading order follows the file. Machine OCR supplements image-bearing pages and is not certified character by character.')
        elif ext=='.pptx':
            details=pptx_extract(path,sections,warnings,cache,assets)
            if render_office:details['visualRendering']=office_visuals(path,sections,warnings,cache,assets)
        elif ext=='.docx':
            docx_extract(path,sections,warnings,cache,assets)
            if render_office:details['visualRendering']=office_visuals(path,sections,warnings,cache,assets)
        elif ext in IMAGE_EXT:
            result=ocr_bytes(data,cache);add_section(sections,'Image text (machine OCR)',result.get('text',''),'machine-ocr','image',ocr=result,imageUrl=store_visual(data,assets));warnings.append('Image OCR is machine transcription, not a certified reading. Exact original image remains available.')
        elif ext=='.rtf':
            with tempfile.TemporaryDirectory(prefix='source-rtf-') as td:
                subprocess.run(['soffice','-env:UserInstallation=file://'+td+'/profile','--headless','--convert-to','txt:Text (encoded):UTF8','--outdir',td,str(path.resolve())],capture_output=True,timeout=90,check=True)
                candidates=list(Path(td).glob('*.txt'))
                if candidates:
                    with candidates[0].open(encoding='utf-8',newline='') as handle:text=handle.read()
                    add_section(sections,'Complete RTF text',text,'libreoffice-text','file')
            warnings.append('RTF text conversion does not preserve layout; use the original for formatting.')
        else:warnings.append('No readable text extractor for '+ext+'; exact original retained.')
    except Exception as exc:warnings.append('EXTRACTION ERROR: '+str(exc))
    record={'id':digest,'sha256':digest,'extractorVersion':VERSION,'title':job.get('title',path.name),'format':ext.lstrip('.'),
      'bytes':len(data),'characters':sum(s['characters'] for s in sections),'sections':sections,'warnings':warnings,'details':details,
      'extractionStatus':'error' if any(w.startswith('EXTRACTION ERROR') for w in warnings) else ('text-extracted' if sections else 'original-only'),
      'literalTextPreserved':ext in TEXT_EXT,'originalDownload':retain_original(path,digest)}
    record=unique_section_ids(repair_vector_ocr(record,path,outdir,cache))
    atomic_json(dest,record);return record

def unit_week(path):
    value=path.lower();unit=next((u for u,k in [('laws2400','torts'),('laws2000','international'),('laws2000','pil'),('laws2100','juris'),('mgmt2094','marketing'),('mgmt2094','mgmt')] if k in value),'shared')
    match=re.search(r'(?:week[-_ ]*|topic[-_ ]*)(\d{1,2})',value)
    return unit,int(match.group(1)) if match else None

def read_download_map(path):
    if not path.exists():return []
    raw=json.loads(path.read_text())
    if isinstance(raw,list):return raw
    if isinstance(raw.get('files'),list):return raw['files']
    if isinstance(raw.get('downloads'),list):return raw['downloads']
    if isinstance(raw.get('files'),dict):return list(raw['files'].values())
    return [v for v in raw.values() if isinstance(v,dict) and v.get('id')]

def main():
    global ORIGINAL_ROOT
    ap=argparse.ArgumentParser();ap.add_argument('--root',default='.');ap.add_argument('--inventory');ap.add_argument('--download-map',action='append',default=[])
    ap.add_argument('--output',default='public/source-corpus');ap.add_argument('--cache',default='/workspace/sites/study-audit-work/ocr-cache');ap.add_argument('--workers',type=int,default=6);ap.add_argument('--no-office-visuals',action='store_true')
    args=ap.parse_args();root=Path(args.root).resolve();out=(root/args.output).resolve();cache=Path(args.cache);ORIGINAL_ROOT=str(root/'public/source-originals')
    for p in [out/'files',out/'images',cache]:p.mkdir(parents=True,exist_ok=True)
    jobs=[]
    for path in (root/'raw').rglob('*'):
        if path.is_file() and path.suffix.lower() not in MEDIA_EXT:
            relative=path.relative_to(root).as_posix();jobs.append({'localPath':str(path),'title':path.name,'path':relative,'url':'https://github.com/DeveshRamanan-collab/ChatGPT-StudySite/blob/main/'+relative,'origin':'repository'})
    inventory=json.loads(Path(args.inventory).read_text()) if args.inventory and Path(args.inventory).exists() else {'files':[]}
    mapping={}
    for file in args.download_map:
        for item in read_download_map(Path(file)):
            if item.get('id'):mapping[item['id']]=item
    missing=[];media=[]
    for item in inventory.get('files',[]):
        if str(item.get('mime_type','')).startswith(('video/','audio/')):
            media.append(item);continue
        entry={**item,**mapping.get(item['id'],{})};local=entry.get('localPath') or entry.get('local_path') or entry.get('workspace_path')
        if local and Path(local).is_file():jobs.append({**entry,'localPath':local,'origin':'drive'})
        else:missing.append({k:item.get(k) for k in ['id','title','path','url','mime_type','size']})
    byhash={}
    for job in jobs:byhash.setdefault(sha(Path(job['localPath']).read_bytes()),[]).append(job)
    results={};started=time.time()
    def checkpoint(complete=False):
        files=[]
        for digest,record in results.items():
            originals=byhash[digest];paths=list(dict.fromkeys(j.get('path',j['localPath']) for j in originals));unit,week=unit_week(' '.join(paths))
            drive=[{k:j.get(k) for k in ['id','title','path','url','mime_type','size']} for j in originals if j['origin']=='drive']
            files.append({k:record.get(k) for k in ['id','sha256','title','format','bytes','characters','extractionStatus','literalTextPreserved','originalDownload']}|{
              'paths':paths,'unit':unit,'week':week,'sectionCount':len(record.get('sections',[])),
              'ocrSections':sum(s['method']=='machine-ocr' for s in record.get('sections',[])),
              'warnings':record.get('warnings',[]),'details':record.get('details',{}),
              'originals':drive or [{'title':originals[0]['title'],'path':originals[0]['path'],'url':originals[0]['url']}],
              'dataUrl':'/source-corpus/files/'+digest+'.json'})
        for item in media:
            ident='drive-'+item['id'];unit,week=unit_week(item.get('path',''));warnings=['Audiovisual recording has not been watched or fully transcribed in this audit. Transcript candidates are not proof of recording coverage.']
            metadata={'id':ident,'sha256':None,'title':item['title'],'format':Path(item['title']).suffix.lstrip('.'),
              'bytes':int(item.get('size') or 0),'characters':0,'sections':[],'paths':[item.get('path','')],'unit':unit,'week':week,
              'warnings':warnings,'extractionStatus':'audiovisual-not-reviewed','literalTextPreserved':False,'originals':[item]}
            atomic_json(out/'files'/(ident+'.json'),metadata)
            files.append({k:v for k,v in metadata.items() if k!='sections'}|{'sectionCount':0,'ocrSections':0,'dataUrl':'/source-corpus/files/'+ident+'.json'})
        files.sort(key=lambda f:(f.get('unit') or '',f.get('week') or 0,f.get('title') or '',f['id']))
        summary={'generatedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'extractorVersion':VERSION,'complete':complete,
          'sourceOccurrences':len(jobs),'distinctFiles':len(files),'sections':sum(f['sectionCount'] for f in files),'characters':sum(f.get('characters') or 0 for f in files),
          'ocrSections':sum(f['ocrSections'] for f in files),'missingDriveFiles':len(missing),'unreviewedMedia':len(media),
          'ocrErrors':sum(s.get('ocr',{}).get('status')=='ocr-error' for record in results.values() for s in record.get('sections',[])),
          'failedExtractions':sum(f['extractionStatus']=='error' for f in files),
          'wrongFilenameNoteMappings':sum(f.get('details',{}).get('wrongFilenameNoteMappings',0) for f in files),
          'driveInventory':inventory.get('summary'), 'completedExtractions':len(results),'expectedDistinctByteFiles':len(byhash),
          'certification':'Extracted text is retained literally. OCR accuracy, audiovisual coverage and legal paraphrase correctness are separate uncompleted checks.'}
        atomic_json(out/'index.json',{'summary':summary,'files':files,'missing':missing})
        return summary
    checkpoint()
    with futures.ProcessPoolExecutor(max_workers=args.workers) as pool:
        tasks={pool.submit(extract_file,group[0],out,cache,not args.no_office_visuals):digest for digest,group in byhash.items()}
        for number,task in enumerate(futures.as_completed(tasks),1):
            try:results[tasks[task]]=task.result()
            except Exception as exc:
                digest=tasks[task];record={'id':digest,'sha256':digest,'title':byhash[digest][0]['title'],'extractionStatus':'error','warnings':['EXTRACTION ERROR: '+str(exc)],'sections':[],'characters':0};results[digest]=record;atomic_json(out/'files'/(digest+'.json'),record)
            if number%20==0:
                summary=checkpoint();print(json.dumps({'completed':number,'total':len(tasks),'seconds':round(time.time()-started),'sections':summary['sections']}),flush=True)
    final=checkpoint(True)
    used={part['url'].rsplit('/',1)[-1] for record in results.values() for part in record.get('originalDownload',{}).get('parts',[])}
    for generated in Path(ORIGINAL_ROOT).iterdir():
        if generated.is_file() and generated.name not in used:generated.unlink()
    print(json.dumps(final),flush=True)

if __name__=='__main__':main()
