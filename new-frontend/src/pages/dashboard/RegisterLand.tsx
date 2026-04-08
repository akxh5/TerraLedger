import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { Upload, CheckCircle, Copy, Loader2, MapPin } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { landApi } from "@/lib/api/land";
import { useTransaction } from "@/components/TransactionProvider";
import GlassInput from "@/components/GlassInput";
import LiquidGlassButton from "@/components/LiquidGlassButton";
import LiquidGlassCard from "@/components/LiquidGlassCard";
import MapPicker from "@/components/MapPicker";

const RegisterLand = () => {
  const { addTx, updateTx } = useTransaction();
  const [formData, setFormData] = useState({
    landId: '',
    ownerName: '',
    location: '',
    area: '',
    documentHash: '',
    latitude: '',
    longitude: '',
    geoJsonBoundary: '',
    jurisdiction: '',
    registryOffice: '',
    legalDocRef: '',
    landClassification: '',
    citizenId: '',
    notaryId: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const registerMutation = useMutation({
    mutationFn: landApi.registerLand,
    onMutate: () => {
      const txId = Date.now().toString();
      addTx(txId, "Land Record Minting");
      return { txId };
    },
    onSuccess: (data, _, context) => {
      const hash = typeof data === 'string' && data.includes('hash: ') ? data.split('hash: ')[1] : data?.hash || data?.transactionHash || '0x...';
      setTxHash(hash);
      updateTx(context.txId, 'confirmed', hash);
      toast.success("Land record minted successfully");
      setFormData({ landId: '', ownerName: '', location: '', area: '', documentHash: '', latitude: '', longitude: '', geoJsonBoundary: '', jurisdiction: '', registryOffice: '', legalDocRef: '', landClassification: '', citizenId: '', notaryId: '' });
      setFile(null);
      setIsVerified(false);
    },
    onError: (error: any, _, context) => {
      updateTx(context!.txId, 'failed');
      toast.error(error.response?.data?.message || error.message || 'Failed to register land.');
    }
  });

  const verifyMutation = useMutation({
    mutationFn: landApi.verifyIdentity,
    onSuccess: (data) => {
      if(data?.verified) {
        setIsVerified(true);
        toast.success('Identity verified via KYC Provider!');
      } else {
        toast.error('Identity verification failed.');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message || 'Identity verification failed.');
    }
  });

  const handleVerify = () => {
    if (!formData.citizenId) {
      toast.error("Citizen ID required for verification.");
      return;
    }
    verifyMutation.mutate({ citizenId: formData.citizenId });
  };

  const handleLocationSelect = (data: any) => {
    setFormData(prev => ({
      ...prev,
      latitude: data?.lat?.toString() || '',
      longitude: data?.lng?.toString() || '',
      geoJsonBoundary: data?.geoJson || ''
    }));
    toast.success(`Boundary captured!`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setIsUploading(true);
    const toastId = toast.loading('Pinning document to IPFS...');
    try {
      const result = await landApi.uploadDocument(selectedFile);
      setFormData(prev => ({ ...prev, documentHash: result?.cid || '' }));
      toast.success('Document pinned to IPFS', { id: toastId });
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'IPFS upload failed', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.landId || !formData.ownerName) {
      toast.error('Please fill required fields.');
      return;
    }
    if (!isVerified) {
      toast.error('Please verify identity first.');
      return;
    }
    registerMutation.mutate(formData);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <motion.div {...fadeUp(0.1)} className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Register Land</h1>
        <p className="text-muted-foreground">Enter property details to mint a new land record on the ledger.</p>
      </div>

      <LiquidGlassCard className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassInput
              id="landId"
              label="Land ID / Parcel Number *"
              placeholder="e.g. LND-2026-001"
              value={formData.landId}
              onChange={handleChange}
              required
            />
            <GlassInput
              id="ownerName"
              label="Initial Owner Name *"
              placeholder="Full legal name"
              value={formData.ownerName}
              onChange={handleChange}
              required
            />
          </div>

          <GlassInput
            id="location"
            label="Location / Address"
            placeholder="123 Example Street, City"
            value={formData.location}
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassInput
              id="area"
              label="Area (sq meters)"
              type="number"
              placeholder="e.g. 500"
              value={formData.area}
              onChange={handleChange}
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80 ml-1">Document Upload</label>
              <div className="relative group">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-dashed border-white/20 bg-white/5 text-white/60 cursor-pointer group-hover:bg-white/10 group-hover:border-primary/50 transition-all text-sm"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  ) : (
                    <Upload className="w-4 h-4 group-hover:text-primary" />
                  )}
                  {file ? file.name.substring(0, 20) + '...' : 'Upload Property Deed'}
                </label>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 space-y-6">
            <h3 className="text-lg font-semibold">Identity Verification</h3>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <GlassInput
                id="citizenId"
                label="Citizen Identity / National ID"
                placeholder="Enter ID for KYC"
                className="flex-1"
                value={formData.citizenId}
                onChange={handleChange}
              />
              <LiquidGlassButton 
                type="button" 
                onClick={handleVerify} 
                disabled={verifyMutation.isPending || isVerified}
                variant={isVerified ? "primary" : "secondary"}
                className="mb-0.5"
              >
                {isVerified ? '✓ Identity Verified' : (verifyMutation.isPending ? 'Verifying...' : 'Verify Identity')}
              </LiquidGlassButton>
            </div>
            <GlassInput
              id="notaryId"
              label="Notary Public ID (Optional)"
              placeholder="e.g. NOT-8899"
              value={formData.notaryId}
              onChange={handleChange}
            />
          </div>

          <div className="pt-6 border-t border-white/5 space-y-6">
            <h3 className="text-lg font-semibold">Compliance & Regulatory Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassInput
                id="jurisdiction"
                label="Jurisdiction"
                placeholder="e.g. State of California"
                value={formData.jurisdiction}
                onChange={handleChange}
              />
              <GlassInput
                id="registryOffice"
                label="Registry Office"
                placeholder="e.g. County Clerk Office"
                value={formData.registryOffice}
                onChange={handleChange}
              />
              <GlassInput
                id="legalDocRef"
                label="Legal Document Reference"
                placeholder="e.g. Book 123, Page 45"
                value={formData.legalDocRef}
                onChange={handleChange}
              />
              <GlassInput
                id="landClassification"
                label="Land Classification"
                placeholder="e.g. Commercial / Residential"
                value={formData.landClassification}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-white/80 ml-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Select Parcel Location
            </label>
            <MapPicker onLocationSelect={handleLocationSelect} />
            <div className="grid grid-cols-2 gap-4">
              <GlassInput
                id="latitude"
                label="Latitude"
                value={formData.latitude}
                readOnly
                placeholder="Click map"
              />
              <GlassInput
                id="longitude"
                label="Longitude"
                value={formData.longitude}
                readOnly
                placeholder="Click map"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <LiquidGlassButton 
              type="submit" 
              disabled={registerMutation.isPending || isUploading || !isVerified} 
              className={`w-full py-4 font-bold text-lg ${!isVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {registerMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Broadcasting to Ledger...
                </span>
              ) : 'MINT LAND RECORD'}
            </LiquidGlassButton>
          </div>
        </form>
      </LiquidGlassCard>

      {txHash && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <LiquidGlassCard className="border-primary/20 bg-primary/5 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold">Registration Confirmed</h3>
                <p className="text-sm text-muted-foreground mb-3">Transaction successfully mined and added to block.</p>
                <div className="flex items-center gap-2 bg-black/40 p-2 rounded-lg border border-white/5 font-mono text-xs text-muted-foreground">
                  <span className="truncate">{txHash}</span>
                  <button onClick={() => copyToClipboard(txHash)} className="p-1 hover:text-primary transition-colors">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </LiquidGlassCard>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RegisterLand;
