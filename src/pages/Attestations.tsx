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
import { FileCheck, Clock, Shield, Info, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Attestation } from "@/types/attestation";
import { getAttestations, createAttestation, verifyAttestation } from "@/lib/attestation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Attestations = () => {
  const { address } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newAttestationType, setNewAttestationType] = useState("github");
  const [newAttestationName, setNewAttestationName] = useState("");

  useEffect(() => {
    if (address) {
      loadAttestations();
    }
  }, [address]);

  const loadAttestations = async () => {
    if (!address) return;
    try {
      const data = await getAttestations(address);
      setAttestations(data);
    } catch (error) {
      console.error('Failed to load attestations:', error);
    }
  };

  const handleCreateAttestation = async () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      setIsCreating(true);
      await createAttestation({
        type: newAttestationType as any,
        name: newAttestationName,
        recipient: address,
      });
      await loadAttestations();
      setIsCreating(false);
      setNewAttestationType("github");
      setNewAttestationName("");
    } catch (error) {
      console.error('Failed to create attestation:', error);
      setIsCreating(false);
    }
  };

  const handleVerifyAttestation = async (id: string) => {
    try {
      await verifyAttestation(id);
      await loadAttestations();
    } catch (error) {
      console.error('Failed to verify attestation:', error);
    }
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
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="button-gradient"
                disabled={!address}
              >
                <Plus className="w-4 h-4 mr-2" />
                Request New Attestation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Attestation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label>Type</label>
                  <Select
                    value={newAttestationType}
                    onValueChange={setNewAttestationType}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="github">GitHub</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="discord">Discord</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label>Name</label>
                  <Input
                    value={newAttestationName}
                    onChange={(e) => setNewAttestationName(e.target.value)}
                    placeholder="Enter attestation name"
                  />
                </div>
                <Button
                  className="w-full button-gradient"
                  onClick={handleCreateAttestation}
                  disabled={isCreating || !newAttestationName}
                >
                  {isCreating ? "Creating..." : "Create Attestation"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
                  {attestations.filter((a) => a.status === "verified").length}
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
                  {attestations.filter((a) => a.status === "pending").length}
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
                      <TableHead>Type</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Issuer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttestations.length > 0 ? (
                      filteredAttestations.map((attestation) => (
                        <TableRow key={attestation.id}>
                          <TableCell>
                            {getStatusIcon(attestation.status)}
                          </TableCell>
                          <TableCell className="capitalize">
                            {attestation.type}
                          </TableCell>
                          <TableCell className="font-medium">
                            {attestation.name}
                          </TableCell>
                          <TableCell>
                            {attestation.issuer.slice(0, 6)}...{attestation.issuer.slice(-4)}
                          </TableCell>
                          <TableCell>
                            {new Date(attestation.timestamp).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {attestation.status === 'pending' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerifyAttestation(attestation.id)}
                              >
                                Verify
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
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