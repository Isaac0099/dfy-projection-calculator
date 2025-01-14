import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Clock, Home, TrendingUp, PercentCircle, Building, Wrench, Wallet } from 'lucide-react';
import { getWeightedAverageAppreciation } from '@/lib/utils/utils';

const ParametersCard = ({ projectionYears, legacyYears, growthStrategy, homes, results }) => {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);

  const Parameter = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-4 p-4 pb-8 rounded-lg bg-gray-50 border border-gray-100">
      <div className="rounded-full p-2 bg-gray-100">
        <Icon className="h-8 w-8 text-orange-600 mt-2" />
      </div>
      <div>
        <div className="text-2xl text-gray-600">{label}</div>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
      </div>
    </div>
  );

  return (
    <Card className="mb-12 border-orange-500 border-t-8 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50">
        <CardTitle className="text-4xl text-gray-900">Simulation Parameters</CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-6">
              <Clock className="h-8 w-8 text-orange-500" />
              Timeline
            </h3>
            <div className="grid gap-4">
              <Parameter 
                icon={Wrench}
                label="Building Phase"
                value={`${projectionYears} Years`}
              />
              <Parameter 
                icon={Clock}
                label="Retirement Phase"
                value={`${legacyYears} Years`}
              />
              <Parameter 
                icon={TrendingUp}
                label="Growth Strategy"
                value={growthStrategy === "reinvestment" ? "Equity Reinvestment" : "Pay Off Principal"}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-6">
              <Home className="h-8 w-8 text-orange-500" />
              Properties
            </h3>
            <div className="grid gap-4">
            <Parameter 
                icon={PercentCircle}
                label="Average Appreciation Rate"
                value={`${(getWeightedAverageAppreciation(homes)*100).toFixed(1)}%`}
              />
              <Parameter 
                icon={Home}
                label="Starting Property Count"
                value={homes.length}
              />
              <Parameter 
                icon={Building}
                label="Ending Property Count"
                value={results.homes.length}
              />
              <Parameter 
                icon={Wallet}
                label="Initial Investment"
                value={formatCurrency(results.totalOutOfPocket)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParametersCard;