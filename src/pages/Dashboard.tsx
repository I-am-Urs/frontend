import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { apiGetPasswords, PasswordRecord } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "@/components/LoadingSpinner";
import PasswordTable from "@/components/PasswordTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddPasswordForm from "@/components/AddPasswordForm";

const Dashboard = () => {
  const { token } = useAuth();
  const qc = useQueryClient();
  const { data, isLoading, refetch } = useQuery<PasswordRecord[]>({
    queryKey: ["passwords"],
    queryFn: async () => {
      if (!token) return [];
      return apiGetPasswords(token);
    },
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["passwords"] });
    refetch();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Dashboard – VaultGuard</title>
        <meta name="description" content="Manage your saved passwords securely in VaultGuard." />
        <link rel="canonical" href={window.location.origin + "/dashboard"} />
      </Helmet>
      <Navbar />
      <main className="container flex-1 py-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Add a new password</CardTitle>
          </CardHeader>
          <CardContent>
            <AddPasswordForm onAdded={refresh} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Passwords</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-10"><LoadingSpinner label="Loading passwords" /></div>
            ) : (
              <PasswordTable items={data || []} onChanged={refresh} />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
