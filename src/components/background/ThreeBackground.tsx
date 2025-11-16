"use client";

export function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-blue-50 animate-pulse"></div>

      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl floating-animation"></div>
      <div
        className="absolute top-3/4 right-1/4 w-48 h-48 bg-cyan-200/20 rounded-full blur-2xl floating-animation"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-indigo-200/20 rounded-full blur-3xl floating-animation"
        style={{ animationDelay: "4s" }}
      ></div>

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-3"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, hsl(200 90% 60%) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, hsl(180 50% 70%) 1px, transparent 1px)
          `,
          backgroundSize: "120px 120px",
          animation: "gridFloat 30s linear infinite",
        }}
      ></div>

      {/* Light Rays */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-0 w-0.5 h-64 bg-gradient-to-b from-blue-300/15 to-transparent transform rotate-12"></div>
        <div className="absolute top-1/2 right-0 w-0.5 h-48 bg-gradient-to-b from-cyan-300/15 to-transparent transform -rotate-12"></div>
        <div className="absolute bottom-1/4 left-1/2 w-0.5 h-56 bg-gradient-to-b from-indigo-300/15 to-transparent transform rotate-45"></div>
      </div>
    </div>
  );
}
