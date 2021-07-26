---
title: Changelog
sidebar_label: 📝 Changelog
---

## Hotfix 0.26.3

[[#2192](https://github.com/airyhq/airy/issues/2192)] Inbox crashing when selecting conversations in filtered view [[#2193](https://github.com/airyhq/airy/pull/2193)]

## Hotfix 0.26.2

[[#2187](https://github.com/airyhq/airy/issues/2187)] Hotfix chat plugin async bundle loading failed on installed websites

## Hotfix 0.26.1

[[#2181](https://github.com/airyhq/airy/issues/2181)] Fixes chat plugin integration crashing with empty config


## 0.26.0

#### Changes

- Change endpoint for webhook to /twilio [[#2123](https://github.com/airyhq/airy/pull/2123)]
- Fixes #2100 - link to up-to-date Rasa connector [[#2101](https://github.com/airyhq/airy/pull/2101)]
- [[#1702](https://github.com/airyhq/airy/issues/1702)] Update conversations counter in real time [[#2091](https://github.com/airyhq/airy/pull/2091)]

#### 🚀 Features

- [[#2078](https://github.com/airyhq/airy/issues/2078)] Add endpoint for uploading media [[#2147](https://github.com/airyhq/airy/pull/2147)]
- [[#2132](https://github.com/airyhq/airy/issues/2132)] Allow deleting messages [[#2136](https://github.com/airyhq/airy/pull/2136)]
- [[#2051](https://github.com/airyhq/airy/issues/2051)] Support instagram as a source [[#2082](https://github.com/airyhq/airy/pull/2082)]
- [[#2071](https://github.com/airyhq/airy/issues/2071)] Redesigned inputbar Chatplugin [[#2095](https://github.com/airyhq/airy/pull/2095)]
- [[#661](https://github.com/airyhq/airy/issues/661)] Added possibility to connect Google via UI [[#2092](https://github.com/airyhq/airy/pull/2092)]
- [[#2073](https://github.com/airyhq/airy/issues/2073)] Added powered by airy to Chatplugin [[#2089](https://github.com/airyhq/airy/pull/2089)]
- [[#2074](https://github.com/airyhq/airy/issues/2074)] Added subtitle to Chatplugin [[#2087](https://github.com/airyhq/airy/pull/2087)]
- [[#1916](https://github.com/airyhq/airy/issues/1916)] Cypress test for display name edit [[#2088](https://github.com/airyhq/airy/pull/2088)]
- [[#1914](https://github.com/airyhq/airy/issues/1914)] Cypress test for conversation state  [[#2061](https://github.com/airyhq/airy/pull/2061)]
- [[#1391](https://github.com/airyhq/airy/issues/1391)] Cypress test for suggested replies  [[#2057](https://github.com/airyhq/airy/pull/2057)]
- [[#2056](https://github.com/airyhq/airy/issues/2056)] Added first transition and animations [[#2066](https://github.com/airyhq/airy/pull/2066)]
- [[#1819](https://github.com/airyhq/airy/issues/1819)] Add Airy favicon [[#2067](https://github.com/airyhq/airy/pull/2067)]

#### 🐛 Bug Fixes

- [[#2149](https://github.com/airyhq/airy/issues/2149)] UI crashes when filtering with unknown source involved  [[#2152](https://github.com/airyhq/airy/pull/2152)]
- [[#2072](https://github.com/airyhq/airy/issues/2072)] Chat Plugin: Emoji Selector [[#2121](https://github.com/airyhq/airy/pull/2121)]
- [[#2093](https://github.com/airyhq/airy/issues/2093)] Fixed moving avatar in ConversationListItem [[#2094](https://github.com/airyhq/airy/pull/2094)]
- [[#2069](https://github.com/airyhq/airy/issues/2069)] fix http client and chat plugin packages [[#2070](https://github.com/airyhq/airy/pull/2070)]
- [[#2060](https://github.com/airyhq/airy/issues/2060)] edit text templates  [[#2068](https://github.com/airyhq/airy/pull/2068)]

#### 🧰 Maintenance

- Bump @types/react-redux from 7.1.16 to 7.1.18 [[#2138](https://github.com/airyhq/airy/pull/2138)]
- Bump cypress from 7.6.0 to 7.7.0 [[#2145](https://github.com/airyhq/airy/pull/2145)]
- Bump @types/react-dom from 17.0.8 to 17.0.9 [[#2146](https://github.com/airyhq/airy/pull/2146)]
- Bump sass from 1.35.1 to 1.35.2 [[#2141](https://github.com/airyhq/airy/pull/2141)]
- Bump @typescript-eslint/parser from 4.28.1 to 4.28.2 [[#2113](https://github.com/airyhq/airy/pull/2113)]
- Bump @types/react-router-dom from 5.1.7 to 5.1.8 [[#2137](https://github.com/airyhq/airy/pull/2137)]
- Bump @types/resize-observer-browser from 0.1.5 to 0.1.6 [[#2135](https://github.com/airyhq/airy/pull/2135)]
- Bump @typescript-eslint/eslint-plugin from 4.28.1 to 4.28.2 [[#2112](https://github.com/airyhq/airy/pull/2112)]
- Bump @types/react-window-infinite-loader from 1.0.3 to 1.0.4 [[#2130](https://github.com/airyhq/airy/pull/2130)]
- [[#1590](https://github.com/airyhq/airy/issues/1590)] Refactor: Split chatplugin into library and app targets [[#2120](https://github.com/airyhq/airy/pull/2120)]
- [[#2014](https://github.com/airyhq/airy/issues/2014)] Fix stable version file [[#2107](https://github.com/airyhq/airy/pull/2107)]
- [[#1970](https://github.com/airyhq/airy/issues/1970)] Add issue templates [[#2106](https://github.com/airyhq/airy/pull/2106)]
- Bump eslint from 7.29.0 to 7.30.0 [[#2102](https://github.com/airyhq/airy/pull/2102)]
- Bump @types/node from 15.14.0 to 16.0.0 [[#2103](https://github.com/airyhq/airy/pull/2103)]
- Bump @types/node from 15.12.5 to 15.14.0 [[#2096](https://github.com/airyhq/airy/pull/2096)]
- Bump @types/react from 17.0.11 to 17.0.13 [[#2097](https://github.com/airyhq/airy/pull/2097)]
- Bump camelcase-keys from 6.2.2 to 7.0.0 [[#2083](https://github.com/airyhq/airy/pull/2083)]
- Bump preact from 10.5.13 to 10.5.14 [[#2099](https://github.com/airyhq/airy/pull/2099)]
- Bump webpack from 5.41.1 to 5.42.0 [[#2098](https://github.com/airyhq/airy/pull/2098)]
- Bump @typescript-eslint/eslint-plugin from 4.28.0 to 4.28.1 [[#2084](https://github.com/airyhq/airy/pull/2084)]
- Bump webpack from 5.40.0 to 5.41.1 [[#2085](https://github.com/airyhq/airy/pull/2085)]
- Bump @typescript-eslint/parser from 4.28.0 to 4.28.1 [[#2081](https://github.com/airyhq/airy/pull/2081)]
- Bump style-loader from 2.0.0 to 3.0.0 [[#2040](https://github.com/airyhq/airy/pull/2040)]
- Bump @types/node from 15.12.2 to 15.12.5 [[#2052](https://github.com/airyhq/airy/pull/2052)]
- Bump core-js from 3.15.0 to 3.15.2 [[#2064](https://github.com/airyhq/airy/pull/2064)]
- Bump prettier from 2.3.1 to 2.3.2 [[#2053](https://github.com/airyhq/airy/pull/2053)]
- Bump terser-webpack-plugin from 5.1.3 to 5.1.4 [[#2065](https://github.com/airyhq/airy/pull/2065)]
- Bump copy-webpack-plugin from 9.0.0 to 9.0.1 [[#2059](https://github.com/airyhq/airy/pull/2059)]

#### Airy CLI

You can download the Airy CLI for your operating system from the following links:

[MacOS](https://airy-core-binaries.s3.amazonaws.com/0.25.1/darwin/amd64/airy)
[Linux](https://airy-core-binaries.s3.amazonaws.com/0.25.1/linux/amd64/airy)
[Windows](https://airy-core-binaries.s3.amazonaws.com/0.25.1/windows/amd64/airy.exe)

## 0.25.0

#### 🚀 Features

- [[#1752](https://github.com/airyhq/airy/issues/1752)] Add connect cluster chart [[#1961](https://github.com/airyhq/airy/pull/1961)]

#### 🐛 Bug Fixes

- [[#2009](https://github.com/airyhq/airy/issues/2009)] Fixed unnecessary recalls and rerenders [[#2054](https://github.com/airyhq/airy/pull/2054)]
- [[#2018](https://github.com/airyhq/airy/issues/2018)] Unknown Message Type from Facebook chat plugin  [[#2055](https://github.com/airyhq/airy/pull/2055)]
- [[#2038](https://github.com/airyhq/airy/issues/2038)] Fix broken download links on release page [[#2039](https://github.com/airyhq/airy/pull/2039)]
- [[#1991](https://github.com/airyhq/airy/issues/1991)] re-organizing infinite scroll for conversationlist and messagelist [[#2006](https://github.com/airyhq/airy/pull/2006)]
- [[#1985](https://github.com/airyhq/airy/issues/1985)] Bug: Template Title not Rendering [[#1995](https://github.com/airyhq/airy/pull/1995)]
- [[#1939](https://github.com/airyhq/airy/issues/1939)] Redirect / to /ui [[#2001](https://github.com/airyhq/airy/pull/2001)]

#### 🧰 Maintenance

- Bump prismjs from 1.23.0 to 1.24.0 in /docs [[#2058](https://github.com/airyhq/airy/pull/2058)]
- Bump @bazel/typescript from 3.5.1 to 3.6.0 [[#1975](https://github.com/airyhq/airy/pull/1975)]
- Bump webpack from 5.39.1 to 5.40.0 [[#2022](https://github.com/airyhq/airy/pull/2022)]
- Bump @typescript-eslint/eslint-plugin from 4.27.0 to 4.28.0 [[#2026](https://github.com/airyhq/airy/pull/2026)]
- Bump html-webpack-plugin from 5.3.1 to 5.3.2 [[#2032](https://github.com/airyhq/airy/pull/2032)]
- Bump cypress from 7.5.0 to 7.6.0 [[#2031](https://github.com/airyhq/airy/pull/2031)]
- [[#2030](https://github.com/airyhq/airy/issues/2030)] Expose all jvm dependencies [[#2033](https://github.com/airyhq/airy/pull/2033)]
- Bump @babel/preset-env from 7.14.5 to 7.14.7 [[#2024](https://github.com/airyhq/airy/pull/2024)]
- Bump @typescript-eslint/parser from 4.27.0 to 4.28.0 [[#2025](https://github.com/airyhq/airy/pull/2025)]
- Bump eslint from 7.28.0 to 7.29.0 [[#2016](https://github.com/airyhq/airy/pull/2016)]
- Bump webpack from 5.39.0 to 5.39.1 [[#2012](https://github.com/airyhq/airy/pull/2012)]
- Bump @types/react-dom from 17.0.7 to 17.0.8 [[#2011](https://github.com/airyhq/airy/pull/2011)]
- Bump core-js from 3.14.0 to 3.15.0 [[#2015](https://github.com/airyhq/airy/pull/2015)]
- [[#1974](https://github.com/airyhq/airy/issues/1974)] Upgrade to Facebook API graph version 11 [[#2007](https://github.com/airyhq/airy/pull/2007)]
- Bump @babel/preset-env from 7.14.4 to 7.14.5 [[#1982](https://github.com/airyhq/airy/pull/1982)]
- Bump @typescript-eslint/eslint-plugin from 4.26.1 to 4.27.0 [[#1993](https://github.com/airyhq/airy/pull/1993)]
- Bump sass from 1.34.1 to 1.35.1 [[#1999](https://github.com/airyhq/airy/pull/1999)]
- Bump react-modal from 3.14.2 to 3.14.3 [[#2000](https://github.com/airyhq/airy/pull/2000)]

#### Airy CLI

You can download the Airy CLI for your operating system from the following links:

[MacOS](https://airy-core-binaries.s3.amazonaws.com/0.24.1/darwin/amd64/airy)
[Linux](https://airy-core-binaries.s3.amazonaws.com/0.24.1/linux/amd64/airy)
[Windows](https://airy-core-binaries.s3.amazonaws.com/0.24.1/windows/amd64/airy.exe)

## 0.23.1 Hotfix

[[#1921](https://github.com/airyhq/airy/issues/1921)] Hotfix: Facebook echo ingestion [[#1922](https://github.com/airyhq/airy/issues/1922)]

## 0.24.0

#### Changes

- [[#1956](https://github.com/airyhq/airy/issues/1956)] Fix link to installation page [[#1957](https://github.com/airyhq/airy/pull/1957)]

#### 🐛 Bug Fixes

- [[#1952](https://github.com/airyhq/airy/issues/1952)] Fix embedded path for Airy create on Windows [[#1992](https://github.com/airyhq/airy/pull/1992)]
- [[#1967](https://github.com/airyhq/airy/issues/1967)] Fixed messageInput [[#1983](https://github.com/airyhq/airy/pull/1983)]
- [[#1932](https://github.com/airyhq/airy/issues/1932)] Added scrollToBotton in messageList [[#1934](https://github.com/airyhq/airy/pull/1934)]
- [[#1933](https://github.com/airyhq/airy/issues/1933)] Suggested Replies does not fit in messageInput [[#1935](https://github.com/airyhq/airy/pull/1935)]
- [[#1924](https://github.com/airyhq/airy/issues/1924)] Fixed long message in messageInput [[#1925](https://github.com/airyhq/airy/pull/1925)]

#### 📚 Documentation

- [[#1926](https://github.com/airyhq/airy/issues/1926)] Docs for using a custom public hostname [[#1945](https://github.com/airyhq/airy/pull/1945)]
- [[#1936](https://github.com/airyhq/airy/issues/1936)] Minor grammar edits- all remaining sections [[#1941](https://github.com/airyhq/airy/pull/1941)]
- [[#1926](https://github.com/airyhq/airy/issues/1926)] Polishing the docs [[#1937](https://github.com/airyhq/airy/pull/1937)]
- [[#1936](https://github.com/airyhq/airy/issues/1936)] Minor grammar edits- Getting Started [[#1938](https://github.com/airyhq/airy/pull/1938)]

#### 🧰 Maintenance

- Bump @babel/preset-typescript from 7.13.0 to 7.14.5 [[#1966](https://github.com/airyhq/airy/pull/1966)]
- Bump webpack from 5.38.1 to 5.39.0 [[#1990](https://github.com/airyhq/airy/pull/1990)]
- Bump @babel/core from 7.14.5 to 7.14.6 [[#1988](https://github.com/airyhq/airy/pull/1988)]
- Bump @babel/plugin-transform-spread from 7.13.0 to 7.14.6 [[#1986](https://github.com/airyhq/airy/pull/1986)]
- Bump @typescript-eslint/parser from 4.26.0 to 4.27.0 [[#1987](https://github.com/airyhq/airy/pull/1987)]
- Bump @babel/plugin-proposal-class-properties from 7.13.0 to 7.14.5 [[#1979](https://github.com/airyhq/airy/pull/1979)]
- Bump @babel/core from 7.14.3 to 7.14.5 [[#1977](https://github.com/airyhq/airy/pull/1977)]
- Bump sass-loader from 12.0.0 to 12.1.0 [[#1978](https://github.com/airyhq/airy/pull/1978)]
- Bump @babel/preset-react from 7.13.13 to 7.14.5 [[#1976](https://github.com/airyhq/airy/pull/1976)]
- Bump @typescript-eslint/eslint-plugin from 4.26.0 to 4.26.1 [[#1947](https://github.com/airyhq/airy/pull/1947)]
- Bump @reduxjs/toolkit from 1.5.1 to 1.6.0 [[#1949](https://github.com/airyhq/airy/pull/1949)]
- Bump @babel/plugin-proposal-object-rest-spread from 7.14.4 to 7.14.5 [[#1965](https://github.com/airyhq/airy/pull/1965)]
- Bump ssri from 6.0.1 to 6.0.2 in /docs [[#1964](https://github.com/airyhq/airy/pull/1964)]
- Bump @types/react-dom from 17.0.6 to 17.0.7 [[#1950](https://github.com/airyhq/airy/pull/1950)]
- Bump @types/react from 17.0.9 to 17.0.11 [[#1958](https://github.com/airyhq/airy/pull/1958)]
- Bump prettier from 2.3.0 to 2.3.1 [[#1928](https://github.com/airyhq/airy/pull/1928)]
- Bump sass from 1.34.0 to 1.34.1 [[#1905](https://github.com/airyhq/airy/pull/1905)]
- Bump eslint from 7.27.0 to 7.28.0 [[#1930](https://github.com/airyhq/airy/pull/1930)]
- Bump cypress from 7.4.0 to 7.5.0 [[#1944](https://github.com/airyhq/airy/pull/1944)]
- Bump @types/node from 15.12.0 to 15.12.2 [[#1943](https://github.com/airyhq/airy/pull/1943)]
- Bump webpack-cli from 4.7.0 to 4.7.2 [[#1942](https://github.com/airyhq/airy/pull/1942)]
- Bump core-js from 3.13.1 to 3.14.0 [[#1929](https://github.com/airyhq/airy/pull/1929)]
- Bump @types/node from 15.6.1 to 15.12.0 [[#1912](https://github.com/airyhq/airy/pull/1912)]

#### Airy CLI

You can download the Airy CLI for your operating system from the following links:

[MacOS](https://airy-core-binaries.s3.amazonaws.com/0.24.0/darwin/amd64/airy)
[Linux](https://airy-core-binaries.s3.amazonaws.com/0.24.0/linux/amd64/airy)
[Windows](https://airy-core-binaries.s3.amazonaws.com/0.24.0/windows/amd64/airy.exe)

## 0.23.0

#### 🚀 Features

- [[#1815](https://github.com/airyhq/airy/issues/1815)] Added emptyState for filtered items [[#1874](https://github.com/airyhq/airy/pull/1874)]
- [[#1773](https://github.com/airyhq/airy/issues/1773)] Filter conversations by source [[#1864](https://github.com/airyhq/airy/pull/1864)]
- [[#1850](https://github.com/airyhq/airy/issues/1850)] Added npm chatplugin library [[#1857](https://github.com/airyhq/airy/pull/1857)]
- [[#1823](https://github.com/airyhq/airy/issues/1823)] Improve login/logout behavior [[#1840](https://github.com/airyhq/airy/pull/1840)]
- [[#1616](https://github.com/airyhq/airy/issues/1616)] Customize instance type for AWS [[#1833](https://github.com/airyhq/airy/pull/1833)]
- [[#1107](https://github.com/airyhq/airy/issues/1107)] Add demo gif docs [[#1851](https://github.com/airyhq/airy/pull/1851)]
- [[#1650](https://github.com/airyhq/airy/issues/1650)] Message pagination [[#1651](https://github.com/airyhq/airy/pull/1651)]
- [[#1693](https://github.com/airyhq/airy/issues/1693)] Move defaults to airy yaml [[#1700](https://github.com/airyhq/airy/pull/1700)]

#### 🐛 Bug Fixes

- [[#1732](https://github.com/airyhq/airy/issues/1732)] Fix display name search typo [[#1873](https://github.com/airyhq/airy/pull/1873)]
- [[#1863](https://github.com/airyhq/airy/issues/1863)] Added SourceMessagePreview [[#1867](https://github.com/airyhq/airy/pull/1867)]
- [[#1733](https://github.com/airyhq/airy/issues/1733)] Fix cypress tests [[#1876](https://github.com/airyhq/airy/pull/1876)]
- [[#1865](https://github.com/airyhq/airy/issues/1865)] Fix chat plugin website installation url [[#1866](https://github.com/airyhq/airy/pull/1866)]
- [[#1808](https://github.com/airyhq/airy/issues/1808)] Improved lastMessageSent [[#1821](https://github.com/airyhq/airy/pull/1821)]
- [[#1837](https://github.com/airyhq/airy/issues/1837)] Improve facebook render library follow-up [[#1839](https://github.com/airyhq/airy/pull/1839)]
- [[#1820](https://github.com/airyhq/airy/issues/1820)] Sending messages UX improvement: focus on input and send on Enter  [[#1855](https://github.com/airyhq/airy/pull/1855)]
- [[#1838](https://github.com/airyhq/airy/issues/1838)] Add call to pagination when filtering conversations [[#1852](https://github.com/airyhq/airy/pull/1852)]
- [[#1843](https://github.com/airyhq/airy/issues/1843)] Fix Airy core reachability followup [[#1836](https://github.com/airyhq/airy/pull/1836)]
- [[#1809](https://github.com/airyhq/airy/issues/1809)] Channels page breaks when there are too many channels  [[#1822](https://github.com/airyhq/airy/pull/1822)]
- [[#1798](https://github.com/airyhq/airy/issues/1798)] Fix not rendered content messages in facebook render library [[#1818](https://github.com/airyhq/airy/pull/1818)]
- [[#1611](https://github.com/airyhq/airy/issues/1611)] Aligned svg files [[#1810](https://github.com/airyhq/airy/pull/1810)]
- [[#1843](https://github.com/airyhq/airy/issues/1843)] Fix Airy core reachability [[#1835](https://github.com/airyhq/airy/pull/1835)]
- [[#1342](https://github.com/airyhq/airy/issues/1342)] Fix dependabot failing PRs [[#1831](https://github.com/airyhq/airy/pull/1831)]
- [[#1599](https://github.com/airyhq/airy/issues/1599)] Add health status to components endpoint [[#1799](https://github.com/airyhq/airy/pull/1799)]

#### 📚 Documentation

- [[#1853](https://github.com/airyhq/airy/issues/1853)] minor grammar edits sources + UI [[#1858](https://github.com/airyhq/airy/pull/1858)]
- [[#1848](https://github.com/airyhq/airy/issues/1848)] Fix getting started-introduction [[#1849](https://github.com/airyhq/airy/pull/1849)]
- [[#1813](https://github.com/airyhq/airy/issues/1813)] Update docs on conersations states [[#1814](https://github.com/airyhq/airy/pull/1814)]

#### 🧰 Maintenance

- Bump @typescript-eslint/eslint-plugin from 4.25.0 to 4.26.0 [[#1881](https://github.com/airyhq/airy/pull/1881)]
- Bump @typescript-eslint/parser from 4.25.0 to 4.26.0 [[#1882](https://github.com/airyhq/airy/pull/1882)]
- Bump @babel/preset-env from 7.14.2 to 7.14.4 [[#1869](https://github.com/airyhq/airy/pull/1869)]
- Bump core-js from 3.13.0 to 3.13.1 [[#1872](https://github.com/airyhq/airy/pull/1872)]
- Bump eslint-plugin-react from 7.23.2 to 7.24.0 [[#1870](https://github.com/airyhq/airy/pull/1870)]
- Bump webpack from 5.37.1 to 5.38.1 [[#1862](https://github.com/airyhq/airy/pull/1862)]
- Bump dns-packet from 1.3.1 to 1.3.4 [[#1860](https://github.com/airyhq/airy/pull/1860)]
- Bump @bazel/typescript from 3.5.0 to 3.5.1 [[#1846](https://github.com/airyhq/airy/pull/1846)]
- Bump dns-packet from 1.3.1 to 1.3.4 in /docs [[#1861](https://github.com/airyhq/airy/pull/1861)]
- Bump @typescript-eslint/eslint-plugin from 4.24.0 to 4.25.0 [[#1841](https://github.com/airyhq/airy/pull/1841)]
- Bump css-loader from 5.2.5 to 5.2.6 [[#1842](https://github.com/airyhq/airy/pull/1842)]
- Bump @typescript-eslint/parser from 4.24.0 to 4.25.0 [[#1843](https://github.com/airyhq/airy/pull/1843)]
- Bump core-js from 3.12.1 to 3.13.0 [[#1847](https://github.com/airyhq/airy/pull/1847)]
- Bump cypress from 7.3.0 to 7.4.0 [[#1844](https://github.com/airyhq/airy/pull/1844)]
- Bump @types/react from 17.0.6 to 17.0.8 [[#1845](https://github.com/airyhq/airy/pull/1845)]
- Bump @bazel/bazelisk from 1.8.1 to 1.9.0 [[#1824](https://github.com/airyhq/airy/pull/1824)]
- Bump sass from 1.33.0 to 1.34.0 [[#1825](https://github.com/airyhq/airy/pull/1825)]
- Bump eslint from 7.26.0 to 7.27.0 [[#1826](https://github.com/airyhq/airy/pull/1826)]
- Bump browserslist from 4.16.3 to 4.16.6 [[#1830](https://github.com/airyhq/airy/pull/1830)]
- Bump @types/node from 15.3.1 to 15.6.1 [[#1829](https://github.com/airyhq/airy/pull/1829)]
- Bump webpack from 5.37.0 to 5.37.1 [[#1812](https://github.com/airyhq/airy/pull/1812)]
- Bump sass from 1.32.13 to 1.33.0 [[#1817](https://github.com/airyhq/airy/pull/1817)]
- Bump css-loader from 5.2.4 to 5.2.5 [[#1816](https://github.com/airyhq/airy/pull/1816)]
- Bump @types/react from 17.0.5 to 17.0.6 [[#1807](https://github.com/airyhq/airy/pull/1807)]
- Bump copy-webpack-plugin from 8.1.1 to 9.0.0 [[#1827](https://github.com/airyhq/airy/pull/1827)]
- Bump @types/node from 15.3.0 to 15.3.1 [[#1811](https://github.com/airyhq/airy/pull/1811)]

#### Airy CLI

You can download the Airy CLI for your operating system from the following links:

[MacOS](https://airy-core-binaries.s3.amazonaws.com/0.23.0/darwin/amd64/airy)
[Linux](https://airy-core-binaries.s3.amazonaws.com/0.23.0/linux/amd64/airy)
[Windows](https://airy-core-binaries.s3.amazonaws.com/0.23.0/windows/amd64/airy.exe)

## 0.22.0

#### 🚀 Features

- [[#1743](https://github.com/airyhq/airy/issues/1743)] Return proper status code for unauthorized access [[#1785](https://github.com/airyhq/airy/pull/1785)]

#### 🐛 Bug Fixes

- [[#1743](https://github.com/airyhq/airy/issues/1743)] Permit public auth pages [[#1786](https://github.com/airyhq/airy/pull/1786)]
- [[#1768](https://github.com/airyhq/airy/issues/1768)] Bad calls to conversations info when opening inbox [[#1775](https://github.com/airyhq/airy/pull/1775)]
- [[#1764](https://github.com/airyhq/airy/issues/1764)] Filter fixed + state header bar toggle fix [[#1774](https://github.com/airyhq/airy/pull/1774)]

#### 🧰 Maintenance

- Bump prettier from 2.2.1 to 2.3.0 [[#1759](https://github.com/airyhq/airy/pull/1759)]
- Bump webpack-bundle-analyzer from 4.4.1 to 4.4.2 [[#1800](https://github.com/airyhq/airy/pull/1800)]
- Bump @typescript-eslint/parser from 4.23.0 to 4.24.0 [[#1801](https://github.com/airyhq/airy/pull/1801)]
- Bump @babel/core from 7.14.2 to 7.14.3 [[#1802](https://github.com/airyhq/airy/pull/1802)]
- Bump @typescript-eslint/eslint-plugin from 4.23.0 to 4.24.0 [[#1803](https://github.com/airyhq/airy/pull/1803)]
- Bump sass from 1.32.12 to 1.32.13 [[#1793](https://github.com/airyhq/airy/pull/1793)]
- Bump @bazel/typescript from 3.4.2 to 3.5.0 [[#1776](https://github.com/airyhq/airy/pull/1776)]
- Bump @types/node from 15.0.2 to 15.3.0 [[#1796](https://github.com/airyhq/airy/pull/1796)]
- Bump terser-webpack-plugin from 5.1.1 to 5.1.2 [[#1795](https://github.com/airyhq/airy/pull/1795)]
- Bump @typescript-eslint/parser from 4.22.1 to 4.23.0 [[#1779](https://github.com/airyhq/airy/pull/1779)]
- Bump @babel/core from 7.14.0 to 7.14.2 [[#1794](https://github.com/airyhq/airy/pull/1794)]
- Bump cypress from 7.2.0 to 7.3.0 [[#1780](https://github.com/airyhq/airy/pull/1780)]
- Bump sass-loader from 11.0.1 to 11.1.1 [[#1790](https://github.com/airyhq/airy/pull/1790)]
- Bump @babel/preset-env from 7.14.1 to 7.14.2 [[#1792](https://github.com/airyhq/airy/pull/1792)]
- Bump @types/react-dom from 16.9.2 to 17.0.5 [[#1789](https://github.com/airyhq/airy/pull/1789)]
- Bump core-js from 3.12.0 to 3.12.1 [[#1758](https://github.com/airyhq/airy/pull/1758)]
- Bump eslint from 7.25.0 to 7.26.0 [[#1760](https://github.com/airyhq/airy/pull/1760)]
- Bump @typescript-eslint/eslint-plugin from 4.22.1 to 4.23.0 [[#1769](https://github.com/airyhq/airy/pull/1769)]
- Bump webpack from 5.36.2 to 5.37.0 [[#1770](https://github.com/airyhq/airy/pull/1770)]

#### Airy CLI

You can download the Airy CLI for your operating system from the following links:

[MacOS](https://airy-core-binaries.s3.amazonaws.com/0.22.0/darwin/amd64/airy)
[Linux](https://airy-core-binaries.s3.amazonaws.com/0.22.0/linux/amd64/airy)
[Windows](https://airy-core-binaries.s3.amazonaws.com/0.22.0/windows/amd64/airy.exe)

## 0.21.0

#### Changes

- [[#1750](https://github.com/airyhq/airy/issues/1750)] Fix tags filter [[#1765](https://github.com/airyhq/airy/pull/1765)]

#### 🚀 Features

- [[#1681](https://github.com/airyhq/airy/issues/1681)] Clean phone number input [[#1772](https://github.com/airyhq/airy/pull/1772)]
- [[#1519](https://github.com/airyhq/airy/issues/1519)] Implement auth UI behavior [[#1737](https://github.com/airyhq/airy/pull/1737)]
- [[#1721](https://github.com/airyhq/airy/issues/1721)] Webhook consumer should start consuming… [[#1722](https://github.com/airyhq/airy/pull/1722)]
- [[#1713](https://github.com/airyhq/airy/issues/1713)] Fix crash conversation from search [[#1720](https://github.com/airyhq/airy/pull/1720)]
- [[#1707](https://github.com/airyhq/airy/issues/1707)] Attach user profile to application logs [[#1718](https://github.com/airyhq/airy/pull/1718)]
- [[#1714](https://github.com/airyhq/airy/issues/1714)] Webhook config updates only once [[#1715](https://github.com/airyhq/airy/pull/1715)]

#### 🐛 Bug Fixes

- [[#1749](https://github.com/airyhq/airy/issues/1749)] Fixed activeFilterCount [[#1747](https://github.com/airyhq/airy/pull/1747)]
- [[#1763](https://github.com/airyhq/airy/issues/1763)] Fixed tag string length in contactInfo [[#1766](https://github.com/airyhq/airy/pull/1766)]
- [[#1736](https://github.com/airyhq/airy/issues/1736)] improve render library for facebook [[#1756](https://github.com/airyhq/airy/pull/1756)]
- [[#1748](https://github.com/airyhq/airy/issues/1748)] Add missing default redirect uri [[#1749](https://github.com/airyhq/airy/pull/1749)]
- [[#1729](https://github.com/airyhq/airy/issues/1729)] Fix lastMessageIcon [[#1735](https://github.com/airyhq/airy/pull/1735)]
- [[#1726](https://github.com/airyhq/airy/issues/1726)] Customize Start a New Conversation button [[#1731](https://github.com/airyhq/airy/pull/1731)]
- [[#1696](https://github.com/airyhq/airy/issues/1696)] Fix backgroundColor accountName [[#1728](https://github.com/airyhq/airy/pull/1728)]
- [[#1694](https://github.com/airyhq/airy/issues/1694)] Adding icons for lastMessage [[#1704](https://github.com/airyhq/airy/pull/1704)]
- [[#1706](https://github.com/airyhq/airy/issues/1706)] Fixed gap between conversationList and conversationListHeader [[#1717](https://github.com/airyhq/airy/pull/1717)]
- [[#1558](https://github.com/airyhq/airy/issues/1558)] Enable loadbalancer annotations [[#1683](https://github.com/airyhq/airy/pull/1683)]
- [[#1695](https://github.com/airyhq/airy/issues/1695)] Twilio SMS does not display the channelSourceId correctly [[#1703](https://github.com/airyhq/airy/pull/1703)]

#### 📚 Documentation

- [[#1745](https://github.com/airyhq/airy/issues/1745)] Update chat plugin customization docs  [[#1754](https://github.com/airyhq/airy/pull/1754)]

#### 🧰 Maintenance

- [[#1486](https://github.com/airyhq/airy/issues/1486)] upgrade react [[#1757](https://github.com/airyhq/airy/pull/1757)]
- [[#1486](https://github.com/airyhq/airy/issues/1486)] Upgrade rules\_pkg and rules\_docker [[#1755](https://github.com/airyhq/airy/pull/1755)]
- Bump react-markdown from 6.0.1 to 6.0.2 [[#1742](https://github.com/airyhq/airy/pull/1742)]
- Bump typescript from 3.7.4 to 4.2.3 [[#1189](https://github.com/airyhq/airy/pull/1189)]
- [[#1486](https://github.com/airyhq/airy/issues/1486)] Upgrade kafka images [[#1691](https://github.com/airyhq/airy/pull/1691)]
- Bump core-js from 3.11.1 to 3.12.0 [[#1739](https://github.com/airyhq/airy/pull/1739)]
- Bump @bazel/bazelisk from 1.8.0 to 1.8.1 [[#1740](https://github.com/airyhq/airy/pull/1740)]
- Bump webpack-cli from 4.6.0 to 4.7.0 [[#1741](https://github.com/airyhq/airy/pull/1741)]
- Bump @types/node from 15.0.1 to 15.0.2 [[#1723](https://github.com/airyhq/airy/pull/1723)]
- Bump @typescript-eslint/parser from 4.22.0 to 4.22.1 [[#1724](https://github.com/airyhq/airy/pull/1724)]
- Bump typescript from 4.2.3 to 4.2.4 [[#1753](https://github.com/airyhq/airy/pull/1753)]
- Bump @types/react from 17.0.4 to 17.0.5 [[#1727](https://github.com/airyhq/airy/pull/1727)]
- Bump @typescript-eslint/eslint-plugin from 4.22.0 to 4.22.1 [[#1725](https://github.com/airyhq/airy/pull/1725)]

#### Airy CLI

You can download the Airy CLI for your operating system from the following links:

[MacOS](https://airy-core-binaries.s3.amazonaws.com/0.21.0/darwin/amd64/airy)
[Linux](https://airy-core-binaries.s3.amazonaws.com/0.21.0/linux/amd64/airy)
[Windows](https://airy-core-binaries.s3.amazonaws.com/0.21.0/windows/amd64/airy.exe)

## 0.20.0

#### Changes

- Bump @types/react from 16.9.34 to 17.0.4 [[#1658](https://github.com/airyhq/airy/pull/1658)]

#### 🚀 Features

- [[#1642](https://github.com/airyhq/airy/issues/1642)] Add dev cli script [[#1690](https://github.com/airyhq/airy/pull/1690)]
- [[#1518](https://github.com/airyhq/airy/issues/1518)] Add OIDC authentication backend [[#1623](https://github.com/airyhq/airy/pull/1623)]
- [[#1505](https://github.com/airyhq/airy/issues/1505)] Rewrite Webhook queue with Beanstalkd [[#1536](https://github.com/airyhq/airy/pull/1536)]
- [[#1687](https://github.com/airyhq/airy/issues/1687)] Kafka Prometheus exporter error [[#1688](https://github.com/airyhq/airy/pull/1688)]
- [[#1615](https://github.com/airyhq/airy/issues/1615)] Expose tag events via websocket [[#1624](https://github.com/airyhq/airy/pull/1624)]
- [[#1495](https://github.com/airyhq/airy/issues/1495)] Add kafka Prometheus exporter [[#1668](https://github.com/airyhq/airy/pull/1668)]
- [[#1525](https://github.com/airyhq/airy/issues/1525)] Update quick filter [[#1660](https://github.com/airyhq/airy/pull/1660)]

#### 🐛 Bug Fixes

- [[#1642](https://github.com/airyhq/airy/issues/1642)] Fix flag [[#1712](https://github.com/airyhq/airy/pull/1712)]
- [[#1698](https://github.com/airyhq/airy/issues/1698)] Webhook config error [[#1699](https://github.com/airyhq/airy/pull/1699)]
- [[#1689](https://github.com/airyhq/airy/issues/1689)] Bug: Conversation Counter: Optimize Filter Use [[#1697](https://github.com/airyhq/airy/pull/1697)]
- [[#1665](https://github.com/airyhq/airy/issues/1665)] Fix chatplugin reconnection problem [[#1682](https://github.com/airyhq/airy/pull/1682)]
- [[#1646](https://github.com/airyhq/airy/issues/1646)] fix avatar images styling [[#1680](https://github.com/airyhq/airy/pull/1680)]
- [[#1652](https://github.com/airyhq/airy/issues/1652)] Fix rendering messages with render library [[#1675](https://github.com/airyhq/airy/pull/1675)]
- [[#1674](https://github.com/airyhq/airy/issues/1674)] Chatplugin customize problems [[#1678](https://github.com/airyhq/airy/pull/1678)]
- [[#1666](https://github.com/airyhq/airy/issues/1666)] Fix chatplugin cors config [[#1667](https://github.com/airyhq/airy/pull/1667)]

#### 📚 Documentation

- [[#1676](https://github.com/airyhq/airy/issues/1676)] fix sending messages to google source [[#1677](https://github.com/airyhq/airy/pull/1677)]
- [[#1661](https://github.com/airyhq/airy/issues/1661)] Fix token name in docs [[#1664](https://github.com/airyhq/airy/pull/1664)]

#### 🧰 Maintenance

- Bump @babel/preset-env from 7.14.0 to 7.14.1 [[#1705](https://github.com/airyhq/airy/pull/1705)]
- Bump webpack from 5.36.1 to 5.36.2 [[#1692](https://github.com/airyhq/airy/pull/1692)]
- Bump @babel/core from 7.13.16 to 7.14.0 [[#1685](https://github.com/airyhq/airy/pull/1685)]
- Bump @babel/preset-env from 7.13.15 to 7.14.0 [[#1684](https://github.com/airyhq/airy/pull/1684)]
- Bump webpack from 5.36.0 to 5.36.1 [[#1670](https://github.com/airyhq/airy/pull/1670)]
- Bump @bazel/typescript from 3.4.1 to 3.4.2 [[#1671](https://github.com/airyhq/airy/pull/1671)]
- Bump core-js from 3.11.0 to 3.11.1 [[#1672](https://github.com/airyhq/airy/pull/1672)]
- Bump sass from 1.32.11 to 1.32.12 [[#1673](https://github.com/airyhq/airy/pull/1673)]
- Bump webpack from 5.35.1 to 5.36.0 [[#1663](https://github.com/airyhq/airy/pull/1663)]
- Bump @types/node from 15.0.0 to 15.0.1 [[#1662](https://github.com/airyhq/airy/pull/1662)]

#### Airy CLI

You can download the Airy CLI for your operating system from the following links:

[MacOS](https://airy-core-binaries.s3.amazonaws.com/0.20.0/darwin/amd64/airy)
[Linux](https://airy-core-binaries.s3.amazonaws.com/0.20.0/linux/amd64/airy)
[Windows](https://airy-core-binaries.s3.amazonaws.com/0.20.0/windows/amd64/airy.exe)

## 0.19.0

#### Changes

#### 🚀 Features

- [[#1520](https://github.com/airyhq/airy/issues/1520)] Log user activity [[#1588](https://github.com/airyhq/airy/pull/1588)]
- [[#1606](https://github.com/airyhq/airy/issues/1606)] Conversation count on the title of the page [[#1626](https://github.com/airyhq/airy/pull/1626)]
- [[#1580](https://github.com/airyhq/airy/issues/1580)] Create in existing VPC on AWS [[#1595](https://github.com/airyhq/airy/pull/1595)]
- [[#1517](https://github.com/airyhq/airy/issues/1517)] Don't create a default system token [[#1613](https://github.com/airyhq/airy/pull/1613)]
- [[#1517](https://github.com/airyhq/airy/issues/1517)] Remove email auth [[#1569](https://github.com/airyhq/airy/pull/1569)]

#### 🐛 Bug Fixes

- [[#1639](https://github.com/airyhq/airy/issues/1639)] Fix conversation count [[#1648](https://github.com/airyhq/airy/pull/1648)]
- [[#1637](https://github.com/airyhq/airy/issues/1637)] Fix carousels [[#1649](https://github.com/airyhq/airy/pull/1649)]
- [[#1628](https://github.com/airyhq/airy/issues/1628)] Fix send button for selected templates  [[#1645](https://github.com/airyhq/airy/pull/1645)]
- [[#1629](https://github.com/airyhq/airy/issues/1629)] Remove hardcoded availability zones [[#1636](https://github.com/airyhq/airy/pull/1636)]
- [[#1620](https://github.com/airyhq/airy/issues/1620)] Fix the config apply flag in the docs [[#1625](https://github.com/airyhq/airy/pull/1625)]
- [[#1618](https://github.com/airyhq/airy/issues/1618)] Remove intermediate call to action from new chat plugin [[#1627](https://github.com/airyhq/airy/pull/1627)]
- [[#1605](https://github.com/airyhq/airy/issues/1605)] Fix Tags Flow [[#1619](https://github.com/airyhq/airy/pull/1619)]
- [[#1603](https://github.com/airyhq/airy/issues/1603)] Redirect when trying to add GBM channel [[#1617](https://github.com/airyhq/airy/pull/1617)]
- [[#1609](https://github.com/airyhq/airy/issues/1609)] Fix svg sizing  [[#1610](https://github.com/airyhq/airy/pull/1610)]
- [[#1602](https://github.com/airyhq/airy/issues/1602)] Checkmark svg broken [[#1607](https://github.com/airyhq/airy/pull/1607)]

#### 📚 Documentation

- [[#1558](https://github.com/airyhq/airy/issues/1558)] Docs for configuring https on AWS [[#1653](https://github.com/airyhq/airy/pull/1653)]
- [[#1641](https://github.com/airyhq/airy/issues/1641)] Specify the required minikube version [[#1644](https://github.com/airyhq/airy/pull/1644)]
- [[#1635](https://github.com/airyhq/airy/issues/1635)] Update docs on configuring sources [[#1643](https://github.com/airyhq/airy/pull/1643)]

#### 🧰 Maintenance

- Bump react-markdown from 6.0.0 to 6.0.1 [[#1656](https://github.com/airyhq/airy/pull/1656)]
- Bump cypress from 7.1.0 to 7.2.0 [[#1655](https://github.com/airyhq/airy/pull/1655)]
- Bump @types/node from 14.14.41 to 15.0.0 [[#1657](https://github.com/airyhq/airy/pull/1657)]
- Bump webpack from 5.35.0 to 5.35.1 [[#1647](https://github.com/airyhq/airy/pull/1647)]
- Bump @bazel/bazelisk from 1.7.5 to 1.8.0 [[#1633](https://github.com/airyhq/airy/pull/1633)]
- Bump eslint from 7.24.0 to 7.25.0 [[#1632](https://github.com/airyhq/airy/pull/1632)]
- Bump react-redux from 7.2.3 to 7.2.4 [[#1631](https://github.com/airyhq/airy/pull/1631)]
- Bump redux from 4.0.5 to 4.1.0 [[#1630](https://github.com/airyhq/airy/pull/1630)]
- Bump core-js from 3.10.2 to 3.11.0 [[#1621](https://github.com/airyhq/airy/pull/1621)]
- Bump @bazel/typescript from 3.4.0 to 3.4.1 [[#1622](https://github.com/airyhq/airy/pull/1622)]
- [[#1486](https://github.com/airyhq/airy/issues/1486)] Update spring [[#1612](https://github.com/airyhq/airy/pull/1612)]
- Bump webpack from 5.34.0 to 5.35.0 [[#1608](https://github.com/airyhq/airy/pull/1608)]
- Bump @babel/core from 7.13.15 to 7.13.16 [[#1592](https://github.com/airyhq/airy/pull/1592)]

#### Airy CLI

You can download the Airy CLI for your operating system from the following links:

[MacOS](https://airy-core-binaries.s3.amazonaws.com/0.19.0/darwin/amd64/airy)
[Linux](https://airy-core-binaries.s3.amazonaws.com/0.19.0/linux/amd64/airy)
[Windows](https://airy-core-binaries.s3.amazonaws.com/0.19.0/windows/amd64/airy.exe)

## 0.18.0

#### 🚀 Features
- [[#1524](https://github.com/airyhq/airy/issues/1524)] Added conversationState to conversationList [[#1560](https://github.com/airyhq/airy/pull/1560)]
- [[#1515](https://github.com/airyhq/airy/issues/1515)] Create airy chat plugin library + use it in UI [[#1550](https://github.com/airyhq/airy/pull/1550)]
- [[#1577](https://github.com/airyhq/airy/issues/1577)] Conversations.setState Returns 404 [[#1578](https://github.com/airyhq/airy/pull/1578)]
- [[#1526](https://github.com/airyhq/airy/issues/1526)] Added conversation count in inbox [[#1572](https://github.com/airyhq/airy/pull/1572)]
- [[#1566](https://github.com/airyhq/airy/issues/1566)] Add state endpoints [[#1568](https://github.com/airyhq/airy/pull/1568)]
- [[#1537](https://github.com/airyhq/airy/issues/1537)] AWS Uninstall Docs - Remove reference to… [[#1564](https://github.com/airyhq/airy/pull/1564)]
- [[#1502](https://github.com/airyhq/airy/issues/1502)] Improve model lib [[#1547](https://github.com/airyhq/airy/pull/1547)]
- [[#740](https://github.com/airyhq/airy/issues/740)] Uses components endpoint on service discovery [[#1549](https://github.com/airyhq/airy/pull/1549)]
- [[#1503](https://github.com/airyhq/airy/issues/1503)] Cypress test to end a conversation in chatplugin [[#1543](https://github.com/airyhq/airy/pull/1543)]
- [[#740](https://github.com/airyhq/airy/issues/740)] Adding k8s endpoint to airy controller [[#1546](https://github.com/airyhq/airy/pull/1546)]
- [[#740](https://github.com/airyhq/airy/issues/740)] Label and introspect components [[#1510](https://github.com/airyhq/airy/pull/1510)]
- [[#740](https://github.com/airyhq/airy/issues/740)] Refactor config apply [[#1544](https://github.com/airyhq/airy/pull/1544)]
#### 🐛 Bug Fixes
- [[#1590](https://github.com/airyhq/airy/issues/1590)] Fix api host variable injection in chatplugin [[#1591](https://github.com/airyhq/airy/pull/1591)]
- [[#740](https://github.com/airyhq/airy/issues/740)] Fix env variables [[#1583](https://github.com/airyhq/airy/pull/1583)]
- [[#1581](https://github.com/airyhq/airy/issues/1581)] Prevent page from crashing when adding a channel [[#1582](https://github.com/airyhq/airy/pull/1582)]
- [[#1570](https://github.com/airyhq/airy/issues/1570)] Fixed confikey chat plugin [[#1571](https://github.com/airyhq/airy/pull/1571)]
- [[#1565](https://github.com/airyhq/airy/issues/1565)] Fixed github variable [[#1565](https://github.com/airyhq/airy/pull/1565)]
- [[#635](https://github.com/airyhq/airy/issues/635)] Fix deployment of the library to npm [[#1411](https://github.com/airyhq/airy/pull/1411)]
- [[#1555](https://github.com/airyhq/airy/issues/1555)] Fixed template button [[#1556](https://github.com/airyhq/airy/pull/1556)]
- [[#1540](https://github.com/airyhq/airy/issues/1540)] Added return to messageBubble [[#1542](https://github.com/airyhq/airy/pull/1542)]
- [[#1535](https://github.com/airyhq/airy/issues/1535)] Release version uses correct app image tag [[#1538](https://github.com/airyhq/airy/pull/1538)]
#### 📚 Documentation
- [[#1399](https://github.com/airyhq/airy/issues/1399)] Add Rasa suggested reply guide [[#1548](https://github.com/airyhq/airy/pull/1548)]
- [[#1532](https://github.com/airyhq/airy/issues/1532)] Remove step 4 of airy cli installation docs [[#1534](https://github.com/airyhq/airy/pull/1534)]
#### 🧰 Maintenance
- Bump css-loader from 5.2.2 to 5.2.4 [[#1587](https://github.com/airyhq/airy/pull/1587)]
- Bump webpack from 5.33.2 to 5.34.0 [[#1586](https://github.com/airyhq/airy/pull/1586)]
- Bump sass from 1.32.10 to 1.32.11 [[#1585](https://github.com/airyhq/airy/pull/1585)]
- Bump core-js from 3.10.1 to 3.10.2 [[#1584](https://github.com/airyhq/airy/pull/1584)]
- Bump @bazel/typescript from 3.3.0 to 3.4.0 [[#1552](https://github.com/airyhq/airy/pull/1552)]
- Bump css-loader from 5.2.1 to 5.2.2 [[#1574](https://github.com/airyhq/airy/pull/1574)]
- Bump sass from 1.32.8 to 1.32.10 [[#1573](https://github.com/airyhq/airy/pull/1573)]
- Bump @types/node from 14.14.40 to 14.14.41 [[#1561](https://github.com/airyhq/airy/pull/1561)]
- Bump @types/node from 14.14.39 to 14.14.40 [[#1559](https://github.com/airyhq/airy/pull/1559)]
- Bump react-markdown from 5.0.3 to 6.0.0 [[#1554](https://github.com/airyhq/airy/pull/1554)]
- Bump @types/node from 14.14.37 to 14.14.39 [[#1553](https://github.com/airyhq/airy/pull/1553)]
- Bump webpack from 5.32.0 to 5.33.2 [[#1551](https://github.com/airyhq/airy/pull/1551)]
- Bump react-modal from 3.12.1 to 3.13.1 [[#1545](https://github.com/airyhq/airy/pull/1545)]
- Bump @typescript-eslint/parser from 4.21.0 to 4.22.0 [[#1528](https://github.com/airyhq/airy/pull/1528)]
- Bump cypress from 7.0.1 to 7.1.0 [[#1529](https://github.com/airyhq/airy/pull/1529)]
- Bump @typescript-eslint/eslint-plugin from 4.21.0 to 4.22.0 [[#1530](https://github.com/airyhq/airy/pull/1530)]
- Bump webpack from 5.31.2 to 5.32.0 [[#1527](https://github.com/airyhq/airy/pull/1527)]
#### Airy CLI
You can download the Airy CLI for your operating system from the following links:
[MacOS](https://airy-core-binaries.s3.amazonaws.com/0.18.0/darwin/amd64/airy)
[Linux](https://airy-core-binaries.s3.amazonaws.com/0.18.0/linux/amd64/airy)
[Windows](https://airy-core-binaries.s3.amazonaws.com/0.18.0/windows/amd64/airy.exe)
## 0.17.0

#### 🚀 Features

- [[#929](https://github.com/airyhq/airy/issues/929)] Implement the option to end chat [[#1508](https://github.com/airyhq/airy/pull/1508)]
- [[#1110](https://github.com/airyhq/airy/issues/1110)] Add basic and advance customization to chatplugin docs [[#1494](https://github.com/airyhq/airy/pull/1494)]
- [[#1290](https://github.com/airyhq/airy/issues/1290)] Prometheus Metrics about Spring apps [[#1479](https://github.com/airyhq/airy/pull/1479)]
- [[#1473](https://github.com/airyhq/airy/issues/1473)] Make release process more quiet [[#1501](https://github.com/airyhq/airy/pull/1501)]
- [[#1004](https://github.com/airyhq/airy/issues/1004)] Enable quickreplies for chatplugin [[#1478](https://github.com/airyhq/airy/pull/1478)]
- [[#572](https://github.com/airyhq/airy/issues/572)] Cleanup senderType code [[#1490](https://github.com/airyhq/airy/pull/1490)]
- [[#1474](https://github.com/airyhq/airy/issues/1474)] Added showmode flag that blocks functionality in chat plugin [[#1475](https://github.com/airyhq/airy/pull/1475)]
- [[#572](https://github.com/airyhq/airy/issues/572)] Simplify senderType [[#1458](https://github.com/airyhq/airy/pull/1458)]

#### 🐛 Bug Fixes

- [[#1521](https://github.com/airyhq/airy/issues/1521)] Import ChatPlugin header component assets from library [[#1522](https://github.com/airyhq/airy/pull/1522)]
- [[#1438](https://github.com/airyhq/airy/issues/1438)] Fix logout when a user sends a message to a conversation from a disconnected channel [[#1457](https://github.com/airyhq/airy/pull/1457)]

#### 📚 Documentation

- [[#1408](https://github.com/airyhq/airy/issues/1408)] Add missing tag gifs [[#1496](https://github.com/airyhq/airy/pull/1496)]
- [[#1422](https://github.com/airyhq/airy/issues/1422)] AWS Docs Revamp [[#1487](https://github.com/airyhq/airy/pull/1487)]

#### 🧰 Maintenance

- Remove empty payloads [[#1509](https://github.com/airyhq/airy/pull/1509)]
- Bump css-loader from 5.2.0 to 5.2.1 [[#1514](https://github.com/airyhq/airy/pull/1514)]
- Bump webpack from 5.31.0 to 5.31.2 [[#1513](https://github.com/airyhq/airy/pull/1513)]
- Bump eslint from 7.23.0 to 7.24.0 [[#1512](https://github.com/airyhq/airy/pull/1512)]
- Move back components to the mono repo [[#1506](https://github.com/airyhq/airy/pull/1506)]
- Bump @babel/preset-env from 7.13.12 to 7.13.15 [[#1498](https://github.com/airyhq/airy/pull/1498)]
- Bump @babel/core from 7.13.14 to 7.13.15 [[#1499](https://github.com/airyhq/airy/pull/1499)]
- Bump eslint-plugin-react from 7.23.1 to 7.23.2 [[#1500](https://github.com/airyhq/airy/pull/1500)]
- [[#1466](https://github.com/airyhq/airy/issues/1466)] Follow up on extract model [[#1493](https://github.com/airyhq/airy/pull/1493)]
- Bump cypress from 7.0.0 to 7.0.1 [[#1481](https://github.com/airyhq/airy/pull/1481)]
- [[#1466](https://github.com/airyhq/airy/issues/1466)] Extract model lib from httpclient [[#1488](https://github.com/airyhq/airy/pull/1488)]
- [[#1476](https://github.com/airyhq/airy/issues/1476)] Remove components [[#1485](https://github.com/airyhq/airy/pull/1485)]
- Bump core-js from 3.10.0 to 3.10.1 [[#1484](https://github.com/airyhq/airy/pull/1484)]
- Bump webpack from 5.30.0 to 5.31.0 [[#1483](https://github.com/airyhq/airy/pull/1483)]
- Bump @bazel/typescript from 3.2.3 to 3.3.0 [[#1482](https://github.com/airyhq/airy/pull/1482)]
- Bump copy-webpack-plugin from 8.1.0 to 8.1.1 [[#1469](https://github.com/airyhq/airy/pull/1469)]
- Bump emoji-mart from 3.0.0 to 3.0.1 [[#1507](https://github.com/airyhq/airy/pull/1507)]
- Fix hot module replacement  [[#1480](https://github.com/airyhq/airy/pull/1480)]

#### Airy CLI

You can download the Airy CLI for your operating system from the following links:

[MacOS](https://airy-core-binaries.s3.amazonaws.com/0.17.0/darwin/amd64/airy)
[Linux](https://airy-core-binaries.s3.amazonaws.com/0.17.0/linux/amd64/airy)
[Windows](https://airy-core-binaries.s3.amazonaws.com/0.17.0/windows/amd64/airy.exe)

## 0.16.0

#### 🚀 Features

- [[#1111](https://github.com/airyhq/airy/issues/1111)] Customize Chat Plugin [[#1456](https://github.com/airyhq/airy/pull/1456)]
- [[#1384](https://github.com/airyhq/airy/issues/1384)] Add more types suggested replies [[#1420](https://github.com/airyhq/airy/pull/1420)]
- [[#1293](https://github.com/airyhq/airy/issues/1293)] Add Prometheus doc [[#1448](https://github.com/airyhq/airy/pull/1448)]
- [[#1244](https://github.com/airyhq/airy/issues/1244)] Display lightbulb icon for previous… [[#1424](https://github.com/airyhq/airy/pull/1424)]

#### 🐛 Bug Fixes

- [[#1310](https://github.com/airyhq/airy/issues/1310)] Airy CLI sha changes after the release [[#1443](https://github.com/airyhq/airy/pull/1443)]
- [[#1452](https://github.com/airyhq/airy/issues/1452)] Show tags in contact info column [[#1454](https://github.com/airyhq/airy/pull/1454)]
- [[#1455](https://github.com/airyhq/airy/issues/1455)] Configure lucene so queries are case insensitive [[#1463](https://github.com/airyhq/airy/pull/1463)]
- [[#1304](https://github.com/airyhq/airy/issues/1304)] Wait for core components during create [[#1442](https://github.com/airyhq/airy/pull/1442)]
- [[#925](https://github.com/airyhq/airy/issues/925)] Fix examples [[#1441](https://github.com/airyhq/airy/pull/1441)]
- [[#1413](https://github.com/airyhq/airy/issues/1413)] expand chat plugin by default [[#1436](https://github.com/airyhq/airy/pull/1436)]
- [[#1450](https://github.com/airyhq/airy/issues/1450)] Fix conversation counter [[#1451](https://github.com/airyhq/airy/pull/1451)]

#### 📚 Documentation

- [[#1422](https://github.com/airyhq/airy/issues/1422)] Add section for kubectl [[#1445](https://github.com/airyhq/airy/pull/1445)]
- [[#1406](https://github.com/airyhq/airy/issues/1406)] live chat docs quickstart [[#1440](https://github.com/airyhq/airy/pull/1440)]
- [[#1404](https://github.com/airyhq/airy/issues/1404)] added intro to sources [[#1444](https://github.com/airyhq/airy/pull/1444)]
- [[#1439](https://github.com/airyhq/airy/issues/1439)] Update release process with hotfix doc [[#1449](https://github.com/airyhq/airy/pull/1449)]
- [[#1403](https://github.com/airyhq/airy/issues/1403)] CLI Docs Revamp  [[#1426](https://github.com/airyhq/airy/pull/1426)]

#### 🧰 Maintenance

- [[#1164](https://github.com/airyhq/airy/issues/1164)] Document and improve message upsert endpoint [[#1468](https://github.com/airyhq/airy/pull/1468)]
- Readme - now with nice graph-ical improvements [[#1377](https://github.com/airyhq/airy/pull/1377)]
- [[#1466](https://github.com/airyhq/airy/issues/1466)] Prepare the codebase for lib extraction [[#1467](https://github.com/airyhq/airy/pull/1467)]
- Bump cypress from 6.8.0 to 7.0.0 [[#1461](https://github.com/airyhq/airy/pull/1461)]
- Bump @typescript-eslint/parser from 4.20.0 to 4.21.0 [[#1460](https://github.com/airyhq/airy/pull/1460)]
- Bump @bazel/ibazel from 0.15.6 to 0.15.8 [[#1464](https://github.com/airyhq/airy/pull/1464)]
- Bump webpack from 5.28.0 to 5.30.0 [[#1459](https://github.com/airyhq/airy/pull/1459)]
- Bump @typescript-eslint/eslint-plugin from 4.20.0 to 4.21.0 [[#1462](https://github.com/airyhq/airy/pull/1462)]
- Bump @typescript-eslint/eslint-plugin from 4.19.0 to 4.20.0 [[#1446](https://github.com/airyhq/airy/pull/1446)]
- Bump eslint from 7.22.0 to 7.23.0 [[#1447](https://github.com/airyhq/airy/pull/1447)]
- Remove Airy init and restructure cli [[#1414](https://github.com/airyhq/airy/pull/1414)]
- Bump @typescript-eslint/parser from 4.19.0 to 4.20.0 [[#1434](https://github.com/airyhq/airy/pull/1434)]
- Bump core-js from 3.9.1 to 3.10.0 [[#1435](https://github.com/airyhq/airy/pull/1435)]
- Bump @bazel/ibazel from 0.14.0 to 0.15.6 [[#1433](https://github.com/airyhq/airy/pull/1433)]
- Bump @babel/core from 7.13.10 to 7.13.14 [[#1432](https://github.com/airyhq/airy/pull/1432)]
- Bump webpack-cli from 4.5.0 to 4.6.0 [[#1431](https://github.com/airyhq/airy/pull/1431)]

#### Airy CLI

You can download the Airy CLI for your operating system from the following links:

[MacOS](https://airy-core-binaries.s3.amazonaws.com/0.16.0/darwin/amd64/airy)
[Linux](https://airy-core-binaries.s3.amazonaws.com/0.16.0/linux/amd64/airy)
[Windows](https://airy-core-binaries.s3.amazonaws.com/0.16.0/windows/amd64/airy.exe)

## 0.15.1 Hotfix

- [[#1427](https://github.com/airyhq/airy/issues/1427)] Fix broken UI pod config for AWS deployment

## 0.15.0

#### 🚀 Features

- [[#1299](https://github.com/airyhq/airy/issues/1299)] Video Fallback for the render library [[#1412](https://github.com/airyhq/airy/pull/1412)]
- [[#1357](https://github.com/airyhq/airy/issues/1357)] Rename the draft release with release.sh [[#1394](https://github.com/airyhq/airy/pull/1394)]
- [[#1018](https://github.com/airyhq/airy/issues/1018)] Introduce aws provider for airy create [[#1240](https://github.com/airyhq/airy/pull/1240)]
- [[#1182](https://github.com/airyhq/airy/issues/1182)] Added gifs and image to supported message types chat plugin [[#1365](https://github.com/airyhq/airy/pull/1365)]
- [[#1326](https://github.com/airyhq/airy/issues/1326)] Move Carousel to components lib [[#1364](https://github.com/airyhq/airy/pull/1364)]
- [[#1097](https://github.com/airyhq/airy/issues/1097)] Allow users to fetch a chat plugin resume token [[#1350](https://github.com/airyhq/airy/pull/1350)]
- [[#1325](https://github.com/airyhq/airy/issues/1325)] Move ListenOutsideClick to component lib [[#1345](https://github.com/airyhq/airy/pull/1345)]

#### 🐛 Bug Fixes

- [[#1392](https://github.com/airyhq/airy/issues/1392)] Cypress testing for filtering is false positive [[#1402](https://github.com/airyhq/airy/pull/1402)]
- [[#1097](https://github.com/airyhq/airy/issues/1097)] Fix CORS issue introduced by PR #1350 [[#1371](https://github.com/airyhq/airy/pull/1371)]
- [[#1369](https://github.com/airyhq/airy/issues/1369)] Improved filtering for channels [[#1375](https://github.com/airyhq/airy/pull/1375)]

#### 📚 Documentation

- [[#1363](https://github.com/airyhq/airy/issues/1363)] Added suggested replies doc [[#1381](https://github.com/airyhq/airy/pull/1381)]
- [[#1355](https://github.com/airyhq/airy/issues/1355)] Add debugging advices to all sources [[#1368](https://github.com/airyhq/airy/pull/1368)]
- [[#1318](https://github.com/airyhq/airy/issues/1318)] Improve components page [[#1360](https://github.com/airyhq/airy/pull/1360)]

#### 🧰 Maintenance

- [[#1045](https://github.com/airyhq/airy/issues/1045)] Automated testing of the web socket [[#1382](https://github.com/airyhq/airy/pull/1382)]
- Move CLI to root [[#1401](https://github.com/airyhq/airy/pull/1401)]
- Bump @babel/core from 7.8.4 to 7.13.10 [[#1186](https://github.com/airyhq/airy/pull/1186)]
- Bump webpack from 4.46.0 to 5.27.2 [[#1352](https://github.com/airyhq/airy/pull/1352)]
- Minor tweaks to titles and paragraphs [[#1379](https://github.com/airyhq/airy/pull/1379)]
- Bump @typescript-eslint/eslint-plugin from 4.18.0 to 4.19.0 [[#1376](https://github.com/airyhq/airy/pull/1376)]
- Bump css-loader from 5.1.3 to 5.2.0 [[#1378](https://github.com/airyhq/airy/pull/1378)]
- Bump html-webpack-plugin from 4.5.2 to 5.3.1 [[#1372](https://github.com/airyhq/airy/pull/1372)]
- Bump @bazel/typescript from 3.2.2 to 3.2.3 [[#1374](https://github.com/airyhq/airy/pull/1374)]
- Bump sass-loader from 10.1.1 to 11.0.1 [[#1373](https://github.com/airyhq/airy/pull/1373)]
- Bump copy-webpack-plugin from 6.4.1 to 8.1.0 [[#1366](https://github.com/airyhq/airy/pull/1366)]
- Bump eslint-plugin-react from 7.22.0 to 7.23.0 [[#1339](https://github.com/airyhq/airy/pull/1339)]
- Bump webpack from 5.27.2 to 5.28.0 [[#1361](https://github.com/airyhq/airy/pull/1361)]
- Update the release process [[#1358](https://github.com/airyhq/airy/pull/1358)]

#### Airy CLI

You can download the Airy CLI for your operating system from the following links:

[MacOS](https://airy-core-binaries.s3.amazonaws.com/0.15.0/darwin/amd64/airy)
[Linux](https://airy-core-binaries.s3.amazonaws.com/0.15.0/linux/amd64/airy)
[Windows](https://airy-core-binaries.s3.amazonaws.com/0.15.0/windows/amd64/airy.exe)

## 0.14.0

#### Changes

- Docs/1301 add docs for twilio sources [[#1332](https://github.com/airyhq/airy/pull/1332)]
- Bump webpack-cli from 3.3.12 to 4.5.0 [[#1287](https://github.com/airyhq/airy/pull/1287)]
- Bump css-loader from 3.6.0 to 5.1.3 [[#1320](https://github.com/airyhq/airy/pull/1320)]
- Bump react-window from 1.8.5 to 1.8.6 [[#1309](https://github.com/airyhq/airy/pull/1309)]
- Bump react-window-infinite-loader from 1.0.5 to 1.0.7 [[#1286](https://github.com/airyhq/airy/pull/1286)]
- [[#1235](https://github.com/airyhq/airy/issues/1235)] Add test to connect a chatplugin channel [[#1269](https://github.com/airyhq/airy/pull/1269)]

#### 🚀 Features

- [[#1312](https://github.com/airyhq/airy/issues/1312)] Add users.list [[#1333](https://github.com/airyhq/airy/pull/1333)]
- [[#1049](https://github.com/airyhq/airy/issues/1049)] Script that executes all integration tests [[#1344](https://github.com/airyhq/airy/pull/1344)]
- [[#970](https://github.com/airyhq/airy/issues/970)] Improved ui components docs [[#1341](https://github.com/airyhq/airy/pull/1341)]
- [[#1272](https://github.com/airyhq/airy/issues/1272)] Make cypress tests independent from each other [[#1317](https://github.com/airyhq/airy/pull/1317)]
- [[#1328](https://github.com/airyhq/airy/issues/1328)] Develop version of airy CLI is not… [[#1330](https://github.com/airyhq/airy/pull/1330)]
- [[#1267](https://github.com/airyhq/airy/issues/1267)] Created generic logo component [[#1329](https://github.com/airyhq/airy/pull/1329)]
- [[#677](https://github.com/airyhq/airy/issues/677)] Render Suggested Replies [[#1324](https://github.com/airyhq/airy/pull/1324)]
- [[#1036](https://github.com/airyhq/airy/issues/1036)] API key authentication [[#1316](https://github.com/airyhq/airy/pull/1316)]
- [[#968](https://github.com/airyhq/airy/issues/968)] Improve UI/Inbox docs [[#1280](https://github.com/airyhq/airy/pull/1280)]
- [[#1041](https://github.com/airyhq/airy/issues/1041)] Minikube provider [[#1179](https://github.com/airyhq/airy/pull/1179)]
- [[#1278](https://github.com/airyhq/airy/issues/1278)] GIFs in docs are too large [[#1295](https://github.com/airyhq/airy/pull/1295)]
- [[#1281](https://github.com/airyhq/airy/issues/1281)] Added RichCard and RichCardCarousel to google [[#1288](https://github.com/airyhq/airy/pull/1288)]
- [[#1222](https://github.com/airyhq/airy/issues/1222)] Improved structure in channels pages [[#1271](https://github.com/airyhq/airy/pull/1271)]
- [[#1270](https://github.com/airyhq/airy/issues/1270)] Installation: Toggle broken \& Update for… [[#1273](https://github.com/airyhq/airy/pull/1273)]
- [[#1050](https://github.com/airyhq/airy/issues/1050)] Add test for filtering and creating a tag [[#1252](https://github.com/airyhq/airy/pull/1252)]

#### 🐛 Bug Fixes

- [[#1239](https://github.com/airyhq/airy/issues/1239)] Fix message wrapper for render library [[#1297](https://github.com/airyhq/airy/pull/1297)]
- [[#1306](https://github.com/airyhq/airy/issues/1306)] Fix contact metadata problem [[#1349](https://github.com/airyhq/airy/pull/1349)]
- [[#1343](https://github.com/airyhq/airy/issues/1343)] Save button doesn't work for adding a… [[#1347](https://github.com/airyhq/airy/pull/1347)]
- [[#1298](https://github.com/airyhq/airy/issues/1298)] MessageTextArea in inbox doesn't shrink… [[#1340](https://github.com/airyhq/airy/pull/1340)]
- [[#1303](https://github.com/airyhq/airy/issues/1303)] Long messages from contacts shrink the… [[#1334](https://github.com/airyhq/airy/pull/1334)]
- [[#1267](https://github.com/airyhq/airy/issues/1267)] Updated sourceLogo component [[#1331](https://github.com/airyhq/airy/pull/1331)]
- [[#1041](https://github.com/airyhq/airy/issues/1041)] follow up fix: missing quotes in web dev script [[#1311](https://github.com/airyhq/airy/pull/1311)]
- [[#1090](https://github.com/airyhq/airy/issues/1090)] Add fallback image to channels [[#1254](https://github.com/airyhq/airy/pull/1254)]

#### 📚 Documentation

- [[#1323](https://github.com/airyhq/airy/issues/1323)] Fix minikube command [[#1327](https://github.com/airyhq/airy/pull/1327)]
- [[#1314](https://github.com/airyhq/airy/issues/1314)] Have one TLDR [[#1315](https://github.com/airyhq/airy/pull/1315)]
- [[#1264](https://github.com/airyhq/airy/issues/1264)] Prepare config page for the new milestone [[#1308](https://github.com/airyhq/airy/pull/1308)]
- [[#1265](https://github.com/airyhq/airy/issues/1265)] Merge cheatsheet from introduction into reference [[#1277](https://github.com/airyhq/airy/pull/1277)]
- [[#969](https://github.com/airyhq/airy/issues/969)] Cleanup tag docs [[#1275](https://github.com/airyhq/airy/pull/1275)]
- [[#1263](https://github.com/airyhq/airy/issues/1263)] Airy Core Components: Move to own page [[#1276](https://github.com/airyhq/airy/pull/1276)]

#### 🧰 Maintenance

- Fix build [[#1346](https://github.com/airyhq/airy/pull/1346)]
- Bump react-redux from 7.2.2 to 7.2.3 [[#1335](https://github.com/airyhq/airy/pull/1335)]
- Bump @babel/preset-env from 7.13.10 to 7.13.12 [[#1336](https://github.com/airyhq/airy/pull/1336)]
- Bump @typescript-eslint/parser from 4.18.0 to 4.19.0 [[#1337](https://github.com/airyhq/airy/pull/1337)]
- Remove ejs compiled loader [[#1322](https://github.com/airyhq/airy/pull/1322)]
- Invert icons on darkTheme [[#1319](https://github.com/airyhq/airy/pull/1319)]
- Bump style-loader from 1.3.0 to 2.0.0 [[#1313](https://github.com/airyhq/airy/pull/1313)]
- Bump redux-starter-kit from 0.8.1 to 2.0.0 [[#1296](https://github.com/airyhq/airy/pull/1296)]
- Bump node-sass from 4.14.0 to 5.0.0 [[#1226](https://github.com/airyhq/airy/pull/1226)]
- Bump @svgr/webpack from 5.4.0 to 5.5.0 [[#1257](https://github.com/airyhq/airy/pull/1257)]
- Bump @types/node from 12.11.1 to 14.14.35 [[#1258](https://github.com/airyhq/airy/pull/1258)]

#### Airy CLI

You can download the Airy CLI for your operating system from the following links:

[MacOS](https://airy-core-binaries.s3.amazonaws.com/0.14.0/darwin/amd64/airy)
[Linux](https://airy-core-binaries.s3.amazonaws.com/0.14.0/linux/amd64/airy)
[Windows](https://airy-core-binaries.s3.amazonaws.com/0.14.0/windows/amd64/airy.exe)

## 0.13.0

#### Changes
- Bump typesafe-actions from 4.4.2 to 5.1.0 [[#1210](https://github.com/airyhq/airy/pull/1210)]
- [[#783](https://github.com/airyhq/airy/issues/783)] Introduce changelog [[#1221](https://github.com/airyhq/airy/pull/1221)]
- Bump yargs-parser from 5.0.0 to 5.0.1 [[#1213](https://github.com/airyhq/airy/pull/1213)]
- Bump react-dom from 16.12.0 to 16.14.0 [[#1188](https://github.com/airyhq/airy/pull/1188)]
- [[#773](https://github.com/airyhq/airy/issues/773)] change searchbar to the left [[#1192](https://github.com/airyhq/airy/pull/1192)]

#### 🚀 Features
- [[#1247](https://github.com/airyhq/airy/issues/1247)] Optional variables for templates creation [[#1248](https://github.com/airyhq/airy/pull/1248)]
- [[#656](https://github.com/airyhq/airy/issues/656)] Enable users to connect via Twilio Sms and Whatsapp [[#1223](https://github.com/airyhq/airy/pull/1223)]
- [[#659](https://github.com/airyhq/airy/issues/659)] Enable to connect via facebook [[#1130](https://github.com/airyhq/airy/pull/1130)]
- [[#871](https://github.com/airyhq/airy/issues/871)] Httpclient methods need return value [[#1199](https://github.com/airyhq/airy/pull/1199)]
- [[#868](https://github.com/airyhq/airy/issues/868)] Templates manager [[#1123](https://github.com/airyhq/airy/pull/1123)]
- [[#1228](https://github.com/airyhq/airy/issues/1228)] Scope templates list by source type [[#1230](https://github.com/airyhq/airy/pull/1230)]
- [[#1204](https://github.com/airyhq/airy/issues/1204)] Add sourceType to templates API [[#1208](https://github.com/airyhq/airy/pull/1208)]
- [[#1047](https://github.com/airyhq/airy/issues/1047)] Chatplugin testing [[#1087](https://github.com/airyhq/airy/pull/1087)]
- [[#1022](https://github.com/airyhq/airy/issues/1022)] Change ingress hostnames and deploy traefik ingress controller [[#1122](https://github.com/airyhq/airy/pull/1122)]
- [[#1055](https://github.com/airyhq/airy/issues/1055)] Expired Websocket Connection [[#1181](https://github.com/airyhq/airy/pull/1181)]

#### 🐛 Bug Fixes
- [[#1236](https://github.com/airyhq/airy/issues/1236)] Fixed issues with filter by channel [[#1253](https://github.com/airyhq/airy/pull/1253)]
- [[#1249](https://github.com/airyhq/airy/issues/1249)]fixed templates modal and fixed type template with api change [[#1251](https://github.com/airyhq/airy/pull/1251)]
- [[#1241](https://github.com/airyhq/airy/issues/1241)] Fix chatplugin ui path collision. Follow up fix. [[#1245](https://github.com/airyhq/airy/pull/1245)]
- [[#1241](https://github.com/airyhq/airy/issues/1241)] Fix chatplugin ui path collision [[#1243](https://github.com/airyhq/airy/pull/1243)]
- [[#1018](https://github.com/airyhq/airy/issues/1018)]Fix Golang dependencies, upgrade Gazelle [[#1231](https://github.com/airyhq/airy/pull/1231)]
- [[#1217](https://github.com/airyhq/airy/issues/1217)] Make validation work for auth app [[#1225](https://github.com/airyhq/airy/pull/1225)]
- [[#677](https://github.com/airyhq/airy/issues/677)] add missing ingress definition for suggest replies endpoint [[#1224](https://github.com/airyhq/airy/pull/1224)]
- [[#1214](https://github.com/airyhq/airy/issues/1214)] Duplicate messages in the redux store [[#1216](https://github.com/airyhq/airy/pull/1216)]
- [[#1205](https://github.com/airyhq/airy/issues/1205)] Fix update deps command and the gazelle repositories [[#1209](https://github.com/airyhq/airy/pull/1209)]
- Fix chat plugin build by upgrading bazel-tools #2 [[#1203](https://github.com/airyhq/airy/pull/1203)]
- Fix chatplugin build by upgrading bazel-tools [[#1202](https://github.com/airyhq/airy/pull/1202)]
- [[#1047](https://github.com/airyhq/airy/issues/1047)] Fix ui baseUrl [[#1200](https://github.com/airyhq/airy/pull/1200)]
- [[#1174](https://github.com/airyhq/airy/issues/1174)] Follow up of the follow up of the fix [[#1198](https://github.com/airyhq/airy/pull/1198)]
- [[#1174](https://github.com/airyhq/airy/issues/1174)] Follow up fix to bug introduced by PR #1177 [[#1196](https://github.com/airyhq/airy/pull/1196)]
- [[#1101](https://github.com/airyhq/airy/issues/1101)] Filtering by channel not functioning [[#1194](https://github.com/airyhq/airy/pull/1194)]

#### 📚 Documentation
- More readable examples [[#1233](https://github.com/airyhq/airy/pull/1233)]
- Chatplugin overview section [[#1207](https://github.com/airyhq/airy/pull/1207)]
- [[#1105](https://github.com/airyhq/airy/issues/1105)] New structure for chatplugin docs [[#1180](https://github.com/airyhq/airy/pull/1180)]

#### 🧰 Maintenance
- Bump @stomp/stompjs from 6.0.0 to 6.1.0 [[#1227](https://github.com/airyhq/airy/pull/1227)]
- [[#1197](https://github.com/airyhq/airy/issues/1197)] Rename chat\_plugin to chatplugin everywhere [[#1234](https://github.com/airyhq/airy/pull/1234)]
- Bump @bazel/typescript from 3.2.1 to 3.2.2 [[#1187](https://github.com/airyhq/airy/pull/1187)]
- Bump copy-webpack-plugin from 5.1.1 to 6.4.1 [[#1158](https://github.com/airyhq/airy/pull/1158)]
- [[#1183](https://github.com/airyhq/airy/issues/1183)] Bring back the prettier config [[#1184](https://github.com/airyhq/airy/pull/1184)]

#### Airy CLI

You can download the Airy CLI for your operating system from the following links:

[MacOS](https://airy-core-binaries.s3.amazonaws.com/0.13.0/darwin/amd64/airy)
[Linux](https://airy-core-binaries.s3.amazonaws.com/0.13.0/linux/amd64/airy)
[Windows](https://airy-core-binaries.s3.amazonaws.com/0.13.0/windows/amd64/airy.exe)

## 0.12.0

#### Changes

- [[#1132](https://github.com/airyhq/airy/issues/1132)] Fix missing , in nginx [[#1133](https://github.com/airyhq/airy/pull/1133)]
- [[#1014](https://github.com/airyhq/airy/issues/1014)] Deploy the helm charts [[#1084](https://github.com/airyhq/airy/pull/1084)]
- [[#1124](https://github.com/airyhq/airy/issues/1124)] Template endpoints return 404 [[#1125](https://github.com/airyhq/airy/pull/1125)]

#### 🚀 Features

- [[#1113](https://github.com/airyhq/airy/issues/1113)] Chat Plugin: keep text in input bar if… [[#1143](https://github.com/airyhq/airy/pull/1143)]
- [[#1000](https://github.com/airyhq/airy/issues/1000)] ConversationList scrolls over TopBar [[#1129](https://github.com/airyhq/airy/pull/1129)]
- [[#983](https://github.com/airyhq/airy/issues/983)] The login call should not send the auth… [[#1127](https://github.com/airyhq/airy/pull/1127)]
- [[#1126](https://github.com/airyhq/airy/issues/1126)] /templates.info And /templates.update are returning 404 [[#1128](https://github.com/airyhq/airy/pull/1128)]
- [[#660](https://github.com/airyhq/airy/issues/660)] Enable users to connect via Airy Live Chat [[#1078](https://github.com/airyhq/airy/pull/1078)]
- [[#1117](https://github.com/airyhq/airy/issues/1117)] Template docs are not accessible [[#1118](https://github.com/airyhq/airy/pull/1118)]

#### 🐛 Bug Fixes

- [[#1174](https://github.com/airyhq/airy/issues/1174)] Build the right cli version on develop [[#1177](https://github.com/airyhq/airy/pull/1177)]
- [[#1165](https://github.com/airyhq/airy/issues/1165)] Fix template endpoint content field [[#1166](https://github.com/airyhq/airy/pull/1166)]
- [[#1161](https://github.com/airyhq/airy/issues/1161)] Fix metadata 404 [[#1162](https://github.com/airyhq/airy/pull/1162)]
- [[#1152](https://github.com/airyhq/airy/issues/1152)] Fix conditional config apply [[#1153](https://github.com/airyhq/airy/pull/1153)]
- [[#1142](https://github.com/airyhq/airy/issues/1142)] Backbutton \& search aligned [[#1149](https://github.com/airyhq/airy/pull/1149)]
- [[#1034](https://github.com/airyhq/airy/issues/1034)] Tag empty state has strange scrolling… [[#1141](https://github.com/airyhq/airy/pull/1141)]
- [[#1112](https://github.com/airyhq/airy/issues/1112)] fixed highlight in inbox [[#1119](https://github.com/airyhq/airy/pull/1119)]
- [[#1120](https://github.com/airyhq/airy/issues/1120)] Fix Shellcheck [[#1121](https://github.com/airyhq/airy/pull/1121)]

#### 📚 Documentation

- [[#1094](https://github.com/airyhq/airy/issues/1094)] Minor UI improvements to the docs [[#1131](https://github.com/airyhq/airy/pull/1131)]

#### 🧰 Maintenance

- Revert "Bump webpack-dev-middleware from 3.7.2 to 4.1.0" [[#1172](https://github.com/airyhq/airy/pull/1172)]
- Bump elliptic from 6.5.3 to 6.5.4 in /docs [[#1170](https://github.com/airyhq/airy/pull/1170)]
- Bump elliptic from 6.5.3 to 6.5.4 [[#1171](https://github.com/airyhq/airy/pull/1171)]
- Bump terser-webpack-plugin from 2.3.6 to 4.2.3 [[#1169](https://github.com/airyhq/airy/pull/1169)]
- Bump html-webpack-plugin from 4.2.0 to 4.5.2 [[#1168](https://github.com/airyhq/airy/pull/1168)]
- Bump webpack-dev-middleware from 3.7.2 to 4.1.0 [[#1154](https://github.com/airyhq/airy/pull/1154)]
- Bump react from 16.12.0 to 16.14.0 [[#1167](https://github.com/airyhq/airy/pull/1167)]
- Restructure cli for building providers [[#1159](https://github.com/airyhq/airy/pull/1159)]
- Bump react-router-dom from 5.1.2 to 5.2.0 [[#1155](https://github.com/airyhq/airy/pull/1155)]
- Bump prettier from 1.19.1 to 2.2.1 [[#1147](https://github.com/airyhq/airy/pull/1147)]
- Bump lodash-es from 4.17.15 to 4.17.21 [[#1156](https://github.com/airyhq/airy/pull/1156)]
- Bump @types/react-router-dom from 5.1.3 to 5.1.7 [[#1157](https://github.com/airyhq/airy/pull/1157)]
- Restructure cli to prepare for providers [[#1151](https://github.com/airyhq/airy/pull/1151)]
- Bump eslint-plugin-react from 7.21.5 to 7.22.0 [[#1148](https://github.com/airyhq/airy/pull/1148)]
- Bump eslint from 7.16.0 to 7.21.0 [[#1144](https://github.com/airyhq/airy/pull/1144)]
- Bump file-loader from 6.0.0 to 6.2.0 [[#1145](https://github.com/airyhq/airy/pull/1145)]
- Bump @bazel/typescript from 3.2.0 to 3.2.1 [[#1146](https://github.com/airyhq/airy/pull/1146)]
- Bump react-hot-loader from 4.12.20 to 4.13.0 [[#1138](https://github.com/airyhq/airy/pull/1138)]
- Bump @types/react-redux from 7.1.3 to 7.1.16 [[#1136](https://github.com/airyhq/airy/pull/1136)]
- Bump @types/lodash-es from 4.17.3 to 4.17.4 [[#1137](https://github.com/airyhq/airy/pull/1137)]
- Bump preact from 10.5.7 to 10.5.12 [[#1139](https://github.com/airyhq/airy/pull/1139)]
- Bump react-redux from 7.1.3 to 7.2.2 [[#1140](https://github.com/airyhq/airy/pull/1140)]
- Add dependabot config [[#1135](https://github.com/airyhq/airy/pull/1135)]

#### Airy CLI

You can download the Airy CLI for your operating system from the following links:

[MacOS](https://airy-core-binaries.s3.amazonaws.com/0.12.0/darwin/amd64/airy)
[Linux](https://airy-core-binaries.s3.amazonaws.com/0.12.0/linux/amd64/airy)
[Windows](https://airy-core-binaries.s3.amazonaws.com/0.12.0/windows/amd64/airy.exe)

## 0.11.0

#### 🚀 Features

- Custom welcome message in Chat Plugin [[#1103](https://github.com/airyhq/airy/pull/1103)]
- [[#1015](https://github.com/airyhq/airy/issues/1015)] Refactor the scheduling of the components [[#1091](https://github.com/airyhq/airy/pull/1091)]
- [[#1016](https://github.com/airyhq/airy/issues/1016)] Create topics with k8s job [[#1074](https://github.com/airyhq/airy/pull/1074)]
- [[#1044](https://github.com/airyhq/airy/issues/1044)] Add cypress rule [[#1077](https://github.com/airyhq/airy/pull/1077)]
- [[#1080](https://github.com/airyhq/airy/issues/1080)] Change style of ChatPlugin + fix carousel [[#1082](https://github.com/airyhq/airy/pull/1082)]
- [[#1014](https://github.com/airyhq/airy/issues/1014)] Add helm image containing the charts [[#1079](https://github.com/airyhq/airy/pull/1079)]
- [[#814](https://github.com/airyhq/airy/issues/814)] Add cmd+enter and better disabled state to… [[#1076](https://github.com/airyhq/airy/pull/1076)]


#### 🐛 Bug Fixes

- Fix/1104 split endpoints in http library in multiple files [[#1114](https://github.com/airyhq/airy/pull/1114)]
- [[#1099](https://github.com/airyhq/airy/issues/1099)] Add missing allowed origin env [[#1100](https://github.com/airyhq/airy/pull/1100)]
- [[#1093](https://github.com/airyhq/airy/issues/1093)] Fix image url for Facebook channel connection [[#1095](https://github.com/airyhq/airy/pull/1095)]
- [[#1088](https://github.com/airyhq/airy/issues/1088)] Fix missing Facebook channel disconnect [[#1089](https://github.com/airyhq/airy/pull/1089)]
- [[#1068](https://github.com/airyhq/airy/issues/1068)] improve channels UI [[#1071](https://github.com/airyhq/airy/pull/1071)]
- fix size chatplugin in example.html [[#1070](https://github.com/airyhq/airy/pull/1070)]
- [[#1028](https://github.com/airyhq/airy/issues/1028)] replaced manual mapping with npm lib [[#1098](https://github.com/airyhq/airy/pull/1098)]
- [[#1072](https://github.com/airyhq/airy/issues/1072)] fixed text message and fallback in google suggestions [[#1073](https://github.com/airyhq/airy/pull/1073)]

#### 📚 Documentation

- [1092] Merge deployment and installation sections [[#1096](https://github.com/airyhq/airy/pull/1096)]
- Readme Revamp [[#1059](https://github.com/airyhq/airy/pull/1059)]

#### 🧰 Maintenance

- Use Bazel eslint test rule [[#1086](https://github.com/airyhq/airy/pull/1086)]
- Upgrade bazel tools and use buildifier tests [[#1081](https://github.com/airyhq/airy/pull/1081)]

#### Airy CLI

You can download the Airy CLI for your operating system from the following links:

[MacOS](https://airy-core-binaries.s3.amazonaws.com/0.11.0/darwin/amd64/airy)
[Linux](https://airy-core-binaries.s3.amazonaws.com/0.11.0/linux/amd64/airy)
[Windows](https://airy-core-binaries.s3.amazonaws.com/0.11.0/windows/amd64/airy.exe)

## 0.10.0

#### Changes

- [[#1007](https://github.com/airyhq/airy/issues/1007)] Bug: Cookies + 2 Chat Plugins [[#1027](https://github.com/airyhq/airy/pull/1027)]

#### 🚀 Features

- [[#665](https://github.com/airyhq/airy/issues/665)] Build UI aspect of channels page [[#986](https://github.com/airyhq/airy/pull/986)]
- [[#848](https://github.com/airyhq/airy/issues/848)] Handle Postback / Suggestion Messages /… [[#1066](https://github.com/airyhq/airy/pull/1066)]
- [[#862](https://github.com/airyhq/airy/issues/862)] Render suggestions google [[#1040](https://github.com/airyhq/airy/pull/1040)]
- [[#1038](https://github.com/airyhq/airy/issues/1038)] ChatPlugin does not render RichText [[#1060](https://github.com/airyhq/airy/pull/1060)]
- [[#1017](https://github.com/airyhq/airy/issues/1017)] Introduce the airy create command [[#1056](https://github.com/airyhq/airy/pull/1056)]
- [[#1002](https://github.com/airyhq/airy/issues/1002)] Chat Plugin Size [[#1039](https://github.com/airyhq/airy/pull/1039)]
- [[#905](https://github.com/airyhq/airy/issues/905)] Extract avatar and time from message render library [[#1011](https://github.com/airyhq/airy/pull/1011)]
- [[#957](https://github.com/airyhq/airy/issues/957)] Add ErrorBoundaries for the RenderLibrary [[#1024](https://github.com/airyhq/airy/pull/1024)]
- [[#918](https://github.com/airyhq/airy/issues/918)] Consume Airy Events from new websocket in the UI [[#988](https://github.com/airyhq/airy/pull/988)]
- [[#670](https://github.com/airyhq/airy/issues/670)] Render Rich Card Carousel (Google Style)… [[#1021](https://github.com/airyhq/airy/pull/1021)]
- [[#885](https://github.com/airyhq/airy/issues/885)] Use new airy event in webhook [[#998](https://github.com/airyhq/airy/pull/998)]
- [[#934](https://github.com/airyhq/airy/issues/934)] Parse (but don't map) API message response… [[#977](https://github.com/airyhq/airy/pull/977)]

#### 🐛 Bug Fixes

- [[#1042](https://github.com/airyhq/airy/issues/1042)] Fixes rendering and sending messaged to Facebook and sending for Google [[#1065](https://github.com/airyhq/airy/pull/1065)]
- [[#932](https://github.com/airyhq/airy/issues/932)] Add Twilio SMS and Whatsapp to render library [[#1061](https://github.com/airyhq/airy/pull/1061)]
- [[#1063](https://github.com/airyhq/airy/issues/1063)] Fix docs for status command [[#1064](https://github.com/airyhq/airy/pull/1064)]
- [[#842](https://github.com/airyhq/airy/issues/842)] Remove ugly border around filter icon [[#1057](https://github.com/airyhq/airy/pull/1057)]
- [[#885](https://github.com/airyhq/airy/issues/885)] Fix webhook payload [[#1033](https://github.com/airyhq/airy/pull/1033)]
- [[#1029](https://github.com/airyhq/airy/issues/1029)] Webhook consumer bootstrapping fixed [[#1030](https://github.com/airyhq/airy/pull/1030)]
- [[#1023](https://github.com/airyhq/airy/issues/1023)] Websocket uses tls when the page is loaded via https [[#1025](https://github.com/airyhq/airy/pull/1025)]

#### 📚 Documentation

- [[#1001](https://github.com/airyhq/airy/issues/1001)] improve google facebook sources [[#1012](https://github.com/airyhq/airy/pull/1012)]
- [[#999](https://github.com/airyhq/airy/issues/999)] ButtonBox v3 [[#1013](https://github.com/airyhq/airy/pull/1013)]
- [[#967](https://github.com/airyhq/airy/issues/967)] Add UI Quickstart [[#996](https://github.com/airyhq/airy/pull/996)]

#### 🧰 Maintenance

- [[#751](https://github.com/airyhq/airy/issues/751)] Introduce golang deps tool [[#1058](https://github.com/airyhq/airy/pull/1058)]
- Upgrade rules nodejs to 3.1 [[#1062](https://github.com/airyhq/airy/pull/1062)]
- [[#954](https://github.com/airyhq/airy/issues/954)] Extracting svgs from the apps and… [[#1037](https://github.com/airyhq/airy/pull/1037)]
- [[#886](https://github.com/airyhq/airy/issues/886)] Remove deprecated communication websocket [[#1026](https://github.com/airyhq/airy/pull/1026)]

#### Airy CLI

You can download the Airy CLI for your operating system from the following links:

[MacOS](https://airy-core-binaries.s3.amazonaws.com/0.10.0/darwin/amd64/airy)
[Linux](https://airy-core-binaries.s3.amazonaws.com/0.10.0/linux/amd64/airy)
[Windows](https://airy-core-binaries.s3.amazonaws.com/0.10.0/windows/amd64/airy.exe)

## 0.9.0

#### 🚀 Features

- [[#807](https://github.com/airyhq/airy/issues/807)] Introduction to UI docs [[#973](https://github.com/airyhq/airy/pull/973)]
- [[#849](https://github.com/airyhq/airy/issues/849)] Introduce dynamic page titles [[#990](https://github.com/airyhq/airy/pull/990)]
- [[#882](https://github.com/airyhq/airy/issues/882)] New /metadata.upsert API endpoint [[#955](https://github.com/airyhq/airy/pull/955)]
- [[#909](https://github.com/airyhq/airy/issues/909)] Add metadata to conversations API [[#941](https://github.com/airyhq/airy/pull/941)]
- [[#859](https://github.com/airyhq/airy/issues/859)] Add google rich card carousel to render library [[#976](https://github.com/airyhq/airy/pull/976)]
- [[#806](https://github.com/airyhq/airy/issues/806)] Add minimum height and width to UI [[#980](https://github.com/airyhq/airy/pull/980)]
- [[#671](https://github.com/airyhq/airy/issues/671)] Allow any message to be sent to the chat plugin [[#961](https://github.com/airyhq/airy/pull/961)]
- [[#950](https://github.com/airyhq/airy/issues/950)] Add update homebrew formula step to release process [[#959](https://github.com/airyhq/airy/pull/959)]
- [[#309](https://github.com/airyhq/airy/issues/309)] Homebrew cli tap [[#943](https://github.com/airyhq/airy/pull/943)]
- [[#949](https://github.com/airyhq/airy/issues/949)] Improve UI of chatplugin [[#953](https://github.com/airyhq/airy/pull/953)]
- [[#860](https://github.com/airyhq/airy/issues/860)] Render Generic Template Carousel from… [[#951](https://github.com/airyhq/airy/pull/951)]
- [[#675](https://github.com/airyhq/airy/issues/675)] Add Templates Endpoints documentation [[#872](https://github.com/airyhq/airy/pull/872)]
- [[#675](https://github.com/airyhq/airy/issues/675)] Add Templates Endpoints [[#948](https://github.com/airyhq/airy/pull/948)]
- [[#671](https://github.com/airyhq/airy/issues/671)] Render Rich Card (Google Style) on Live… [[#962](https://github.com/airyhq/airy/pull/962)]

#### 🐛 Bug Fixes

- [[#992](https://github.com/airyhq/airy/issues/992)] Start frontend components in start.sh [[#993](https://github.com/airyhq/airy/pull/993)]
- [[#960](https://github.com/airyhq/airy/issues/960)] Scope svg styles so that we don't break the sidebar [[#984](https://github.com/airyhq/airy/pull/984)]
- Fix missing annotation in google webhook [[#964](https://github.com/airyhq/airy/pull/964)]
- [[#956](https://github.com/airyhq/airy/issues/956)] Fix side problem in chatplugin source [[#958](https://github.com/airyhq/airy/pull/958)]
- [[#914](https://github.com/airyhq/airy/issues/914)] Add ingress and docs for AKHQ [[#940](https://github.com/airyhq/airy/pull/940)]
- [[#733](https://github.com/airyhq/airy/issues/733)] Hotfix/733 path for docs [[#982](https://github.com/airyhq/airy/pull/982)]

#### 📚 Documentation

- [[#867](https://github.com/airyhq/airy/issues/867)] Put cobra cmd docs in one file [[#971](https://github.com/airyhq/airy/pull/971)]
- [[#938](https://github.com/airyhq/airy/issues/938)] Buttons, buttons everywhere [[#963](https://github.com/airyhq/airy/pull/963)]

#### 🧰 Maintenance

- [[#733](https://github.com/airyhq/airy/issues/733)] Fix Netlify docs previews [[#991](https://github.com/airyhq/airy/pull/991)]
- [[#975](https://github.com/airyhq/airy/issues/975)] Rename Airy Core Platform [[#985](https://github.com/airyhq/airy/pull/985)]

#### Airy CLI

You can download the Airy CLI for your operating system from the following links:

[MacOS](https://airy-core-binaries.s3.amazonaws.com/0.9.0/darwin/amd64/airy)
[Linux](https://airy-core-binaries.s3.amazonaws.com/0.9.0/linux/amd64/airy)
[Windows](https://airy-core-binaries.s3.amazonaws.com/0.9.0/windows/amd64/airy.exe)

## 0.8.1

#### Changes

#### 🚀 Features

- [[#861](https://github.com/airyhq/airy/issues/861)] Render quick replies from facebook [[#942](https://github.com/airyhq/airy/pull/942)]
- [[#910](https://github.com/airyhq/airy/issues/910)] Add message metadata API documentation [[#937](https://github.com/airyhq/airy/pull/937)]
- [[#918](https://github.com/airyhq/airy/issues/918)] New Airy websocket using Airy events [[#928](https://github.com/airyhq/airy/pull/928)]
- [[#875](https://github.com/airyhq/airy/issues/875)] Improve Box component [[#924](https://github.com/airyhq/airy/pull/924)]
- [[#910](https://github.com/airyhq/airy/issues/910)] Add message metadata API [[#933](https://github.com/airyhq/airy/pull/933)]
- [[#856](https://github.com/airyhq/airy/issues/856)] Render Generic Template from Facebook [[#930](https://github.com/airyhq/airy/pull/930)]
- [[#855](https://github.com/airyhq/airy/issues/855)] Render Button Template from Facebook [[#921](https://github.com/airyhq/airy/pull/921)]

#### Airy CLI

You can download the Airy CLI for your operating system from the following links:

[MacOS](https://airy-core-binaries.s3.amazonaws.com/0.8.1/darwin/amd64/airy)
[Linux](https://airy-core-binaries.s3.amazonaws.com/0.8.1/linux/amd64/airy)
[Windows](https://airy-core-binaries.s3.amazonaws.com/0.8.1/windows/amd64/airy.exe)

## 0.8.0

#### Changes


#### 🚀 Features

- [[#852](https://github.com/airyhq/airy/issues/852)] Add google rich text to render library [[#902](https://github.com/airyhq/airy/pull/902)]
- [[#722](https://github.com/airyhq/airy/issues/722)] Add AKHQ as optional tool [[#847](https://github.com/airyhq/airy/pull/847)]
- [[#854](https://github.com/airyhq/airy/issues/854)] Render File from Facebook [[#904](https://github.com/airyhq/airy/pull/904)]
- [[#858](https://github.com/airyhq/airy/issues/858)] Add render rich card [[#901](https://github.com/airyhq/airy/pull/901)]
- [[#863](https://github.com/airyhq/airy/issues/863)] Map metadata to object [[#891](https://github.com/airyhq/airy/pull/891)]
- [[#605](https://github.com/airyhq/airy/issues/605)] Improve chatplugin docs and gifs [[#900](https://github.com/airyhq/airy/pull/900)]
- [[#827](https://github.com/airyhq/airy/issues/827)] Chatplugin uses its own payload [[#853](https://github.com/airyhq/airy/pull/853)]
- [[#772](https://github.com/airyhq/airy/issues/772)] Add Airy Core, Airy Enterprise, Need help? and github links to navigationBar [[#838](https://github.com/airyhq/airy/pull/838)]
- [[#794](https://github.com/airyhq/airy/issues/794)] Introduce channels domain to source specific channel APIs [[#836](https://github.com/airyhq/airy/pull/836)]
- [[#729](https://github.com/airyhq/airy/issues/729)] Make auth header compliant with rfc6750 (Bearer auth) [[#830](https://github.com/airyhq/airy/pull/830)]
- [[#833](https://github.com/airyhq/airy/issues/833)] Bottom space in conversation list [[#843](https://github.com/airyhq/airy/pull/843)]

#### 🐛 Bug Fixes

- [[#911](https://github.com/airyhq/airy/issues/911)] fixed rich card rendering with product requirements [[#912](https://github.com/airyhq/airy/pull/912)]
- [[#796](https://github.com/airyhq/airy/issues/796)] Mv shellsheck installation to workflow [[#870](https://github.com/airyhq/airy/pull/870)]
- [[#841](https://github.com/airyhq/airy/issues/841)] Logout if user auth token is wrong [[#857](https://github.com/airyhq/airy/pull/857)]
- Fix facebook text render [[#864](https://github.com/airyhq/airy/pull/864)]
- [[#834](https://github.com/airyhq/airy/issues/834)]Delete link in old inbox and css fix [[#851](https://github.com/airyhq/airy/pull/851)]
- [[#832](https://github.com/airyhq/airy/issues/832)] Merging messages when loading conversations [[#845](https://github.com/airyhq/airy/pull/845)]

#### 📚 Documentation

- [[#893](https://github.com/airyhq/airy/issues/893)] Enable showLastUpdateTime [[#917](https://github.com/airyhq/airy/pull/917)]
- [[#899](https://github.com/airyhq/airy/issues/899)] Quickstart with steps [[#916](https://github.com/airyhq/airy/pull/916)]
- [[#876](https://github.com/airyhq/airy/issues/876)] cli install doc revamp [[#896](https://github.com/airyhq/airy/pull/896)]
- [[#846](https://github.com/airyhq/airy/issues/846)] Docs for airy config yaml [[#873](https://github.com/airyhq/airy/pull/873)]
- [[#874](https://github.com/airyhq/airy/issues/874)] Highlight component for docs  [[#887](https://github.com/airyhq/airy/pull/887)]
- [[#735](https://github.com/airyhq/airy/issues/735)] Show airy logo on darkmode [[#837](https://github.com/airyhq/airy/pull/837)]

#### 🧰 Maintenance

- [#796 ] Add shellcheck lint [[#865](https://github.com/airyhq/airy/pull/865)]
- [[#575](https://github.com/airyhq/airy/issues/575)] Fix window: any type definition [[#850](https://github.com/airyhq/airy/pull/850)]
- [[#605](https://github.com/airyhq/airy/issues/605)] Rename also the charts [[#839](https://github.com/airyhq/airy/pull/839)]

#### Airy CLI

You can download the Airy CLI for your operating system from the following links:

[MacOS](https://airy-core-binaries.s3.amazonaws.com/0.8.0/darwin/amd64/airy)
[Linux](https://airy-core-binaries.s3.amazonaws.com/0.8.0/linux/amd64/airy)
[Windows](https://airy-core-binaries.s3.amazonaws.com/0.8.0/windows/amd64/airy.exe)

## 0.7.0

#### Changes

- [[#685](https://github.com/airyhq/airy/issues/685)] Type errors not caught by Typescript [[#780](https://github.com/airyhq/airy/pull/780)]
- [[#288](https://github.com/airyhq/airy/issues/288)] Upgrade to Bazel 4.0.0 [[#799](https://github.com/airyhq/airy/pull/799)]
- [[#403](https://github.com/airyhq/airy/issues/403)] Filter for conversations [[#744](https://github.com/airyhq/airy/pull/744)]
- [[#745](https://github.com/airyhq/airy/issues/745)] Fixing demo api host env when running… [[#746](https://github.com/airyhq/airy/pull/746)]

#### 🚀 Features

- [[#824](https://github.com/airyhq/airy/issues/824)] When sending a message to the Chat Plugin,… [[#825](https://github.com/airyhq/airy/pull/825)]
- [[#642](https://github.com/airyhq/airy/issues/642)] extract message rendering to a library [[#716](https://github.com/airyhq/airy/pull/716)]
- [[#809](https://github.com/airyhq/airy/issues/809)] Httpclientinstance does not get new auth… [[#811](https://github.com/airyhq/airy/pull/811)]
- [[#804](https://github.com/airyhq/airy/issues/804)] Websocket crashes when new conversation is… [[#808](https://github.com/airyhq/airy/pull/808)]
- [[#538](https://github.com/airyhq/airy/issues/538)] Wire websocket server to the redux store [[#708](https://github.com/airyhq/airy/pull/708)]
- [[#310](https://github.com/airyhq/airy/issues/310)] autogenerated md docs for cli [[#792](https://github.com/airyhq/airy/pull/792)]
- [[#754](https://github.com/airyhq/airy/issues/754)] Specify CPUs and memory at bootstrap [[#782](https://github.com/airyhq/airy/pull/782)]
- [[#401](https://github.com/airyhq/airy/issues/401)] Implement input bar, write \& send message functionality [[#755](https://github.com/airyhq/airy/pull/755)]
- [[#752](https://github.com/airyhq/airy/issues/752)] airy version command should work without loading the config [[#769](https://github.com/airyhq/airy/pull/769)]
- [[#742](https://github.com/airyhq/airy/issues/742)] Chatplugin example page crashes when… [[#768](https://github.com/airyhq/airy/pull/768)]
- [[#611](https://github.com/airyhq/airy/issues/611)] infinite scroll for conversations list and messages [[#720](https://github.com/airyhq/airy/pull/720)]
- [[#723](https://github.com/airyhq/airy/issues/723)] Resolving source media without typed mapping [[#748](https://github.com/airyhq/airy/pull/748)]
- [[#691](https://github.com/airyhq/airy/issues/691)] Support tag\_ids filter queries [[#760](https://github.com/airyhq/airy/pull/760)]
- [[#723](https://github.com/airyhq/airy/issues/723)] Update backend message content for a transparent send message API [[#727](https://github.com/airyhq/airy/pull/727)]

#### 🐛 Bug Fixes

- [[#754](https://github.com/airyhq/airy/issues/754)] Fix bootstrap for empty vars [[#801](https://github.com/airyhq/airy/pull/801)]
- [[#785](https://github.com/airyhq/airy/issues/785)] display messages from auth in chat plugin  [[#793](https://github.com/airyhq/airy/pull/793)]
- [[#813](https://github.com/airyhq/airy/issues/813)] Prevent sending empty messages [[#816](https://github.com/airyhq/airy/pull/816)]
- [[#802](https://github.com/airyhq/airy/issues/802)] Fix expanding message container [[#803](https://github.com/airyhq/airy/pull/803)]
- [[#791](https://github.com/airyhq/airy/issues/791)] Message Input UI/Design Improvement [[#795](https://github.com/airyhq/airy/pull/795)]
- [[#739](https://github.com/airyhq/airy/issues/739)] Fix Airy cli version when provisioning [[#787](https://github.com/airyhq/airy/pull/787)]
- Keep default in sync with the rest of the system [[#786](https://github.com/airyhq/airy/pull/786)]
- [[#788](https://github.com/airyhq/airy/issues/788)] Import StateModel instead of RootState [[#789](https://github.com/airyhq/airy/pull/789)]
- [[#706](https://github.com/airyhq/airy/issues/706)] Make NGrok optional [[#756](https://github.com/airyhq/airy/pull/756)]
- [[#778](https://github.com/airyhq/airy/issues/778)] Fix display of messages in Chat Plugin [[#779](https://github.com/airyhq/airy/pull/779)]
- [[#757](https://github.com/airyhq/airy/issues/757)] fixed read conversation when it is active [[#759](https://github.com/airyhq/airy/pull/759)]
- [[#654](https://github.com/airyhq/airy/issues/654)] Replace scss files with scss modules [[#753](https://github.com/airyhq/airy/pull/753)]
- Upgrade viper [[#747](https://github.com/airyhq/airy/pull/747)]

#### 📚 Documentation

- Add more docs on the installation process [[#822](https://github.com/airyhq/airy/pull/822)]
- [[#800](https://github.com/airyhq/airy/issues/800)] Restructure deployment documentation [[#826](https://github.com/airyhq/airy/pull/826)]
- [[#819](https://github.com/airyhq/airy/issues/819)] Introduce sources introduction [[#823](https://github.com/airyhq/airy/pull/823)]
- [[#810](https://github.com/airyhq/airy/issues/810)] Better troubleshooting page [[#818](https://github.com/airyhq/airy/pull/818)]
- [[#815](https://github.com/airyhq/airy/issues/815)] Rename sources [[#817](https://github.com/airyhq/airy/pull/817)]
- [[#310](https://github.com/airyhq/airy/issues/310)] autogenerated md docs for cli [[#792](https://github.com/airyhq/airy/pull/792)]
- [[#765](https://github.com/airyhq/airy/issues/765)] Restructure API docs [[#781](https://github.com/airyhq/airy/pull/781)]
- [[#775](https://github.com/airyhq/airy/issues/775)] Add ga config [[#777](https://github.com/airyhq/airy/pull/777)]
- [[#774](https://github.com/airyhq/airy/issues/774)] Better favicon [[#776](https://github.com/airyhq/airy/pull/776)]
- [[#491](https://github.com/airyhq/airy/issues/491)] Do not show the edit button for docs [[#771](https://github.com/airyhq/airy/pull/771)]
- [[#731](https://github.com/airyhq/airy/issues/731)] Follow up on revamp of the structure [[#767](https://github.com/airyhq/airy/pull/767)]
- [[#731](https://github.com/airyhq/airy/issues/731)] Doc revamp [[#758](https://github.com/airyhq/airy/pull/758)]

#### 🧰 Maintenance

- Untrack .ijwb since it makes importing the project more difficult [[#766](https://github.com/airyhq/airy/pull/766)]

#### Airy CLI

You can download the Airy CLI for your operating system from the following links:

[MacOS](https://airy-core-binaries.s3.amazonaws.com/0.7.0/darwin/amd64/airy)
[Linux](https://airy-core-binaries.s3.amazonaws.com/0.7.0/linux/amd64/airy)
[Windows](https://airy-core-binaries.s3.amazonaws.com/0.7.0/windows/amd64/airy.exe)

## 0.6.0

#### 🚀 Features

- [[#623](https://github.com/airyhq/airy/issues/623)] Optional apps depend on config file [[#719](https://github.com/airyhq/airy/pull/719)]
- [[#698](https://github.com/airyhq/airy/issues/698)] Provide endpoint configuration to the frontend [[#712](https://github.com/airyhq/airy/pull/712)]
- [[#704](https://github.com/airyhq/airy/issues/704)] Update websocket documentation [[#705](https://github.com/airyhq/airy/pull/705)]
- [[#620](https://github.com/airyhq/airy/issues/620)] Reload configuration based on config file [[#655](https://github.com/airyhq/airy/pull/655)]
- [[#644](https://github.com/airyhq/airy/issues/644)] Facebook connector sends out templates [[#683](https://github.com/airyhq/airy/pull/683)]
- [[#667](https://github.com/airyhq/airy/issues/667)] Support Google suggestion responses [[#690](https://github.com/airyhq/airy/pull/690)]
- [[#622](https://github.com/airyhq/airy/issues/622)] Affect only deployments with a particular… [[#688](https://github.com/airyhq/airy/pull/688)]
- Introduce status command [[#686](https://github.com/airyhq/airy/pull/686)]
- [[#402](https://github.com/airyhq/airy/issues/402)] Tag conversations [[#682](https://github.com/airyhq/airy/pull/682)]
- [[#640](https://github.com/airyhq/airy/issues/640)] Enrich send message API with source template messages [[#680](https://github.com/airyhq/airy/pull/680)]
- [[#641](https://github.com/airyhq/airy/issues/641)] Add content type for source templates [[#676](https://github.com/airyhq/airy/pull/676)]
- [[#620](https://github.com/airyhq/airy/issues/620)] Download kubeconf file [[#673](https://github.com/airyhq/airy/pull/673)]
- [[#308](https://github.com/airyhq/airy/issues/308)] Upload cli binaries to S3 [[#669](https://github.com/airyhq/airy/pull/669)]
- [[#621](https://github.com/airyhq/airy/issues/621)] Controller starts/stops apps based on config map changes [[#647](https://github.com/airyhq/airy/pull/647)]
- Introduce /client.config [[#668](https://github.com/airyhq/airy/pull/668)]
- [[#646](https://github.com/airyhq/airy/issues/646)] Configurable ingress hostnames [[#648](https://github.com/airyhq/airy/pull/648)]
- [[#306](https://github.com/airyhq/airy/issues/306)] cli config [[#649](https://github.com/airyhq/airy/pull/649)]
- [[#501](https://github.com/airyhq/airy/issues/501)] Resume conversation in chat plugin [[#603](https://github.com/airyhq/airy/pull/603)]
- [[#497](https://github.com/airyhq/airy/issues/497)] Upload metadata and message source files [[#602](https://github.com/airyhq/airy/pull/602)]
- [[#599](https://github.com/airyhq/airy/issues/599)] Display avatar + time in messages [[#625](https://github.com/airyhq/airy/pull/625)]
- [[#614](https://github.com/airyhq/airy/issues/614)] Fix release script [[#615](https://github.com/airyhq/airy/pull/615)]
- [[#598](https://github.com/airyhq/airy/issues/598)] Feature/598 read unread state of conversations [[#617](https://github.com/airyhq/airy/pull/617)]


#### 🐛 Bug Fixes

- [[#623](https://github.com/airyhq/airy/issues/623)] Fix Google safile sample config [[#736](https://github.com/airyhq/airy/pull/736)]
- [[#623](https://github.com/airyhq/airy/issues/623)] Fix manifest for the chatpluign [[#732](https://github.com/airyhq/airy/pull/732)]
- Fix numeric range queries [[#730](https://github.com/airyhq/airy/pull/730)]
- Return messages last to first so pagination makes sense [[#728](https://github.com/airyhq/airy/pull/728)]
- Fix infinite recursion in chatplugin nginx location capture [[#725](https://github.com/airyhq/airy/pull/725)]
- [[#698](https://github.com/airyhq/airy/issues/698)] Use host config coming from the env [[#721](https://github.com/airyhq/airy/pull/721)]
- Rm extra bracket [[#717](https://github.com/airyhq/airy/pull/717)]
- Paginate messages for real :) [[#715](https://github.com/airyhq/airy/pull/715)]
- [[#713](https://github.com/airyhq/airy/issues/713)] Fix bug on tags list [[#714](https://github.com/airyhq/airy/pull/714)]
- [[#695](https://github.com/airyhq/airy/issues/695)] Fix yq version incompatibility [[#697](https://github.com/airyhq/airy/pull/697)]
- [[#678](https://github.com/airyhq/airy/issues/678)] Update VERSION file after release [[#684](https://github.com/airyhq/airy/pull/684)]
- [[#421](https://github.com/airyhq/airy/issues/421)] Consider service disabled if any exception occurs [[#674](https://github.com/airyhq/airy/pull/674)]
- Endpoints should return {} instead of nothing [[#672](https://github.com/airyhq/airy/pull/672)]
- refactored lib with class that can be instantiated [[#664](https://github.com/airyhq/airy/pull/664)]
- add mappers to ts http client lib  [[#657](https://github.com/airyhq/airy/pull/657)]
- [[#692](https://github.com/airyhq/airy/issues/692)] unread count [[#734](https://github.com/airyhq/airy/pull/734)]
- [[#546](https://github.com/airyhq/airy/issues/546)] Fix/546 revise image tags [[#658](https://github.com/airyhq/airy/pull/658)]

#### 📚 Documentation

- Update README.md [[#700](https://github.com/airyhq/airy/pull/700)]

#### 🧰 Maintenance

- Remove suppression [[#702](https://github.com/airyhq/airy/pull/702)]
- Improve config tests and introduce integration tests runner func [[#726](https://github.com/airyhq/airy/pull/726)]
- [[#711](https://github.com/airyhq/airy/issues/711)] Add CI status badge [[#724](https://github.com/airyhq/airy/pull/724)]
- Fix typo in readme [[#709](https://github.com/airyhq/airy/pull/709)]
- Reorganize integration tests  [[#694](https://github.com/airyhq/airy/pull/694)]
- [[#693](https://github.com/airyhq/airy/issues/693)] Simplify display name contact API response [[#696](https://github.com/airyhq/airy/pull/696)]
- Add missing docs for authenticating with the websocket [[#689](https://github.com/airyhq/airy/pull/689)]
- [[#403](https://github.com/airyhq/airy/issues/403)] Allow leading wildcard searches for Lucene [[#681](https://github.com/airyhq/airy/pull/681)]
- Remove .bazelproject from vcs [[#666](https://github.com/airyhq/airy/pull/666)]
- Disable go plugin by default since it only works for ultimate users [[#663](https://github.com/airyhq/airy/pull/663)]
- [[#651](https://github.com/airyhq/airy/issues/651)] Use Google Cloud Storage for the bazel remote cache [[#652](https://github.com/airyhq/airy/pull/652)]
- [[#642](https://github.com/airyhq/airy/issues/642)] Update typescript content typings [[#645](https://github.com/airyhq/airy/pull/645)]

#### Airy CLI

You can download the Airy CLI for your operating system from the following links:

[MacOS](https://airy-core-binaries.s3.amazonaws.com/0.6.0/darwin/amd64/airy)
[Linux](https://airy-core-binaries.s3.amazonaws.com/0.6.0/linux/amd64/airy)
[Windows](https://airy-core-binaries.s3.amazonaws.com/0.6.0/windows/amd64/airy.exe)
[Alpine](https://airy-core-binaries.s3.amazonaws.com/0.6.0/alpine/amd64/airy)
## 

#### Changes

#### 🚀 Features

- [[#400](https://github.com/airyhq/airy/issues/400)] Load messages of conversations [[#567](https://github.com/airyhq/airy/pull/567)]
- [[#335](https://github.com/airyhq/airy/issues/335)] Provisioning optimization [[#610](https://github.com/airyhq/airy/pull/610)]
- [[#526](https://github.com/airyhq/airy/issues/526)] Introduce namespace var [[#595](https://github.com/airyhq/airy/pull/595)]
- [[#169](https://github.com/airyhq/airy/issues/169)] Use karapace.io schema registry [[#596](https://github.com/airyhq/airy/pull/596)]
- [[#497](https://github.com/airyhq/airy/issues/497)] Dynamically map source data urls in content mapper [[#594](https://github.com/airyhq/airy/pull/594)]
- [[#169](https://github.com/airyhq/airy/issues/169)] Optimize kafka images [[#583](https://github.com/airyhq/airy/pull/583)]
- [[#327](https://github.com/airyhq/airy/issues/327)] Introduce a release script that automates the process [[#586](https://github.com/airyhq/airy/pull/586)]
- [[#526](https://github.com/airyhq/airy/issues/526)] Rename pg values [[#590](https://github.com/airyhq/airy/pull/590)]
- [[#446](https://github.com/airyhq/airy/issues/446)] Introduce go linter [[#576](https://github.com/airyhq/airy/pull/576)]
- [[#496](https://github.com/airyhq/airy/issues/496)] Add file content model [[#579](https://github.com/airyhq/airy/pull/579)]
- [[#496](https://github.com/airyhq/airy/issues/496)] Add video content model [[#577](https://github.com/airyhq/airy/pull/577)]
- [[#522](https://github.com/airyhq/airy/issues/522)] introduce httpclient lib [[#571](https://github.com/airyhq/airy/pull/571)]
- [[#450](https://github.com/airyhq/airy/issues/450)] Introduce Airy k8s controller [[#534](https://github.com/airyhq/airy/pull/534)]
- [[#496](https://github.com/airyhq/airy/issues/496)] Add audio content model [[#574](https://github.com/airyhq/airy/pull/574)]
- [[#572](https://github.com/airyhq/airy/issues/572)] Messages from facebook page should have… [[#573](https://github.com/airyhq/airy/pull/573)]

#### 🐛 Bug Fixes

- [[#412](https://github.com/airyhq/airy/issues/412)] Always deploy images [[#609](https://github.com/airyhq/airy/pull/609)]
- [[#412](https://github.com/airyhq/airy/issues/412)] Use the correct ENV var [[#608](https://github.com/airyhq/airy/pull/608)]
- [[#412](https://github.com/airyhq/airy/issues/412)] Actually pass the branch ref [[#604](https://github.com/airyhq/airy/pull/604)]
- [[#587](https://github.com/airyhq/airy/issues/587)] fix chat plugin development env [[#589](https://github.com/airyhq/airy/pull/589)]
- Lower case the webhook subdomains [[#588](https://github.com/airyhq/airy/pull/588)]
- [[#569](https://github.com/airyhq/airy/issues/569)] Facebook Messages from page are not parsed… [[#570](https://github.com/airyhq/airy/pull/570)]

#### 📚 Documentation

- [[#424](https://github.com/airyhq/airy/issues/424)] chatplugin gifs with asciinema [[#592](https://github.com/airyhq/airy/pull/592)]

#### 🧰 Maintenance

- [[#412](https://github.com/airyhq/airy/issues/412)] Push only changed images for beta [[#601](https://github.com/airyhq/airy/pull/601)]
- [[#331](https://github.com/airyhq/airy/issues/331)] Introduce local container push target [[#580](https://github.com/airyhq/airy/pull/580)]

## 0.4.0

#### 🚀 Features

- [[#526](https://github.com/airyhq/airy/issues/526)] Introduce namespacing for topics [[#566](https://github.com/airyhq/airy/pull/566)]
- [[#503](https://github.com/airyhq/airy/issues/503)] Customize commit interval so the test environment can have a d… [[#555](https://github.com/airyhq/airy/pull/555)]
- [[#549](https://github.com/airyhq/airy/issues/549)] Stop logging Facebook webhook requests [[#557](https://github.com/airyhq/airy/pull/557)]
- [[#547](https://github.com/airyhq/airy/issues/547)] Introduce model lib for metadata and messages [[#552](https://github.com/airyhq/airy/pull/552)]
- [[#223](https://github.com/airyhq/airy/issues/223)] Future of `/channels.explore` [[#541](https://github.com/airyhq/airy/pull/541)]
- [[#169](https://github.com/airyhq/airy/issues/169)] Use distroless for java images [[#540](https://github.com/airyhq/airy/pull/540)]
- [[#527](https://github.com/airyhq/airy/issues/527)] Enable resuming of chatplugin conversations [[#533](https://github.com/airyhq/airy/pull/533)]
- [[#494](https://github.com/airyhq/airy/issues/494)] Fetch Facebook metadata [[#528](https://github.com/airyhq/airy/pull/528)]
- [[#496](https://github.com/airyhq/airy/issues/496)] Added Image content model for Facebook [[#539](https://github.com/airyhq/airy/pull/539)]
- [[#399](https://github.com/airyhq/airy/issues/399)] Conversations List [[#507](https://github.com/airyhq/airy/pull/507)]
- [[#496](https://github.com/airyhq/airy/issues/496)] Added Image content model for Twilio [[#532](https://github.com/airyhq/airy/pull/532)]
- [[#496](https://github.com/airyhq/airy/issues/496)] Added Image content model for Google [[#531](https://github.com/airyhq/airy/pull/531)]
- [[#493](https://github.com/airyhq/airy/issues/493)] Route Google metadata to get displayname [[#521](https://github.com/airyhq/airy/pull/521)]
- [[#523](https://github.com/airyhq/airy/issues/523)] Return source type in the channel payload [[#529](https://github.com/airyhq/airy/pull/529)]
- [[#496](https://github.com/airyhq/airy/issues/496)] Changing content render api [[#520](https://github.com/airyhq/airy/pull/520)]
- [[#464](https://github.com/airyhq/airy/issues/464)] Feature/add logout core [[#519](https://github.com/airyhq/airy/pull/519)]
- [[#499](https://github.com/airyhq/airy/issues/499)] Future-proof metadata model [[#514](https://github.com/airyhq/airy/pull/514)]

#### 🐛 Bug Fixes

- [[#564](https://github.com/airyhq/airy/issues/564)] Fix kafka configmap in helm [[#565](https://github.com/airyhq/airy/pull/565)]
- [[#466](https://github.com/airyhq/airy/issues/466)] Change public name of go modules [[#561](https://github.com/airyhq/airy/pull/561)]
- [[#562](https://github.com/airyhq/airy/issues/562)] Fix chatplugin generator [[#563](https://github.com/airyhq/airy/pull/563)]

#### 📚 Documentation

- [[#485](https://github.com/airyhq/airy/issues/485)] [[#486](https://github.com/airyhq/airy/issues/486)] Enrich HTTP docs [[#560](https://github.com/airyhq/airy/pull/560)]
- [[#524](https://github.com/airyhq/airy/issues/524)] remove hyperlinks [[#530](https://github.com/airyhq/airy/pull/530)]
- [[#489](https://github.com/airyhq/airy/issues/489)] how to run the frontend [[#518](https://github.com/airyhq/airy/pull/518)]

#### 🧰 Maintenance

- [[#515](https://github.com/airyhq/airy/issues/515)] introduce eslint [[#554](https://github.com/airyhq/airy/pull/554)]
- [[#548](https://github.com/airyhq/airy/issues/548)] Extract payload to web library and introduce date lib [[#556](https://github.com/airyhq/airy/pull/556)]
- [[#551](https://github.com/airyhq/airy/issues/551)] Use test.properties everywhere [[#553](https://github.com/airyhq/airy/pull/553)]

