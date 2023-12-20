import React, { FC } from 'react';
import { RGBInputsProps } from '@/types'

const RGBInputs: FC<RGBInputsProps> = ({ rgb, handleChange }) => {
  return (
    <div className="mb-3 grid grid-flow-col place-content-center">
      <div>
        <label htmlFor="red" className="block text-center text-lg font-bold">R</label>
        <input
          name="red"
          className="border-0 bg-transparent px-2 py-1 text-center text-4xl  font-bold"
          type="number"
          value={rgb[0]}
          onChange={e => handleChange(0, e)}
          min="0"
          max="255"
          placeholder="000"
        />
      </div>
      <div>
        <label htmlFor="green" className="block text-center text-lg font-bold">G</label>
        <input
          name="green"
          className="border-0 bg-transparent px-2 py-1 text-center text-4xl font-bold"
          type="number"
          value={rgb[1]}
          onChange={e => handleChange(1, e)}
          min="0"
          max="255"
          placeholder="000"
        />
      </div>
      <div>
        <label htmlFor="blue" className="block text-center text-lg font-bold">B</label>
        <input
          name="blue"
          className="border-0 bg-transparent px-2 py-1 text-center text-4xl font-bold"
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
