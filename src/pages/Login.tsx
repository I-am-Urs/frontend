import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { apiLogin } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

type FormValues = z.infer<typeof schema>;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      const { token } = await apiLogin({ email: values.email, password: values.password });
      if (!token) throw new Error("Token missing in response");
      login(token);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (e: any) {
      toast.error(e.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Login – VaultGuard</title>
        <meta name="description" content="Login to VaultGuard to access your secure password vault." />
        <link rel="canonical" href={window.location.origin + "/login"} />
      </Helmet>
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <h1 className="sr-only">Login to VaultGuard</h1>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Signing in..." : "Login"}</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Login;
