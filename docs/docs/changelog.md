---
title: Changelog
sidebar_label: 📝 Changelog
---

## 0.15.1

Hotfix

- [[#1427](https://github.com/airyhq/airy/issues/1427)] Fix broken ui pod config for aws deployment
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

## 0.3.0

#### Changes

- [[#472](https://github.com/airyhq/airy/issues/472)] Fix guide link [[#488](https://github.com/airyhq/airy/pull/488)]

#### 🚀 Features

- [[#473](https://github.com/airyhq/airy/issues/473)] Rely on allowed origins setup from the env [[#505](https://github.com/airyhq/airy/pull/505)]
- [[#257](https://github.com/airyhq/airy/issues/257)] Add tags to core [[#431](https://github.com/airyhq/airy/pull/431)]
- [[#310](https://github.com/airyhq/airy/issues/310)] Airy CLI [[#468](https://github.com/airyhq/airy/pull/468)]
- [[#393](https://github.com/airyhq/airy/issues/393)] AllowedOrigin in airy.conf [[#469](https://github.com/airyhq/airy/pull/469)]
- [[#310](https://github.com/airyhq/airy/issues/310)] Add go api client lib [[#460](https://github.com/airyhq/airy/pull/460)]
- [[#452](https://github.com/airyhq/airy/issues/452)] Split auth dependency [[#456](https://github.com/airyhq/airy/pull/456)]
- [[#457](https://github.com/airyhq/airy/issues/457)] Improve conversations query (indexes, restoration, api) [[#459](https://github.com/airyhq/airy/pull/459)]
- [[#451](https://github.com/airyhq/airy/issues/451)] Bash test messages generator [[#454](https://github.com/airyhq/airy/pull/454)]
- [[#437](https://github.com/airyhq/airy/issues/437)] Replace alignment in favor of sender type [[#441](https://github.com/airyhq/airy/pull/441)]
- [[#434](https://github.com/airyhq/airy/issues/434)] Move libs to the root of the monorepo [[#438](https://github.com/airyhq/airy/pull/438)]
- [[#370](https://github.com/airyhq/airy/issues/370)] Add conversation metadata filter docs [[#439](https://github.com/airyhq/airy/pull/439)]
- [[#342](https://github.com/airyhq/airy/issues/342)] Add guide on how to connect Rasa and fix webhook API [[#423](https://github.com/airyhq/airy/pull/423)]
- [[#413](https://github.com/airyhq/airy/issues/413)] Add /metadata.remove endpoint [[#430](https://github.com/airyhq/airy/pull/430)]
- [[#425](https://github.com/airyhq/airy/issues/425)] Migrate Code formating to Bazel tools [[#426](https://github.com/airyhq/airy/pull/426)]
- [[#290](https://github.com/airyhq/airy/issues/290)] Channels page [[#420](https://github.com/airyhq/airy/pull/420)]
- [[#427](https://github.com/airyhq/airy/issues/427)] Return default contact information [[#429](https://github.com/airyhq/airy/pull/429)]
- [[#413](https://github.com/airyhq/airy/issues/413)] Add /metadata.set endpoint [[#414](https://github.com/airyhq/airy/pull/414)]
- [[#370](https://github.com/airyhq/airy/issues/370)] Filter conversations on metadata [[#407](https://github.com/airyhq/airy/pull/407)]

#### 🐛 Bug Fixes

- [[#498](https://github.com/airyhq/airy/issues/498)] Fix image tags on conf [[#511](https://github.com/airyhq/airy/pull/511)]
- Fix codeowners syntax [[#512](https://github.com/airyhq/airy/pull/512)]
- [[#506](https://github.com/airyhq/airy/issues/506)] Remove unused labels [[#510](https://github.com/airyhq/airy/pull/510)]
- Fix sources configmap [[#500](https://github.com/airyhq/airy/pull/500)]
- [[#386](https://github.com/airyhq/airy/issues/386)] Add quote function [[#476](https://github.com/airyhq/airy/pull/476)]
- Hotfix for CI [[#465](https://github.com/airyhq/airy/pull/465)]
- [442] Fix glossary TOC [[#443](https://github.com/airyhq/airy/pull/443)]

#### 📚 Documentation

- [[#490](https://github.com/airyhq/airy/issues/490)] Reorganize sidebar [[#492](https://github.com/airyhq/airy/pull/492)]
- [[#484](https://github.com/airyhq/airy/issues/484)] Remove reset password docs [[#487](https://github.com/airyhq/airy/pull/487)]
- Several initial updates [[#477](https://github.com/airyhq/airy/pull/477)]
- Several improvements [[#478](https://github.com/airyhq/airy/pull/478)]
- Small improvements [[#479](https://github.com/airyhq/airy/pull/479)]
- [[#470](https://github.com/airyhq/airy/issues/470)] Specify --no-ff option in merge commands [[#471](https://github.com/airyhq/airy/pull/471)]
- [[#341](https://github.com/airyhq/airy/issues/341)] Introduce "how to connect a facebook page"… [[#436](https://github.com/airyhq/airy/pull/436)]
- [[#453](https://github.com/airyhq/airy/issues/453)] Update release docs [[#458](https://github.com/airyhq/airy/pull/458)]
- [[#444](https://github.com/airyhq/airy/issues/444)] Use prettier for markdown files as well [[#448](https://github.com/airyhq/airy/pull/448)]
- [[#442](https://github.com/airyhq/airy/issues/442)] Fix glossary TOC [[#443](https://github.com/airyhq/airy/pull/443)]

#### 🧰 Maintenance

- [[#462](https://github.com/airyhq/airy/issues/462)] Assign the label chore to dependabot pull requests [[#504](https://github.com/airyhq/airy/pull/504)]
- Add codeowners configuration [[#502](https://github.com/airyhq/airy/pull/502)]
- Bump ini from 1.3.5 to 1.3.7 in /docs [[#475](https://github.com/airyhq/airy/pull/475)]
- Bump ini from 1.3.5 to 1.3.7 [[#474](https://github.com/airyhq/airy/pull/474)]
- Bump elliptic from 6.5.2 to 6.5.3 [[#461](https://github.com/airyhq/airy/pull/461)]
- [[#432](https://github.com/airyhq/airy/issues/432)] Use Bazel tools web rules [[#435](https://github.com/airyhq/airy/pull/435)]

## 0.2.0

#### Changes

- [[#338](https://github.com/airyhq/airy/issues/338)] Add docs for running in production [[#359](https://github.com/airyhq/airy/pull/359)]
- [[#394](https://github.com/airyhq/airy/issues/394)] Fix broken link in documentation [[#395](https://github.com/airyhq/airy/pull/395)]
- [[#376](https://github.com/airyhq/airy/issues/376)] Fix chatplugin message sending and style loading [[#379](https://github.com/airyhq/airy/pull/379)]
- [324] Reflect in the docs our understanding of the release process [[#375](https://github.com/airyhq/airy/pull/375)]
- [[#351](https://github.com/airyhq/airy/issues/351)] Add Twilio deployment descriptors [[#374](https://github.com/airyhq/airy/pull/374)]
- [[#350](https://github.com/airyhq/airy/issues/350)] Twilio content mapper [[#373](https://github.com/airyhq/airy/pull/373)]
- [[#352](https://github.com/airyhq/airy/issues/352)] Add Twilio channel connection [[#371](https://github.com/airyhq/airy/pull/371)]
- [[#369](https://github.com/airyhq/airy/issues/369)] Show release process docs in the sidebar [[#372](https://github.com/airyhq/airy/pull/372)]
- [[#367](https://github.com/airyhq/airy/issues/367)] cleanup linting [[#368](https://github.com/airyhq/airy/pull/368)]
- [[#354](https://github.com/airyhq/airy/issues/354)] Add Twilio Events router, fix ingestion time bug in google source [[#365](https://github.com/airyhq/airy/pull/365)]
- [[#355](https://github.com/airyhq/airy/issues/355)] Add Twilio sender [[#366](https://github.com/airyhq/airy/pull/366)]
- [[#353](https://github.com/airyhq/airy/issues/353)] Add Twilio webhook [[#362](https://github.com/airyhq/airy/pull/362)]
- [[#337](https://github.com/airyhq/airy/issues/337)] Prettier linting uses tests [[#357](https://github.com/airyhq/airy/pull/357)]
- [[#334](https://github.com/airyhq/airy/issues/334)] Reflect components move in the docs [[#361](https://github.com/airyhq/airy/pull/361)]
- Change hostname in smoketest for chatplugin routes [[#363](https://github.com/airyhq/airy/pull/363)]
- Add chatplugin api docs [[#348](https://github.com/airyhq/airy/pull/348)]
- [[#322](https://github.com/airyhq/airy/issues/322)] Conversations.tag endpoint returns 500 on empty payload [[#360](https://github.com/airyhq/airy/pull/360)]
- [[#328](https://github.com/airyhq/airy/issues/328)] Update Subscribed Fields for Facebook Webhooks [[#329](https://github.com/airyhq/airy/pull/329)]
- [[#279](https://github.com/airyhq/airy/issues/279)] Add update delivery state message accessor [[#339](https://github.com/airyhq/airy/pull/339)]
- [[#349](https://github.com/airyhq/airy/issues/349)] Add Twilio source documentation [[#356](https://github.com/airyhq/airy/pull/356)]
- [[#346](https://github.com/airyhq/airy/issues/346)] Fix ingress configuration [[#347](https://github.com/airyhq/airy/pull/347)]
- [[#326](https://github.com/airyhq/airy/issues/326)] Update release process docs [[#332](https://github.com/airyhq/airy/pull/332)]
- [[#303](https://github.com/airyhq/airy/issues/303)] deploy chat plugin widget [[#333](https://github.com/airyhq/airy/pull/333)]
- [[#236](https://github.com/airyhq/airy/issues/236)] - Removing the current kafka-client pod [[#289](https://github.com/airyhq/airy/pull/289)]
- [[#231](https://github.com/airyhq/airy/issues/231)] Smoke test improvements [[#330](https://github.com/airyhq/airy/pull/330)]
- Fix the ci bazel config [[#320](https://github.com/airyhq/airy/pull/320)]
- [[#318](https://github.com/airyhq/airy/issues/318)] Docs should use the right branch [[#319](https://github.com/airyhq/airy/pull/319)]
- [[#302](https://github.com/airyhq/airy/issues/302)] Add chat plugin UI widget [[#311](https://github.com/airyhq/airy/pull/311)]
- Release npm components library v0.4.5 [[#317](https://github.com/airyhq/airy/pull/317)]
- Fix aws cli env variables in ci [[#316](https://github.com/airyhq/airy/pull/316)]
- [215] Infra/publish images [[#294](https://github.com/airyhq/airy/pull/294)]
- [[#268](https://github.com/airyhq/airy/issues/268)] Google/Facebook source documentation [[#301](https://github.com/airyhq/airy/pull/301)]
- [[#287](https://github.com/airyhq/airy/issues/287)] Add Java linting [[#295](https://github.com/airyhq/airy/pull/295)]
- [[#292](https://github.com/airyhq/airy/issues/292)] Configure algolia for docs.airy.co [[#293](https://github.com/airyhq/airy/pull/293)]
- Log web requests [[#291](https://github.com/airyhq/airy/pull/291)]
- Structure + Login for demo [[#263](https://github.com/airyhq/airy/pull/263)]
- Add google deployment descriptors [[#286](https://github.com/airyhq/airy/pull/286)]
- Add google admin api channel connection [[#284](https://github.com/airyhq/airy/pull/284)]
- [[#270](https://github.com/airyhq/airy/issues/270)] Google content mapper [[#285](https://github.com/airyhq/airy/pull/285)]
- [[#221](https://github.com/airyhq/airy/issues/221)] Further improvements to the script [[#283](https://github.com/airyhq/airy/pull/283)]
- Add authentication to communication websocket [[#282](https://github.com/airyhq/airy/pull/282)]
- Fix chat plugin messaging behavior [[#277](https://github.com/airyhq/airy/pull/277)]
- [[#264](https://github.com/airyhq/airy/issues/264)] Google event router [[#278](https://github.com/airyhq/airy/pull/278)]
- Fix reverse conversation list order [[#280](https://github.com/airyhq/airy/pull/280)]
- Add Google message sender app [[#275](https://github.com/airyhq/airy/pull/275)]
- Infra/smoke test improvement [[#262](https://github.com/airyhq/airy/pull/262)]
- [[#265](https://github.com/airyhq/airy/issues/265)] Google webhook ingestion [[#272](https://github.com/airyhq/airy/pull/272)]
- Prepare the codebase for release processes [[#260](https://github.com/airyhq/airy/pull/260)]
- Use airy specific dns entries for the dev box [[#261](https://github.com/airyhq/airy/pull/261)]
- Do not use javatuples [[#258](https://github.com/airyhq/airy/pull/258)]
- Expands contribution document [[#237](https://github.com/airyhq/airy/pull/237)]
- Generate typescript definitions from content model [[#241](https://github.com/airyhq/airy/pull/241)]
- Bug/245 send message duplicates webhook [[#249](https://github.com/airyhq/airy/pull/249)]
- [[#251](https://github.com/airyhq/airy/issues/251)] Do not remove the viewBox in SVGs [[#252](https://github.com/airyhq/airy/pull/252)]
- Fix request NPEs [[#248](https://github.com/airyhq/airy/pull/248)]
- [[#180](https://github.com/airyhq/airy/issues/180)] Extract testing helper to a java library [[#247](https://github.com/airyhq/airy/pull/247)]
- Fix name of provisioner [[#246](https://github.com/airyhq/airy/pull/246)]
- Temporary remove demo from the status output [[#242](https://github.com/airyhq/airy/pull/242)]
- Running core on alpine image with k3s [[#230](https://github.com/airyhq/airy/pull/230)]
- Map outbound content model in communication app [[#231](https://github.com/airyhq/airy/pull/231)]
- attempt to improve ci [[#234](https://github.com/airyhq/airy/pull/234)]
- Smoke test draft [[#232](https://github.com/airyhq/airy/pull/232)]
- Fixes #226  [[#233](https://github.com/airyhq/airy/pull/233)]
- Add alpine nginx image for demo app [[#229](https://github.com/airyhq/airy/pull/229)]
- Use the local components library version in the showcase app [[#228](https://github.com/airyhq/airy/pull/228)]
- Introduce sources top level menu [[#214](https://github.com/airyhq/airy/pull/214)]
- Update README.md [[#224](https://github.com/airyhq/airy/pull/224)]
- Do not autowire in production code [[#225](https://github.com/airyhq/airy/pull/225)]
- Refer to the main branch for the edit button in docs [[#220](https://github.com/airyhq/airy/pull/220)]
- Fix Facebook channel connection docs [[#222](https://github.com/airyhq/airy/pull/222)]
- Add deployment files for webhooks [[#206](https://github.com/airyhq/airy/pull/206)]
- Checks bootstrap script run path [[#192](https://github.com/airyhq/airy/pull/192)]
- Add demo app and globalize typescript type definitions [[#211](https://github.com/airyhq/airy/pull/211)]
- Add docusaurus and move docs [[#212](https://github.com/airyhq/airy/pull/212)]
- Small fixes before release [[#208](https://github.com/airyhq/airy/pull/208)]
- Fix consumer healthcheck endpoint in deployments [[#209](https://github.com/airyhq/airy/pull/209)]
- Minimal release script [[#203](https://github.com/airyhq/airy/pull/203)]
- fixed link to components website [[#205](https://github.com/airyhq/airy/pull/205)]
- Prepare the codebase for renaming [[#204](https://github.com/airyhq/airy/pull/204)]
- Orchestrate vagrant up and down [[#194](https://github.com/airyhq/airy/pull/194)]
- Fix sender app id [[#202](https://github.com/airyhq/airy/pull/202)]
- Filter out unknown webhooks [[#201](https://github.com/airyhq/airy/pull/201)]
- Require url and default to empty map for headers in webhook creation [[#198](https://github.com/airyhq/airy/pull/198)]
- Fix unauthorized response [[#200](https://github.com/airyhq/airy/pull/200)]
- Fix Searchfield [[#195](https://github.com/airyhq/airy/pull/195)]
- Disable test output in CI [[#193](https://github.com/airyhq/airy/pull/193)]
- Infra/schema reg protocol [[#199](https://github.com/airyhq/airy/pull/199)]
- Require color on tag creation [[#197](https://github.com/airyhq/airy/pull/197)]
- Introduce web test helper [[#191](https://github.com/airyhq/airy/pull/191)]
- One broker [[#190](https://github.com/airyhq/airy/pull/190)]
- Auth refactor [[#183](https://github.com/airyhq/airy/pull/183)]
- Change default bootstrap [[#184](https://github.com/airyhq/airy/pull/184)]
- Add line to apply the yaml [[#185](https://github.com/airyhq/airy/pull/185)]
- Fix bootstrap [[#181](https://github.com/airyhq/airy/pull/181)]
- Normalize health endpoints [[#179](https://github.com/airyhq/airy/pull/179)]
- Fix response code for duplicate email signups [[#178](https://github.com/airyhq/airy/pull/178)]
- Add auth middleware to admin [[#176](https://github.com/airyhq/airy/pull/176)]
- Add chat plugin [[#142](https://github.com/airyhq/airy/pull/142)]
- Add jwt to backend apps [[#175](https://github.com/airyhq/airy/pull/175)]
- Add bracket [[#174](https://github.com/airyhq/airy/pull/174)]
- Randomize jwt token and pg password [[#171](https://github.com/airyhq/airy/pull/171)]
- new version [[#172](https://github.com/airyhq/airy/pull/172)]
- Add subscribed\_fields to page connect API [[#173](https://github.com/airyhq/airy/pull/173)]
- Add channels connect endpoint [[#166](https://github.com/airyhq/airy/pull/166)]
- Change default port and mail [[#164](https://github.com/airyhq/airy/pull/164)]
- Allows /actuator/health routes to be accessible [[#165](https://github.com/airyhq/airy/pull/165)]
- Add mail vars to user inoput [[#163](https://github.com/airyhq/airy/pull/163)]
- Adds webhook api docs [[#161](https://github.com/airyhq/airy/pull/161)]
- Install virtualbox [[#158](https://github.com/airyhq/airy/pull/158)]
- Feature/remove translations [[#157](https://github.com/airyhq/airy/pull/157)]
- Check if there is a config file or not [[#159](https://github.com/airyhq/airy/pull/159)]
- Pull images while building the packer image [[#156](https://github.com/airyhq/airy/pull/156)]
- Rename endpoints so that naming is more consistent [[#153](https://github.com/airyhq/airy/pull/153)]
- Kafka topics config [[#155](https://github.com/airyhq/airy/pull/155)]
- Add local copies of the changed yamls [[#154](https://github.com/airyhq/airy/pull/154)]
- Add spring auth and spring security lib [[#127](https://github.com/airyhq/airy/pull/127)]
- Fix issue #134 [[#152](https://github.com/airyhq/airy/pull/152)]
- Clean up some scripts [[#151](https://github.com/airyhq/airy/pull/151)]
- Add box\_url instead of box [[#149](https://github.com/airyhq/airy/pull/149)]
- Disable audio for virtualbox [[#148](https://github.com/airyhq/airy/pull/148)]
- Fix curl example [[#147](https://github.com/airyhq/airy/pull/147)]
- Only print vagrant installation information if needed [[#146](https://github.com/airyhq/airy/pull/146)]
- Fix airy-core s3 image [[#143](https://github.com/airyhq/airy/pull/143)]
- Local Helm charts [[#139](https://github.com/airyhq/airy/pull/139)]
- Remove topbar and dependency on react-redux [[#144](https://github.com/airyhq/airy/pull/144)]
- Fix health check [[#137](https://github.com/airyhq/airy/pull/137)]
- Add chat plugin channel source [[#140](https://github.com/airyhq/airy/pull/140)]
- Introduce a user guide [[#138](https://github.com/airyhq/airy/pull/138)]
- Add chat plugin docs [[#136](https://github.com/airyhq/airy/pull/136)]
- Update user-input script for airy-core [[#130](https://github.com/airyhq/airy/pull/130)]
- Updates to the frontend readme [[#128](https://github.com/airyhq/airy/pull/128)]
- Remove date range, make showcase use npm library [[#125](https://github.com/airyhq/airy/pull/125)]
- Add ngrok sidecar to facebook webhook [[#126](https://github.com/airyhq/airy/pull/126)]
- Fix the left join topology call by reference issue [[#129](https://github.com/airyhq/airy/pull/129)]
- Add user input from config file [[#123](https://github.com/airyhq/airy/pull/123)]
- add readme [[#124](https://github.com/airyhq/airy/pull/124)]
- Move packer images to a separate folder [[#121](https://github.com/airyhq/airy/pull/121)]
- Fix library export [[#120](https://github.com/airyhq/airy/pull/120)]
- Add more components to showcase [[#118](https://github.com/airyhq/airy/pull/118)]
- Add conversation tag/untag [[#107](https://github.com/airyhq/airy/pull/107)]
- Bootstrap finishing [[#119](https://github.com/airyhq/airy/pull/119)]
- Bootstrap finishing [[#117](https://github.com/airyhq/airy/pull/117)]
- Implements /tags.update endpoint [[#114](https://github.com/airyhq/airy/pull/114)]
- Update topics configs [[#116](https://github.com/airyhq/airy/pull/116)]
- Download Vagrant at bootstrap time [[#112](https://github.com/airyhq/airy/pull/112)]
- Some gardening [[#115](https://github.com/airyhq/airy/pull/115)]
- Topics finder [[#113](https://github.com/airyhq/airy/pull/113)]
- User input  [[#110](https://github.com/airyhq/airy/pull/110)]
- General cleanup of the docs [[#111](https://github.com/airyhq/airy/pull/111)]
- Delete tags endpoint [[#109](https://github.com/airyhq/airy/pull/109)]
- Infra/istio [[#99](https://github.com/airyhq/airy/pull/99)]
- Fix npm publishing [[#108](https://github.com/airyhq/airy/pull/108)]
- Creates /tags.list endpoint [[#105](https://github.com/airyhq/airy/pull/105)]
- Fix target name [[#106](https://github.com/airyhq/airy/pull/106)]
- Publish library on NPM [[#75](https://github.com/airyhq/airy/pull/75)]
- Rm App health checks from streaming apps [[#103](https://github.com/airyhq/airy/pull/103)]
- Creates the /tags.create endpoint [[#102](https://github.com/airyhq/airy/pull/102)]
- Add content mapper library, use content mapper on webhook publisher [[#96](https://github.com/airyhq/airy/pull/96)]
- Adds tags api documentation [[#98](https://github.com/airyhq/airy/pull/98)]
- Add wait-loop instead of sleep [[#97](https://github.com/airyhq/airy/pull/97)]
- Introduce a glossary [[#83](https://github.com/airyhq/airy/pull/83)]
- Images [[#86](https://github.com/airyhq/airy/pull/86)]
- New /users.password-reset endpoint [[#89](https://github.com/airyhq/airy/pull/89)]
- Add webhook consumer [[#88](https://github.com/airyhq/airy/pull/88)]
- Add webhook publisher [[#87](https://github.com/airyhq/airy/pull/87)]
- Enabe authorization [[#85](https://github.com/airyhq/airy/pull/85)]
- Add webhook api [[#84](https://github.com/airyhq/airy/pull/84)]
- Core auth email configuration [[#82](https://github.com/airyhq/airy/pull/82)]
- Fix components deploy [[#81](https://github.com/airyhq/airy/pull/81)]
- Adding Readme to infrastructure [[#80](https://github.com/airyhq/airy/pull/80)]
- Add password reset route [[#79](https://github.com/airyhq/airy/pull/79)]
- Prepare readme for launch [[#77](https://github.com/airyhq/airy/pull/77)]
- Add showcase app deployment [[#73](https://github.com/airyhq/airy/pull/73)]
- Core auth /users.accept-invitation endpoint [[#71](https://github.com/airyhq/airy/pull/71)]
- Some little gardening while reading the code [[#74](https://github.com/airyhq/airy/pull/74)]
- Create Components Library [[#57](https://github.com/airyhq/airy/pull/57)]
- Add login endpoint [[#70](https://github.com/airyhq/airy/pull/70)]
- Core auth create invitations endpoint [[#59](https://github.com/airyhq/airy/pull/59)]
- Add bootstrapping script [[#61](https://github.com/airyhq/airy/pull/61)]
- Add apache license [[#63](https://github.com/airyhq/airy/pull/63)]
- Add signup route with password hashing and jwt creation [[#62](https://github.com/airyhq/airy/pull/62)]
- Websocket docs [[#60](https://github.com/airyhq/airy/pull/60)]
- More design principles content [[#58](https://github.com/airyhq/airy/pull/58)]
- Add core auth app [[#56](https://github.com/airyhq/airy/pull/56)]
- Quick formatting updates to the docs [[#55](https://github.com/airyhq/airy/pull/55)]
- feature/core auth docs [[#53](https://github.com/airyhq/airy/pull/53)]
- Websocket add remaining implementations [[#52](https://github.com/airyhq/airy/pull/52)]
- Feature/streams to websocket [[#41](https://github.com/airyhq/airy/pull/41)]
- Unread count [[#42](https://github.com/airyhq/airy/pull/42)]
- Quick cleanup before next steps [[#40](https://github.com/airyhq/airy/pull/40)]
- Use group by key [[#38](https://github.com/airyhq/airy/pull/38)]
- Add facebook message sender [[#37](https://github.com/airyhq/airy/pull/37)]
- Feature/send message [[#32](https://github.com/airyhq/airy/pull/32)]
- Add delivery states to message [[#35](https://github.com/airyhq/airy/pull/35)]
- Send message requests in the events router [[#33](https://github.com/airyhq/airy/pull/33)]
- Fix the channels test [[#31](https://github.com/airyhq/airy/pull/31)]
- Channels API [[#28](https://github.com/airyhq/airy/pull/28)]
- Reorganize the docs so they can scale better [[#27](https://github.com/airyhq/airy/pull/27)]
- Remove deprecation [[#26](https://github.com/airyhq/airy/pull/26)]
- Upgrade to bazel 3.5.0 [[#25](https://github.com/airyhq/airy/pull/25)]
- More cleanup for test infrastructure [[#24](https://github.com/airyhq/airy/pull/24)]
- Speed up the tests [[#23](https://github.com/airyhq/airy/pull/23)]
- Kafka upgrade [[#22](https://github.com/airyhq/airy/pull/22)]
- Communication API [[#18](https://github.com/airyhq/airy/pull/18)]
- Small cleanups [[#21](https://github.com/airyhq/airy/pull/21)]
- Cleaning up while reading code [[#19](https://github.com/airyhq/airy/pull/19)]
- Ingestion platform draft [[#16](https://github.com/airyhq/airy/pull/16)]
- More docs infrastructure [[#9](https://github.com/airyhq/airy/pull/9)]
- Spell check the README [[#8](https://github.com/airyhq/airy/pull/8)]
- Core README v0 [[#4](https://github.com/airyhq/airy/pull/4)]
- Remove airy docs website from this repository [[#7](https://github.com/airyhq/airy/pull/7)]
- Fix edit url and root title [[#6](https://github.com/airyhq/airy/pull/6)]
- Hugo docs site [[#5](https://github.com/airyhq/airy/pull/5)]
- Setup Bazel dependencies, code formatters and github workflows [[#3](https://github.com/airyhq/airy/pull/3)]
- Basic docs ported from platform [[#2](https://github.com/airyhq/airy/pull/2)]
- Basic structure [[#1](https://github.com/airyhq/airy/pull/1)]

#### 🐛 Bug Fixes

- [417] Fix chatplugin chart [[#418](https://github.com/airyhq/airy/pull/418)]
- [[#408](https://github.com/airyhq/airy/issues/408)] Prioritize first apps [[#410](https://github.com/airyhq/airy/pull/410)]
- Generate random strings with helm [[#404](https://github.com/airyhq/airy/pull/404)]
- [[#405](https://github.com/airyhq/airy/issues/405)] Populate delivery state correctly [[#406](https://github.com/airyhq/airy/pull/406)]
- [[#388](https://github.com/airyhq/airy/issues/388)] Chat plugin text render bug fixed [[#392](https://github.com/airyhq/airy/pull/392)]
- [[#386](https://github.com/airyhq/airy/issues/386)] Add missing cors configuration [[#390](https://github.com/airyhq/airy/pull/390)]
- [[#378](https://github.com/airyhq/airy/issues/378)] Fix the code also and not only the docs for channel connection token [[#389](https://github.com/airyhq/airy/pull/389)]
- [[#378](https://github.com/airyhq/airy/issues/378)] Do not require token as most sources do not require it [[#380](https://github.com/airyhq/airy/pull/380)]
- [[#381](https://github.com/airyhq/airy/issues/381)] Classify pull requests as our conventions specify [[#382](https://github.com/airyhq/airy/pull/382)]

#### 📚 Documentation

- [415] Add gifs to connecting chatplugin channel documentation [[#419](https://github.com/airyhq/airy/pull/419)]
- Add Vbox known issue [[#409](https://github.com/airyhq/airy/pull/409)]
- [[#344](https://github.com/airyhq/airy/issues/344)] Enable copy\&paste of code snippets [[#391](https://github.com/airyhq/airy/pull/391)]
- Docs/chat plugin [[#383](https://github.com/airyhq/airy/pull/383)]

