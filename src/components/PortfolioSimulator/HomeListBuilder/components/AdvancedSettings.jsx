// AdvancedSettings.jsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { InputGroup } from '@/components/ui/InputGroup';
import { Separator } from '@radix-ui/react-select';


const AdvancedSettings = ({ 
  isOpen, 
  onToggle, 
  yearsBetweenRefinances, 
  onYearsBetweenRefinancesChange,
  isReinvestmentStrategy 
}) => {
  return (
    <div className="mt-4">
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 text-sm text-gray-600 hover:text-orange-400"
      >
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        <span>{isOpen ? 'Hide' : 'Show'} advanced settings</span>
      </button>

      {isOpen && (
        <Card className="mt-2 bg-gray-50">
          <CardContent className="pt-4">
            <InputGroup
              icon={Calendar}
              label="Years Between Refinances in Retirement"
              hint="Pick how frequently to pull out equity for income in retirement. Longer periods minimize refinance costs but lower something idk dawg   (1-5 years)"
              disabled={!isReinvestmentStrategy}
            >
              <Input
                type="number"
                value={yearsBetweenRefinances}
                onChange={(e) => onYearsBetweenRefinancesChange(parseInt(e.target.value))}
                min={1}
                max={6}
                disabled={!isReinvestmentStrategy}
                className={!isReinvestmentStrategy ? "bg-gray-100" : ""}
              />
            </InputGroup>
            <div className="mt-4">
              <p className="text-xs text-gray-500">
                {!isReinvestmentStrategy 
                  ? "⚠️ Enable equity reinvestment strategy to adjust refinancing schedule" 
                  : "Longer periods between refinances mean more stable but potentially lower income"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {isOpen && <Separator className="mt-4" />}
    </div>
  );
};

export default AdvancedSettings;