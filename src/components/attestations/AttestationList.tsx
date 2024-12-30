import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileCheck, Clock, Info } from "lucide-react";
import { Attestation } from "@/types/attestation";
import { useState } from "react";

interface AttestationListProps {
  attestations: Attestation[];
  onVerify: (id: string) => Promise<void>;
}

export const AttestationList = ({ attestations, onVerify }: AttestationListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

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
                          onClick={() => onVerify(attestation.id)}
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
  );
};