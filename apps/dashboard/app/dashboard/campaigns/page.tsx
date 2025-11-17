'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { withAuth } from '@/components/auth/withAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function CampaignsPage() {
  const { token, logout } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [flows, setFlows] = useState([]);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [selectedFlowId, setSelectedFlowId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const apiClient = token ? api(token) : null;

  const fetchData = async () => {
    if (!apiClient) return;
    try {
      const [campaignsData, flowsData] = await Promise.all([
        apiClient.getCampaigns(),
        apiClient.getFlows(),
      ]);
      setCampaigns(campaignsData);
      setFlows(flowsData);
    } catch (err) {
      setError(err.message);
      if (err.message === 'Unauthorized') logout();
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiClient || !selectedFlowId) {
      setError('Please select a flow.');
      return;
    }
    setError(null);
    try {
      await apiClient.createCampaign({ name: newCampaignName, flowId: selectedFlowId });
      setNewCampaignName('');
      setSelectedFlowId('');
      fetchData(); // Refresh the list
    } catch (err) {
      setError('Failed to create campaign.');
    }
  };

  const handleStartCampaign = async (campaignId: string) => {
    if (!apiClient) return;
    try {
      await apiClient.startCampaign(campaignId);
      // Optionally, refresh data to show status change
      fetchData();
    } catch (err) {
      alert('Failed to start campaign.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Campaign Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Create New Campaign</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateCampaign} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input
                    id="campaign-name"
                    value={newCampaignName}
                    onChange={(e) => setNewCampaignName(e.target.value)}
                    placeholder="e.g., Q3 Promo"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="flow-select">Flow</Label>
                  <Select onValueChange={setSelectedFlowId} value={selectedFlowId}>
                    <SelectTrigger id="flow-select">
                      <SelectValue placeholder="Select a flow" />
                    </SelectTrigger>
                    <SelectContent>
                      {flows.map((flow: any) => (
                        <SelectItem key={flow.id} value={flow.id}>
                          {flow.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit">Create Campaign</Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Existing Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {campaigns.map((campaign: any) => (
                  <li key={campaign.id} className="p-3 border rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{campaign.name}</p>
                      <p className="text-sm text-gray-500">Flow: {campaign.flow?.name || 'N/A'}</p>
                      <p className="text-sm text-gray-500">Status: {campaign.status}</p>
                    </div>
                    <Button size="sm" onClick={() => handleStartCampaign(campaign.id)} disabled={campaign.status === 'ACTIVE'}>
                      Start
                    </Button>
                  </li>
                ))}
                {campaigns.length === 0 && <p>No campaigns found.</p>}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default withAuth(CampaignsPage);
