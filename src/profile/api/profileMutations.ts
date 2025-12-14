import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileKeys } from '@/shared';
import {
  updateMyProfile,
  addRole,
  updateRole,
  deleteRole,
} from './profileApi';
import type {
  UpdateProfileBasicsPayload,
  AddRolePayload,
  UpdateRolePayload,
} from '../types';

/**
 * Mutation hook to update profile basics
 */
export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfileBasicsPayload) => updateMyProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me() });
    },
  });
};

/**
 * Mutation hook to add a new role
 */
export const useAddRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddRolePayload) => addRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me() });
    },
  });
};

/**
 * Mutation hook to update an existing role
 */
export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, payload }: { roleId: string; payload: UpdateRolePayload }) =>
      updateRole(roleId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me() });
    },
  });
};

/**
 * Mutation hook to delete a role
 */
export const useDeleteRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleId: string) => deleteRole(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me() });
    },
  });
};
