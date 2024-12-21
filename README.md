DexAggregator with Linear Programming Optimization
Overview
The DexAggregator is a decentralized application (DApp) designed to optimize token swaps across Automated Market Makers (AMMs) by finding the best available prices, fees, and liquidity. The application utilizes linear programming through the GLPK.js library for optimal decision-making.
Features
Token Swapping:
Facilitates swaps between tokens using the most optimal AMM based on selected criteria.
Dynamic Optimization:
Supports optimization based on:
Lowest Price
Lowest Fees
Highest Liquidity
Historical Data:
Maintains and displays a history of all swaps.
User-Friendly Interface:
Built with React and Bootstrap for an interactive frontend.
Blockchain Integration:
Uses ethers.js for communication with Ethereum-based smart contracts.
Deployment Details
The application is deployed on the Sepolia Test Network and accessible at: https://hissing-dusk-fast.on-fleek.app/

Source code repository: GitHub - https://github.com/michalradzik/blockchain-dexAggregator

How Linear Programming Is Used
The optimization algorithm utilizes GLPK.js, a JavaScript library for linear programming, to evaluate and select the best AMM based on the following weighted factors:

Price
Fee
Liquidity
Steps of the Algorithm:
Normalization:
Data points for price, fee, and liquidity are normalized to bring them into comparable ranges.
Example:
Normalized Price = (currentPrice - minPrice) / (maxPrice - minPrice)
Normalized Fee = (currentFee - minFee) / (maxFee - minFee)
Normalized Liquidity = currentLiquidity / maxLiquidity
Weighting:
User-defined weights are applied to prioritize price, fee, or liquidity.
Linear Programming Problem Setup:
Defines the optimization objective:
Maximize liquidity (if prioritized).
Minimize price or fee (if prioritized).
Execution:
The algorithm solves the problem using GLPK.js and identifies the best AMM.
Highlighting the Result:
The optimal AMM is highlighted in the frontend for the user.
Requirements
Prerequisites
Node.js (v16.x or later)
NPM or Yarn
Ethereum wallet (e.g., MetaMask)
Smart Contracts
DexAggregator: Manages tokens, AMMs, and swap history.
Token: ERC20 token contract.
AMM: Automated Market Maker contract.
Installation
Clone the Repository
git clone https://github.com/michalradzik/blockchain-dexAggregator.git
cd blockchain-dexAggregator
Install Dependencies
bash
Skopiuj kod
npm install
Deployment
Deploy Smart Contracts:

Use the provided deploy.js script:
npx hardhat run scripts/deploy.js --network localhost
Update the DEX_AGGREGATOR_ADDRESS in the App.js file with the deployed contract address.
Start the Application:


npm start
Running the Optimization
Interaction
Open the application in your browser.
Select tokens and input the amount for swapping.
Choose a priority:
Price, Fee, or Liquidity.
Click Optimize to run the linear programming algorithm.
Debugging Optimization
Console Logs:
Review the normalized values and coefficients in the browser console.
Error Handling:
If the GLPK instance is not initialized, ensure that the library is correctly loaded.
Technologies Used
React.js: Frontend framework.
Bootstrap: Styling and layout.
ethers.js: Blockchain interaction.
GLPK.js: Linear programming library.
Hardhat: Ethereum development environment.
Troubleshooting
GLPK Initialization Fails:

Ensure the glpk.js library is imported and initialized properly in the App.js file.
Contract Interaction Issues:

Verify the deployed smart contract address in the DEX_AGGREGATOR_ADDRESS variable.
Swap Fails:

Confirm sufficient token allowances and balances.
Future Improvements
Add support for multiple networks.
Implement more advanced optimization criteria (e.g., risk analysis).
Improve frontend responsiveness for mobile devices.

