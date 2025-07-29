import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SpinningWheelProps {
  isSpinning: boolean;
  result?: string;
  size?: number;
}

const segments = [
  { label: "₹1", color: "from-green-400 to-green-600", angle: 0 },
  { label: "Try Again", color: "from-gray-400 to-gray-600", angle: 72 },
  { label: "₹5", color: "from-blue-400 to-blue-600", angle: 144 },
  { label: "Bonus", color: "from-orange-400 to-orange-600", angle: 216 },
  { label: "₹10", color: "from-purple-400 to-purple-600", angle: 288 },
];

export default function SpinningWheel({ isSpinning, result, size = 280 }: SpinningWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [finalRotation, setFinalRotation] = useState(0);

  useEffect(() => {
    if (isSpinning) {
      // Generate random rotation between 1800-3600 degrees (5-10 full rotations)
      const randomRotation = Math.floor(Math.random() * 1800) + 1800;
      setFinalRotation(rotation + randomRotation);
    }
  }, [isSpinning, rotation]);

  useEffect(() => {
    if (!isSpinning && result) {
      // Calculate the final position based on result
      let targetAngle = 0;
      switch (result) {
        case 'amount':
          // Could be ₹1, ₹5, or ₹10 - randomly pick one for visual
          const amounts = [0, 144, 288]; // ₹1, ₹5, ₹10
          targetAngle = amounts[Math.floor(Math.random() * amounts.length)];
          break;
        case 'try_again':
          targetAngle = 72;
          break;
        case 'bonus_task':
          targetAngle = 216;
          break;
        default:
          targetAngle = 0;
      }
      
      // Adjust final rotation to land on target
      const baseRotations = Math.floor(finalRotation / 360) * 360;
      setRotation(baseRotations + (360 - targetAngle));
    }
  }, [isSpinning, result, finalRotation]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Wheel Container */}
      <div 
        className="relative rounded-full border-8 border-white shadow-2xl"
        style={{ width: size, height: size }}
      >
        {/* Spinning Wheel */}
        <div
          className={cn(
            "w-full h-full rounded-full relative overflow-hidden transition-transform duration-[4000ms] ease-out spin-wheel-gradient",
            isSpinning && "duration-[4000ms]"
          )}
          style={{
            transform: `rotate(${isSpinning ? finalRotation : rotation}deg)`,
          }}
        >
          {/* Wheel Segments */}
          <div className="absolute inset-0">
            {segments.map((segment, index) => (
              <div
                key={index}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: `rotate(${segment.angle}deg)`,
                  clipPath: `polygon(50% 50%, 100% 0%, 87% 50%, 100% 100%)`,
                }}
              >
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    background: `conic-gradient(from ${segment.angle}deg, transparent ${segment.angle}deg, rgba(255,255,255,0.1) ${segment.angle + 36}deg, transparent ${segment.angle + 72}deg)`,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Segment Labels */}
          {segments.map((segment, index) => (
            <div
              key={`label-${index}`}
              className="absolute w-full h-full flex items-center justify-center pointer-events-none"
              style={{
                transform: `rotate(${segment.angle + 36}deg)`,
              }}
            >
              <div 
                className="text-white font-bold text-sm absolute"
                style={{
                  transform: `translateY(-${size * 0.3}px) rotate(-${segment.angle + 36}deg)`,
                }}
              >
                {segment.label}
              </div>
            </div>
          ))}

          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center border-4 border-gray-200">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Pointer */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
        <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-red-500 drop-shadow-lg"></div>
      </div>

      {/* Spinning Effect Overlay */}
      {isSpinning && (
        <div className="absolute inset-0 rounded-full bg-white bg-opacity-20 animate-pulse"></div>
      )}
    </div>
  );
}
