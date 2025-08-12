import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { apiAddPassword } from "@/lib/api";
import { toast } from "sonner";

const schema = z.object({
  accountName: z.string().min(2, "Account name is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

const AddPasswordForm = ({ onAdded }: { onAdded: () => void }) => {
  const { token } = useAuth();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      if (!token) throw new Error("Not authenticated");
      await apiAddPassword(token, { accountName: values.accountName, username: values.username, password: values.password });
      toast.success("Password added");
      reset();
      onAdded();
    } catch (e: any) {
      toast.error(e.message || "Failed to add password");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="accountName">Account name</Label>
        <Input id="accountName" {...register("accountName")} placeholder="e.g., Gmail" />
        {errors.accountName && <p className="text-sm text-destructive">{errors.accountName.message}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" {...register("username")} placeholder="jane.doe" />
        {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Adding..." : "Add Password"}</Button>
    </form>
  );
};

export default AddPasswordForm;
