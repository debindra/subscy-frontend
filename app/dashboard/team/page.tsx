'use client';

import { useState, useEffect } from 'react';
import { teamsApi, TeamMember, InviteUserPayload } from '@/lib/api/teams';
import { usePlanFeatures } from '@/lib/hooks/usePlanFeatures';
import { useToast } from '@/lib/context/ToastContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function TeamPage() {
  const { showToast } = useToast();
  const { isUltimate, hasSharedAccounts, loading: planLoading } = usePlanFeatures();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'member' | 'admin'>('member');
  const [inviting, setInviting] = useState(false);
  const [teamInfo, setTeamInfo] = useState<{ team_id: string; total_members: number; max_members: number } | null>(null);

  useEffect(() => {
    if (!planLoading && isUltimate) {
      loadTeamMembers();
    }
  }, [planLoading, isUltimate]);

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await teamsApi.getMembers();
      setMembers(response.data.members || []);
      setTeamInfo({
        team_id: response.data.team_id,
        total_members: response.data.total_members,
        max_members: response.data.max_members,
      });
    } catch (error: any) {
      console.error('Failed to load team members:', error);
      if (error?.response?.status === 403) {
        showToast('Team sharing requires Ultimate plan', 'error');
      } else {
        showToast('Failed to load team members', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      showToast('Please enter an email address', 'error');
      return;
    }

    try {
      setInviting(true);
      const payload: InviteUserPayload = {
        email: inviteEmail.trim(),
        role: inviteRole,
      };
      await teamsApi.inviteMember(payload);
      showToast(`Invitation sent to ${inviteEmail}`, 'success');
      setInviteEmail('');
      setInviteRole('member');
      // Reload team members
      await loadTeamMembers();
    } catch (error: any) {
      console.error('Failed to invite member:', error);
      if (error?.response?.status === 403) {
        showToast('Team member limit reached or feature not available', 'error');
      } else {
        showToast('Failed to send invitation', 'error');
      }
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string, email: string) => {
    if (!confirm(`Are you sure you want to remove ${email} from the team?`)) {
      return;
    }

    try {
      await teamsApi.removeMember(memberId);
      showToast('Team member removed successfully', 'success');
      await loadTeamMembers();
    } catch (error: any) {
      console.error('Failed to remove member:', error);
      showToast('Failed to remove team member', 'error');
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: 'owner' | 'admin' | 'member') => {
    try {
      await teamsApi.updateMemberRole(memberId, { role: newRole });
      showToast('Member role updated successfully', 'success');
      await loadTeamMembers();
    } catch (error: any) {
      console.error('Failed to update role:', error);
      showToast('Failed to update member role', 'error');
    }
  };

  if (planLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!isUltimate && !hasSharedAccounts) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Team Sharing</h2>
            <p className="text-slate-600 mb-6">
              Team sharing is available on the Ultimate plan. Upgrade to share subscriptions with up to 5 team members.
            </p>
            <Button
              onClick={() => (window.location.href = '/')}
              className="bg-primary-600 text-white"
            >
              View Plans
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Team Management</h1>
        <p className="text-slate-600">
          Invite team members and manage access to shared subscriptions.
        </p>
      </div>

      {/* Team Stats */}
      {teamInfo && (
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Team Members</p>
              <p className="text-2xl font-bold text-slate-900">
                {teamInfo.total_members} / {teamInfo.max_members}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Invite Member */}
      <Card className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Invite Team Member</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@example.com"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Role
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as 'member' | 'admin')}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <Button
            onClick={handleInvite}
            disabled={inviting || !inviteEmail.trim()}
            className="bg-primary-600 text-white"
          >
            {inviting ? 'Sending...' : 'Send Invitation'}
          </Button>
        </div>
      </Card>

      {/* Team Members List */}
      <Card>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Team Members</h2>
        {loading ? (
          <div className="text-center py-8 text-slate-600">Loading members...</div>
        ) : members.length === 0 ? (
          <div className="text-center py-8 text-slate-600">No team members yet</div>
        ) : (
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{member.email}</p>
                  <p className="text-sm text-slate-600 capitalize">{member.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!member.is_owner && (
                    <>
                      <select
                        value={member.role}
                        onChange={(e) =>
                          handleUpdateRole(member.id, e.target.value as 'owner' | 'admin' | 'member')
                        }
                        className="px-3 py-1 text-sm border border-slate-300 rounded-lg"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                        <option value="owner">Owner</option>
                      </select>
                      <Button
                        onClick={() => handleRemoveMember(member.id, member.email)}
                        className="bg-red-600 text-white text-sm px-3 py-1"
                      >
                        Remove
                      </Button>
                    </>
                  )}
                  {member.is_owner && (
                    <span className="text-sm text-slate-500">Owner</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

