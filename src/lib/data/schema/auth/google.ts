import { ResponseData } from "../base";
import { AuthResponseData } from "./login";

export interface GoogleAuthPayload {
  id_token: string;
}

export type GoogleAuthResponse = ResponseData<AuthResponseData>;
