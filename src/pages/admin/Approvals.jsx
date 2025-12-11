import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Inbox, Check, X } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

export default function Approvals() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { data: approvals, isLoading } = useQuery({
    queryKey: ['approvals'],
    queryFn: async () => {
      const res = await api.get('/admin/approvals');
      return res.data;
    }
  });

  const approveMutation = useMutation({
    mutationFn: async (id) => {
      await api.post(`/admin/approvals/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['approvals']);
      addToast("Request Approved", "success");
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      await api.post(`/admin/approvals/${id}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['approvals']);
      addToast("Request Rejected", "default");
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-mono flex items-center gap-2">
          <Inbox className="text-primary" /> PENDING_APPROVALS
        </h2>
      </div>

      <div className="border border-border rounded-md overflow-hidden bg-card/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>TIMESTAMP</TableHead>
              <TableHead>USER</TableHead>
              <TableHead>COMMAND</TableHead>
              <TableHead className="text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8">SCANNING_INBOX...</TableCell></TableRow>
            ) : approvals?.map((req) => (
              <TableRow key={req.id}>
                 <TableCell className="font-mono text-xs text-muted-foreground">
                   {new Date(req.timestamp).toLocaleString()}
                </TableCell>
                <TableCell className="font-mono text-xs">{req.user?.email || req.userId}</TableCell>
                <TableCell className="font-mono font-bold text-yellow-400">{req.command}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 w-8 p-0 border-green-500/50 hover:bg-green-500/20 text-green-400"
                      onClick={() => approveMutation.mutate(req.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 w-8 p-0 border-red-500/50 hover:bg-red-500/20 text-red-400"
                      onClick={() => rejectMutation.mutate(req.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && approvals?.length === 0 && (
               <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">NO_PENDING_REQUESTS</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
