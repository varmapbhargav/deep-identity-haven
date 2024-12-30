import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck, Clock, Shield } from "lucide-react";
import { Attestation } from "@/types/attestation";

interface AttestationStatsProps {
  attestations: Attestation[];
}

export const AttestationStats = ({ attestations }: AttestationStatsProps) => {
  const verifiedCount = attestations.filter(a => a.status === "verified").length;
  const pendingCount = attestations.filter(a => a.status === "pending").length;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5" />
            Verified Attestations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{verifiedCount}</p>
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
          <p className="text-2xl font-bold">{pendingCount}</p>
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
  );
};