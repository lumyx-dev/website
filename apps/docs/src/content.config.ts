import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    // `stub` : voir src/lib/stubs.ts.
    schema: docsSchema({ extend: z.object({ stub: z.boolean().optional() }) }),
  }),
};
