import { ResponseData } from "../base";
import { AuthResponseData, UserPayload } from "./complete_profile";

export interface GoogleAuthPayload {
  id_token: string;
}

export interface GoogleAuthResponseData {
  auth_data?: AuthResponseData;
  access_token?: string;
  refresh_token?: string;
  user?: UserPayload;
}

export type GoogleAuthResponse = ResponseData<GoogleAuthResponseData>;
