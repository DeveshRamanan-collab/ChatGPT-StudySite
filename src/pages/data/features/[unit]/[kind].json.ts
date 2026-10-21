// /data/features/<unit>/<kind>.json — authored feature data for islands (src/lib/feature-data.ts). Always emitted for
// every unit × kind, as the empty shape until the YAML exists, so client fetches never 404.
import type { APIRoute, GetStaticPaths } from 'astro';
import { units } from '../../../../lib/content';
import { FEATURE_KINDS, featureData, type FeatureKind } from '../../../../lib/feature-data';

export const getStaticPaths: GetStaticPaths = async () =>
  (await units()).flatMap((u) => FEATURE_KINDS.map((kind) => ({ params: { unit: u.id, kind } })));

export const GET: APIRoute = ({ params }) =>
  new Response(JSON.stringify(featureData(params.unit!, params.kind as FeatureKind)), { headers: { 'content-type': 'application/json' } });
