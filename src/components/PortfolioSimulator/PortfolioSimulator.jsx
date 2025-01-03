// PortfolioSimulator.jsx

"use client";
import React, { useState } from "react";
import { HomeListBuilder } from "@/components/PortfolioSimulator/HomeListBuilder/HomeListBuilder";
import { SimulationResults } from "@/components/PortfolioSimulator/SimulationResults/SimulationResults";
import { runSimulation } from "@/lib/Simulation";

const PortfolioSimulator = () => {
    const [simulationData, setSimulationData] = useState(null);
    const [showResults, setShowResults] = useState(false);

    const handleCalculate = (data) => {
        const results = runSimulation(data.homes, data.projectionYears, data.legacyYears);
        setSimulationData({
            homes: data.homes,
            projectionYears: data.projectionYears,
            legacyYears: data.legacyYears,
            results: results
        });
        setShowResults(true);
    };

    const handleReset = () => {
        setSimulationData(null);
        setShowResults(false);
    };

    const handleEdit = () => {
        // Keep the existing simulation data when editing
        setShowResults(false);
    };

    return (
        <div className="p-4">
            {!showResults ? (
                <HomeListBuilder 
                    onCalculate={handleCalculate}
                    initialData={simulationData}
                />
            ) : (
                <SimulationResults
                    homes={simulationData.homes}
                    projectionYears={simulationData.projectionYears}
                    legacyYears={simulationData.legacyYears}
                    results={simulationData.results}
                    onReset={handleReset}
                    onEdit={handleEdit}
                />
            )}
        </div>
    );
};

export default PortfolioSimulator;