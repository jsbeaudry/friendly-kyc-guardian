import { useState } from "react";
import { KYCProgress } from "@/components/KYCProgress";
import { DocumentUpload } from "@/components/DocumentUpload";
import { LocationCapture } from "@/components/LocationCapture";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Step = "document" | "selfie" | "proof" | "location";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>("document");
  const [documentType, setDocumentType] = useState<string>("");
  const [documentImage, setDocumentImage] = useState<string>("");
  const [selfieImage, setSelfieImage] = useState<string>("");
  const [proofImage, setProofImage] = useState<string>("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const steps = [
    {
      title: "Document",
      completed: currentStep !== "document" && !!documentImage,
      current: currentStep === "document",
    },
    {
      title: "Selfie",
      completed: currentStep !== "selfie" && !!selfieImage,
      current: currentStep === "selfie",
    },
    {
      title: "Proof",
      completed: currentStep !== "proof" && !!proofImage,
      current: currentStep === "proof",
    },
    {
      title: "Location",
      completed: currentStep !== "location" && !!location,
      current: currentStep === "location",
    },
  ];

  const handleNext = () => {
    const stepOrder: Step[] = ["document", "selfie", "proof", "location"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-lg p-6 animate-fadeIn">
          <h1 className="text-2xl font-bold text-center text-kyc-primary mb-6">
            Identity Verification
          </h1>

          <KYCProgress steps={steps} />

          <div className="mt-8">
            {currentStep === "document" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Document Type
                  </label>
                  <Select onValueChange={setDocumentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="license">Driver's License</SelectItem>
                      <SelectItem value="id">National ID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {documentType && (
                  <DocumentUpload
                    title="Upload Your Document"
                    description="Please upload a clear photo of your document"
                    onUpload={setDocumentImage}
                  />
                )}
              </div>
            )}

            {currentStep === "selfie" && (
              <DocumentUpload
                title="Take a Selfie"
                description="Please take a clear photo of your face"
                onUpload={setSelfieImage}
              />
            )}

            {currentStep === "proof" && (
              <DocumentUpload
                title="Human Verification"
                description="Please follow the on-screen instructions for liveness detection"
                onUpload={setProofImage}
                isLivenessCheck={true}
              />
            )}

            {currentStep === "location" && (
              <LocationCapture onLocationCaptured={setLocation} />
            )}

            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === "document" && !documentImage) ||
                  (currentStep === "selfie" && !selfieImage) ||
                  (currentStep === "proof" && !proofImage) ||
                  (currentStep === "location" && !location)
                }
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;