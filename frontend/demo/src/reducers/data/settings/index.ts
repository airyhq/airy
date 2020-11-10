import { ActionType } from "typesafe-actions";

type Action = ActionType<any>;

type IFeature = {
  enabled: boolean;
};

export type ISettingsState = {
  [key: string]: IFeature;
};

const initialState: ISettingsState = {};

export default function settings(state = initialState, action: Action) {
  return state;
}
