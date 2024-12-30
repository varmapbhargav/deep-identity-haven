import { ethers } from 'ethers';
import { toast } from 'sonner';

// Simple ABI for attestation storage
const ATTESTATION_ABI = [
  "event AttestationCreated(bytes32 indexed id, address indexed issuer, address indexed recipient, string attestationType, bytes32 zkProof)",
  "function createAttestation(address recipient, string calldata attestationType, bytes32 zkProof) external returns (bytes32)",
  "function verifyAttestation(bytes32 id, bytes32 zkProof) external view returns (bool)"
];

// This would be your deployed contract address
const ATTESTATION_CONTRACT_ADDRESS = "0x..."; // Replace with actual contract address

export class BlockchainService {
  private provider: ethers.BrowserProvider;
  private contract: ethers.Contract | null = null;

  constructor() {
    if (window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    } else {
      throw new Error("Ethereum provider not found");
    }
  }

  async connect() {
    try {
      const signer = await this.provider.getSigner();
      this.contract = new ethers.Contract(
        ATTESTATION_CONTRACT_ADDRESS,
        ATTESTATION_ABI,
        signer
      );
      return true;
    } catch (error) {
      console.error("Failed to connect to blockchain:", error);
      toast.error("Failed to connect to blockchain");
      return false;
    }
  }

  async createAttestation(recipient: string, type: string, proof: string) {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      const tx = await this.contract.createAttestation(
        recipient,
        type,
        ethers.id(proof)
      );
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error("Failed to create attestation:", error);
      throw error;
    }
  }

  async verifyAttestation(id: string, proof: string) {
    if (!this.contract) throw new Error("Contract not initialized");
    
    try {
      return await this.contract.verifyAttestation(
        ethers.id(id),
        ethers.id(proof)
      );
    } catch (error) {
      console.error("Failed to verify attestation:", error);
      throw error;
    }
  }
}

export const blockchainService = new BlockchainService();