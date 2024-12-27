import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Shield, UserCircle, Key, FileCheck, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const { address } = useAuth();

  const handleCreateAttestation = () => {
    toast.info("Creating new attestation...");
  };

  const stats = [
    {
      title: "Identity Status",
      icon: <UserCircle className="w-5 h-5" />,
      value: "Active",
      description: address ? `Connected: ${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected",
    },
    {
      title: "Verified Attestations",
      icon: <FileCheck className="w-5 h-5" />,
      value: "2",
      description: "Successfully verified",
    },
    {
      title: "Pending Requests",
      icon: <Clock className="w-5 h-5" />,
      value: "1",
      description: "Awaiting verification",
    },
    {
      title: "Security Score",
      icon: <Shield className="w-5 h-5" />,
      value: "85%",
      description: "Identity strength",
    },
  ];

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-heading mb-4">Welcome to DIDentity</h1>
          <p className="text-gray-600 mb-8">Please connect your wallet to access your dashboard</p>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold font-heading">My Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Manage your decentralized identity and attestations
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={handleCreateAttestation}
              className="button-gradient"
            >
              Create Attestation
            </Button>
            <Link to="/attestations">
              <Button variant="outline">
                View All Attestations
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass-card">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl flex items-center gap-2">
                    {stat.icon}
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <FileCheck className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium">GitHub Contributor Attestation Verified</p>
                  <p className="text-sm text-gray-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <Clock className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="font-medium">Twitter Account Verification Pending</p>
                  <p className="text-sm text-gray-600">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;