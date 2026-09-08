import api from "@/lib/api";
import {
  GetDocumentPayload,
  GetDocumentResponse,
  UploadDocumentValues,
} from "../schema/user/document";
import {
  GetGeneralProfilePayload,
  GetGeneralProfileResponse,
  UpdateGeneralProfileValues,
} from "../schema/user/general_profile";
import { ChangePasswordValues } from "../schema/user/password";
import {
  PersonaProfilePayload,
  PersonaProfileResponse,
  UpdatePersonaValues,
} from "../schema/user/persona";
import {
  GetPhoneNumbersPayload,
  PhoneNumberItem,
  PhoneValues,
} from "../schema/user/phone_number";

export async function getGeneralProfile(): Promise<GetGeneralProfileResponse> {
  const response = await api.get<GetGeneralProfilePayload>("/users/profile");
  return response.data.data;
}

export async function updateGeneralProfile(
  payload: UpdateGeneralProfileValues,
) {
  const response = await api.put<GetGeneralProfilePayload>(
    "/users/profile",
    payload,
  );
  return response.data.data;
}

export async function getPhoneNumbers(): Promise<PhoneNumberItem[]> {
  const response = await api.get<GetPhoneNumbersPayload>("/users/phone");
  return response.data.data;
}

export async function addPhoneNumber(payload: PhoneValues): Promise<void> {
  await api.post("/users/phone", payload);
}

export async function updatePhoneNumber(
  index: string | number,
  payload: PhoneValues,
): Promise<void> {
  await api.put(`/users/phone/${index}`, payload);
}

export async function deletePhoneNumber(index: string | number): Promise<void> {
  await api.delete(`/users/phone/${index}`);
}

export async function updatePassword(
  payload: ChangePasswordValues,
): Promise<void> {
  await api.put("/users/password", payload);
}

export async function getPersonaProfile(
  role: string,
): Promise<PersonaProfileResponse> {
  const response = await api.get<PersonaProfilePayload>(
    `/users/persona/${role}`,
  );
  return response.data.data;
}

export async function updatePersonaProfile(
  role: string,
  payload: UpdatePersonaValues,
): Promise<void> {
  await api.put(`/users/persona/${role}`, payload);
}

export async function getDocument(): Promise<GetDocumentResponse> {
  const response = await api.get<GetDocumentPayload>("/users/document");
  return response.data.data;
}

export async function uploadDocument(
  payload: UploadDocumentValues,
): Promise<void> {
  await api.post("/users/document", payload);
}

export async function deleteDocument(): Promise<void> {
  await api.delete("/users/document");
}
