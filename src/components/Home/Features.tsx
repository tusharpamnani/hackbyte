"use client";

import React from "react";

const features = [
  "No more boring tutorials — learn by building real projects.",
  "Made for beginners — smooth, zero-overwhelm experience.",
  "Access your roadmap from anywhere, anytime.",
  "Every user gets a personalized project journey.",
  "Learn Git, automate workflows, and actually enjoy it.",
];

const FeaturesSection = () => {
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 bg-white text-gray-900">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 md:mb-16 text-center tracking-tight">
          Why GitSmart hits <span className="text-orange-500">different</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-start gap-4 p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white group"
            >
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold text-lg group-hover:bg-orange-600 transition-colors">
                {index + 1}
              </div>
              <p className="text-base sm:text-lg font-medium leading-relaxed text-gray-800">
                {feature}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;