import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';

export const MetricCard = ({ 
  icon: Icon, 
  title, 
  value, 
  multilines, 
  change, 
  description, 
  small = false 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <Card 
        className={`relative overflow-hidden border border-gray-200 shadow-sm hover:border-gray-300 transition-colors rounded-lg h-full bg-white ${description ? 'cursor-pointer' : ''}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
      >    
        <CardContent className="p-2.5">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className="h-4 w-4 text-orange-500 shrink-0" />
                <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
              </div>
              <div className="flex flex-col gap-0.5 pl-2">
                {/* Show either value or multilines */}
                {value && !multilines && (
                  <p className={`${small ? 'text-base' : 'text-lg'} font-semibold`}>
                    {value}
                  </p>
                )}
                {multilines && (
                  <div className="flex flex-col gap-0.5">
                    {multilines.map((text, index) => (
                      <p key={index} className="text-sm font-semibold">
                        {text}
                      </p>
                    ))}
                  </div>
                )}
                {change && (
                  <p className={`text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
                  </p>
                )}
              </div>
            </div>
            {description && (
              <Info className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            )}
          </div>
        </CardContent>
      </Card>
      {showTooltip && description && (
        <div 
          className="absolute z-50 w-64 p-2 text-sm bg-white border border-gray-200 rounded-lg shadow-lg -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full"
        >
          <div className="font-medium mb-1">{title}</div>
          <div className="text-gray-600">{description}</div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-white border-r border-b border-gray-200"></div>
        </div>
      )}
    </div>
  );
};

export default MetricCard;