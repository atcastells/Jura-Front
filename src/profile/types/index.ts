import type { Timestamps } from '@/shared';

// Profile basic information
export interface ProfileBasics {
  name?: string;
  headline?: string;
  summary?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
}

// Highlight within a role
export interface RoleHighlight {
  id: string;
  description: string;
  order: number;
}

// Professional role/experience
export interface ProfileRole {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  highlights: RoleHighlight[];
}

// Complete profile
export interface Profile extends Timestamps {
  id: string;
  userId: string;
  basics: ProfileBasics;
  roles: ProfileRole[];
  completenessScore: number;
  slug?: string;
  isPublic: boolean;
}

// API payloads
export interface UpdateProfileBasicsPayload {
  name?: string;
  headline?: string;
  summary?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
}

export interface AddRolePayload {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface UpdateRolePayload {
  title?: string;
  company?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

export interface AddHighlightPayload {
  description: string;
  order?: number;
}
