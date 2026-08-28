import { ResponseData } from "../base";
import { AuthResponseData } from "./complete_profile";

export interface GoogleAuthPayload {
  id_token: string;
}

export interface GoogleSetupPresetResponse {
  email: string;
  name: string;
  avatar_url?: string;
  setup_token: string;
  is_profile_completed: boolean;
}

export interface GoogleAuthResponseData {
  auth_data?: AuthResponseData;
  setup_preset?: GoogleSetupPresetResponse;
}

export type GoogleAuthResponse = ResponseData<GoogleAuthResponseData>;
