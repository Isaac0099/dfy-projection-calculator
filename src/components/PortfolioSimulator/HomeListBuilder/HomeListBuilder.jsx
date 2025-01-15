"use client";
import React, { useState, useMemo } from 'react';
import DFYLogo from '../../../../public/DFYLogo.png';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@radix-ui/react-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InputGroup } from "@/components/ui/InputGroup";
import WelcomeBanner from "./components/WelcomeBanner";
import { Trash2, Plus, Home, DollarSign, Calendar, Percent, TrendingUp } from 'lucide-react';
import House from '@/lib/House';
import { generateId } from '@/lib/utils/utils.js';
import ExistingPropertyToggle from './components/ExistingPropertyToggle';

export const HomeListBuilder = ({ onCalculate, initialData }) => {
  // =====================
  // 1. Overall Simulation Settings
  // =====================
  const [projectionYears, setProjectionYears] = useState(initialData?.projectionYears || 15);
  const [legacyYears, setLegacyYears] = useState(initialData?.legacyYears || 25);
  const [growthStrategy, setGrowthStrategy] = useState(() => {
    if (initialData?.homes) {
      return initialData.homes[0].willReinvest ? "reinvestment" : "payOffPrincipal";
    }
    return "reinvestment";
  });

  // =====================
  // 2. Form State
  // =====================
  const [currentForm, setCurrentForm] = useState({
    // Fields for brand-new purchase:
    monthOfPurchase: 0,
    homePrice: initialData?.results?.homes[0]?.initialHomePrice || 280000,
    percentDownPayment: initialData?.results?.homes[0]?.percentDownPayment || 25,
    loanTermYears: 30,
    
    // Common to both:
    percentAnnualInterestRate: "6.5",
    percentAnnualHomeAppreciation: "5.0",

    // Fields for existing property:
    isExistingProperty: false,
    purchaseDate: "",           // e.g. "2018-06-15"
    originalLoanAmount: "",
    originalLoanTermYears: 30,
    currentHomeValue: "",
    monthsPaidSoFar: 0 // We'll store this if we like, or just compute on the fly
  });

  const [homes, setHomes] = useState(() => {
    if (!initialData?.homes) return [];
    
    return initialData.homes.map(home => {
      // Create base configuration that works for both new and existing properties
      const baseConfig = {
        id: generateId(),
        percentAnnualHomeAppreciation: home.percentAnnualHomeAppreciation,
        percentAnnualInterestRate: home.percentAnnualInterestRate,
        willReinvest: home.willReinvest,
        isExistingProperty: home.isExistingProperty,
      };
  
      // Add specific fields based on whether it's an existing or new property
      const homeConfig = home.isExistingProperty
        ? {
            ...baseConfig,
            datePurchased: home.datePurchased,
            originalLoanAmount: home.originalLoanAmount,
            originalLoanTermYears: home.originalLoanTermYears,
            monthsPaidSoFar: home.monthsPaidSoFar,
            currentHomeValue: home.initialHomePrice, // For existing properties, initialHomePrice represents current value
          }
        : {
            ...baseConfig,
            monthOfPurchase: home.monthOfPurchase,
            homePrice: home.initialHomePrice,
            percentDownPayment: home.percentDownPayment,
            loanTermYears: home.loanTermYears,
          };
  
      return new House(homeConfig);
    });
  });

  const [error, setError] = useState("");

  // =====================
  // 3. Handlers
  // =====================

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for interest and appreciation rates
    if (name === 'percentAnnualInterestRate' || name === 'percentAnnualHomeAppreciation') {
      // Allow empty, single dot, or valid decimal input
      if (value === '' || value === '.' || /^\d*\.?\d*$/.test(value)) {
        setCurrentForm(prev => ({ ...prev, [name]: value }));
      }
      return;
    }

    // For other numeric fields that need comma formatting
    if (name === 'homePrice' || name === 'originalLoanAmount' || name === 'currentHomeValue') {
      const rawValue = value.replace(/,/g, '');
      if (rawValue === '' || rawValue === '.') {
        setCurrentForm(prev => ({ ...prev, [name]: rawValue }));
        return;
      }
      const numValue = parseFloat(rawValue);
      if (!isNaN(numValue)) {
        setCurrentForm((prev) => ({ ...prev, [name]: numValue }));
      }
      return;
    }

    // For all other fields, just set the value directly
    setCurrentForm(prev => ({ ...prev, [name]: value }));
  };


  // b) Toggle existing property
  const toggleExistingProperty = (e) => {
    const isExisting = e.target.checked;
    setCurrentForm(prev => ({ ...prev, isExistingProperty: isExisting }));
  };

  // c) Add a new property to the list
  const addHome = () => {
    setError("");  
    if (currentForm.isExistingProperty) {
      // Validate for existing property
      if (!currentForm.purchaseDate || !currentForm.originalLoanAmount || !currentForm.currentHomeValue) {
        setError("Please fill out the purchase date, original loan amount, and current home value for an existing property.");
        return;
      }
      const now = new Date();
      const purchaseDt = new Date(currentForm.purchaseDate);
      if (purchaseDt > now) {
        setError("Purchase date cannot be in the future.");
        return;
      }
      if (!currentForm.percentAnnualHomeAppreciation || currentForm.percentAnnualHomeAppreciation < 3.5 || currentForm.percentAnnualHomeAppreciation > 6.5) {
        setError("Please enter a home value appreciation rate in the range of 3.5% to 6.5%");
        return;
      }      
      if (!currentForm.percentAnnualInterestRate || currentForm.percentAnnualInterestRate < 1 || currentForm.percentAnnualInterestRate > 10) {
        setError("Please enter an interest rate between 1% to 10%");
        return;
      }
      // Compute monthsPaidSoFar
      const monthsPaidSoFar = Math.max(
        0,
        Math.floor((now - purchaseDt) / (1000 * 60 * 60 * 24 * 30.43))
      );
  
      const newHouse = new House({
        id: generateId(),
        isExistingProperty: true,
        percentAnnualHomeAppreciation: Number(currentForm.percentAnnualHomeAppreciation),
        percentAnnualInterestRate: Number(currentForm.percentAnnualInterestRate),
        willReinvest: growthStrategy === "reinvestment",
        
        // Existing property specific fields
        datePurchased: currentForm.purchaseDate,
        originalLoanAmount: Number(currentForm.originalLoanAmount),
        originalLoanTermYears: Number(currentForm.originalLoanTermYears),
        monthsPaidSoFar: monthsPaidSoFar,
        currentHomeValue: Number(currentForm.currentHomeValue)
      });
  
      setHomes(prev => [...prev, newHouse]);
    } else {
      // New purchase validations
      if (!currentForm.percentDownPayment || currentForm.percentDownPayment < 1 || currentForm.percentDownPayment > 100) {
        setError("Please enter a down payment percent between 1 and 100");
        return;
      }
      if (!currentForm.homePrice || currentForm.homePrice < 200_000 || currentForm.homePrice > 1_000_000) {
        setError("Please enter a home price between 200,000 and 1,000,000");
        return;
      }
      if (!currentForm.loanTermYears || ![15, 20, 30].includes(Number(currentForm.loanTermYears))) {
        setError("Please enter loan term that is either 15, 20, or 30 years");
        return;
      }
      if (!currentForm.percentAnnualHomeAppreciation || currentForm.percentAnnualHomeAppreciation < 3.5 || currentForm.percentAnnualHomeAppreciation > 6.5) {
        setError("Please enter a home value appreciation rate in the range of 3.5% to 6.5%");
        return;
      }
      if (currentForm.monthOfPurchase === "" || currentForm.monthOfPurchase < 0 || currentForm.monthOfPurchase > projectionYears * 12) {
        setError("Please enter a purchase month from 0 to the month the simulation ends");
        return;
      }
      if (!currentForm.percentAnnualInterestRate || currentForm.percentAnnualInterestRate < 1 || currentForm.percentAnnualInterestRate > 10) {
        setError("Please enter an interest rate between 1% to 10%");
        return;
      }

      // Grabbing this appreciation adjusted price so that we can add a home that's been adjusted for appreciation
      const adjustedHomePrice = getAdjustedPurchasePrice(
        Number(currentForm.homePrice),
        Number(currentForm.percentAnnualHomeAppreciation),
        Number(currentForm.monthOfPurchase)
      );
  
      const newHouse = new House({
        id: generateId(),
        isExistingProperty: false,
        monthOfPurchase: Number(currentForm.monthOfPurchase),
        homePrice: Number(adjustedHomePrice),
        percentAnnualHomeAppreciation: Number(currentForm.percentAnnualHomeAppreciation),
        percentDownPayment: Number(currentForm.percentDownPayment),
        percentAnnualInterestRate: Number(currentForm.percentAnnualInterestRate),
        loanTermYears: Number(currentForm.loanTermYears),
        willReinvest: growthStrategy === "reinvestment"
      });
  
      setHomes(prev => [...prev, newHouse]);
    }
  };

  // d) Helper to compute future purchase price
  const getAdjustedPurchasePrice = (initialPrice, appreciationRate, months) => {
    return Math.round(
      initialPrice * Math.pow(1 + appreciationRate / 100, months / 12)
    );
  };

  // e) Remove a property
  const removeHome = (id) => {
    setHomes(homes.filter((home) => home.id !== id));
  };

  // f) Run the Simulation
  const handleCalculate = () => {
    setError("");
    if (projectionYears < 1 || projectionYears > 60) {
      setError("Please enter a number of years to retirement between 1 and 60 years");
      return;
    }
    if (legacyYears < 0 || legacyYears > 60) {
      setError("Please enter a number of years in retirement from 0 to 60");
      return;
    }
    onCalculate({ homes, growthStrategy, projectionYears, legacyYears });
  };

  // =====================
  // 4. Derived / Memo Values
  // =====================
  const totalOutOfPocket = useMemo(() => {
    if (currentForm.isExistingProperty) return 0; // existing property => no new DP
    if (!currentForm.homePrice || !currentForm.percentDownPayment) return 0;

    const adjustedPrice = getAdjustedPurchasePrice(
      Number(currentForm.homePrice),
      Number(currentForm.percentAnnualHomeAppreciation),
      Number(currentForm.monthOfPurchase)
    );
    const downPaymentAmount = adjustedPrice * (Number(currentForm.percentDownPayment) / 100);
    const closingCosts = 
      Number(currentForm.percentDownPayment) !== 100 
        ? adjustedPrice * 0.07 
        : adjustedPrice * 0.05;
    return downPaymentAmount + closingCosts;
  }, [
    currentForm.homePrice,
    currentForm.percentDownPayment,
    currentForm.percentAnnualHomeAppreciation,
    currentForm.monthOfPurchase,
    currentForm.isExistingProperty
  ]);

  // Format a numeric value with commas for the input display
  const formatNumberWithCommas = (val) => {
    if (val === "" || isNaN(val)) return "";
    return Number(val).toLocaleString();
  };

  // =====================
  // 5. Render
  // =====================
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-4">
      {/* Welcome Alert */}
      <WelcomeBanner DFYLogo={DFYLogo} />

      {/* Main Configuration Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Strategy Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Simulation Settings</CardTitle>
            <CardDescription className="mb-0">
              <p>Configure your investment timeline and strategy.</p>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <InputGroup 
              icon={Calendar} 
              label="Years to Retirement (Building Phase)"
              hint="Period of active investment: 1-60"
            >
              <Input
                type="number"
                value={projectionYears}
                onChange={(e) => setProjectionYears(parseInt(e.target.value))}
                className="mt-1"
              />
            </InputGroup>

            <InputGroup 
              icon={Calendar} 
              label="Years in Retirement (Withdrawal Phase)"
              hint="Expected years from retirement to end of life"
            >
              <Input
                type="number"
                value={legacyYears}
                onChange={(e) => setLegacyYears(parseInt(e.target.value))}
                className="mt-1"
              />
            </InputGroup>

            <InputGroup
              icon={Percent}
              label="Growth Strategy"
              warning="Changing this clears your portfolio"
              description="Determines whether simulation focuses on equity-based or rent-based income."
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
                  <SelectItem value="payOffPrincipal">
                    <div>
                      <div className="font-medium">Pay off principal</div>
                      <div className="text-xs text-gray-500">Build equity without refinancing</div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </InputGroup>
          </CardContent>
        </Card>

        {/* Property Configuration Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Property Configuration</CardTitle>
            <CardDescription>Define property details and financing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Toggle for existing property */}
            <ExistingPropertyToggle
                isChecked={currentForm.isExistingProperty}
                onToggle={(checked) => {
                    setCurrentForm(prev => ({
                    ...prev,
                    isExistingProperty: checked
                    }));
                }}
            />

            {/* NEW PURCHASE: 2 rows x 3 columns */}
            {!currentForm.isExistingProperty && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 1st row of 3 inputs */}
                  <InputGroup 
                    icon={Home} 
                    label="Home Value Today ($)"
                    hint="200k - 1M"
                  >
                    <Input
                      type="text"
                      name="homePrice"
                      value={formatNumberWithCommas(currentForm.homePrice)}
                      onChange={handleInputChange}
                    />
                  </InputGroup>

                  <InputGroup 
                    icon={Calendar} 
                    label="Months from Now"
                    hint="When to purchase"
                  >
                    <Input
                      type="number"
                      name="monthOfPurchase"
                      value={currentForm.monthOfPurchase}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setCurrentForm(prev => ({ ...prev, monthOfPurchase: isNaN(val) ? "" : val }));
                      }}
                      min={0}
                    />
                  </InputGroup>

                  <InputGroup 
                    icon={DollarSign} 
                    label="Down Payment (%)"
                    hint="E.g. 25%"
                  >
                    <Input
                      type="number"
                      name="percentDownPayment"
                      value={currentForm.percentDownPayment}
                      onChange={(e) => {
                        let val = parseFloat(e.target.value);
                        if (isNaN(val)) val = "";
                        setCurrentForm(prev => ({ ...prev, percentDownPayment: val }));
                      }}
                    />
                  </InputGroup>
                </div>

                {/* 2nd row of 3 inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputGroup 
                    icon={Calendar} 
                    label="Loan Term (Years)"
                    hint="15, 20, or 30"
                  >
                    <Input
                      type="number"
                      name="loanTermYears"
                      value={currentForm.loanTermYears}
                      onChange={(e) => {
                        let val = parseInt(e.target.value);
                        if (isNaN(val)) val = "";
                        setCurrentForm(prev => ({ ...prev, loanTermYears: val }));
                      }}
                      disabled={Number(currentForm.percentDownPayment) === 100}
                    />
                  </InputGroup>

                  <InputGroup 
                    icon={Percent} 
                    label="Annual Interest Rate"
                    hint="e.g. 6.5"
                  >
                    <Input
                      type="text"
                      name="percentAnnualInterestRate"
                      value={currentForm.percentAnnualInterestRate}
                      onChange={handleInputChange}
                    />
                  </InputGroup>

                  <InputGroup 
                    icon={TrendingUp} 
                    label="Annual Appreciation (%)"
                    hint="3.5 - 6.5"
                  >
                    <Input
                      type="text"
                      name="percentAnnualHomeAppreciation"
                      value={currentForm.percentAnnualHomeAppreciation}
                      onChange={handleInputChange}
                    />
                  </InputGroup>
                </div>
              </>
            )}

            {/* EXISTING PROPERTY: 2 rows x 3 columns */}
            {currentForm.isExistingProperty && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 1st row of 3 inputs */}
                  <InputGroup 
                    icon={Calendar}
                    label="Original Purchase Date"
                    hint="MM-DD-YYYY"
                  >
                    <Input
                      type="date"
                      name="purchaseDate"
                      value={currentForm.purchaseDate}
                      onChange={(e) => {
                        setCurrentForm(prev => ({ ...prev, purchaseDate: e.target.value }));
                      }}
                    />
                  </InputGroup>

                  <InputGroup
                    icon={DollarSign}
                    label="Original Loan Amount"
                  >
                    <Input
                      type="text"
                      name="originalLoanAmount"
                      value={formatNumberWithCommas(currentForm.originalLoanAmount)}
                      onChange={handleInputChange}
                    />
                  </InputGroup>

                  <InputGroup
                    icon={Calendar}
                    label="Original Loan Term (yrs)"
                  >
                    <Input
                      type="number"
                      name="originalLoanTermYears"
                      value={currentForm.originalLoanTermYears}
                      onChange={(e) => {
                        let val = parseInt(e.target.value);
                        if (isNaN(val)) val = "";
                        setCurrentForm(prev => ({ ...prev, originalLoanTermYears: val }));
                      }}
                    />
                  </InputGroup>
                </div>

                {/* 2nd row of 3 inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputGroup 
                    icon={Home} 
                    label="Current Home Value"
                    hint="What is it worth now?"
                  >
                    <Input
                      type="text"
                      name="currentHomeValue"
                      value={formatNumberWithCommas(currentForm.currentHomeValue)}
                      onChange={handleInputChange}
                    />
                  </InputGroup>

                  <InputGroup 
                    icon={Percent} 
                    label="Annual Interest Rate"
                    hint="e.g. 6.5"
                  >
                    <Input
                      type="text"
                      name="percentAnnualInterestRate"
                      value={currentForm.percentAnnualInterestRate}
                      onChange={handleInputChange}
                    />
                  </InputGroup>

                  <InputGroup 
                    icon={TrendingUp} 
                    label="Annual Appreciation (%)"
                    hint="3.5 - 6.5"
                  >
                    <Input
                      type="text"
                      name="percentAnnualHomeAppreciation"
                      value={currentForm.percentAnnualHomeAppreciation}
                      onChange={handleInputChange}
                    />
                  </InputGroup>
                </div>
              </>
            )}

            <Separator className="py-[0.5px] h-1 rounded-sm bg-gray-300 dark:bg-gray-700" />

            {/* Calculated Values (only for new purchase) */}
            {!currentForm.isExistingProperty && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-lg">
                <InputGroup 
                  icon={DollarSign} 
                  label="Purchase Price"
                  hint={`Value after ${currentForm.monthOfPurchase} months of appreciation`}
                >
                  <div className="h-9 px-3 py-2 rounded-md border bg-gray-100 border-gray-950 text-sm font-medium">
                    {currentForm.homePrice && currentForm.percentAnnualHomeAppreciation
                      ? `$${getAdjustedPurchasePrice(
                          Number(currentForm.homePrice),
                          Number(currentForm.percentAnnualHomeAppreciation),
                          Number(currentForm.monthOfPurchase)
                        ).toLocaleString()}`
                      : '0'}
                  </div>
                </InputGroup>

                <InputGroup 
                  icon={DollarSign} 
                  label="Total Out of Pocket"
                  hint={Number(currentForm.percentDownPayment) !== 100 
                    ? "Down payment + closing (7%)" 
                    : "Cash purchase + closing (5%)"
                  }
                >
                  <div className="h-9 px-3 py-2 rounded-md border bg-gray-100 border-gray-950 text-sm font-medium">
                    {`$${Math.round(totalOutOfPocket).toLocaleString()}`}
                  </div>
                </InputGroup>
              </div>
            )}

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
              ? "Add properties to begin the simulation" 
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
              {homes.map((home) => {
                // If it's an existing property, let's show how many months ago it was purchased
                // We'll assume the House instance has a .monthsPaidSoFar if we passed it in.
                const monthsAgo = home.monthsPaidSoFar || 0;
                return (
                  <div
                    key={home.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">
                        ${Math.round(home.initialHomePrice).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        {home.isExistingProperty
                          ? `Purchased ~${monthsAgo} months ago • ${home.percentAnnualHomeAppreciation}% Future Appreciation •  ${home.percentAnnualInterestRate}% Interest Rate`
                          : `Purchase in ${home.monthOfPurchase} months • ${
                              home.percentDownPayment !== 100
                                ? `${home.percentDownPayment}% down • ${home.loanTermYears}y term •`
                                : "cash purchase •"
                            } ${home.percentAnnualHomeAppreciation}% appreciation`
                        }
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
                );
              })}
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