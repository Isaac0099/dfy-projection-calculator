// PropertyTypeToggle.jsx

"use client"

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const PropertyTypeToggle = ({ isMediumTerm, onToggle }) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Label htmlFor="property-type" className="text-sm font-medium">
            Is this a mid-term rental? 
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoCircledIcon className="h-4 w-4 text-gray-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">
                  Mid-term rentals typically generate higher rent (often double) but require furnishing costs, so your leverage ratio that positively affects your long term growth is lower. Assuming you spend the same total out of pocket on both options.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center space-x-1">
          <span className={`text-sm ${!isMediumTerm ? 'font-medium' : 'text-gray-500'}`}>
            No
          </span>
          <Switch
            id="property-type"
            checked={isMediumTerm}
            onCheckedChange={onToggle}
          />
          <span className={`text-sm ${isMediumTerm ? 'font-medium' : 'text-gray-500'}`}>
            Yes
          </span>
        </div>
      </div>
      
      {isMediumTerm && (
        <div className="p-2 bg-blue-50 rounded-md border border-blue-100 text-sm text-blue-700">
          <p>
            <strong>Note:</strong> Mid-term rentals will get you higher monthly positive cashflow, but your leverage ratio is lower. To purchase a mid-term you must be a member of MBML+
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertyTypeToggle;