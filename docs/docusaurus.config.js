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
    googleAnalytics: {
      trackingID: 'UA-74312428-5',
    },
    hideableSidebar: true,
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('./src/plugins/prism_themes/monokai'),
      additionalLanguages: ['json5'],
    },
    navbar: {
      items: [
        {
          type: 'search',
          position: 'left',
        },
      ],
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
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
