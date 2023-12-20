import React, { FC } from 'react';
import { RGBInputsProps } from '@/types'

const RGBInputs: FC<RGBInputsProps> = ({ rgb, handleChange }) => {
  return (
    <div className="grid grid-flow-col place-content-center mb-3">
      <div>
        <label htmlFor="red" className="block text-lg font-bold text-center">R</label>
        <input
          name="red"
          className="bg-transparent text-4xl text-center font-bold px-2 py-1  border-0"
          type="number"
          value={rgb[0]}
          onChange={e => handleChange(0, e)}
          min="0"
          max="255"
          placeholder="000"
        />
      </div>
      <div>
        <label htmlFor="green" className="block text-lg font-bold text-center">G</label>
        <input
          name="green"
          className="bg-transparent text-4xl text-center font-bold px-2 py-1 border-0"
          type="number"
          value={rgb[1]}
          onChange={e => handleChange(1, e)}
          min="0"
          max="255"
          placeholder="000"
        />
      </div>
      <div>
        <label htmlFor="blue" className="block text-lg font-bold text-center">B</label>
        <input
          name="blue"
          className="bg-transparent text-4xl text-center font-bold px-2 py-1 border-0"
          type="number"
          value={rgb[2]}
          onChange={e => handleChange(2, e)}
          min="0"
          max="255"
          placeholder="000"
        />
      </div>
    </div>
  );
};

export default RGBInputs;
