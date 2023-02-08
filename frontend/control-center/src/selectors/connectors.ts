import {StateModel} from '../reducers';
import {useSelector} from 'react-redux';
import {Channel, Connector, ConnectorName, ConnectorsModel, InstallationStatus, Source} from 'model';
import {createSelector} from 'reselect';
import {merge} from 'lodash-es';
import {allChannelsConnected} from './channels';

export const useCurrentConnectorForSource = (source: Source) => {
  const connectors = useSelector((state: StateModel) => state.data.connector);
  const connectorInfoArr = Object.entries(connectors).filter(item => item[0].includes(source));

  const connectorInfoArrFlat = connectorInfoArr.flat() as [string, {[key: string]: string}];

  return {...connectorInfoArrFlat[1]};
};

export const getMergedConnectors = createSelector(
  (state: StateModel) => state.data.catalog,
  (state: StateModel) => state.data.config.components,
  (state: StateModel) => state.data.connector,
  (state: StateModel) => Object.values(allChannelsConnected(state)),
  (catalog, components, connectors, channels) => {
    let structuredConnector: Connector = {};
    let structuredCatalog: Connector = {};
    let structuredComponent: Connector = {};
    const catalogList: ConnectorsModel = {};
    const connectorsList: ConnectorsModel = {};
    const componentsList: ConnectorsModel = {};

    Object.entries(catalog).map(catalog => {
      const channelsBySource = (Source: Source) => channels.filter((channel: Channel) => channel.source === Source);
      const connectedChannels = channelsBySource(catalog[1].source).length;
      const isChannel = catalog[1].isChannel?.includes('true') ?? false;
      const isInstalled = catalog[1].installationStatus === InstallationStatus.installed;
      const price = catalog[1].price;
      const source = catalog[1].source;
      const name = catalog[0];
      const displayName = catalog[1].displayName;
      const isApp = catalog[1].isApp;

      structuredCatalog = {
        name: name,
        displayName: displayName,
        installationStatus: catalog[1].installationStatus,
        isConfigured: !isInstalled && false,
        isHealthy: !isInstalled && false,
        isEnabled: !isInstalled && false,
        isChannel: isChannel,
        isApp: isApp,
        price: price,
        source: source,
        connectedChannels: connectedChannels,
      };

      if (isApp) {
        structuredCatalog = {
          ...structuredCatalog,
          isConfigured: true,
          isHealthy: true,
          isEnabled: true,
        };
      }

      catalogList[structuredCatalog.name] = structuredCatalog;
    });

    Object.entries(connectors).map(connector => {
      let isConfigured = false;
      if (Object.values(connector[1]).length > 0 || connector[0] === ConnectorName.sourcesChatPlugin) {
        isConfigured = true;
      }

      structuredConnector = {
        name: connector[0],
        configureValues: connector[1],
        isConfigured: isConfigured,
      };

      connectorsList[structuredConnector.name] = structuredConnector;
    });

    Object.entries(components).map(component => {
      structuredComponent = {
        name: component[0],
        isEnabled: component[1].enabled,
        isHealthy: component[1].healthy,
      };
      componentsList[structuredComponent.name] = structuredComponent;
    });

    const mergedConnectors = merge(catalogList, connectorsList, componentsList);

    return mergedConnectors;
  }
);
