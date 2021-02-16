module.exports = {
  title: 'Airy Documentation',
  tagline: 'Airy documentation website',
  url: 'https://airy.co',
  baseUrl: '/docs/core/',
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
      logo: {
        alt: 'Airy Documentation',
        src: 'img/logo_light.svg',
        srcDark: 'img/logo_dark.svg',
      },
      items: [
        {
          target: '_self',
          label: 'Airy Core',
          position: 'left',
          to: '/',
        },
        {
          target: '_self',
          label: 'Airy Enterprise',
          position: 'left',
          href: 'https://airy.co/docs/enterprise/',
        },
        {
          href: 'https://github.com/airyhq/airy',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
          position: 'right',
        },
        {
          target: '_self',
          label: 'Need help?',
          position: 'right',
          to: '/getting-started/troubleshooting',
        },
      ],
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
          showLastUpdateTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
