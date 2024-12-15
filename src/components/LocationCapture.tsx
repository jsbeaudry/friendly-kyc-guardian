import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

interface LocationCaptureProps {
  onLocationCaptured: (location: { lat: number; lng: number }) => void;
}

export const LocationCapture = ({ onLocationCaptured }: LocationCaptureProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const captureLocation = () => {
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(newLocation);
        onLocationCaptured(newLocation);
        toast.success("Location captured successfully");
        setIsLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Could not get your location. Please check permissions.");
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    captureLocation();
  }, []);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-kyc-text">Location Verification</h2>
        <p className="text-gray-600 mt-1">
          Please allow access to your location for verification
        </p>
      </div>

      <Button
        onClick={captureLocation}
        disabled={isLoading}
        className="w-full"
      >
        <MapPin className="mr-2 h-4 w-4" />
        {isLoading ? "Getting Location..." : "Capture Location"}
      </Button>

      {location && (
        <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
          <iframe
            title="Location Map"
            width="100%"
            height="200"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng-0.01},${location.lat-0.01},${location.lng+0.01},${location.lat+0.01}&layer=mapnik&marker=${location.lat},${location.lng}`}
            className="bg-[#F2FCE2]"
          />
        </div>
      )}
    </div>
  );
};