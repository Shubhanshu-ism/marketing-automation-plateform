'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { withAuth } from '@/components/auth/withAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Assuming you'll add this component

function FlowsPage() {
  const { token, logout } = useAuth();
  const [flows, setFlows] = useState([]);
  const [newFlowName, setNewFlowName] = useState('');
  const [newFlowSteps, setNewFlowSteps] = useState('{}');
  const [error, setError] = useState<string | null>(null);

  const apiClient = token ? api(token) : null;

  const fetchFlows = async () => {
    if (!apiClient) return;
    try {
      const data = await apiClient.getFlows();
      setFlows(data);
    } catch (err) {
      setError(err.message);
      if (err.message === 'Unauthorized') {
        logout();
      }
    }
  };

  useEffect(() => {
    fetchFlows();
  }, [token]);

  const handleCreateFlow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiClient) return;
    setError(null);
    try {
      const steps = JSON.parse(newFlowSteps);
      await apiClient.createFlow({ name: newFlowName, steps });
      setNewFlowName('');
      setNewFlowSteps('{}');
      fetchFlows(); // Refresh the list
    } catch (err) {
      setError('Failed to create flow. Ensure steps are valid JSON.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Flow Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Create New Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateFlow} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="flow-name">Flow Name</Label>
                  <Input
                    id="flow-name"
                    value={newFlowName}
                    onChange={(e) => setNewFlowName(e.target.value)}
                    placeholder="e.g., New User Welcome"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="flow-steps">Steps (JSON)</Label>
                  <Textarea
                    id="flow-steps"
                    value={newFlowSteps}
                    onChange={(e) => setNewFlowSteps(e.target.value)}
                    placeholder='{ "trigger": "user_signup" }'
                    required
                    rows={5}
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit">Create Flow</Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Existing Flows</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {flows.map((flow: any) => (
                  <li key={flow.id} className="p-2 border rounded-md">
                    {flow.name}
                  </li>
                ))}
                {flows.length === 0 && <p>No flows found.</p>}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default withAuth(FlowsPage);
