import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    // https://ileumas.com/writing/2022/03/astro-math-katex/
    markdown: {
        remarkPlugins: [
            remarkMath,
        ],
        rehypePlugins: [
            rehypeKatex,
        ]
    },
	site: 'https://justinchiu.netlify.app',
	integrations: [mdx(), sitemap()],
});
