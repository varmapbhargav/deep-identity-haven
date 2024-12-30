import { Identity } from '@semaphore-protocol/identity';
import { generateProof } from '@semaphore-protocol/proof';
import { toast } from 'sonner';

export class ZKPService {
  private identity: Identity | null = null;

  async createIdentity(address: string) {
    try {
      // Create a new identity from the user's address
      this.identity = new Identity(address);
      return this.identity;
    } catch (error) {
      console.error("Failed to create ZK identity:", error);
      toast.error("Failed to create ZK identity");
      throw error;
    }
  }

  async generateProof(signal: string, externalNullifier: string) {
    if (!this.identity) {
      throw new Error("Identity not initialized");
    }

    try {
      // Generate a zero-knowledge proof
      const proof = await generateProof(
        this.identity,
        signal,
        externalNullifier
      );
      return proof;
    } catch (error) {
      console.error("Failed to generate proof:", error);
      toast.error("Failed to generate proof");
      throw error;
    }
  }
}

export const zkpService = new ZKPService();