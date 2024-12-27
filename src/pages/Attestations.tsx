import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { FileCheck, Clock, Shield, Info } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Attestation {
  id: string;
  name: string;
  issuer: string;
  timestamp: string;
  status: "pending" | "verified" | "rejected";
}

const Attestations = () => {
  const { address } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [attestations] = useState<Attestation[]>([
    {
      id: "1",
      name: "GitHub Contributor",
      issuer: "GitHub Attestation Service",
      timestamp: "2024-02-20",
      status: "verified",
    },
    {
      id: "2",
      name: "Twitter Account Holder",
      issuer: "Twitter Verification",
      timestamp: "2024-02-19",
      status: "pending",
    },
  ]);

  const handleRequestAttestation = () => {
    toast.info("Attestation request feature coming soon!");
  };

  const filteredAttestations = attestations.filter(
    (attestation) =>
      attestation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attestation.issuer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <FileCheck className="w-5 h-5 text-green-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "rejected":
        return <Info className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

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
            <h1 className="text-3xl font-bold font-heading">Attestations</h1>
            <p className="text-gray-600 mt-2">
              View and manage your attestations
            </p>
          </div>
          <Button
            onClick={handleRequestAttestation}
            className="button-gradient"
            disabled={!address}
          >
            Request New Attestation
          </Button>
        </div>

        <div className="grid gap-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5" />
                  Verified Attestations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {
                    attestations.filter((a) => a.status === "verified").length
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Pending Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {
                    attestations.filter((a) => a.status === "pending").length
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Total Attestations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{attestations.length}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Your Attestations</CardTitle>
              <div className="mt-4">
                <Input
                  placeholder="Search attestations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Issuer</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttestations.length > 0 ? (
                      filteredAttestations.map((attestation) => (
                        <TableRow key={attestation.id}>
                          <TableCell>
                            {getStatusIcon(attestation.status)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {attestation.name}
                          </TableCell>
                          <TableCell>{attestation.issuer}</TableCell>
                          <TableCell>{attestation.timestamp}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-gray-500"
                        >
                          No attestations found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Attestations;