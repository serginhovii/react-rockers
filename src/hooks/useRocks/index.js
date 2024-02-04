import  { useMemo } from  'react';
import { useWeb3React } from '@web3-react/core';
import RocksArtifact from '../../config/artifacts/Rocks';


const {address, abi } = RocksArtifact;

const useRocks = () => {
    const { active, library, chainId } = useWeb3React(); 
    const rocks = useMemo( () => { 
        if (active && library.eth.Contract) {
            
            return new library.eth.Contract(
                abi,
                address[chainId]
            );
        }
        }, [active, chainId, library?.eth?.Contract]
    );
    return rocks;
    
};

export default useRocks;