import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Shield, UserCircle, Key } from "lucide-react";

const Dashboard = () => {
  const { address } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-heading">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Manage your decentralized identity and attestations
            </p>
          </div>
          <Button className="button-gradient">Create New Attestation</Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl flex items-center gap-2">
                <UserCircle className="w-5 h-5" />
                Identity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 break-all">{address}</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Active Attestations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl flex items-center gap-2">
                <Key className="w-5 h-5" />
                Verification Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;