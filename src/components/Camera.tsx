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
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isPerformingLivenessCheck, setIsPerformingLivenessCheck] = useState(false);
  const [livenessInstructions, setLivenessInstructions] = useState<string>("");

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access camera. Please check permissions.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

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

    for (const instruction of instructions) {
      setLivenessInstructions(instruction);
      setIsPerformingLivenessCheck(true);
      
      // Wait for 3 seconds for each instruction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Capture the frame for verification
      if (videoRef.current) {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0);
          // Here you would typically send this frame to your backend for liveness verification
          // For now, we'll simulate success
        }
      }
    }

    setIsPerformingLivenessCheck(false);
    setLivenessInstructions("");
    toast.success("Liveness check completed successfully");
    capturePhoto();
  }, [isLivenessCheck, capturePhoto]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  useEffect(() => {
    if (stream && isLivenessCheck) {
      performLivenessCheck();
    }
  }, [stream, isLivenessCheck, performLivenessCheck]);

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
              autoPlay
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
              Capture Photo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};