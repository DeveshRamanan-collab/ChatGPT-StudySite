import type { APIRoute } from 'astro';
import { getJumpIndex } from '../../lib/rebuild';
export const GET: APIRoute = async () => new Response(JSON.stringify(await getJumpIndex()),{headers:{'content-type':'application/json'}});
