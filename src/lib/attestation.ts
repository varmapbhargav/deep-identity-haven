import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Attestation, CreateAttestationParams } from '@/types/attestation';
import { blockchainService } from './blockchain';
import { zkpService } from './zkp';
import { dataSourceConnectors } from './datasource';

export const createAttestation = async (params: CreateAttestationParams): Promise<Attestation> => {
  try {
    // Verify data source if applicable
    if (dataSourceConnectors[params.type]) {
      const isVerified = await dataSourceConnectors[params.type].verify(params.metadata);
      if (!isVerified) {
        throw new Error(`${params.type} verification failed`);
      }
    }

    // Generate ZK proof
    const proof = await zkpService.generateProof(
      JSON.stringify(params),
      params.recipient
    );

    // Store attestation on blockchain
    const txHash = await blockchainService.createAttestation(
      params.recipient,
      params.type,
      proof.toString()
    );

    const attestation: Attestation = {
      id: txHash,
      ...params,
      issuer: window.ethereum?.selectedAddress || '',
      timestamp: new Date().toISOString(),
      status: 'pending',
      proof: proof.toString(),
    };
    
    toast.success('Attestation created successfully');
    return attestation;
  } catch (error) {
    toast.error('Failed to create attestation');
    throw error;
  }
};

export const getAttestations = async (address?: string): Promise<Attestation[]> => {
  try {
    if (!address) return [];
    
    // In a real implementation, you would:
    // 1. Query the blockchain for attestation events
    // 2. Fetch attestation data from IPFS/storage
    // 3. Verify proofs
    // For now, we'll return mock data
    return [];
  } catch (error) {
    toast.error('Failed to fetch attestations');
    throw error;
  }
};

export const verifyAttestation = async (id: string): Promise<boolean> => {
  try {
    // Verify the attestation on the blockchain
    const isValid = await blockchainService.verifyAttestation(id, "proof");
    
    if (isValid) {
      toast.success('Attestation verified successfully');
    } else {
      toast.error('Attestation verification failed');
    }
    
    return isValid;
  } catch (error) {
    toast.error('Failed to verify attestation');
    throw error;
  }
};