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
  isPassport?: boolean;
}

export const DocumentUpload = ({
  onUpload,
  title,
  description,
  isLivenessCheck = false,
  isPassport = false,
}: DocumentUploadProps) => {
  const [showCamera, setShowCamera] = useState(false);
  const [frontImage, setFrontImage] = useState<string>("");
  const [backImage, setBackImage] = useState<string>("");
  const [captureBack, setCaptureBack] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isPassport && !frontImage) {
          setFrontImage(reader.result as string);
          onUpload(reader.result as string);
          toast.success("Front passport page uploaded successfully");
        } else if (isPassport) {
          setBackImage(reader.result as string);
          onUpload(reader.result as string);
          toast.success("Back passport page uploaded successfully");
        } else {
          onUpload(reader.result as string);
          toast.success("Document uploaded successfully");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = (image: string) => {
    if (isPassport && !frontImage) {
      setFrontImage(image);
      onUpload(image);
      setShowCamera(false);
      toast.success("Front passport page captured successfully");
    } else if (isPassport && !backImage) {
      setBackImage(image);
      onUpload(image);
      setShowCamera(false);
      setCaptureBack(false);
      toast.success("Back passport page captured successfully");
    } else {
      onUpload(image);
      setShowCamera(false);
      if (!isLivenessCheck) {
        toast.success("Photo captured successfully");
      }
    }
  };

  const renderThumbnail = (image: string, label: string) => {
    if (!image) return null;
    return (
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-1">{label}:</p>
        <img src={image} alt={label} className="w-32 h-20 object-cover rounded-lg border border-gray-200" />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-kyc-text">{title}</h2>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>

      {isPassport && (
        <div className="flex flex-col space-y-2">
          {renderThumbnail(frontImage, "Front Page")}
          {renderThumbnail(backImage, "Back Page")}
        </div>
      )}

      {(!isPassport || !backImage) && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => {
              if (isPassport && frontImage) {
                setCaptureBack(true);
              }
              setShowCamera(true);
            }}
            className="flex-1"
          >
            <LucideCamera className="mr-2 h-4 w-4" />
            {isLivenessCheck
              ? "Start Verification"
              : isPassport && frontImage
              ? "Capture Back Page"
              : isPassport
              ? "Capture Front Page"
              : "Take Photo"}
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
      )}

      {showCamera && (
        <Camera
          onCapture={handleCapture}
          onClose={() => {
            setShowCamera(false);
            setCaptureBack(false);
          }}
          isLivenessCheck={isLivenessCheck}
        />
      )}
    </div>
  );
};