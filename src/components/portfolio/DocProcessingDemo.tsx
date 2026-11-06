import React, { useState } from 'react';
import { FileText, CheckCircle2, RefreshCw, Eye, FileCode, Check } from 'lucide-react';

interface SampleDoc {
  id: string;
  name: string;
  type: string;
  size: string;
  extractedJSON: Record<string, unknown>;
  fieldsExtracted: number;
  confidence: string;
}

const SAMPLE_DOCS: SampleDoc[] = [
  {
    id: "inv-2025-089",
    name: "Enterprise_Cloud_Invoice_2025.pdf",
    type: "PDF Invoice",
    size: "245 KB",
    fieldsExtracted: 12,
    confidence: "99.4%",
    extractedJSON: {
      documentType: "Commercial Invoice",
      invoiceNumber: "INV-2025-89412",
      issueDate: "2025-10-14",
      dueDate: "2025-11-14",
      vendor: {
        name: "Acme Cloud Systems Inc.",
        taxId: "US-984120341",
        address: "700 Innovation Way, San Jose, CA"
      },
      customer: {
        name: "Orbit Tech Solutions",
        accountRef: "ACC-88341"
      },
      financialSummary: {
        currency: "USD",
        subtotal: 4850.00,
        taxAmount: 436.50,
        totalAmount: 5286.50
      },
      lineItems: [
        { sku: "CLD-K8S-01", description: "Managed Kubernetes Cluster", qty: 2, unitPrice: 1800.00, lineTotal: 3600.00 },
        { sku: "STOR-S3-HIGH", description: "High-IOPS Block Storage 10TB", qty: 1, unitPrice: 1250.00, lineTotal: 1250.00 }
      ],
      validationStatus: "VERIFIED_VALID"
    }
  },
  {
    id: "tech-spec-042",
    name: "Satellite_Telemetry_Specification.pdf",
    type: "Technical Spec",
    size: "1.2 MB",
    fieldsExtracted: 18,
    confidence: "98.7%",
    extractedJSON: {
      documentType: "Engineering Specification",
      systemName: "ORBIT-SAT-COMM-V3",
      author: "Badri Narayanan",
      revision: "2.4.1",
      operatingFrequency: "14.25 GHz (Ku-Band)",
      powerOutput: "450W Solar Thermal",
      subsystems: [
        { id: "SYS-COMM", status: "NOMINAL", redundant: true },
        { id: "SYS-[#SOLAR-WING]", status: "DEPLOYED", panelEfficiency: "32.4%" }
      ],
      schemaValid: true
    }
  }
];

export const DocProcessingDemo: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<SampleDoc>(SAMPLE_DOCS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelectDoc = (doc: SampleDoc) => {
    setIsProcessing(true);
    setSelectedDoc(doc);
    setTimeout(() => {
      setIsProcessing(false);
    }, 400);
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(selectedDoc.extractedJSON, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#030407] border border-white/10 rounded-xl p-5 space-y-6 text-[#F3F1EB]">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101927] border border-white/10 p-4 rounded-xl">
        <div>
          <div className="text-xs font-mono text-[#D9A441] font-semibold">FLAGSHIP PLATFORM PROTOTYPE</div>
          <div className="text-sm font-bold font-heading text-[#F3F1EB] mt-0.5">Automated Intelligent Schema Extraction</div>
        </div>

        <div className="flex items-center gap-2">
          {SAMPLE_DOCS.map(doc => (
            <button
              key={doc.id}
              onClick={() => handleSelectDoc(doc)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                selectedDoc.id === doc.id
                  ? 'bg-[#FF6A00] text-[#030407] font-bold shadow-md'
                  : 'bg-[#080C13] text-[#A5AAB2] hover:text-[#F3F1EB] border border-white/10'
              }`}
            >
              {doc.type}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Document View */}
        <div className="bg-[#101927] border border-white/10 rounded-xl p-4 flex flex-col space-y-4">
          <div className="flex items-center justify-between text-xs font-mono border-b border-white/10 pb-2">
            <span className="text-[#A5AAB2] flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#D9A441]" />
              <span>{selectedDoc.name}</span>
            </span>
            <span className="text-[#D9A441]">{selectedDoc.size}</span>
          </div>

          <div className="relative aspect-[4/3] bg-[#080C13] border border-white/10 rounded-lg p-5 flex flex-col justify-between overflow-hidden shadow-inner">
            
            <div className="absolute top-4 left-4 border border-[#FF6A00] bg-[#FF6A00]/10 px-2 py-1 text-[10px] font-mono text-[#FF9D42] rounded">
              BOX_01: INVOICE_HEADER
            </div>

            <div className="absolute top-16 right-4 border border-emerald-400 bg-emerald-400/10 px-2 py-1 text-[10px] font-mono text-emerald-400 rounded">
              BOX_02: TOTAL_AMOUNT = $5,286.50
            </div>

            <div className="absolute bottom-12 left-4 right-4 border border-[#D9A441] bg-[#D9A441]/10 p-2 text-[10px] font-mono text-[#D9A441] rounded">
              BOX_03: LINE_ITEMS_TABLE (2 ROWS PARSED)
            </div>

            <div className="space-y-3 pt-6 opacity-75">
              <div className="h-3 bg-white/20 rounded w-1/3" />
              <div className="h-2 bg-[#A5AAB2]/20 rounded w-2/3" />
              <div className="h-2 bg-[#A5AAB2]/20 rounded w-1/2" />
              <div className="h-16 bg-[#101927] rounded border border-white/5 mt-6" />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-[#A5AAB2] z-10 pt-2 border-t border-white/10">
              <span>OCR BOUNDING BOXES: 14 DETECTED</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> CONFIDENCE: {selectedDoc.confidence}
              </span>
            </div>

          </div>

          <div className="flex items-center justify-between text-xs font-mono text-[#A5AAB2]">
            <span>FIELDS EXTRACTED: <strong className="text-[#F3F1EB]">{selectedDoc.fieldsExtracted}</strong></span>
            <span className="text-emerald-400 font-semibold">SCHEMA VALIDATED</span>
          </div>
        </div>

        {/* Right: Extracted JSON */}
        <div className="bg-[#101927] border border-white/10 rounded-xl p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between text-xs font-mono border-b border-white/10 pb-2">
            <span className="text-[#D9A441] font-semibold flex items-center gap-1.5">
              <FileCode className="w-4 h-4" />
              <span>STRUCTURED JSON OUTPUT</span>
            </span>

            <button
              onClick={handleCopyJSON}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono bg-[#080C13] hover:bg-[#17191D] border border-white/10 rounded text-[#D9A441] transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Eye className="w-3 h-3" />}
              <span>{copied ? 'COPIED' : 'COPY JSON'}</span>
            </button>
          </div>

          <div className="relative flex-1 bg-[#030407] border border-white/10 rounded-lg p-4 font-mono text-xs overflow-x-auto min-h-[260px] max-h-[320px]">
            {isProcessing ? (
              <div className="absolute inset-0 bg-[#030407]/90 flex items-center justify-center gap-2 text-[#FF6A00]">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Parsing Document Structure...</span>
              </div>
            ) : (
              <pre className="text-emerald-300 leading-relaxed">
                {JSON.stringify(selectedDoc.extractedJSON, null, 2)}
              </pre>
            )}
          </div>

          <div className="text-[11px] font-mono text-[#A5AAB2] flex items-center justify-between">
            <span>VALIDATION ENGINE: ZOD + TYPE SAFETY</span>
            <span className="text-[#D9A441]">LATENCY: 340ms</span>
          </div>
        </div>

      </div>
    </div>
  );
};
