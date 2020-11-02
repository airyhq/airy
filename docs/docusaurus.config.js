module.exports = {
  title: 'Airy Documentation',
  tagline: 'Airy documentation website',
  url: 'https://docs.airy.co',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'airyhq', // Usually your GitHub org/user name.
  projectName: 'airy', // Usually your repo name.
  themeConfig: {
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('./src/plugins/prism_themes/monokai'),
    },
    navbar: {
      title: 'Documentation',
      logo: {
        alt: 'Airy Documentation',
        src: 'img/logo.svg',
      }
    },
    footer: {
      style: 'light',
      copyright: `Copyright © ${new Date().getFullYear()} Airy, Inc.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/airyhq/airy/edit/master/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
