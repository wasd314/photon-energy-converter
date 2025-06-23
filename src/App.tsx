import { useState } from 'react';
import './App.css';
import EnergyUnit from './EnergyUnit';

const App = () => {
  const units = [
    {
      coefficient: 1,
      proportional: true,
      quantityName: 'Energy',
      mathQuantity: 'E',
      mathUnit: '\\mathrm{J}',
    },
    {
      coefficient: 1.60218e-19,
      proportional: true,
      // quantityName: 'Voltage',
      // mathQuantity: 'V',
      // mathUnit: '\\mathrm{V}',
      quantityName: '',
      mathQuantity: '',
      mathUnit: '\\mathrm{eV}',
    },
    {
      coefficient: 1.98645e-25,
      proportional: false,
      quantityName: 'Wavelength',
      mathQuantity: '\\lambda',
      mathUnit: '\\mathrm{m}',
    },
    {
      coefficient: 1.98645e-16,
      proportional: false,
      quantityName: '',
      mathQuantity: '',
      mathUnit: '\\mathrm{nm}',
    },
    {
      coefficient: 1.98645e-23,
      proportional: true,
      quantityName: 'Wavenumber',
      mathQuantity: '\\tilde{\\nu}',
      mathUnit: '\\mathrm{cm}^{-1}',
    },
    {
      coefficient: 6.62607e-34,
      proportional: false,
      quantityName: 'Period',
      mathQuantity: '\\tau',
      mathUnit: '\\mathrm{s}',
    },
    {
      coefficient: 6.62607e-19,
      proportional: false,
      quantityName: '',
      mathQuantity: '',
      mathUnit: '\\mathrm{fs}',
    },
    {
      coefficient: 6.62607e-34,
      proportional: true,
      quantityName: 'Frequency',
      mathQuantity: '\\nu',
      mathUnit: '\\mathrm{Hz}',
    },
    {
      coefficient: 6.62607e-22,
      proportional: true,
      quantityName: '',
      mathQuantity: '',
      mathUnit: '\\mathrm{THz}',
    },
    {
      coefficient: 1.05457e-34,
      proportional: true,
      quantityName: 'Angular frequency',
      mathQuantity: '\\omega',
      mathUnit: '\\mathrm{rad}\\, \\mathrm{s}^{-1}',
    },
    {
      coefficient: 1.05457e-19,
      proportional: true,
      quantityName: '',
      mathQuantity: '',
      mathUnit: '\\mathrm{rad}\\, \\mathrm{fs}^{-1}',
    },
    {
      coefficient: 1.38065e-23,
      proportional: true,
      quantityName: 'Temperature',
      mathQuantity: 'T',
      mathUnit: '\\mathrm{K}',
    },
    {
      coefficient: 9.27401e-24,
      proportional: true,
      quantityName: 'Magnetic flux density',
      mathQuantity: 'B',
      mathUnit: '\\mathrm{T}',
    },
  ];
  const [values, setValues] = useState(Array(units.length).fill(''));
  const updateEnergy = (i0: number, original: string, newEnergy: number) => {
    console.log(`\tupdateEnergy(${newEnergy})`);
    const newValues = units.map(({ coefficient, proportional }, i) => {
      if (i == i0) return original;
      const newValue = proportional
        ? newEnergy / coefficient
        : coefficient / newEnergy;
      // return newValue.toExponential(5);
      // return newValue.toFixed(5);
      return newValue.toPrecision(6);
    });
    setValues(newValues);
  };
  const updateValue = (i: number, newValue: string) => {
    console.log(`updateValue(${i}, "${newValue}")`);
    const newValues = values.slice();
    newValues[i] = newValue;
    setValues(newValues);
    const parsedQuantity = Number(newValue);
    const { proportional, coefficient } = units[i];
    const newEnergy = proportional
      ? parsedQuantity * coefficient
      : coefficient / parsedQuantity;
    if (newValue !== '' && !Number.isNaN(newEnergy)) {
      updateEnergy(i, newValue, newEnergy);
    }
  };
  const energyUnits = units.map(
    ({ quantityName, mathQuantity, mathUnit }, i) => (
      <EnergyUnit
        key={i}
        quantityName={quantityName}
        mathQuantity={mathQuantity}
        mathUnit={mathUnit}
        value={values[i]}
        setValue={(s) => updateValue(i, s)}
      />
    )
  );
  return (
    <>
      <h2>Photon energy converter</h2>
      <table>
        <tbody>{energyUnits}</tbody>
      </table>
    </>
  );
};

export default App;
