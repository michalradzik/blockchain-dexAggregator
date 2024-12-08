// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract DexAggregator {
    struct Token {
        string name;
        string symbol;
        address tokenAddress;
    }

    struct AMM {
        address ammAddress;
        uint256 makerFee;
        uint256 takerFee;
        uint256 liquidityToken1;
        uint256 liquidityToken2;
        string name;
    }

    struct Swap {
        address user;          // Adres użytkownika
        address ammAddress;    // Adres AMM
        address tokenIn;       // Adres tokena wejściowego
        address tokenOut;      // Adres tokena wyjściowego
        uint256 amountIn;      // Ilość tokena wejściowego
        uint256 amountOut;     // Ilość tokena wyjściowego
        uint256 timestamp;     // Znacznik czasu
        bytes32 txHash;        // Hash transakcji
        string ammName;
    }

    Token[] public tokens; // Przechowywanie tokenów
    AMM[] public amms;
    Swap[] public swapHistory; // Historia swapów

    event TokenAdded(string name, string symbol, address tokenAddress);
    event ammAdded(address ammAddress, uint256 makerFee, uint256 takerFee, uint256 liquidityToken1, uint256 liquidityToken2, string name);
    event SwapExecuted(
        address indexed user,
        address indexed ammAddress,
        address indexed tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 timestamp,
        bytes32 txHash,
        string ammName
    );

    function addToken(string memory _name, string memory _symbol, address _tokenAddress) external {
        tokens.push(Token({
            name: _name,
            symbol: _symbol,
            tokenAddress: _tokenAddress
        }));
        emit TokenAdded(_name, _symbol, _tokenAddress);
    }

    function getTokens() external view returns (Token[] memory) {
        return tokens;
    } 

    function addAmm(
        address _ammAddress,
        uint256 _makerFee,
        uint256 _takerFee,
        uint256 _liquidityToken1,
        uint256 _liquidityToken2,
        string memory _name
    ) external {
        amms.push(AMM({
            ammAddress: _ammAddress,
            makerFee: _makerFee,
            takerFee: _takerFee,
            liquidityToken1: _liquidityToken1,
            liquidityToken2: _liquidityToken2,
            name: _name
        }));
        emit ammAdded(_ammAddress, _makerFee, _takerFee, _liquidityToken1, _liquidityToken2, _name);
    }

    function getAmms() external view returns (AMM[] memory) {
        return amms;
    }

    function executeSwap(
        address ammAddress,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        bytes32 transactionHash, // Hash transakcji przekazywany jako argument
        string memory ammName
    ) external {
        // Dodanie danych swapu do historii
        swapHistory.push(Swap({
            user: msg.sender,
            ammAddress: ammAddress,
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            amountIn: amountIn,
            amountOut: amountOut,
            timestamp: block.timestamp,
            txHash: transactionHash,
            ammName: ammName
        }));

        // Emitowanie zdarzenia po wykonaniu swapu
        emit SwapExecuted(
            msg.sender,
            ammAddress,
            tokenIn,
            tokenOut,
            amountIn,
            amountOut,
            block.timestamp,
            transactionHash,
            ammName

        );
    }

    function getSwapHistory() external view returns (Swap[] memory) {
        return swapHistory;
    }
}

contract DexAggregatorFactory {
    address public deployedDexAggregator;

    event DexAggregatorDeployed(address indexed contractAddress);

    function deployDexAggregator() external {
        DexAggregator dexAggregator = new DexAggregator();
        deployedDexAggregator = address(dexAggregator);

        emit DexAggregatorDeployed(deployedDexAggregator); // Emituj zdarzenie z adresem wdrożonego kontraktu
    }

    function getDeployedDexAggregator() external view returns (address) {
        return deployedDexAggregator;
    }
}
