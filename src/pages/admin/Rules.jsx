import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Plus, Trash2, AlertTriangle, Clock } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

export default function Rules() {
  const [pattern, setPattern] = useState('');
  const [action, setAction] = useState('AUTO_REJECT');
  const [cost, setCost] = useState(1);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { data: rules, isLoading } = useQuery({
    queryKey: ['rules'],
    queryFn: async () => {
      const res = await api.get('/admin/rules');
      return res.data;
    }
  });

  const createRuleMutation = useMutation({
    mutationFn: async (newRule) => {
      await api.post('/admin/rules', newRule);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['rules']);
      addToast("Rule Directive Updated", "success");
      setPattern('');
      setStartTime('');
      setEndTime('');
    },
    onError: (error) => {
      const msg = error.response?.data?.error || "Failed to update directive";
      addToast(msg, "error");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pattern) return;
    createRuleMutation.mutate({ 
      pattern, 
      action, 
      cost: Number(cost),
      startTime: startTime || null,
      endTime: endTime || null
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-mono flex items-center gap-2">
          <Shield className="text-primary" /> SECURITY_RULES
        </h2>
      </div>

      <div className="bg-card border border-border p-4 rounded-md shadow-sm">
        <h3 className="text-sm font-mono text-muted-foreground mb-4 uppercase">New_Directive</h3>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px] space-y-2">
            <label className="text-xs font-mono">PATTERN (REGEX)</label>
            <Input 
              value={pattern} 
              onChange={(e) => setPattern(e.target.value)} 
              placeholder="^sudo.*"
              className="font-mono text-sm"
            />
          </div>
          <div className="w-40 space-y-2">
             <label className="text-xs font-mono">ACTION</label>
             <select 
               className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono"
               value={action}
               onChange={(e) => setAction(e.target.value)}
             >
               <option value="AUTO_ACCEPT">AUTO_ACCEPT</option>
               <option value="AUTO_REJECT">AUTO_REJECT</option>
               <option value="REQUIRE_APPROVAL">REQUIRE_APPROVAL</option>
             </select>
          </div>
          <div className="w-24 space-y-2">
            <label className="text-xs font-mono">COST</label>
            <Input 
              type="number" 
              value={cost} 
              onChange={(e) => setCost(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          <div className="w-28 space-y-2">
            <label className="text-xs font-mono">START (HH:mm)</label>
            <Input 
              type="time" 
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          <div className="w-28 space-y-2">
            <label className="text-xs font-mono">END (HH:mm)</label>
            <Input 
              type="time" 
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          <Button type="submit" disabled={createRuleMutation.isPending}>
            <Plus className="h-4 w-4" /> ADD
          </Button>
        </form>
      </div>

      <div className="border border-border rounded-md overflow-hidden bg-card/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PATTERN</TableHead>
              <TableHead>ACTION</TableHead>
              <TableHead>COST</TableHead>
              <TableHead>TIME WINDOW</TableHead>
              <TableHead className="text-right">ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">LOADING_RULES...</TableCell></TableRow>
            ) : rules?.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="font-mono text-primary font-bold">{rule.pattern}</TableCell>
                <TableCell>
                  <Badge variant={
                    rule.action === 'AUTO_ACCEPT' ? 'success' : 
                    rule.action === 'AUTO_REJECT' ? 'destructive' : 'warning'
                  }>
                    {rule.action}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono">{rule.cost}</TableCell>
                <TableCell className="font-mono text-xs">
                   {rule.startTime && rule.endTime ? (
                      <span className="flex items-center gap-1">
                         <Clock className="h-3 w-3" /> {rule.startTime} - {rule.endTime}
                      </span>
                   ) : (
                      <span className="text-muted-foreground opacity-50">ALWAYS</span>
                   )}
                </TableCell>
                <TableCell className="text-right font-mono text-xs text-muted-foreground">{rule.id}</TableCell>
              </TableRow>
            ))}
            {!isLoading && rules?.length === 0 && (
               <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">NO_ACTIVE_DIRECTIVES</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
