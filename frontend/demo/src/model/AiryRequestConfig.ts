import { User } from "./User";

export abstract class AiryRequestConfig {
  appId: string;

  constructor(appId: string) {
    this.appId = appId;
  }

  abstract onLogoutUser(): void;
  abstract onLoginUser(payload: User): void;
}
