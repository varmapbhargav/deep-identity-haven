export type AttestationType = 'github' | 'twitter' | 'discord' | 'custom';

export type AttestationStatus = 'pending' | 'verified' | 'rejected';

export interface Attestation {
  id: string;
  type: AttestationType;
  name: string;
  issuer: string;
  recipient: string;
  timestamp: string;
  status: AttestationStatus;
  metadata?: Record<string, any>;
  proof?: string;
}

export interface CreateAttestationParams {
  type: AttestationType;
  name: string;
  recipient: string;
  metadata?: Record<string, any>;
}