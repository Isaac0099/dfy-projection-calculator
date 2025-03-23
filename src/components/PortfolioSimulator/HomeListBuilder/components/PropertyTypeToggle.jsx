// // PropertyTypeToggle.jsx

"use client";
import React from "react";
import { Switch } from "@/components/ui/switch";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const PropertyTypeToggle = ({ isMediumTerm, onToggle }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <span className={`text-xs ${!isMediumTerm ? "font-semibold" : "text-gray-500"}`}>Long-term</span>
        <Switch id="property-type" checked={isMediumTerm} onCheckedChange={onToggle} className="mx-1" />
        <span className={`text-xs ${isMediumTerm ? "font-semibold" : "text-gray-500"}`}>Mid-term</span>
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger className="inline-flex h-4 w-4 items-center justify-center rounded-full">
              <InfoCircledIcon className="h-4 w-4 text-gray-500 hover:text-gray-700" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">
                Mid-term rentals generate higher monthly income but require furnishing costs. This reduces your leverage
                ratio compared to long-term rentals, assuming the same initial investment.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default PropertyTypeToggle;
