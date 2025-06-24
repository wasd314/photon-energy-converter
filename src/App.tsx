import { useState } from 'react';
import './App.css';
import EnergyUnit from './EnergyUnit';
import { units } from './Units';

const App = () => {
  const [values, setValues] = useState(Array(units.length).fill(''));
  const updateEnergy = (i0: number, original: string, newEnergy: number) => {
    const newValues = units.map(({ coefficient, proportional }, i) => {
      if (i == i0) return original;
      const newValue = proportional
        ? newEnergy / coefficient
        : coefficient / newEnergy;
      // return newValue.toExponential(5);
      // return newValue.toFixed(5);
      return newValue.toPrecision(10);
    });
    setValues(newValues);
  };
  const updateValue = (i: number, newValue: string) => {
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
  const handleClick = () => {
    setValues(Array(units.length).fill(''));
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
      <div>
        <button onClick={handleClick}>Clear</button>
      </div>
    </>
  );
};

export default App;
