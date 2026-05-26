import { defineConfig } from 'vite';
import injectHTML from 'vite-plugin-html-inject';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import fs from 'fs';
import path from 'path';
import { load } from 'cheerio';
import { optimize } from 'svgo';
import sharp from 'sharp';
import ttf2woff2 from 'ttf2woff2';

function viteFontConverterPlugin() {
  return {
    name: 'vite-plugin-font-converter',
    apply: 'build',
    buildStart() {
      const fontsDir = path.resolve(__dirname, 'src/fonts');
      const outputDir = path.resolve(__dirname, 'public/fonts'); //

      if (!fs.existsSync(fontsDir)) return;
      if (!fs.existsSync(outputDir))
        fs.mkdirSync(outputDir, { recursive: true });

      fs.readdirSync(fontsDir).forEach((file) => {
        const ext = path.extname(file).toLowerCase();
        if (ext === '.ttf' || ext === '.otf') {
          const fontName = path.parse(file).name;
          const distPath = path.join(outputDir, `${fontName}.woff2`);

          if (!fs.existsSync(distPath)) {
            try {
              const inputBuffer = fs.readFileSync(path.join(fontsDir, file));
              fs.writeFileSync(distPath, ttf2woff2(inputBuffer));
              console.log(
                `\x1b[32m✓ Шрифт создан в public: ${fontName}.woff2\x1b[0m`
              );
            } catch (err) {
              console.error(
                `\x1b[31m✕ Ошибка конвертации ${file}:\x1b[0m`,
                err
              );
            }
          }
        }
      });
    },
  };
}

function viteImageToWebpPlugin() {
  return {
    name: 'vite-plugin-image-to-webp',
    apply: 'build',
    async buildStart() {
      const imagesDir = path.resolve(__dirname, 'src/images');
      const outputDir = path.resolve(__dirname, 'public');

      if (!fs.existsSync(imagesDir)) return;
      if (!fs.existsSync(outputDir))
        fs.mkdirSync(outputDir, { recursive: true });

      const processFolder = async (dir, relativePath = '') => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const filePath = path.join(dir, file);
          const targetDir = path.join(outputDir, relativePath);

          if (fs.statSync(filePath).isDirectory()) {
            if (file !== 'icons') {
              fs.mkdirSync(path.join(targetDir, file), { recursive: true });
              await processFolder(filePath, path.join(relativePath, file));
            }
          } else {
            const ext = path.extname(file).toLowerCase();
            const outputPath = path.join(
              targetDir,
              path.parse(file).name + '.webp'
            );

            if (['.jpg', '.jpeg', '.png'].includes(ext)) {
              if (!fs.existsSync(outputPath)) {
                await sharp(filePath).webp({ quality: 80 }).toFile(outputPath);
                console.log(`\x1b[36m✓ WebP создан из ${file}\x1b[0m`);
              }
            } else if (ext === '.webp') {
              if (!fs.existsSync(outputPath)) {
                fs.copyFileSync(filePath, outputPath);
                console.log(
                  `\x1b[32m✓ Существующий WebP скопирован: ${file}\x1b[0m`
                );
              }
            }
          }
        }
      };
      await processFolder(imagesDir);
    },
  };
}

function viteSvgSpritePlugin() {
  return {
    name: 'vite-plugin-custom-sprite',
    handleHotUpdate({ file, server }) {
      if (file.includes('src/images/icons') && file.endsWith('.svg')) {
        buildSprite();
        server.ws.send({ type: 'full-reload' });
      }
    },
    buildStart() {
      buildSprite();
    },
  };
}

function buildSprite() {
  const iconsDir = path.resolve(__dirname, 'src/images/icons');
  const outputDir = path.resolve(__dirname, 'public');
  if (!fs.existsSync(iconsDir)) return;
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const files = fs.readdirSync(iconsDir).filter((f) => f.endsWith('.svg'));
  let symbols = files.map((file) => {
    const filename = path.parse(file).name;
    let svgContent = fs.readFileSync(path.join(iconsDir, file), 'utf-8');
    const result = optimize(svgContent, {
      multipass: true,
      plugins: [
        'preset-default',
        'removeDimensions',
        'collapseGroups',
        {
          name: 'removeAttrs',
          params: { attrs: 'opacity' },
        },
      ],
    });
    const $ = load(result.data, { xmlMode: true });
    const $shapes = $('path, circle, rect, ellipse, polygon, polyline');

    if ($shapes.length > 0 && $shapes.length <= 4) {
      $shapes.each(function (i) {
        $(this).attr('fill', `var(--color-${i + 1}, #000)`);
        if ($(this).attr('stroke'))
          $(this).attr('stroke', `var(--stroke-${i + 1}, #000)`);
        $(this).attr(
          'style',
          'transition: fill var(--icon-duration, 0.3s) ease, stroke var(--icon-duration, 0.3s) ease;'
        );
      });
      $('style').remove();
    }
    return `<symbol id="${filename}" viewBox="${$('svg').attr('viewBox') || '0 0 24 24'}">${$('svg').html()}</symbol>`;
  });

  fs.writeFileSync(
    path.join(outputDir, 'icons.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${symbols.join('')}</svg>`
  );
}

export default defineConfig({
  base: './',
  server: { host: '0.0.0.0', port: 5173 },
  build: { outDir: 'docs', emptyOutDir: true },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        loadPaths: [path.resolve(__dirname, 'src/styles')],
      },
    },
  },
  plugins: [
    injectHTML(),
    viteFontConverterPlugin(),
    viteImageToWebpPlugin(),
    viteSvgSpritePlugin(),
    ViteImageOptimizer({
      exclude: [/\.webp$/i],
      webp: { quality: 80 },
      avif: { quality: 75 },
    }),
  ],
});
