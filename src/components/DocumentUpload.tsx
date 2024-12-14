import { useState } from "react";
import { Camera } from "./Camera";
import { Button } from "@/components/ui/button";
import { Camera as LucideCamera, Upload } from "lucide-react";
import { toast } from "sonner";

interface DocumentUploadProps {
  onUpload: (file: string) => void;
  title: string;
  description: string;
  isLivenessCheck?: boolean;
}

export const DocumentUpload = ({
  onUpload,
  title,
  description,
  isLivenessCheck = false,
}: DocumentUploadProps) => {
  const [showCamera, setShowCamera] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
        toast.success("Document uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = (image: string) => {
    onUpload(image);
    setShowCamera(false);
    if (!isLivenessCheck) {
      toast.success("Photo captured successfully");
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-kyc-text">{title}</h2>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="outline"
          onClick={() => setShowCamera(true)}
          className="flex-1"
        >
          <LucideCamera className="mr-2 h-4 w-4" />
          {isLivenessCheck ? "Start Verification" : "Take Photo"}
        </Button>
        {!isLivenessCheck && (
          <div className="relative flex-1">
            <Button variant="outline" className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        )}
      </div>

      {showCamera && (
        <Camera
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
          isLivenessCheck={isLivenessCheck}
        />
      )}
    </div>
  );
};