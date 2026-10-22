import {describe, expect, it} from 'vitest';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname,join} from 'node:path';
import {pptx} from '../scripts/extract.mjs';

describe('PowerPoint source fidelity',()=>{
  it('uses presentation order and slide relationships for notes, retaining number-only lines',()=>{
    const dir=mkdtempSync(join(tmpdir(),'source-corpus-test-'));
    const para=(text:string)=>`<a:p><a:r><a:t>${text}</a:t></a:r></a:p>`;
    const files:Record<string,string>={
      'ppt/presentation.xml':'<p:presentation><p:sldIdLst><p:sldId id="2" r:id="second"/><p:sldId id="1" r:id="first"/></p:sldIdLst></p:presentation>',
      'ppt/_rels/presentation.xml.rels':'<Relationships><Relationship Id="first" Target="slides/slide1.xml"/><Relationship Id="second" Target="slides/slide2.xml"/></Relationships>',
      'ppt/slides/slide1.xml':para('Second in presentation'),
      'ppt/slides/slide2.xml':para('First in presentation'),
      'ppt/slides/_rels/slide1.xml.rels':'<Relationships><Relationship Id="notes" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesSlide" Target="../notesSlides/notesSlide9.xml"/></Relationships>',
      'ppt/slides/_rels/slide2.xml.rels':'<Relationships><Relationship Id="notes" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesSlide" Target="../notesSlides/notesSlide3.xml"/></Relationships>',
      'ppt/notesSlides/notesSlide9.xml':para('Second notes s 5B(1)(c).')+para('7'),
      'ppt/notesSlides/notesSlide3.xml':para('First notes [2026] HCA 4.'),
    };
    try{
      for(const [part,text] of Object.entries(files)){const target=join(dir,part);mkdirSync(dirname(target),{recursive:true});writeFileSync(target,text);}
      execFileSync('zip',['-qr',join(dir,'fixture.pptx'),'ppt'],{cwd:dir});
      expect(pptx(join(dir,'fixture.pptx'))).toBe('--- slide 1 ---\nFirst in presentation\n[speaker notes]\nFirst notes [2026] HCA 4.\n\n--- slide 2 ---\nSecond in presentation\n[speaker notes]\nSecond notes s 5B(1)(c).\n7');
    }finally{rmSync(dir,{recursive:true,force:true});}
  });
  it('retains whitespace, tabs, explicit line breaks and hexadecimal punctuation',()=>{
    const dir=mkdtempSync(join(tmpdir(),'source-corpus-whitespace-'));
    const files:Record<string,string>={
      'ppt/presentation.xml':'<p:presentation><p:sldId r:id="s"/></p:presentation>',
      'ppt/_rels/presentation.xml.rels':'<Relationships><Relationship Id="s" Target="slides/slide1.xml"/></Relationships>',
      'ppt/slides/slide1.xml':'<a:p><a:r><a:t>  s 5B</a:t></a:r><a:tab/><a:r><a:t>(1)</a:t></a:r><a:br/><a:r><a:t>&#x2019; &amp; &lt;x&gt;  </a:t></a:r></a:p>',
    };
    try{
      for(const [part,text] of Object.entries(files)){const target=join(dir,part);mkdirSync(dirname(target),{recursive:true});writeFileSync(target,text);}
      execFileSync('zip',['-qr',join(dir,'fixture.pptx'),'ppt'],{cwd:dir});
      expect(pptx(join(dir,'fixture.pptx'))).toBe('--- slide 1 ---\n  s 5B\t(1)\n’ & <x>  ');
    }finally{rmSync(dir,{recursive:true,force:true});}
  });
  it('preserves numeric paragraphs and empty paragraphs in the published Python extractor',()=>{
    const code=[
      'import importlib.util,json,sys,xml.etree.ElementTree as ET',
      'spec=importlib.util.spec_from_file_location("source_corpus_fixture",sys.argv[1])',
      'module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)',
      'sections=[]',
      'module.add_section(sections,"Repeated hyperlink","s 5B(1)","literal-text","same-target")',
      'module.add_section(sections,"Repeated hyperlink","s 5B(1)","literal-text","same-target")',
      'print(json.dumps({"text":module.xml_text(ET.fromstring(sys.argv[2])),"sections":sections}))',
    ].join('\n');
    const xml='<a:root xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:p><a:r><a:t>  s 5B</a:t></a:r><a:tab/><a:r><a:t>(1)</a:t></a:r><a:br/><a:r><a:t>&#x2019; &amp; &lt;x&gt;  </a:t></a:r></a:p><a:p><a:r><a:t>7</a:t></a:r></a:p><a:p/><a:p><a:r><a:t>final.</a:t></a:r></a:p></a:root>';
    const output=execFileSync(process.env.CODEX_PRIMARY_RUNTIME_PYTHON || 'python3',['-c',code,join(process.cwd(),'scripts/source-corpus.py'),xml],{encoding:'utf8'});
    const result=JSON.parse(output);
    expect(result.text).toBe('  s 5B\t(1)\n’ & <x>  \n7\n\nfinal.');
    expect(result.sections.map((section:{text:string})=>section.text)).toEqual(['s 5B(1)','s 5B(1)']);
    expect(new Set(result.sections.map((section:{id:string})=>section.id)).size).toBe(2);
  });
  it('rejects failed OCR processes and unchecked old cache entries before reusing verified successful results',()=>{
    const code=[
      'import importlib.util,io,json,sys,tempfile',
      'from pathlib import Path',
      'from types import SimpleNamespace',
      'from unittest.mock import patch',
      'from PIL import Image',
      'spec=importlib.util.spec_from_file_location("source_corpus_fixture",sys.argv[1])',
      'module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)',
      'buffer=io.BytesIO();Image.new("RGB",(100,40),"white").save(buffer,format="PNG");data=buffer.getvalue()',
      'with tempfile.TemporaryDirectory() as directory:',
      ' cache=Path(directory);entry=cache/(module.sha(data)+".json")',
      ' entry.write_text(json.dumps({"status":"machine-ocr-unverified","text":"unchecked old result"}))',
      ' with patch.object(module.subprocess,"run",return_value=SimpleNamespace(returncode=1,stdout="",stderr="fixture failure")):',
      '  failed=module.ocr_bytes(data,cache)',
      ' header="level\\tpage_num\\tblock_num\\tpar_num\\tline_num\\tword_num\\tleft\\ttop\\twidth\\theight\\tconf\\ttext\\n"',
      ' row="5\\t1\\t1\\t1\\t1\\t1\\t0\\t0\\t10\\t10\\t99\\ts\\n"',
      ' with patch.object(module.subprocess,"run",return_value=SimpleNamespace(returncode=0,stdout=header+row,stderr="")):',
      '  successful=module.ocr_bytes(data,cache)',
      ' with patch.object(module.subprocess,"run",side_effect=RuntimeError("cache should avoid execution")):',
      '  cached=module.ocr_bytes(data,cache)',
      ' print(json.dumps({"failed":failed,"successful":successful,"cached":cached}))',
    ].join('\n');
    const output=execFileSync(process.env.CODEX_PRIMARY_RUNTIME_PYTHON || 'python3',['-c',code,join(process.cwd(),'scripts/source-corpus.py')],{encoding:'utf8'});
    const result=JSON.parse(output);
    expect(result.failed.status).toBe('ocr-error');
    expect(result.failed.error).toContain('Tesseract exited with code 1: fixture failure');
    expect(result.successful.text).toBe('s');
    expect(result.successful.processExitCode).toBe(0);
    expect(result.cached).toEqual(result.successful);
  });
});
