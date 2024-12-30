import { Identity } from '@semaphore-protocol/identity';
import { generateProof } from '@semaphore-protocol/proof';
import { toast } from 'sonner';

// Constants for Semaphore
const GROUP_ID = 1; // Your group ID
const TREE_DEPTH = 20; // Default tree depth

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
      // Generate a zero-knowledge proof with required parameters
      const proof = await generateProof(
        this.identity,
        GROUP_ID,
        externalNullifier,
        signal,
        {
          zkeyFilePath: '/semaphore.zkey',
          wasmFilePath: '/semaphore.wasm'
        }
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