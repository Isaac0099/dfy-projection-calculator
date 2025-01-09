import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const ChartSection = ({ title, description, children }) => (
    <Card className="mb-4 rounded-lg">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );

  export default ChartSection;