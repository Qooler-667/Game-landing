import autoprefixer from 'autoprefixer';
import sortMediaQueries from 'postcss-sort-media-queries';

export default {
  plugins: [
    autoprefixer({ overrideBrowserslist: ['last 10 versions'] }),
    sortMediaQueries({ sort: 'mobile-first' }),
  ],
};
