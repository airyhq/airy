module.exports = {
  title: 'Airy Documentation',
  tagline: 'Airy documentation website',
  url: 'https://airy.co',
  baseUrl: process.env.CONTEXT === 'production' ? '/docs/core/' : '/',
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
      theme: require('./src/plugins/prism_themes/github'),
      darkTheme: require('./src/plugins/prism_themes/monokai'),
      additionalLanguages: ['json5'],
    },
    navbar: {
      logo: {
        alt: 'Airy Documentation',
        src: 'img/logo_light.svg',
        srcDark: 'img/logo_dark.svg',
        href: 'https://airy.co',
        target: '_self',
      },
      items: [
        {
          type: 'search',
          position: 'left',
        },
        {
          target: '_self',
          label: 'Why Airy?',
          position: 'left',
          to: 'https://airy.co/',
        },
        {
          target: '_self',
          label: 'Developers',
          position: 'left',
          href: 'https://airy.co/developers',
        },
        {
          target: '_self',
          label: 'Blog',
          position: 'left',
          to: 'https://blog.airy.co/',
        },
        {
          target: '_self',
          label: 'Core Docs',
          position: 'left',
          href: 'https://airy.co/docs/core/',
        },
        {
          target: '_self',
          label: 'Enterprise Docs',
          position: 'left',
          to: 'https://airy.co/docs/enterprise/',
        },
        {
          target: '_self',
          label: 'Solutions',
          position: 'left',
          href: 'https://airy.co/solutions',
        },
        {
          target: '_self',
          label: 'Customer Stories',
          position: 'left',
          to: 'https://airy.co/customer-stories',
        },
        {
          target: '_self',
          label: 'Pricing',
          position: 'left',
          href: 'https://airy.co/pricing',
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
