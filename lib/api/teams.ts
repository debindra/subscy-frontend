import { apiClient } from './client';

export interface TeamMember {
  id: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
  is_owner: boolean;
}

export interface TeamMembersResponse {
  team_id: string;
  members: TeamMember[];
  total_members: number;
  max_members: number;
}

export interface InviteUserPayload {
  email: string;
  role?: 'owner' | 'admin' | 'member';
}

export interface InviteResponse {
  message: string;
  email: string;
  role: string;
  status: string;
}

export interface UpdateRolePayload {
  role: 'owner' | 'admin' | 'member';
}

export const teamsApi = {
  getMembers: () => apiClient.get<TeamMembersResponse>('/teams/members'),
  inviteMember: (payload: InviteUserPayload) =>
    apiClient.post<InviteResponse>('/teams/invite', payload),
  removeMember: (memberId: string) =>
    apiClient.delete(`/teams/members/${memberId}`),
  updateMemberRole: (memberId: string, payload: UpdateRolePayload) =>
    apiClient.patch(`/teams/members/${memberId}/role`, payload),
  shareSubscription: (subscriptionId: string) =>
    apiClient.post(`/subscriptions/${subscriptionId}/share`),
  unshareSubscription: (subscriptionId: string) =>
    apiClient.post(`/subscriptions/${subscriptionId}/unshare`),
};

