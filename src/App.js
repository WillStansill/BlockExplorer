import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [latestBlockTimestamp, setLatestBlockTimestamp] = useState();
  const [gasPrice, setGasPrice] = useState(); // Add a state variable for gas price
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    getBlockNumber();
  }, []);

  useEffect(() => {
    async function getLatestBlockTimeStamp() {
      try {
        const blockNumber = await alchemy.core.getBlockNumber();
        const latestBlock = await alchemy.core.getBlock(blockNumber);
        setLatestBlockTimestamp(new Date(latestBlock.timestamp * 1000).toString());
      } catch (error) {
        console.error('Error fetching latest block timestamp:', error);
      }
    }

    getLatestBlockTimeStamp();
  }, []);

  useEffect(() => {
    async function getGasPrice() {
      try {
        const gasPriceWei = await alchemy.core.getGasPrice();
        // Convert gasPriceWei to Gwei using the Alchemy SDK
        const gasPriceGwei = gasPriceWei.toString(); // Gas price is already in Gwei
        setGasPrice(gasPriceGwei + ' Gwei');
        console.log('Gas Price:', gasPriceGwei + ' Gwei');
      } catch (error) {
        console.error('Error fetching gas price:', error);
      }
    }
  
    getGasPrice();
  }, []);
  useEffect(() => {
    async function fetchTransactions() {
      try {
        const blockNumber = await alchemy.core.getBlockNumber();
        const blockWithTransactions = await alchemy.core.getBlockWithTransactions(blockNumber);
        setTransactions(blockWithTransactions.transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    }

    fetchTransactions();
  }, []); // Empty dependency array to run only once

  return (
    <div className="App">
      <h1>Ethereum Block Explorer</h1>
      <p>Current Block Number: {blockNumber}</p>
      <p>Latest Block Timestamp: {latestBlockTimestamp}</p>
      <p>Current Gas Price: {gasPrice}</p>

      {transactions.length > 0 && (
        <div className="transactions-section">
          <h2 className="sticky-title">Recent Transactions</h2>
          <div className="transactions-list-container">
          <ul className="transactions-list">
            {transactions.map((tx, index) => (
              <li key={index} className="transaction-item">
                Transaction Hash: {tx.hash} - From: {tx.from} - To: {tx.to}
              </li>
            ))}
          </ul>
        </div>
        </div>
      )}
    </div>
  );
}

export default App;
