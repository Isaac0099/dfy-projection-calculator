import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Calendar, Percent } from 'lucide-react';
import { InputGroup } from '@/components/ui/InputGroup';
import { Separator } from '@radix-ui/react-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdvancedSettings = ({ 
  isOpen, 
  onToggle, 
  yearsBetweenRefinances, 
  onYearsBetweenRefinancesChange,
  percentAppreciationToWithdraw,
  onPercentAppreciationChange,
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
          <CardContent className="space-y-4 pt-4">
            <InputGroup
              icon={Calendar}
              label="Years Between Refinances in Retirement"
              hint="Longer periods minimize refinance costs but result in higher mortgage payments (default is 1 year)"
              disabled={!isReinvestmentStrategy}
            >
              <Select
                defaultValue={yearsBetweenRefinances.toString()}
                onValueChange={(value) => onYearsBetweenRefinancesChange(Number(value))}
                disabled={!isReinvestmentStrategy}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">
                    <div className="font-medium">1 year</div>
                  </SelectItem>
                  <SelectItem value="2">
                    <div className="font-medium">2 years</div>
                  </SelectItem>
                  <SelectItem value="3">
                    <div className="font-medium">3 years</div>
                  </SelectItem>
                  <SelectItem value="4">
                    <div className="font-medium">4 years</div>
                  </SelectItem>
                  <SelectItem value="5">
                    <div className="font-medium">5 years</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </InputGroup>

            <InputGroup
              icon={Percent}
              label="Percent of Appreciation to Withdraw"
              hint="What percentage of your property's appreciation you want to access through refinancing (default is 50%)"
              disabled={!isReinvestmentStrategy}
            >
              <Select
                defaultValue={percentAppreciationToWithdraw.toString()}
                onValueChange={(value) => onPercentAppreciationChange(Number(value))}
                disabled={!isReinvestmentStrategy}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select percentage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">
                    <div className="font-medium">25%</div>
                  </SelectItem>
                  <SelectItem value="50">
                    <div className="font-medium">50%</div>
                  </SelectItem>
                  <SelectItem value="75">
                    <div className="font-medium">75%</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </InputGroup>

            {!isReinvestmentStrategy && (
              <div className="pb-4">
                <p className="text-xs text-gray-500">
                  ⚠️ Enable equity reinvestment strategy to adjust refinancing settings
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {isOpen && <Separator className="mt-4" />}
    </div>
  );
};

export default AdvancedSettings;