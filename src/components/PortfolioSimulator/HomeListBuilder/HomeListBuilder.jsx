// HomeListBuilder.jsx

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@radix-ui/react-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Trash2, Plus, Home, DollarSign, Calendar, Percent } from 'lucide-react';
import House from '@/lib/House';
import { generateId } from '@/lib/utils/utils.js';

const InputGroup = ({ icon: Icon, label, children, hint }) => (
    <div className="space-y-1">
        <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4 text-orange-600" />
            <label className="text-sm font-medium text-gray-700">{label}</label>
        </div>
        {children}
        {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
);

export const HomeListBuilder = ({ onCalculate, initialData }) => {
    // Initialize state with either initial data or defaults
    const [projectionYears, setProjectionYears] = useState(initialData?.projectionYears || 15);
    const [legacyYears, setLegacyYears] = useState(initialData?.legacyYears || 25);
    const [growthStrategy, setGrowthStrategy] = useState(() => {
        if (initialData?.homes) {
            return initialData.homes[0].willReinvest ? "reinvestment" : "building";
        }
        return "reinvestment";
    });

    // Property-specific form state
    const [currentForm, setCurrentForm] = useState({
        monthOfPurchase: 0,
        percentDownPayment: 25,
        percentAnnualInterestRate: 6.5,
        loanTermYears: 30,
        homePrice: initialData?.results?.homes[0]?.initialHomePrice || 280000,
        percentAnnualHomeAppreciation: initialData?.results?.homes[0]?.percentAnnualHomeAppreciation || 5
    });
    
    const [homes, setHomes] = useState(() => {
        if (!initialData?.homes) return [];
        return initialData.homes.map(home => new House(
            home.monthOfPurchase,
            home.initialHomePrice,
            home.percentAnnualHomeAppreciation,
            home.percentDownPayment,
            home.percentAnnualInterestRate,
            home.loanTermYears,
            home.willReinvest,
            generateId()
        ));
    });
    
    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const rawValue = value.replace(/,/g, '');
        
        // Handle empty input or decimal point
        if (rawValue === '' || rawValue === '.') {
            setCurrentForm(prev => ({
                ...prev,
                [name]: rawValue
            }));
            return;
        }

        // Convert to number and update state
        const numValue = parseFloat(rawValue);
        if (!isNaN(numValue)) {
            setCurrentForm(prev => ({
                ...prev,
                [name]: numValue
            }));
        }
    };

    const getAdjustedPurchasePrice = (initialPrice, appreciationRate, months) => {
        return Math.round(initialPrice * Math.pow(1 + appreciationRate / 100, months / 12));
    };

    const totalOutOfPocket = useMemo(() => {
        const adjustedPrice = getAdjustedPurchasePrice(
            currentForm.homePrice,
            currentForm.percentAnnualHomeAppreciation,
            currentForm.monthOfPurchase
        );
        const downPaymentAmount = adjustedPrice * (currentForm.percentDownPayment / 100);
        const closingCosts = adjustedPrice * 0.07;
        return downPaymentAmount + closingCosts;
    }, [currentForm.homePrice, currentForm.percentDownPayment, 
        currentForm.percentAnnualHomeAppreciation, currentForm.monthOfPurchase]);

    const addHome = () => {
        setError("");
        if (!currentForm.percentDownPayment || currentForm.percentDownPayment < 1 || currentForm.percentDownPayment > 100) {
            setError("Please enter a down payment percent between 1 and 100");
            return;
        }
        if (!currentForm.homePrice || currentForm.homePrice < 100_000 || currentForm.homePrice > 1_000_000) {
            setError("Please enter a home price between 100,000 and 1,000,000");
            return;
        }
        if (!currentForm.loanTermYears || (currentForm.loanTermYears !== 15 && currentForm.loanTermYears !== 20 && currentForm.loanTermYears !== 30)) {
            setError("Please enter loan term that is either 15, 20, or 30 years");
            return;
        } 
        if (!currentForm.percentAnnualHomeAppreciation || currentForm.percentAnnualHomeAppreciation < 3 || currentForm.percentAnnualHomeAppreciation > 7) {
            setError("Please enter a home value appreciation rate in the range of 3% to 7%");
            return;
        }
        if (currentForm.monthOfPurchase === "" || currentForm.monthOfPurchase < 0 || currentForm.monthOfPurchase > projectionYears * 12) {
            setError("Please enter a purchase month from 0 to the month the simulation ends");
            return;
        }
    
        // Calculate the appreciation-adjusted purchase price
        const adjustedPurchasePrice = getAdjustedPurchasePrice(
            currentForm.homePrice,
            currentForm.percentAnnualHomeAppreciation,
            currentForm.monthOfPurchase
        );
    
        const newHome = new House(
            currentForm.monthOfPurchase, 
            adjustedPurchasePrice, // Use the adjusted price instead of the initial price
            currentForm.percentAnnualHomeAppreciation,
            currentForm.percentDownPayment,
            currentForm.percentAnnualInterestRate,
            currentForm.loanTermYears,
            growthStrategy === "reinvestment",
            generateId() 
        );
        setHomes([...homes, newHome]);
    };

    const removeHome = (id) => {
        setHomes(homes.filter((home) => home.id !== id));
    };

    const handleCalculate = () => {
        setError("");
        if (!projectionYears || projectionYears < 5 || projectionYears > 80) {
            setError("Please enter an investment period between 5 and 80 years");
            return;
        }
        if (!legacyYears || legacyYears < 1 ) {
            setError("Please enter a years in retirement of 1 year minimum");
            return;
        }
        onCalculate({ homes, projectionYears, legacyYears });
    };

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-4">
            {/* Welcome Alert */}
            <Alert className="bg-orange-50 border-orange-200">
                <AlertTitle className="text-lg font-semibold text-orange-800">
                    DFY Portfolio Growth Simulator
                </AlertTitle>
                <AlertDescription className="text-orange-700">
                    Configure your investment strategy and add properties to simulate long-term growth potential.
                </AlertDescription>
            </Alert>

            {/* Main Configuration Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Strategy Settings Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Simulation Settings</CardTitle>
                        <CardDescription>Configure your investment timeline and strategy.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InputGroup 
                            icon={Calendar} 
                            label="Years to Retirement (Building Phase)"
                            hint="Period of active investment: 15-30 years"
                        >
                            <Input
                                type="number"
                                value={projectionYears}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    setProjectionYears(value);
                                    setHomes([]);
                                }}
                                className="mt-1" 
                            />
                        </InputGroup>

                        <InputGroup 
                            icon={Calendar} 
                            label="Years in Retirement (Withdrawal Phase)"
                            hint="Expected years from retirement to end of life for legacy planning"
                        >
                            <Input
                                type="number"
                                value={legacyYears}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    setLegacyYears(value);
                                }}
                                className="mt-1" 
                            />
                        </InputGroup>

                        <InputGroup 
                            icon={Percent} 
                            label="Growth Strategy"
                            hint="Choose how to utilize property equity"
                        >
                            <Select
                                defaultValue={growthStrategy}
                                onValueChange={(value) => {
                                    setGrowthStrategy(value);
                                    setHomes([]);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select strategy" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="reinvestment">
                                        <div>
                                            <div className="font-medium">Equity Reinvestment</div>
                                            <div className="text-xs text-gray-500">Use refinancing to buy more properties</div>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="building">
                                        <div>
                                            <div className="font-medium">Pay off principle</div>
                                            <div className="text-xs text-gray-500">Build equity without refinancing</div>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </InputGroup>
                    </CardContent>
                </Card>

                {/* Property Configuration Card - Reorganized */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Property Configuration</CardTitle>
                        <CardDescription>Define property details and financing</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Main Input Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <InputGroup 
                                icon={Home} 
                                label="Home Value Today ($)"
                                hint="Today's value: 100k - 1M"
                            >
                                <Input
                                    type="text"
                                    name="homePrice"
                                    value={currentForm.homePrice ? Number(currentForm.homePrice).toLocaleString() : ''}
                                    onChange={handleInputChange}
                                />
                            </InputGroup>

                            <InputGroup 
                                icon={Percent} 
                                label="Annual Appreciation (%)"
                                hint="Historical average: 3-7%"
                            >
                                <Select
                                    value={currentForm.percentAnnualHomeAppreciation.toString()}
                                    onValueChange={(value) => {
                                        setCurrentForm(prev => ({
                                            ...prev,
                                            percentAnnualHomeAppreciation: parseFloat(value)
                                        }));
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select rate" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 9 }, (_, i) => 3 + i * 0.5).map((rate) => (
                                            <SelectItem key={rate} value={rate.toString()}>
                                                {rate.toFixed(1)}%
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </InputGroup>

                            <InputGroup 
                                icon={Calendar} 
                                label="Months from Now"
                                hint="When to purchase this property"
                            >
                                <Input
                                    type="number"
                                    name="monthOfPurchase"
                                    value={currentForm.monthOfPurchase}
                                    onChange={handleInputChange}
                                    min={0}
                                />
                            </InputGroup>

                            <InputGroup 
                                icon={DollarSign} 
                                label="Down Payment (%)"
                                hint="Select your down payment percentage"
                            >
                                <Select
                                    value={currentForm.percentDownPayment.toString()}
                                    onValueChange={(value) => {
                                        setCurrentForm(prev => ({
                                            ...prev,
                                            percentDownPayment: parseInt(value)
                                        }));
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select down payment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="20">20%</SelectItem>
                                        <SelectItem value="25">25%</SelectItem>
                                        <SelectItem value="30">30%</SelectItem>
                                        <SelectItem value="100">Cash Purchase</SelectItem>
                                    </SelectContent>
                                </Select>
                            </InputGroup>

                            <InputGroup 
                                icon={Calendar} 
                                label="Loan Term (Years)"
                                hint={currentForm.percentDownPayment === 100 ? "Not applicable for cash purchase" : "Common terms: 15, 20, or 30 years"}
                            >
                                <Select
                                    value={currentForm.percentDownPayment === 100 ? "0" : currentForm.loanTermYears.toString()}
                                    onValueChange={(value) => {
                                        setCurrentForm(prev => ({
                                            ...prev,
                                            loanTermYears: parseInt(value)
                                        }));
                                    }}
                                    disabled={currentForm.percentDownPayment === 100}
                                >
                                    <SelectTrigger className={currentForm.percentDownPayment === 100 ? "bg-gray-100" : ""}>
                                        <SelectValue 
                                            placeholder={currentForm.percentDownPayment === 100 ? "N/A - Cash Purchase" : "Select term"}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="15">15 years</SelectItem>
                                        <SelectItem value="20">20 years</SelectItem>
                                        <SelectItem value="30">30 years</SelectItem>
                                    </SelectContent>
                                </Select>
                            </InputGroup>
                        </div>

                        {/* Divider */}
                        <Separator className="py-[0.5px] h-1 rounded-sm bg-gray-300 dark:bg-gray-700"/>

                        {/* Calculated Values Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-lg">
                            <InputGroup 
                                icon={DollarSign} 
                                label="Purchase Price"
                                hint={`Value after ${currentForm.monthOfPurchase} months of appreciation`}
                            >
                                <div className="h-9 px-3 py-2 rounded-md border bg-gray-100 border-gray-950 text-sm font-medium">
                                    ${currentForm.homePrice && currentForm.percentAnnualHomeAppreciation ? 
                                        Math.round(currentForm.homePrice * 
                                        Math.pow(1 + currentForm.percentAnnualHomeAppreciation / 100, 
                                        currentForm.monthOfPurchase / 12)).toLocaleString() 
                                        : '0'}
                                </div>
                            </InputGroup>

                            <InputGroup 
                                icon={DollarSign} 
                                label="Total Out of Pocket"
                                hint="Down payment + closing costs (7%)"
                            >
                                <div className="h-9 px-3 py-2 rounded-md border bg-gray-100 border-gray-950 text-sm font-medium">
                                    ${Math.round(totalOutOfPocket).toLocaleString()}
                                </div>
                            </InputGroup>
                        </div>

                        {error && (
                            <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="flex justify-end">
                            <Button 
                                onClick={addHome}
                                className="bg-orange-500 hover:bg-orange-600"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Property
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Added Properties List */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Property Portfolio</CardTitle>
                    <CardDescription>
                        {homes.length === 0 
                            ? "Add properties to begin your simulation" 
                            : `${homes.length} ${homes.length === 1 ? 'property' : 'properties'} in portfolio`
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {homes.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Home className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p>No properties added yet</p>
                            <p className="text-sm">Use the form above to add your first property</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {homes.map((home) => (
                                <div
                                    key={home.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                                >
                                    <div className="space-y-1">
                                        <div className="font-medium">
                                            ${Math.round(home.initialHomePrice).toLocaleString()}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Purchase: {home.monthOfPurchase} months from now • 
                                            {home.percentDownPayment}% down • 
                                            {home.loanTermYears}yr term • 
                                            {home.percentAnnualHomeAppreciation}% appreciation
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeHome(home.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Calculate Button */}
            <div className="flex justify-end">
                <Button
                    onClick={handleCalculate}
                    disabled={homes.length === 0}
                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 px-8"
                >
                    Run Simulation
                </Button>
            </div>
        </div>
    );
};

export default HomeListBuilder;