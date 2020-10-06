import {User} from './User';

export abstract class AiryRequestConfig {
  appId: string;

  constructor(appId: string) {
    this.appId = appId;
  }

  abstract getOrgId(): string;

  abstract onLogoutUser(): void;
  abstract onLoginUser(payload: User): void;
}
