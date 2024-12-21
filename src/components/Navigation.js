import { useSelector, useDispatch } from 'react-redux'
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Blockies from 'react-blockies'

import { loadAccount, loadBalances } from '../store/interactions'

import config from '../config.json'

const Navigation = () => {
  const chainId = useSelector(state => state.provider.chainId)
  const account = useSelector(state => state.provider.account)
  const tokens = useSelector(state => state.tokens.contracts)
  const amm = useSelector(state => state.amm.contract)

  const dispatch = useDispatch()

  const connectHandler = async () => {
    const account = await loadAccount(dispatch)
    await loadBalances(amm, tokens, account, dispatch)
  }

  const networkHandler = async (e) => {
    const chainId = e.target.value;
  
    if (chainId === "0xA9A409") { // Chain ID for Sepolia
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0xA9A409', // Sepolia Chain ID in hexadecimal
            chainName: 'Sepolia',
            nativeCurrency: {
              name: 'Ether',
              symbol: 'ETH', // Corrected to a shorter symbol
              decimals: 18
            },
            rpcUrls: ['https://eth-sepolia.g.alchemy.com/v2/rvqQZ6AFZwcbLCuE02OnXtBuxiCCcwt_'],
            blockExplorerUrls: ['https://sepolia.etherscan.io']
          }],
        });
      } catch (error) {
        console.error('Failed to add the network:', error);
      }
    } else {
      // Handle other networks similarly, if needed
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainId }],
        });
      } catch (switchError) {
        console.error('Failed to switch the network:', switchError);
      }
    }
};

  
  
  

  return (
    <Navbar className='my-3' expand="lg">
      <Navbar.Toggle aria-controls="nav" />
      <Navbar.Collapse id="nav" className="justify-content-end">

        <div className="d-flex justify-content-end mt-3">

        <Form.Select
  aria-label="Network Selector"
  value={chainId ? `0x${chainId.toString(16)}` : '0'}
  onChange={networkHandler}
  style={{ maxWidth: '200px', marginRight: '20px' }}
>
  <option value="0" disabled>Select Network</option>
  <option value="0x539">Localhost</option>
  <option value="0x5">Goerli</option>
  <option value="0xA9A409">Sepolia</option>
</Form.Select>


          {account ? (
            <Navbar.Text className='d-flex align-items-center'>
              {account.slice(0, 5) + '...' + account.slice(38, 42)}
              <Blockies
                seed={account}
                size={10}
                scale={3}
                color="#2187D0"
                bgColor="#F1F2F9"
                spotColor="#767F92"
                className="identicon mx-2"
              />
            </Navbar.Text>
          ) : (
            <Button onClick={connectHandler}>Connect</Button>
          )}

        </div>

      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;
