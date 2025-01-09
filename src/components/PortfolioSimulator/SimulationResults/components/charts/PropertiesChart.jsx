
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



export const PropertiesChart = ({results}) => {
    return(
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                    data={results.graphingData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 15 }} 
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="month"
                        tickFormatter={(month) => `${Math.floor(month / 12)}`}
                        interval={11}
                        label={{
                            value:"Years",
                            position: "bottom",
                            offset: 0
                    }}
                    />
                    <YAxis 
                        allowDecimals={false}
                        domain={[0, results.homes.length]}
                    />
                    <Tooltip 
                        formatter={(value) => [value, "Properties"]}
                        labelFormatter={(month) => `Year ${Math.floor(month / 12)} - Month ${month % 12}`}
                    />
                    <Line 
                        type="stepAfter" 
                        dataKey="propertyCount" 
                        stroke="#f97316" 
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default PropertiesChart;