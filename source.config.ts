import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
import { remarkInstall } from "fumadocs-docgen";
import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from "fumadocs-mdx/config";

export const { docs, meta } = defineDocs({
  dir: "content/docs",
  docs: {
    schema: frontmatterSchema,
    // Ignore any files with `_` prefix
    files: ["**/*.mdx", "!**/_*.mdx"],
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    // Path to import your `mdx-components.tsx` file
    providerImportSource: '@/mdx-components',
    remarkPlugins: [
      [
        remarkInstall,
        {
          persist: {
            id: "package-install",
          },
        },
      ],
    ],
    rehypeCodeOptions: {
      lazy: true,
      inline: "tailing-curly-colon",
      themes: {
        light: "github-light",
        dark: "github-dark",
      }
      ,
      transformers: [...(rehypeCodeDefaultOptions.transformers ?? [])],
    },
  },
});
