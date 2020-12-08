module.exports = {
  title: 'Airy Documentation',
  tagline: 'Airy documentation website',
  url: 'https://docs.airy.co',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'airyhq',
  projectName: 'airy',
  themeConfig: {
    algolia: {
      apiKey: '768788b65303eb29ca1f195847ed1e78',
      indexName: 'airy',
    },
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('./src/plugins/prism_themes/monokai'),
      additionalLanguages: ['json5'],
    },
    navbar: {
      title: 'Documentation',
      logo: {
        alt: 'Airy Documentation',
        src: 'img/logo.svg',
      },
    },
    footer: {
      style: 'light',
      copyright: `Copyright © ${new Date().getFullYear()} Airy, Inc.`,
    },
  },
  plugins: ['plugin-image-zoom'],
  scripts: ['https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js'],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/airyhq/airy/edit/main/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
