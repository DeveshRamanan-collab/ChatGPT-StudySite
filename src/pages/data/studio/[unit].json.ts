import {getStudioData} from '../../../lib/studio-data';
export function getStaticPaths(){return ['laws2400','laws2000','laws2100','mgmt2094'].map(unit=>({params:{unit}}));}
export async function GET({params}:any){return new Response(JSON.stringify(await getStudioData(params.unit)),{headers:{'Content-Type':'application/json'}});}
