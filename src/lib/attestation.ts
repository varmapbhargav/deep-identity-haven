import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Attestation, CreateAttestationParams } from '@/types/attestation';
import { blockchainService } from './blockchain';
import { zkpService } from './zkp';
import { dataSourceConnectors } from './datasource';

// In-memory storage for demo purposes
let attestations: Attestation[] = [];

export const createAttestation = async (params: CreateAttestationParams): Promise<Attestation> => {
  try {
    // Initialize blockchain service
    await blockchainService.initialize();

    // Verify data source if applicable
    if (dataSourceConnectors[params.type]) {
      const isVerified = await dataSourceConnectors[params.type].verify(params.metadata);
      if (!isVerified) {
        throw new Error(`${params.type} verification failed`);
      }
    }

    // Get current wallet address
    const accounts = await window.ethereum?.request({
      method: 'eth_accounts'
    });
    const currentAddress = accounts?.[0];
    
    if (!currentAddress) {
      throw new Error('No wallet connected');
    }

    // Create ZK identity if not exists
    await zkpService.createIdentity(currentAddress);

    // Generate mock proof for demo
    const proof = "mock_proof_" + Date.now();

    // Store attestation on blockchain
    const txHash = await blockchainService.createAttestation(
      params.recipient,
      params.type,
      proof
    );

    const attestation: Attestation = {
      id: txHash,
      type: params.type,
      name: params.name,
      issuer: currentAddress,
      recipient: params.recipient,
      timestamp: new Date().toISOString(),
      status: 'pending',
      metadata: params.metadata,
      proof: proof,
    };

    // Store in memory for demo
    attestations.push(attestation);
    
    toast.success('Attestation created successfully');
    return attestation;
  } catch (error) {
    console.error('Failed to create attestation:', error);
    toast.error('Failed to create attestation');
    throw error;
  }
};

export const getAttestations = async (address?: string): Promise<Attestation[]> => {
  try {
    if (!address) return [];
    
    // Filter attestations for the given address
    return attestations.filter(
      a => a.recipient.toLowerCase() === address.toLowerCase() ||
           a.issuer.toLowerCase() === address.toLowerCase()
    );
  } catch (error) {
    console.error('Failed to fetch attestations:', error);
    toast.error('Failed to fetch attestations');
    throw error;
  }
};

export const verifyAttestation = async (id: string): Promise<boolean> => {
  try {
    const attestation = attestations.find(a => a.id === id);
    if (!attestation) {
      throw new Error('Attestation not found');
    }

    // Verify the attestation
    const isValid = await blockchainService.verifyAttestation(id, attestation.proof || '');
    
    if (isValid) {
      // Update attestation status
      attestation.status = 'verified';
      toast.success('Attestation verified successfully');
    } else {
      attestation.status = 'rejected';
      toast.error('Attestation verification failed');
    }
    
    return isValid;
  } catch (error) {
    console.error('Failed to verify attestation:', error);
    toast.error('Failed to verify attestation');
    throw error;
  }
};