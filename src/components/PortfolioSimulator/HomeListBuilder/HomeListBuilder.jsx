"use client";
import React, { useState, useMemo } from "react";
import DFYLogo from "../../../../public/DFYLogo.png";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InputGroup } from "@/components/ui/InputGroup";
import WelcomeBanner from "./components/WelcomeBanner";
import { Trash2, Plus, Home, DollarSign, Calendar, Percent, TrendingUp, Pencil } from "lucide-react";
import House from "@/lib/House";
import { generateId } from "@/lib/utils/utils.js";
import ExistingPropertyToggle from "./components/ExistingPropertyToggle";
import AdvancedSettings from "./components/AdvancedSettings";
import PropertyTypeToggle from "./components/PropertyTypeToggle";

export const HomeListBuilder = ({ onCalculate, initialData }) => {
  // =====================
  // 1. Overall Simulation Settings
  // =====================
  const [projectionYears, setProjectionYears] = useState(initialData?.projectionYears || 15);
  const [legacyYears, setLegacyYears] = useState(initialData?.legacyYears || 25);
  const [growthStrategy, setGrowthStrategy] = useState(() => {
    if (initialData?.homes) {
      return initialData?.growthStrategy === "reinvestment" ? "reinvestment" : "payOffPrincipal";
    }
    console.log(initialData);
    return "reinvestment";
  });
  const [retirementIncomeStrategy, setRetirementIncomeStrategy] = useState(() => {
    if (initialData?.retirementIncomeStrategy) {
      return initialData.retirementIncomeStrategy;
    }
    return "refinancing"; // Default to refinancing
  });

  // Advanced Settings
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [yearsBetweenRefinances, setYearsBetweenRefinances] = useState(initialData?.yearsBetweenRefinances || 1);
  const [percentAppreciationToWithdraw, setPercentAppreciationToWithdraw] = useState(
    initialData?.percentAppreciationToWithdraw || 75
  );

  // Edit Mode State
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingHomeId, setEditingHomeId] = useState(null);

  // =====================
  // 2. Form State
  // =====================
  const [currentForm, setCurrentForm] = useState({
    // Fields for brand-new purchase:
    monthOfPurchase: 0,
    homePrice: initialData ? initialData?.results?.homes[0]?.initialHomePrice : 275000,
    percentDownPayment: initialData ? initialData?.results?.homes[0]?.percentDownPayment : 25,
    loanTermYears: 30,

    // Common to both:
    percentAnnualInterestRate: "6.5",
    percentAnnualHomeAppreciation: "5.0",
    isMediumTerm: false,

    // Fields for existing property:
    isExistingProperty: false,
    purchaseDate: "", // e.g. "2018-06-15"
    originalLoanAmount: "",
    originalLoanTermYears: 30,
    currentHomeValue: "",
    monthsPaidSoFar: 0,
  });

  // Changed to store home configurations instead of House objects
  const [homeConfigs, setHomeConfigs] = useState(() => {
    if (!initialData?.homes) return [];

    return initialData.homes.map((home) => {
      const baseConfig = {
        id: generateId(),
        percentAnnualHomeAppreciation: home.percentAnnualHomeAppreciation,
        percentAnnualInterestRate: home.percentAnnualInterestRate,
        willReinvest: home.willReinvest,
        isExistingProperty: home.isExistingProperty,
        isMediumTerm: home.isMediumTerm || false,
      };

      return home.isExistingProperty
        ? {
            ...baseConfig,
            datePurchased: home.datePurchased,
            originalLoanAmount: home.originalLoanAmount,
            originalLoanTermYears: home.originalLoanTermYears,
            monthsPaidSoFar: home.monthsPaidSoFar,
            currentHomeValue: home.initialHomePrice,
          }
        : {
            ...baseConfig,
            monthOfPurchase: home.monthOfPurchase,
            homePrice: home.initialHomePrice,
            percentDownPayment: home.percentDownPayment,
            loanTermYears: home.loanTermYears,
          };
    });
  });

  const [error, setError] = useState("");

  // =====================
  // 3. Handlers
  // =====================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "percentAnnualInterestRate" || name === "percentAnnualHomeAppreciation") {
      if (value === "" || value === "." || /^\d*\.?\d*$/.test(value)) {
        setCurrentForm((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    if (name === "homePrice" || name === "originalLoanAmount" || name === "currentHomeValue") {
      const rawValue = value.replace(/,/g, "");
      if (rawValue === "" || rawValue === ".") {
        setCurrentForm((prev) => ({ ...prev, [name]: rawValue }));
        return;
      }
      const numValue = parseFloat(rawValue);
      if (!isNaN(numValue)) {
        setCurrentForm((prev) => ({ ...prev, [name]: numValue }));
      }
      return;
    }

    setCurrentForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleExistingProperty = (e) => {
    // Handle both direct event objects and custom change events
    const isExisting = e?.target?.checked ?? e;
    setCurrentForm((prev) => ({ ...prev, isExistingProperty: isExisting }));
  };

  const togglePropertyType = (isMediumTerm) => {
    setCurrentForm((prev) => ({
      ...prev,
      isMediumTerm: isMediumTerm,
      // Suggest a lower appreciation rate by lowering the setting
      percentAnnualHomeAppreciation:
        isMediumTerm && prev.percentAnnualHomeAppreciation > 4 ? "4" : prev.percentAnnualHomeAppreciation,
    }));
  };

  const resetForm = () => {
    setCurrentForm({
      // Fields for brand-new purchase:
      monthOfPurchase: 0,
      homePrice: 275000,
      percentDownPayment: 25,
      loanTermYears: 30,

      // Common to both:
      percentAnnualInterestRate: "6.5",
      percentAnnualHomeAppreciation: "5.0",
      isMediumTerm: false,

      // Fields for existing property:
      isExistingProperty: false,
      purchaseDate: "",
      originalLoanAmount: "",
      originalLoanTermYears: 30,
      currentHomeValue: "",
      monthsPaidSoFar: 0,
    });
    setIsEditMode(false);
    setEditingHomeId(null);
  };

  const handleEditHome = (id) => {
    const homeToEdit = homeConfigs.find(home => home.id === id);
    if (homeToEdit) {
      setCurrentForm({
        isExistingProperty: homeToEdit.isExistingProperty,
        isMediumTerm: homeToEdit.isMediumTerm || false,
        percentAnnualHomeAppreciation: homeToEdit.percentAnnualHomeAppreciation.toString(),
        percentAnnualInterestRate: homeToEdit.percentAnnualInterestRate.toString(),
        ...(homeToEdit.isExistingProperty ? {
          purchaseDate: homeToEdit.datePurchased,
          originalLoanAmount: homeToEdit.originalLoanAmount,
          originalLoanTermYears: homeToEdit.originalLoanTermYears,
          currentHomeValue: homeToEdit.currentHomeValue,
        } : {
          monthOfPurchase: homeToEdit.monthOfPurchase,
          homePrice: homeToEdit.homePrice,
          percentDownPayment: homeToEdit.percentDownPayment,
          loanTermYears: homeToEdit.loanTermYears,
        })
      });
      
      setIsEditMode(true);
      setEditingHomeId(id);
    }
  };

  const addHome = () => {
    setError("");
    if (currentForm.isExistingProperty) {
      if (!currentForm.purchaseDate || !currentForm.originalLoanAmount || !currentForm.currentHomeValue) {
        setError(
          "Please fill out the purchase date, original loan amount, and current home value for an existing property."
        );
        return;
      }
      const now = new Date();
      const purchaseDt = new Date(currentForm.purchaseDate);
      if (purchaseDt > now) {
        setError("Purchase date cannot be in the future.");
        return;
      }
      if (
        !currentForm.percentAnnualHomeAppreciation ||
        currentForm.percentAnnualHomeAppreciation < 3.5 ||
        currentForm.percentAnnualHomeAppreciation > 6.5
      ) {
        setError("Please enter a home value appreciation rate in the range of 3.5% to 6.5%");
        return;
      }
      if (
        !currentForm.percentAnnualInterestRate ||
        currentForm.percentAnnualInterestRate < 1 ||
        currentForm.percentAnnualInterestRate > 10
      ) {
        setError("Please enter an interest rate between 1% to 10%");
        return;
      }
      const monthsPaidSoFar = Math.max(0, Math.floor((now - purchaseDt) / (1000 * 60 * 60 * 24 * 30.43)));

      const newHomeConfig = {
        id: generateId(),
        isExistingProperty: true,
        percentAnnualHomeAppreciation: Number(currentForm.percentAnnualHomeAppreciation),
        percentAnnualInterestRate: Number(currentForm.percentAnnualInterestRate),
        willReinvest: growthStrategy === "reinvestment",
        isMediumTerm: currentForm.isMediumTerm,
        datePurchased: currentForm.purchaseDate,
        originalLoanAmount: Number(currentForm.originalLoanAmount),
        originalLoanTermYears: Number(currentForm.originalLoanTermYears),
        monthsPaidSoFar: monthsPaidSoFar,
        currentHomeValue: Number(currentForm.currentHomeValue),
      };

      setHomeConfigs((prev) => [...prev, newHomeConfig]);
      resetForm();
    } else {
      if (
        !currentForm.percentDownPayment ||
        currentForm.percentDownPayment < 1 ||
        currentForm.percentDownPayment > 100
      ) {
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
      if (
        !currentForm.percentAnnualHomeAppreciation ||
        currentForm.percentAnnualHomeAppreciation < 3.5 ||
        currentForm.percentAnnualHomeAppreciation > 6.5
      ) {
        setError("Please enter a home value appreciation rate in the range of 3.5% to 6.5%");
        return;
      }
      if (
        currentForm.monthOfPurchase === "" ||
        currentForm.monthOfPurchase < 0 ||
        currentForm.monthOfPurchase > projectionYears * 12
      ) {
        setError("Please enter a purchase month from 0 to the month the simulation ends");
        return;
      }
      if (
        !currentForm.percentAnnualInterestRate ||
        currentForm.percentAnnualInterestRate < 1 ||
        currentForm.percentAnnualInterestRate > 10
      ) {
        setError("Please enter an interest rate between 1% to 10%");
        return;
      }

      const adjustedHomePrice = getAdjustedPurchasePrice(
        Number(currentForm.homePrice),
        Number(currentForm.percentAnnualHomeAppreciation),
        Number(currentForm.monthOfPurchase)
      );

      const newHomeConfig = {
        id: generateId(),
        isExistingProperty: false,
        monthOfPurchase: Number(currentForm.monthOfPurchase),
        homePrice: Number(adjustedHomePrice),
        percentAnnualHomeAppreciation: Number(currentForm.percentAnnualHomeAppreciation),
        percentDownPayment: Number(currentForm.percentDownPayment),
        percentAnnualInterestRate: Number(currentForm.percentAnnualInterestRate),
        loanTermYears: Number(currentForm.loanTermYears),
        willReinvest: growthStrategy === "reinvestment",
        isMediumTerm: currentForm.isMediumTerm,
      };

      setHomeConfigs((prev) => [...prev, newHomeConfig]);
      resetForm();
    }
  };

  const updateHome = () => {
    setError("");
    
    if (currentForm.isExistingProperty) {
      if (!currentForm.purchaseDate || !currentForm.originalLoanAmount || !currentForm.currentHomeValue) {
        setError(
          "Please fill out the purchase date, original loan amount, and current home value for an existing property."
        );
        return;
      }
      const now = new Date();
      const purchaseDt = new Date(currentForm.purchaseDate);
      if (purchaseDt > now) {
        setError("Purchase date cannot be in the future.");
        return;
      }
      if (
        !currentForm.percentAnnualHomeAppreciation ||
        currentForm.percentAnnualHomeAppreciation < 3.5 ||
        currentForm.percentAnnualHomeAppreciation > 6.5
      ) {
        setError("Please enter a home value appreciation rate in the range of 3.5% to 6.5%");
        return;
      }
      if (
        !currentForm.percentAnnualInterestRate ||
        currentForm.percentAnnualInterestRate < 1 ||
        currentForm.percentAnnualInterestRate > 10
      ) {
        setError("Please enter an interest rate between 1% to 10%");
        return;
      }
      
      const monthsPaidSoFar = Math.max(0, Math.floor((now - purchaseDt) / (1000 * 60 * 60 * 24 * 30.43)));

      const updatedConfig = {
        id: editingHomeId,
        isExistingProperty: true,
        percentAnnualHomeAppreciation: Number(currentForm.percentAnnualHomeAppreciation),
        percentAnnualInterestRate: Number(currentForm.percentAnnualInterestRate),
        willReinvest: growthStrategy === "reinvestment",
        isMediumTerm: currentForm.isMediumTerm,
        datePurchased: currentForm.purchaseDate,
        originalLoanAmount: Number(currentForm.originalLoanAmount),
        originalLoanTermYears: Number(currentForm.originalLoanTermYears),
        monthsPaidSoFar: monthsPaidSoFar,
        currentHomeValue: Number(currentForm.currentHomeValue),
      };

      setHomeConfigs(prev => prev.map(config => 
        config.id === editingHomeId ? updatedConfig : config
      ));
    } else {
      if (
        !currentForm.percentDownPayment ||
        currentForm.percentDownPayment < 1 ||
        currentForm.percentDownPayment > 100
      ) {
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
      if (
        !currentForm.percentAnnualHomeAppreciation ||
        currentForm.percentAnnualHomeAppreciation < 3.5 ||
        currentForm.percentAnnualHomeAppreciation > 6.5
      ) {
        setError("Please enter a home value appreciation rate in the range of 3.5% to 6.5%");
        return;
      }
      if (
        currentForm.monthOfPurchase === "" ||
        currentForm.monthOfPurchase < 0 ||
        currentForm.monthOfPurchase > projectionYears * 12
      ) {
        setError("Please enter a purchase month from 0 to the month the simulation ends");
        return;
      }
      if (
        !currentForm.percentAnnualInterestRate ||
        currentForm.percentAnnualInterestRate < 1 ||
        currentForm.percentAnnualInterestRate > 10
      ) {
        setError("Please enter an interest rate between 1% to 10%");
        return;
      }

      const adjustedHomePrice = getAdjustedPurchasePrice(
        Number(currentForm.homePrice),
        Number(currentForm.percentAnnualHomeAppreciation),
        Number(currentForm.monthOfPurchase)
      );

      const updatedConfig = {
        id: editingHomeId,
        isExistingProperty: false,
        monthOfPurchase: Number(currentForm.monthOfPurchase),
        homePrice: Number(adjustedHomePrice),
        percentAnnualHomeAppreciation: Number(currentForm.percentAnnualHomeAppreciation),
        percentDownPayment: Number(currentForm.percentDownPayment),
        percentAnnualInterestRate: Number(currentForm.percentAnnualInterestRate),
        loanTermYears: Number(currentForm.loanTermYears),
        willReinvest: growthStrategy === "reinvestment",
        isMediumTerm: currentForm.isMediumTerm,
      };

      setHomeConfigs(prev => prev.map(config => 
        config.id === editingHomeId ? updatedConfig : config
      ));
    }
    
    resetForm();
  };

  const getAdjustedPurchasePrice = (initialPrice, appreciationRate, months) => {
    return Math.round(initialPrice * Math.pow(1 + appreciationRate / 100, months / 12));
  };

  const removeHome = (id) => {
    setHomeConfigs(homeConfigs.filter((home) => home.id !== id));
  };

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
    
    // Convert configurations to House objects only when needed for calculation
    const houseObjects = homeConfigs.map(config => {
      // Create a new config object with the correctly named properties
      const houseConfig = { ...config };
      
      // For new properties, handle different naming conventions
      if (!config.isExistingProperty) {
        // If homePrice is missing but initialHomePrice exists, use that
        if (config.homePrice === undefined && config.initialHomePrice !== undefined) {
          houseConfig.homePrice = config.initialHomePrice;
          delete houseConfig.initialHomePrice;
        }
        // If neither is defined, set a default to avoid errors
        if (houseConfig.homePrice === undefined && houseConfig.initialHomePrice === undefined) {
          console.warn('Home price missing, using default value');
          houseConfig.homePrice = 275000;
        }
      }
      
      // For existing properties, ensure currentHomeValue exists
      if (config.isExistingProperty && config.currentHomeValue === undefined) {
        console.warn('Current home value missing for existing property, using initialHomePrice as fallback');
        houseConfig.currentHomeValue = config.initialHomePrice || 275000;
      }
      
      return new House(houseConfig);
    });
    
    onCalculate({
      homes: houseObjects,
      growthStrategy,
      retirementIncomeStrategy,
      projectionYears,
      legacyYears,
      yearsBetweenRefinances,
      percentAppreciationToWithdraw,
    });
  };

  const totalOutOfPocket = useMemo(() => {
    if (currentForm.isExistingProperty) return 0;
    if (!currentForm.homePrice || !currentForm.percentDownPayment) return 0;

    const adjustedPrice = getAdjustedPurchasePrice(
      Number(currentForm.homePrice),
      Number(currentForm.percentAnnualHomeAppreciation),
      Number(currentForm.monthOfPurchase)
    );
    const downPaymentAmount = adjustedPrice * (Number(currentForm.percentDownPayment) / 100);
    const closingCosts = Number(currentForm.percentDownPayment) !== 100 ? adjustedPrice * 0.07 : adjustedPrice * 0.05;

    // Add furnishing costs for medium-term rentals
    const furnishingCosts = currentForm.isMediumTerm ? adjustedPrice * 0.05 : 0;

    return downPaymentAmount + closingCosts + furnishingCosts;
  }, [
    currentForm.homePrice,
    currentForm.percentDownPayment,
    currentForm.percentAnnualHomeAppreciation,
    currentForm.monthOfPurchase,
    currentForm.isExistingProperty,
    currentForm.isMediumTerm,
  ]);

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
          <CardContent className="space-y-3">
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
              description="Determines whether simulation focuses on equity-based or rent-based income."
            >
              <Select
                defaultValue={growthStrategy}
                onValueChange={(value) => {
                  setGrowthStrategy(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reinvestment">
                    <div>
                      <div className="font-medium">Reinvesting</div>
                      <div className="text-xs text-gray-500">
                        Use refinancing to buy more properties during the growth phase
                      </div>
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

            <InputGroup
              icon={Percent}
              label="Retirement Income Strategy"
              description="How you'll generate income during your retirement phase."
              // Only show this when legacyYears > 0
              disabled={legacyYears === 0}
            >
              <Select
                defaultValue={retirementIncomeStrategy}
                onValueChange={(value) => {
                  setRetirementIncomeStrategy(value);
                }}
                disabled={legacyYears === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="refinancing">
                    <div>
                      <div className="font-medium">Buy Borrow Beyond</div>
                      <div className="text-xs text-gray-500">
                        Use periodic refinancing to generate tax-free income during retirement
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="rental">
                    <div>
                      <div className="font-medium">Rental Income</div>
                      <div className="text-xs text-gray-500">Generate income from rent without refinancing</div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </InputGroup>

            <AdvancedSettings
              isOpen={showAdvancedSettings}
              onToggle={() => setShowAdvancedSettings(!showAdvancedSettings)}
              yearsBetweenRefinances={yearsBetweenRefinances}
              onYearsBetweenRefinancesChange={(value) => {
                if (value >= 1 && value <= 5) {
                  setYearsBetweenRefinances(value);
                }
              }}
              percentAppreciationToWithdraw={percentAppreciationToWithdraw}
              onPercentAppreciationChange={(value) => {
                if (value >= 25 && value <= 100) {
                  setPercentAppreciationToWithdraw(value);
                }
              }}
              isReinvestmentStrategy={growthStrategy === "reinvestment"}
            />
          </CardContent>
        </Card>

        {/* Property Configuration Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">{isEditMode ? "Edit Property" : "Property Configuration"}</CardTitle>
              <CardDescription>{isEditMode ? "Modify property details" : "Define property details and financing"}</CardDescription>
            </div>
            <div className="flex flex-col gap-2">
              <ExistingPropertyToggle isChecked={currentForm.isExistingProperty} onToggle={toggleExistingProperty} />
              <PropertyTypeToggle isMediumTerm={currentForm.isMediumTerm} onToggle={togglePropertyType} />
            </div>
          </CardHeader>
          {currentForm.isMediumTerm && (
            <div className="px-6 pt-1 pb-2">
              <div className="p-2 bg-blue-50 rounded-md border border-blue-100 text-sm text-blue-800">
                <p className="leading-relaxed">
                  <strong>MBML+ Membership Required:</strong> Mid-term rentals offer higher monthly cash flow but with a
                  lower leverage ratio. Upgrade to MBML+ to access this property type.
                </p>
              </div>
            </div>
          )}
          <CardContent className="space-y-6">
            {!currentForm.isExistingProperty && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputGroup icon={Home} label="Home Value Today ($)" hint="200k - 1M">
                    <Input
                      type="text"
                      name="homePrice"
                      value={formatNumberWithCommas(currentForm.homePrice)}
                      onChange={handleInputChange}
                    />
                  </InputGroup>

                  <InputGroup icon={Calendar} label="Months from Now" hint="When to purchase">
                    <Input
                      type="number"
                      name="monthOfPurchase"
                      value={currentForm.monthOfPurchase}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setCurrentForm((prev) => ({ ...prev, monthOfPurchase: isNaN(val) ? "" : val }));
                      }}
                      min={0}
                    />
                  </InputGroup>

                  <InputGroup icon={DollarSign} label="Down Payment (%)" hint="E.g. 25%">
                    <Input
                      type="number"
                      name="percentDownPayment"
                      value={currentForm.percentDownPayment}
                      onChange={(e) => {
                        let val = parseFloat(e.target.value);
                        if (isNaN(val)) val = "";
                        setCurrentForm((prev) => ({ ...prev, percentDownPayment: val }));
                      }}
                    />
                  </InputGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputGroup icon={Calendar} label="Loan Term (Years)" hint="15, 20, or 30">
                    <Input
                      type="number"
                      name="loanTermYears"
                      value={currentForm.loanTermYears}
                      onChange={(e) => {
                        let val = parseInt(e.target.value);
                        if (isNaN(val)) val = "";
                        setCurrentForm((prev) => ({ ...prev, loanTermYears: val }));
                      }}
                      disabled={Number(currentForm.percentDownPayment) === 100}
                    />
                  </InputGroup>

                  <InputGroup icon={Percent} label="Annual Interest Rate" hint="e.g. 6.5">
                    <Input
                      type="text"
                      name="percentAnnualInterestRate"
                      value={currentForm.percentAnnualInterestRate}
                      onChange={handleInputChange}
                    />
                  </InputGroup>

                  <InputGroup icon={TrendingUp} label="Annual Appreciation (%)" hint="3.5 - 6.5">
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

            {currentForm.isExistingProperty && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputGroup icon={Calendar} label="Original Purchase Date" hint="MM-DD-YYYY">
                    <Input
                      type="date"
                      name="purchaseDate"
                      value={currentForm.purchaseDate}
                      onChange={(e) => {
                        setCurrentForm((prev) => ({ ...prev, purchaseDate: e.target.value }));
                      }}
                    />
                  </InputGroup>

                  <InputGroup icon={DollarSign} label="Original Loan Amount">
                    <Input
                      type="text"
                      name="originalLoanAmount"
                      value={formatNumberWithCommas(currentForm.originalLoanAmount)}
                      onChange={handleInputChange}
                    />
                  </InputGroup>

                  <InputGroup icon={Calendar} label="Original Loan Term (yrs)">
                    <Input
                      type="number"
                      name="originalLoanTermYears"
                      value={currentForm.originalLoanTermYears}
                      onChange={(e) => {
                        let val = parseInt(e.target.value);
                        if (isNaN(val)) val = "";
                        setCurrentForm((prev) => ({ ...prev, originalLoanTermYears: val }));
                      }}
                    />
                  </InputGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputGroup icon={Home} label="Current Home Value" hint="What is it worth now?">
                    <Input
                      type="text"
                      name="currentHomeValue"
                      value={formatNumberWithCommas(currentForm.currentHomeValue)}
                      onChange={handleInputChange}
                    />
                  </InputGroup>

                  <InputGroup icon={Percent} label="Annual Interest Rate" hint="e.g. 6.5">
                    <Input
                      type="text"
                      name="percentAnnualInterestRate"
                      value={currentForm.percentAnnualInterestRate}
                      onChange={handleInputChange}
                    />
                  </InputGroup>

                  <InputGroup icon={TrendingUp} label="Annual Appreciation (%)" hint="3.5 - 6.5">
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
                      : "0"}
                  </div>
                </InputGroup>

                <InputGroup
                  icon={DollarSign}
                  label="Total Out of Pocket"
                  hint={
                    Number(currentForm.percentDownPayment) !== 100
                      ? currentForm.isMediumTerm
                        ? "Down payment + closing (7%) + furnishing (5%)"
                        : "Down payment + closing (7%)"
                      : currentForm.isMediumTerm
                      ? "Cash purchase + closing (5%) + furnishing (5%)"
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
              <Button onClick={isEditMode ? updateHome : addHome} className="bg-orange-500 hover:bg-orange-600">
                {isEditMode ? (
                  <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Update Property
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Property
                  </>
                )}
              </Button>
              {isEditMode && (
                <Button 
                  onClick={resetForm} variant="outline" className="ml-2 bg-white hover:bg-gray-50">
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Added Properties List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Property Portfolio</CardTitle>
          <CardDescription>
            {homeConfigs.length === 0
              ? "Add properties to begin the simulation"
              : `${homeConfigs.length} ${homeConfigs.length === 1 ? "property" : "properties"} in portfolio`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {homeConfigs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Home className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No properties added yet</p>
              <p className="text-sm">Use the form above to add your first property</p>
            </div>
          ) : (
            <div className="space-y-2">
              {homeConfigs.map((home) => {
                const monthsAgo = home.monthsPaidSoFar || 0;
                const displayPrice = home.isExistingProperty ? home.currentHomeValue : home.homePrice;
                console.log('Home config for display:', home, 'Display price:', displayPrice);
                return (
                  <div
                    key={home.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="space-y-1">
                      <div className="font-medium flex items-center gap-2">
                        ${displayPrice ? Math.round(displayPrice).toLocaleString() : "0"}
                        {home.isMediumTerm && (
                          <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                            Medium-Term
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {home.isExistingProperty
                          ? `Purchased ~${monthsAgo} months ago • ${home.percentAnnualHomeAppreciation}% Future Appreciation • ${home.percentAnnualInterestRate}% Interest Rate`
                          : `Purchase in ${home.monthOfPurchase} months • ${
                              home.percentDownPayment !== 100
                                ? `${home.percentDownPayment}% down • ${home.loanTermYears} yr term •`
                                : "cash purchase •"
                            } ${home.percentAnnualHomeAppreciation}% appreciation`}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditHome(home.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHome(home.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
          disabled={homeConfigs.length === 0}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 px-8"
        >
          Run Simulation
        </Button>
      </div>
    </div>
  );
};

export default HomeListBuilder;
