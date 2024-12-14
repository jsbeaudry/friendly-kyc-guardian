import { useState } from "react";
import { KYCProgress } from "@/components/KYCProgress";
import { DocumentUpload } from "@/components/DocumentUpload";
import { LocationCapture } from "@/components/LocationCapture";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Step = "document" | "selfie" | "proof" | "location" | "complete";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>("document");
  const [documentType, setDocumentType] = useState<string>("");
  const [documentImage, setDocumentImage] = useState<string>("");
  const [selfieImage, setSelfieImage] = useState<string>("");
  const [proofImage, setProofImage] = useState<string>("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();

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
    {
      title: "Complete",
      completed: currentStep === "complete",
      current: currentStep === "complete",
    },
  ];

  const handleNext = () => {
    const stepOrder: Step[] = ["document", "selfie", "proof", "location", "complete"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      const nextStep = stepOrder[currentIndex + 1];
      setCurrentStep(nextStep);
      
      if (nextStep === "complete") {
        toast({
          title: "Verification Complete",
          description: "Thank you! Your identity verification has been submitted successfully.",
        });
      }
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

            {currentStep === "complete" && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Verification Submitted
                </h2>
                <p className="text-gray-600">
                  Thank you for completing the verification process. We will review your
                  submission and notify you of the results.
                </p>
              </div>
            )}

            {currentStep !== "complete" && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;