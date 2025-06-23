// import { TextField } from '@mui/material';
import 'katex/dist/katex.min.css';
// import { useState } from 'react';
// import { InlineMath, BlockMath } from 'react-katex';
import { InlineMath } from 'react-katex';

export interface EnergyUnitProps {
  quantityName: string;
  mathQuantity: string;
  mathUnit: string;
  value: string;
  setValue: (newValue: string) => void;
}

const EnergyUnit = ({
  quantityName,
  mathQuantity,
  mathUnit,
  value,
  setValue,
}: EnergyUnitProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  return (
    <tr>
      <th>{quantityName}</th>
      <td>
        <InlineMath math={mathQuantity} />
      </td>
      <td>
        <InlineMath math="=" />
      </td>
      {/* <TextField value={value} onChange={handleChange} onBlur={handleBlur} /> */}
      <td>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </td>
      <td>
        <InlineMath math={mathUnit} />
      </td>
    </tr>
  );
};
export default EnergyUnit;
