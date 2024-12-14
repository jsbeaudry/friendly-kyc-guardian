import { useRef, useState, useCallback, useEffect } from "react";
import { Camera as LucideCamera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CameraProps {
  onCapture: (image: string) => void;
  onClose: () => void;
  isLivenessCheck?: boolean;
}

export const Camera = ({ onCapture, onClose, isLivenessCheck = false }: CameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isPerformingLivenessCheck, setIsPerformingLivenessCheck] = useState(false);
  const [livenessInstructions, setLivenessInstructions] = useState<string>("");

  const startCamera = useCallback(async () => {
    try {
      // Stop any existing stream before starting a new one
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      
      streamRef.current = mediaStream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access camera. Please check permissions.");
      onClose();
    }
  }, [onClose]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const image = canvas.toDataURL("image/jpeg");
        onCapture(image);
        stopCamera();
      }
    }
  }, [onCapture, stopCamera]);

  const performLivenessCheck = useCallback(async () => {
    if (!isLivenessCheck) return;

    const instructions = [
      "Please blink your eyes",
      "Please turn your head slightly to the right",
      "Please turn your head slightly to the left",
      "Please smile",
    ];

    setIsPerformingLivenessCheck(true);

    for (const instruction of instructions) {
      setLivenessInstructions(instruction);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      if (!streamRef.current) {
        break; // Stop if camera was closed
      }
    }

    if (streamRef.current) {
      setIsPerformingLivenessCheck(false);
      setLivenessInstructions("");
      toast.success("Liveness check completed successfully");
      capturePhoto();
    }
  }, [isLivenessCheck, capturePhoto]);

  useEffect(() => {
    let mounted = true;

    const initCamera = async () => {
      if (mounted) {
        await startCamera();
        if (isLivenessCheck && mounted) {
          performLivenessCheck();
        }
      }
    };

    initCamera();

    return () => {
      mounted = false;
      stopCamera();
    };
  }, [startCamera, stopCamera, isLivenessCheck, performLivenessCheck]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {isLivenessCheck ? "Liveness Check" : "Take Photo"}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              stopCamera();
              onClose();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              playsInline
              className="w-full rounded-lg"
            />
            {livenessInstructions && (
              <div className="absolute bottom-4 left-0 right-0 text-center bg-black bg-opacity-50 text-white py-2">
                {livenessInstructions}
              </div>
            )}
          </div>

          {!isLivenessCheck && !isPerformingLivenessCheck && (
            <Button className="w-full" onClick={capturePhoto}>
              <LucideCamera className="mr-2 h-4 w-4" />
              Capture Photo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};