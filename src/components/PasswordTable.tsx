import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { apiDeletePassword, apiRevealPassword, apiUpdatePassword, PasswordRecord } from "@/lib/api";
import { toast } from "sonner";

const PasswordTable = ({ items, onChanged }: { items: PasswordRecord[]; onChanged: () => void }) => {
  const { token } = useAuth();
  const [revealed, setRevealed] = useState<Record<string, string | undefined>>({});
  const [editing, setEditing] = useState<PasswordRecord | null>(null);
  const [editValues, setEditValues] = useState<{ accountName: string; username: string; password: string }>({ accountName: "", username: "", password: "" });

  const doReveal = async (id: string) => {
    if (!token) return;
    try {
      const { password } = await apiRevealPassword(token, id);
      setRevealed((r) => ({ ...r, [id]: password }));
      setTimeout(() => setRevealed((r) => ({ ...r, [id]: undefined })), 15000); // auto-hide after 15s
    } catch (e: any) {
      toast.error(e.message || "Failed to reveal password");
    }
  };

  const startEdit = (item: PasswordRecord) => {
    setEditing(item);
    setEditValues({ accountName: item.accountName, username: item.username, password: "" });
  };

  const submitEdit = async () => {
    if (!token || !editing) return;
    try {
      await apiUpdatePassword(token, editing.id, {
        accountName: editValues.accountName,
        username: editValues.username,
        ...(editValues.password ? { password: editValues.password } : {}),
      });
      toast.success("Updated");
      setEditing(null);
      onChanged();
    } catch (e: any) {
      toast.error(e.message || "Failed to update");
    }
  };

  const doDelete = async (id: string) => {
    if (!token) return;
    if (!confirm("Delete this entry?")) return;
    try {
      await apiDeletePassword(token, id);
      toast.success("Deleted");
      onChanged();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete");
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Password</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.accountName}</TableCell>
              <TableCell>{item.username}</TableCell>
              <TableCell className="font-mono">
                {revealed[item.id] ? revealed[item.id] : "********"}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="secondary" onClick={() => doReveal(item.id)}>Reveal</Button>
                <Dialog open={editing?.id === item.id} onOpenChange={(open) => !open && setEditing(null)}>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => startEdit(item)}>Edit</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Entry</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                      <div className="grid gap-2">
                        <Label htmlFor="accountName">Account name</Label>
                        <Input id="accountName" value={editValues.accountName} onChange={(e) => setEditValues((v) => ({ ...v, accountName: e.target.value }))} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" value={editValues.username} onChange={(e) => setEditValues((v) => ({ ...v, username: e.target.value }))} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="password">New Password (optional)</Label>
                        <Input id="password" type="password" value={editValues.password} onChange={(e) => setEditValues((v) => ({ ...v, password: e.target.value }))} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={submitEdit}>Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" onClick={() => doDelete(item.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PasswordTable;
