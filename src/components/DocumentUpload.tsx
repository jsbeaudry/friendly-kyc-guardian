import { useState } from "react";
import { Camera } from "./Camera";
import { Button } from "@/components/ui/button";
import { Camera as LucideCamera, Upload } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

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
  const [livenessProgress, setLivenessProgress] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string>("");

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
    if (isLivenessCheck) {
      setCapturedImage(image);
      // Simulate liveness check progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setLivenessProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          onUpload(image);
          setShowCamera(false);
          toast.success("Liveness check completed successfully");
        }
      }, 500);
    } else if (isPassport && !frontImage) {
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
      toast.success("Photo captured successfully");
    }
  };

  const renderThumbnail = (image: string, label: string) => {
    if (!image) return null;
    return (
      <div className="inline-block mr-4">
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        <img src={image} alt={label} className="w-24 h-16 object-cover rounded-lg border border-gray-200" />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-kyc-text">{title}</h2>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>

      {isLivenessCheck && livenessProgress > 0 && (
        <div className="relative w-48 h-48 mx-auto">
          <div className="absolute inset-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="92"
                fill="none"
                stroke="#EFF6FF"
                strokeWidth="8"
              />
              <circle
                cx="96"
                cy="96"
                r="92"
                fill="none"
                stroke="#1E40AF"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 92}`}
                strokeDashoffset={`${2 * Math.PI * 92 * (1 - livenessProgress / 100)}`}
                className="transition-all duration-500"
              />
            </svg>
          </div>
          {capturedImage && (
            <div className="absolute inset-2 rounded-full overflow-hidden">
              <img
                src={capturedImage}
                alt="Captured face"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-kyc-primary">
              {livenessProgress}%
            </span>
          </div>
        </div>
      )}

      {isPassport && (
        <div className="flex flex-wrap gap-4 justify-center">
          {renderThumbnail(frontImage, "Front Page")}
          {renderThumbnail(backImage, "Back Page")}
        </div>
      )}

      {(!isPassport || !backImage) && !livenessProgress && (
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