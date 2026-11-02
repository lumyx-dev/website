import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

// Les squelettes (`stub: true`) restent atteignables par la nav, donc par un crawler : le
// `noindex` est le second volet de leur exclusion, apres le sitemap.
export const onRequest = defineRouteMiddleware((context) => {
  const { entry, head } = context.locals.starlightRoute;
  if (entry.data.stub) head.push({ tag: 'meta', attrs: { name: 'robots', content: 'noindex' } });
});
