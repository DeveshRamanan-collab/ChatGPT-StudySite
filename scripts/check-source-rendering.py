#!/usr/bin/env python3
"""Audit exact extracted-source text against all generated HTML source pages.

No whitespace, Unicode, case, digit or punctuation normalisation is performed.
This is a publication-fidelity check, not an OCR or legal-accuracy certificate.
"""
import argparse
from collections import Counter
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
import unicodedata

ROOT = Path(__file__).resolve().parents[1]
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
        'meta', 'param', 'source', 'track', 'wbr'}


class SourceText(HTMLParser):
    """Collect text nodes only inside the source section's marked text element."""
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.section_markers = Counter()
        self.texts = {}
        self.orphan_text_elements = 0
        self.feed(html)
        self.close()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        parent_section = self.stack[-1]['section'] if self.stack else None
        section = attrs.get('data-source-section', parent_section)
        if 'data-source-section' in attrs:
            self.section_markers[section] += 1
        capture = None
        if 'data-source-text' in attrs:
            if section is None:
                self.orphan_text_elements += 1
            capture = []
            self.texts.setdefault(section, []).append(capture)
        if tag not in VOID:
            self.stack.append({'tag': tag, 'section': section, 'capture': capture})

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        # Static Astro output is well formed. Matching by tag also makes the
        # checker independent of unrelated void elements in the site chrome.
        for n in range(len(self.stack) - 1, -1, -1):
            if self.stack[n]['tag'] == tag:
                del self.stack[n:]
                break

    def handle_data(self, data):
        for frame in self.stack:
            if frame['capture'] is not None:
                frame['capture'].append(data)

    def values(self, section):
        return [''.join(parts) for parts in self.texts.get(section, [])]


def first_difference(expected, actual):
    limit = min(len(expected), len(actual))
    for n in range(limit):
        if expected[n] != actual[n]:
            return n
    return limit if len(expected) != len(actual) else None


def original_ids(record):
    return {o['id'] for o in record.get('originals', [])
            if isinstance(o, dict) and isinstance(o.get('id'), str)}


