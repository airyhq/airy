module.exports = {
  title: 'Airy Documentation',
  tagline: 'The tagline of my site',
  url: 'https://docs.airy.co',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'airyhq', // Usually your GitHub org/user name.
  projectName: 'airy', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Airy Documentation',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      }
    },
    footer: {
      style: 'dark',
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
