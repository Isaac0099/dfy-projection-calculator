import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LogoBanner } from '../LogoBanner';
import ParametersCard from './ParametersCard';
import PDFMetricsSection from './PDFMetricsSection';
import ChartExplanation from './ChartExplanation';
import CombinedOverviewChart from '../charts/CombinedOverviewChart';
import GrowthPhaseChart from '../charts/GrowthPhaseChart';
import PropertiesChart from '../charts/PropertiesChart';
import RetirementIncomeChart from '../charts/RetirementIncomeChart';
import ComparisonChart from '../charts/ComparisonChart';

const SimulationPDFLayout = React.forwardRef(({ 
  homes,
  projectionYears,
  legacyYears,
  growthStrategy,
  results
}, ref) => {
  const PDFHeader = () => (
    <div className="flex items-center justify-between px-8 pt-24 pb-8">
      <LogoBanner className="flex-shrink-0" />
      <div className="text-right">
        <h1 className="text-5xl font-bold text-white mb-4">DFY Portfolio Growth and Income Simulation</h1>
        <p className="text-3xl text-white opacity-90">
          Generated on {new Date().toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
    </div>
  );

  // Common chart container styles
  const chartContainerStyle = {
    width: '100%',
    height: '450px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <div 
      ref={ref} 
      className="bg-background text-foreground mx-auto" 
      style={{ position: 'absolute', left: '-9999px', top: 0 }}
    >
      {/* Header Page */}
      <div>
        <PDFHeader />
        <div className="p-8">
          <ParametersCard 
            projectionYears={projectionYears}
            legacyYears={legacyYears}
            growthStrategy={growthStrategy}
            homes={homes}
            results={results}
          />         
          <PDFMetricsSection 
            homes={homes}
            projectionYears={projectionYears}
            legacyYears={legacyYears}
            growthStrategy={growthStrategy}
            results={results}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="p-8 mb-8 pt-52">
        <Card className="border-orange-500 border-t-8">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-4xl text-gray-900">Portfolio Growth Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={chartContainerStyle}>
              <CombinedOverviewChart results={results} projectionYears={projectionYears} />
            </div>
            <ChartExplanation chartType="overview" growthStrategy={growthStrategy} />
          </CardContent>
        </Card>
      </div>

      <div className="px-8 mb-8 pt-12 pb-60">
        <Card className="border-orange-500 border-t-8">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-4xl text-gray-900">Growth Phase Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={chartContainerStyle}>
              <GrowthPhaseChart results={results} />
            </div>
            <ChartExplanation chartType="growthPhase" growthStrategy={growthStrategy} />
          </CardContent>
        </Card>
      </div>

      <div className="p-8 mb-8 pt-28">
        <Card className="border-orange-500 border-t-8">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-4xl text-gray-900">Property Acquisition Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={chartContainerStyle}>
              <PropertiesChart results={results} />
            </div>
            <ChartExplanation chartType="properties" growthStrategy={growthStrategy} />
          </CardContent>
        </Card>
      </div>

      <div className="px-8 mb-8 pt-16 pb-48">
        <Card className="border-orange-500 border-t-8">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-4xl text-gray-900">Retirement Monthly Income Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={chartContainerStyle}>
              <RetirementIncomeChart 
                growthStrategy={growthStrategy}
                results={results}
              />
            </div>
            <ChartExplanation chartType="retirementIncome" growthStrategy={growthStrategy} />
          </CardContent>
        </Card>
      </div>

      <div className="p-8 mb-8 pt-48">
        <Card className="border-orange-500 border-t-8">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-4xl text-gray-900">Investment Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={chartContainerStyle}>
              <ComparisonChart 
                projectionYears={projectionYears}
                equityData={results.graphingData.map(data => data.equity)}
                initialHomes={homes}
                results={results}
              />
            </div>
            <ChartExplanation chartType="comparison" growthStrategy={growthStrategy} />
          </CardContent>
        </Card>

        <div className="py-96">
          <p className="pt-40 pb-32">&nbsp;</p>

        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t text-center text-gray-100 text-2xl">
          <p>This simulation is for educational purposes only and should not be considered financial advice.</p>
        </div>
      </div>
    </div>
  );
});

SimulationPDFLayout.displayName = 'SimulationPDFLayout';

export default SimulationPDFLayout;














