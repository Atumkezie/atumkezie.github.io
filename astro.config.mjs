import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://hk0922.github.io',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
