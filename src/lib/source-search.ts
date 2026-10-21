// Search only: source records and rendered text retain their original characters.
export function normaliseSourceSearch(text:string):string {
 return text.normalize('NFKC').toLocaleLowerCase('en-AU')
  .replace(/[‘’`]/g,"'")
  .replace(/[^\p{L}\p{N}'\s]/gu,' ')
  .replace(/\b(?:sections?|ss?)\s*(?=\d)/g,'')
  .replace(/\s+/g,' ').trim();
}
export function sourceMatchesQuery(text:string,query:string):boolean {
 const haystack=normaliseSourceSearch(text);
 return normaliseSourceSearch(query).split(' ').filter(Boolean).every(word=>haystack.includes(word));
}
