import React, { useState, useEffect } from 'react';
import { TezosToolkit } from '@taquito/taquito';
import { char2Bytes } from '@taquito/utils';

const App = () => {
  const [tezos, setTezos] = useState(null);
  const [contract, setContract] = useState(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const Tezos = new TezosToolkit('https://mainnet.smartpy.io');
    setTezos(Tezos);
  }, []);

  const connectWallet = async () => {
    try {
      const wallet = await tezos.wallet.at('KT1....'); // Contract address
      setContract(wallet);
    } catch (error) {
      console.error('Failed to connect wallet', error);
    }
  };

  const updateValue = async (newValue) => {
    try {
      const op = await contract.methods.update_value(newValue).send();
      await op.confirmation();
      setValue(newValue);
      console.log('Value updated to:', newValue);
    } catch (error) {
      console.error('Error updating value:', error);
    }
  };

  return (
    <div>
      <h1>Tezchain - Dynamic NFT Portfolio</h1>
      <button onClick={connectWallet}>Connect Wallet</button>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={() => updateValue(value)}>Update Value</button>
    </div>
  );
};

export default App;
