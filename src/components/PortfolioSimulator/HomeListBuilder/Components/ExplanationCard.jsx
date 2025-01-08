import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';

const ExplanationCard = () => {
    return (
        <Card className="h-fit sticky top-6">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                How It Works
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
            <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <h3 className="font-semibold text-orange-800 mb-2">Portfolio Growth Simulation</h3>
                    <p className="text-orange-900">
                        This simulator helps you visualize how a real estate portfolio could grow over time through property appreciation and strategic refinancing.
                    </p>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">Key Concepts</h3>
                    <div className="space-y-3">
                        <div>
                            <h4 className="font-medium text-gray-900">Property Appreciation</h4>
                            <p className="text-gray-600">Properties increase in value annually based on the appreciation rate you select. This growth compounds over time.</p>
                            <h4 className="font-medium text-gray-900">Equity Focused</h4>
                            <p className="text-gray-600">This simulation is concerned with showing equity growth. It works on the base assumption that rent roughly cancels out with the mortgage payment and home maintenance. In DFY markets it is typically the case that rent exceeds these slightly but we won&apos;t be concerned with that here.</p>
                        </div>
                        
                        <div>
                            <h4 className="font-medium text-gray-900">Growth Strategies</h4>
                            <p className="text-gray-600">Choose between two approaches:</p>
                            <ul className="mt-2 space-y-2 pl-4">
                                <li className="text-gray-600">
                                    <span className="font-medium text-gray-900">Equity Reinvestment:</span> Use accumulated equity to purchase additional properties through refinancing when sufficient equity has built up
                                </li>
                                <li className="text-gray-600">
                                    <span className="font-medium text-gray-900">Equity Building:</span> Focus on paying down mortgages and building equity in existing properties without leveraging for new purchases
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-900">Timeline Planning</h4>
                            <p className="text-gray-600">Plan property purchases across your projection timeline. Earlier purchases benefit from longer appreciation periods and can potentially be used for future down payments.</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="font-semibold text-blue-800 mb-2">Pro Tips</h3>
                    <ul className="space-y-2 text-blue-900">
                        <li>• Start with a realistic base home price for your target market</li>
                        <li>• Consider using conservative appreciation rates (4-5%) for long-term projections</li>
                        <li>• Plan purchases strategically to maximize compound growth</li>
                        <li>• Remember that higher down payments reduce monthly costs but require more upfront capital</li>
                        <li>• Balance loan terms with your investment strategy - shorter terms build equity faster but have higher payments and may break our rent cancelling mortgage payments assumption</li>
                    </ul>
                </div>
            </div>
        </CardContent>
        </Card>
    );
}

export default ExplanationCard;