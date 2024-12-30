import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Attestation, CreateAttestationParams } from "@/types/attestation";
import { getAttestations, createAttestation, verifyAttestation } from "@/lib/attestation";
import { AttestationStats } from "@/components/attestations/AttestationStats";
import { CreateAttestationDialog } from "@/components/attestations/CreateAttestationDialog";
import { AttestationList } from "@/components/attestations/AttestationList";

const Attestations = () => {
  const { address } = useAuth();
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [isCreating, setIsCreating] = useState(false);

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

  const handleCreateAttestation = async (params: CreateAttestationParams) => {
    if (!address) return;

    try {
      setIsCreating(true);
      await createAttestation({
        ...params,
        recipient: address,
      });
      await loadAttestations();
    } catch (error) {
      console.error('Failed to create attestation:', error);
    } finally {
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
          <CreateAttestationDialog
            onCreateAttestation={handleCreateAttestation}
            isCreating={isCreating}
            disabled={!address}
          />
        </div>

        <AttestationStats attestations={attestations} />
        <AttestationList 
          attestations={attestations}
          onVerify={handleVerifyAttestation}
        />
      </motion.div>
    </div>
  );
};

export default Attestations;