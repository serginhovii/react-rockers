import { InjectedConnector } from '@web3-react/injected-connector'
import Web3 from 'web3';


const connector = new InjectedConnector({ supportedChainIds: [11155111] })


const getLibrary = (provider) => {
    return new Web3(provider)
};

export {getLibrary, connector};