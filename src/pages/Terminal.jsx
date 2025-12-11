import { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Terminal as TerminalIcon, ShieldAlert, Cpu } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

export default function Terminal() {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState([]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const { addToast } = useToast();
  
  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Focus input on click
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const executeMutation = useMutation({
    mutationFn: async (cmd) => {
      const response = await api.post('/gateway/execute', { command: cmd });
      return response.data;
    },
    onSuccess: (data, variables) => {
      const newEntry = {
        id: Date.now(),
        command: variables,
        output: data.output,
        status: data.status, // ALLOWED / BLOCKED
        success: data.success,
        timestamp: new Date().toLocaleTimeString(),
        cost: data.costDeducted
      };
      setHistory(prev => [...prev, newEntry]);
      setCommand('');
      
      if (!data.success) {
        // addToast(data.output || "Command Failed", "error");
      }
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || error.message || "Execution Error";
      const newEntry = {
        id: Date.now(),
        command: variables,
        output: errorMessage,
        status: 'ERROR',
        success: false,
        timestamp: new Date().toLocaleTimeString(),
      };
      setHistory(prev => [...prev, newEntry]);
      addToast("System Failure", "error");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!command.trim()) return;
    executeMutation.mutate(command);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] gap-4">
       {/* Header / Status Bar */}
       <div className="flex items-center justify-between border-b border-border pb-4">
         <div className="flex items-center gap-2">
            <TerminalIcon className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold font-mono tracking-wider">COMMAND_INTERFACE</h1>
         </div>
         <div className="flex items-center gap-4">
            {/* Placeholder for credits if we can fetch them later */}
            <Badge variant="outline" className="font-mono gap-2">
               <Cpu className="h-3 w-3" />
               SYSTEM_ONLINE
            </Badge>
         </div>
       </div>

       {/* Output Area */}
       <div 
         className="flex-1 overflow-y-auto rounded-md border border-border bg-black/50 p-4 font-mono shadow-inner"
         onClick={() => inputRef.current?.focus()}
       >
         <div className="space-y-4">
            <div className="text-muted-foreground text-sm opacity-50">
              Initializing... Connected to Gateway.
              <br />
              Type 'help' for available commands.
            </div>

            {history.map((entry) => (
              <div key={entry.id} className="space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                   <span className="text-primary opacity-70">➜</span>
                   <span className="opacity-70">{entry.timestamp}</span>
                   <span className="font-bold text-foreground">{entry.command}</span>
                </div>
                
                <div className="pl-6 text-sm">
                   {entry.status === 'BLOCKED' ? (
                     <span className="text-destructive flex items-center gap-2">
                        <ShieldAlert className="h-3 w-3" /> BLOCKED BY RULE ENGINE
                     </span>
                   ) : entry.status === 'PENDING' ? (
                     <span className="text-yellow-500 flex items-center gap-2 animate-pulse">
                        <ShieldAlert className="h-3 w-3" /> REQUEST SUBMITTED - PENDING APPROVAL
                     </span>
                   ) : (
                     <pre className={`whitespace-pre-wrap ${entry.success ? 'text-green-400' : 'text-red-400'}`}>
                        {entry.output || (entry.success ? "Command executed successfully (No Output)" : "Unknown Error")}
                     </pre>
                   )}
                   {entry.cost && (
                      <div className="mt-1 text-xs text-yellow-500/70">
                        Cost Executed: {entry.cost} Credits
                      </div>
                   )}
                </div>
              </div>
            ))}
            
            {executeMutation.isPending && (
              <div className="flex items-center gap-2 text-primary animate-pulse pl-6 text-sm">
                 Processing...
              </div>
            )}
            <div ref={bottomRef} />
         </div>
       </div>

       {/* Input Area */}
       <div className="relative">
          <form onSubmit={handleSubmit} className="flex gap-2">
             <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-mono text-lg">➜</span>
                <Input 
                   ref={inputRef}
                   value={command}
                   onChange={(e) => setCommand(e.target.value)}
                   className="pl-8 font-mono bg-background/80 border-primary/30 focus:border-primary focus:ring-1 focus:ring-primary/50"
                   placeholder="Enter command..."
                   disabled={executeMutation.isPending}
                   autoComplete="off"
                />
             </div>
             <Button 
                type="submit" 
                disabled={executeMutation.isPending || !command.trim()}
                className="w-24"
             >
                {executeMutation.isPending ? 'EXEC' : <Send className="h-4 w-4" />}
             </Button>
          </form>
       </div>
    </div>
  );
}
