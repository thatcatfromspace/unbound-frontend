import { useQuery } from '@tanstack/react-query';
import { FileText, Activity } from 'lucide-react';
import api from '@/lib/api';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';

export default function Logs() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['logs'],
    queryFn: async () => {
      const res = await api.get('/admin/logs');
      return res.data;
    },
    refetchInterval: 5000 // Live updates
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-mono flex items-center gap-2">
          <FileText className="text-primary" /> SYSTEM_AUDIT_LOGS
        </h2>
        <Badge variant="outline" className="animate-pulse">
            <Activity className="h-3 w-3 mr-1" /> LIVE_FEED
        </Badge>
      </div>

      <div className="border border-border rounded-md overflow-hidden bg-card/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>TIMESTAMP</TableHead>
              <TableHead>USER</TableHead>
              <TableHead>COMMAND</TableHead>
              <TableHead>STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8">RETRIEVING_LOGS...</TableCell></TableRow>
            ) : logs?.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">
                   {new Date(log.timestamp).toLocaleString()}
                </TableCell>
                <TableCell className="font-mono text-xs">{log.user?.email || log.userId}</TableCell>
                <TableCell className="font-mono font-bold">{log.command}</TableCell>
                <TableCell>
                  <Badge variant={
                     log.status === 'ALLOWED' ? 'success' : 
                     log.status === 'BLOCKED' ? 'destructive' : 'warning'
                  }>
                    {log.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && logs?.length === 0 && (
               <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">NO_DATA</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
