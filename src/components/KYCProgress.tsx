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
    <div className="w-full py-6">
      <div className="relative flex justify-between">
        {/* Connecting lines */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
        <div 
          className="absolute top-5 left-0 h-0.5 bg-kyc-success transition-all duration-500 ease-in-out"
          style={{
            width: `${(steps.filter(step => step.completed).length / (steps.length - 1)) * 100}%`
          }}
        />

        {steps.map((step, index) => (
          <div key={index} className="relative flex flex-col items-center group">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                step.completed
                  ? "bg-kyc-success text-white scale-110"
                  : step.current
                  ? "bg-kyc-primary text-white ring-4 ring-blue-100"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {step.completed ? (
                <Check className="w-5 h-5 animate-fadeIn" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </div>
            <span
              className={`mt-3 text-sm font-medium transition-colors duration-300 ${
                step.current 
                  ? "text-kyc-primary"
                  : step.completed
                  ? "text-kyc-success"
                  : "text-gray-500"
              }`}
            >
              {step.title}
            </span>
            {/* Tooltip for current step */}
            {step.current && (
              <div className="absolute -bottom-12 w-max opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-gray-800 text-white text-xs rounded py-1 px-2">
                  Current Step
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};