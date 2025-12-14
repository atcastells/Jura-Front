import { apiClient } from '@/shared';
import type {
  Profile,
  UpdateProfileBasicsPayload,
  AddRolePayload,
  UpdateRolePayload,
  ProfileRole,
} from '../types';

const PROFILE_ENDPOINTS = {
  me: '/api/v1/profile/me',
  roles: '/api/v1/profile/me/roles',
  role: (roleId: string) => `/api/v1/profile/me/roles/${roleId}`,
} as const;

/**
 * Get current user's profile
 */
export const getMyProfile = async (): Promise<Profile> => {
  return apiClient.get<Profile>(PROFILE_ENDPOINTS.me);
};

/**
 * Update current user's profile basics
 */
export const updateMyProfile = async (
  payload: UpdateProfileBasicsPayload
): Promise<Profile> => {
  return apiClient.patch<Profile>(PROFILE_ENDPOINTS.me, payload);
};

/**
 * Add a new role to profile
 */
export const addRole = async (payload: AddRolePayload): Promise<ProfileRole> => {
  return apiClient.post<ProfileRole>(PROFILE_ENDPOINTS.roles, payload);
};

/**
 * Update an existing role
 */
export const updateRole = async (
  roleId: string,
  payload: UpdateRolePayload
): Promise<ProfileRole> => {
  return apiClient.patch<ProfileRole>(PROFILE_ENDPOINTS.role(roleId), payload);
};

/**
 * Delete a role from profile
 */
export const deleteRole = async (roleId: string): Promise<void> => {
  return apiClient.delete<void>(PROFILE_ENDPOINTS.role(roleId));
};
