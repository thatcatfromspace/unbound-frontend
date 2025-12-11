import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users as UsersIcon, UserPlus, Key } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

export default function Users() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [credits, setCredits] = useState(100);
  const [createdKey, setCreatedKey] = useState(null);
  
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/users');
      return res.data;
    }
  });

  const createUserMutation = useMutation({
    mutationFn: async (newUser) => {
      const res = await api.post('/admin/users', newUser);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['users']);
      addToast("Operative Added Successfully", "success");
      setCreatedKey(data.apiKey);
      setEmail('');
    },
    onError: () => {
      addToast("Failed to recruit operative", "error");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    createUserMutation.mutate({ email, role, credits: Number(credits) });
    setCreatedKey(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-mono flex items-center gap-2">
          <UsersIcon className="text-primary" /> OPERATIVE_ROSTER
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border border-border p-4 rounded-md shadow-sm">
          <h3 className="text-sm font-mono text-muted-foreground mb-4 uppercase">Recruit_Operative</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
             <div className="space-y-2">
                <label className="text-xs font-mono">EMAIL / ID</label>
                <Input 
                   value={email} 
                   onChange={(e) => setEmail(e.target.value)} 
                   placeholder="admin@example.com"
                />
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-xs font-mono">ROLE</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="MEMBER">MEMBER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-mono">CREDITS</label>
                 <Input 
                    type="number" 
                    value={credits} 
                    onChange={(e) => setCredits(e.target.value)}
                 />
               </div>
             </div>
             <Button type="submit" className="w-full" disabled={createUserMutation.isPending}>
               <UserPlus className="h-4 w-4 mr-2" /> CREATE USER
             </Button>
          </form>
        </div>

        {createdKey && (
           <div className="bg-primary/10 border border-primary p-6 rounded-md flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
              <Key className="h-8 w-8 text-primary mb-2" />
              <h3 className="text-lg font-bold text-primary mb-2">ACCESS_KEY_GENERATED</h3>
              <div className="bg-background/80 p-3 rounded border border-primary/30 font-mono text-lg break-all select-all w-full">
                 {createdKey}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                 WARNING: Displayed only once. Secure immediately.
              </p>
           </div>
        )}
      </div>

      <div className="border border-border rounded-md overflow-hidden bg-card/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>CREDITS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8">SCANNING_DATABASE...</TableCell></TableRow>
            ) : users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{user.id}</TableCell>
                <TableCell className="font-bold">{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user.role}</Badge>
                </TableCell>
                <TableCell className="font-mono text-primary">{user.credits}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