def run(inventory_path):
    corpus = ROOT / 'public/source-corpus'
    index = json.loads((corpus / 'index.json').read_text(encoding='utf-8'))
    files = index['files']
    failures = []
    ids = [f.get('id') for f in files]
    duplicate_ids = [key for key, count in Counter(ids).items() if count > 1]
    if duplicate_ids:
        failures.append({'reason': 'Duplicate source identifiers', 'ids': duplicate_ids})

    checked_pages = checked_sections = characters = digits = punctuation = 0
    metadata_only_pages = 0
    accounted_drive_ids = set()
    for meta in files:
        source_id = meta.get('id')
        accounted_drive_ids |= original_ids(meta)
        if not isinstance(source_id, str) or not re.fullmatch(r'[A-Za-z0-9_-]+', source_id):
            failures.append({'source': source_id, 'reason': 'Invalid source identifier'})
            continue
        record_path = corpus / 'files' / f'{source_id}.json'
        html_path = ROOT / 'dist/sources' / source_id / 'index.html'
        if not record_path.is_file() or not html_path.is_file():
            failures.append({'source': source_id, 'reason': 'Missing source JSON or generated page',
                             'jsonExists': record_path.is_file(), 'htmlExists': html_path.is_file()})
            continue
        record = json.loads(record_path.read_text(encoding='utf-8'))
        accounted_drive_ids |= original_ids(record)
        sections = record.get('sections', [])
        # newline='' retains any actual CR in the emitted HTML. Entity-decoded
        # CRs are also retained by HTMLParser; there is no read_text conversion.
        with html_path.open(encoding='utf-8', newline='') as handle:
            html = handle.read()
        parsed = SourceText(html)
        checked_pages += 1
        if not sections:
            metadata_only_pages += 1
        expected_section_ids = [s.get('id') for s in sections]
        if len(expected_section_ids) != len(set(expected_section_ids)):
            failures.append({'source': source_id, 'reason': 'Duplicate section identifiers in JSON'})
        if sum(parsed.section_markers.values()) != len(sections):
            failures.append({'source': source_id, 'reason': 'Rendered section count differs',
                             'expected': len(sections), 'actual': sum(parsed.section_markers.values())})
        if parsed.orphan_text_elements:
            failures.append({'source': source_id, 'reason': 'Source text element outside a source section',
                             'count': parsed.orphan_text_elements})
        for section in sections:
            section_id = section['id']
            expected = section['text']
            values = parsed.values(section_id)
            if parsed.section_markers[section_id] != 1 or len(values) != 1:
                failures.append({'source': source_id, 'section': section_id,
                                 'reason': 'Expected exactly one section and one source-text element',
                                 'sectionMarkers': parsed.section_markers[section_id], 'textElements': len(values)})
            if values != [expected]:
                actual = values[0] if values else ''
                offset = first_difference(expected, actual)
                failures.append({'source': source_id, 'section': section_id,
                                 'reason': 'Rendered text differs character for character',
                                 'expectedLength': len(expected), 'actualLengths': [len(v) for v in values],
                                 'firstDifference': offset,
                                 'expectedCodePoint': ord(expected[offset]) if offset is not None and offset < len(expected) else None,
                                 'actualCodePoint': ord(actual[offset]) if offset is not None and offset < len(actual) else None})
            digest = hashlib.sha256(expected.encode('utf-8')).hexdigest()
            if section.get('textSha256') and section['textSha256'] != digest:
                failures.append({'source': source_id, 'section': section_id,
                                 'reason': 'Extracted section SHA-256 differs from its text'})
            checked_sections += 1
            characters += len(expected)
            digits += sum(c.isdecimal() for c in expected)
            punctuation += sum(unicodedata.category(c).startswith('P') for c in expected)
        unexpected = set(parsed.section_markers) - set(expected_section_ids)
        if unexpected:
            failures.append({'source': source_id, 'reason': 'Unexpected rendered source sections',
                             'sections': sorted(unexpected)})

    declared_missing = index.get('missing', [])
    missing_ids = {r['id'] for r in declared_missing if isinstance(r, dict) and isinstance(r.get('id'), str)}
    accounted_drive_ids |= missing_ids
    inventory_ids = set()
    inventory_count = None
    if inventory_path.is_file():
        inventory = json.loads(inventory_path.read_text(encoding='utf-8'))
        inventory_ids = {f['id'] for f in inventory['files']}
        inventory_count = len(inventory['files'])
        unaccounted = sorted(inventory_ids - accounted_drive_ids)
        if unaccounted:
            failures.append({'reason': 'Inventoried Drive files omitted from corpus and declared-missing list', 'ids': unaccounted})
    else:
        failures.append({'reason': 'Drive inventory unavailable; full file accounting could not be checked',
                         'path': str(inventory_path)})

    result = {
        'method': 'Exact Unicode equality after HTML entity decoding, with exactly one text element per source section; no whitespace, case, Unicode or punctuation normalisation',
        'sourcePages': len(files), 'checkedSourcePages': checked_pages,
        'metadataOnlyPages': metadata_only_pages, 'checkedSections': checked_sections,
        'checkedCharacters': characters, 'checkedDigits': digits,
        'checkedPunctuationCharacters': punctuation,
        'driveFileAccounting': {'inventoryEntries': inventory_count, 'distinctInventoriedIds': len(inventory_ids),
                               'accountedInventoriedIds': len(inventory_ids & accounted_drive_ids),
                               'declaredMissingIds': sorted(missing_ids)},
        'failures': failures,
        'limits': 'Checks extracted source JSON to generated HTML and inventory accounting only. It does not certify PDF reading order, extraction completeness, OCR accuracy, audiovisual transcription or the correctness/completeness of legal paraphrases. Metadata-only and declared-missing files remain explicit gaps.'
    }
    (ROOT / 'reports/source-rendering-audit.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({key: value for key, value in result.items() if key != 'failures'}, ensure_ascii=False, indent=2))
    print(f'Failures: {len(failures)}')
    if failures:
        print(json.dumps(failures[:20], ensure_ascii=False, indent=2))
    return bool(failures)


def self_test():
    expected = '\n s 5B(1)(c). [2026] HCA 4; \r\n<risk> & “quote” 7\tend'
    encoded = '\n s 5B(1)(c). [2026] HCA 4; &#13;\n&lt;risk&gt; &amp; “quote” 7\tend'
    sample = '<section data-source-section="s-1"><h2>Not source text</h2><div data-source-text>' + encoded + '</div><img src="x"><p>Not source text</p></section>'
    parsed = SourceText(sample)
    assert parsed.values('s-1') == [expected]
    assert parsed.section_markers == {'s-1': 1}
    assert first_difference('5B', '5D') == 1
    assert first_difference('7', '7\n') == 1
    print('HTML text fidelity parser self-test passed (initial LF, CRLF, entities, section numbers, citation, punctuation and Unicode).')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--inventory', type=Path, default=ROOT / 'reports/source-drive-inventory.json')
    parser.add_argument('--self-test', action='store_true')
    args = parser.parse_args()
    if args.self_test:
        self_test()
        sys.exit(0)
    sys.exit(run(args.inventory))
