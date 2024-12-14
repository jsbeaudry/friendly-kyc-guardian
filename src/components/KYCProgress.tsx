import { Check, Circle } from "lucide-react";

interface Step {
  title: string;
  completed: boolean;
  current: boolean;
}

interface KYCProgressProps {
  steps: Step[];
}

export const KYCProgress = ({ steps }: KYCProgressProps) => {
  return (
    <div className="w-full py-4">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step.completed
                  ? "bg-kyc-success text-white"
                  : step.current
                  ? "bg-kyc-primary text-white"
                  : "bg-gray-200"
              }`}
            >
              {step.completed ? (
                <Check className="w-5 h-5" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </div>
            <span
              className={`mt-2 text-sm ${
                step.current ? "text-kyc-primary font-medium" : "text-gray-500"
              }`}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};