import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateAttestationParams } from "@/types/attestation";

interface CreateAttestationDialogProps {
  onCreateAttestation: (params: CreateAttestationParams) => Promise<void>;
  isCreating: boolean;
  disabled?: boolean;
}

export const CreateAttestationDialog = ({
  onCreateAttestation,
  isCreating,
  disabled
}: CreateAttestationDialogProps) => {
  const [type, setType] = useState("github");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const handleCreate = async () => {
    await onCreateAttestation({
      type: type as any,
      name,
      metadata: { username }
    });
    setType("github");
    setName("");
    setUsername("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="button-gradient"
          disabled={disabled}
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
              value={type}
              onValueChange={setType}
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter attestation name"
            />
          </div>
          {type !== 'custom' && (
            <div className="space-y-2">
              <label>Username</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={`Enter your ${type} username`}
              />
            </div>
          )}
          <Button
            className="w-full button-gradient"
            onClick={handleCreate}
            disabled={isCreating || !name || (!username && type !== 'custom')}
          >
            {isCreating ? "Creating..." : "Create Attestation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};