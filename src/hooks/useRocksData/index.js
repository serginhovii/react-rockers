import { useCallback, useEffect, useState } from "react";
import useRocks from "../useRocks";
import { useWeb3React } from "@web3-react/core";

const getRockData = async ({rocks, tokenId}) => {
    const [tokenURI,
            dna,
            owner,
            accessoriesType,
            clotheColor,
            clotheType,
            eyeType,
            eyeBrowType,
            facialHairColor,
            facialHairType,
            graphicType,
            hairColor,
            hatColor,
            mouthType,
            skinColor,
            topType] = await Promise.all([
        rocks.methods.tokenURI(tokenId).call(),
        rocks.methods.tokenDNA(tokenId).call(),
        rocks.methods.ownerOf(tokenId).call(),
        rocks.methods.getAccessoriesType(tokenId).call(),
        rocks.methods.getClotheColor(tokenId).call(),
        rocks.methods.getClotheType(tokenId).call(),
        rocks.methods.getEyeType(tokenId).call(),
        rocks.methods.getEyeBrowType(tokenId).call(),
        rocks.methods.getFacialHairColor(tokenId).call(),
        rocks.methods.getFacialHairType(tokenId).call(),
        rocks.methods.getHairColor(tokenId).call(),
        rocks.methods.getHatColor(tokenId).call(),
        rocks.methods.getGraphicType(tokenId).call(),
        rocks.methods.getMouthType(tokenId).call(),
        rocks.methods.getSkinColor(tokenId).call(),
        rocks.methods.getTopType(tokenId).call(),
    ]);

    const responseMetadata = await fetch(tokenURI);
    const metadata = await responseMetadata.json();
    return {
        tokenId,
        attributes: {
            accessoriesType: { name:'Type of accesory', value: accessoriesType },
            clotheColor: { name: 'Clothes color', value: clotheColor},
            clotheType: { name: 'Clothes type', value: clotheType},
            eyeType: { name: 'Eyes type', value: eyeType},
            eyeBrowType: { name: 'Eyebrows', value: eyeBrowType},
            facialHairColor: { name: 'Facial hair color', value: facialHairColor},
            facialHairType: { name: 'Facial hair type', value: facialHairType},
            hairColor: { name: 'Hair color', value: hairColor},
            hatColor: { name: 'Hat color', value: hatColor},
            graphicType: { name: 'Graphic type', value: graphicType},
            mouthType: { name: 'Mouth type', value: mouthType},
            skinColor: { name: 'Skin color', value: skinColor},
            topType: { name: 'Top type', value: topType},
        },
        tokenURI,
        dna,
        owner,
        ...metadata
    }
};

const useRocksData = ({owner = null} = {}) => {
    const [rocks, setRocks] = useState([]);
    const {library} = useWeb3React();
    const [loading, setLoading] = useState(true);
    const rocksHook = useRocks();
    const update = useCallback(async () => {
        if (rocksHook) {
            setLoading(true);
            let tokenIds;

            if(!library.utils.isAddress(owner)){
                const totalSupply = await rocksHook.methods.totalSupply().call();
                tokenIds = new Array(Number(totalSupply)).fill().map((_, index) => index);
                
            } else {
                const balanceOf = await rocksHook.methods.balanceOf(owner).call();
                const tokenIdsOwner = new Array(Number(balanceOf)).fill().map((_, index) => {
                   return rocksHook.methods.tokenOfOwnerByIndex(owner, index).call();
                })

                tokenIds = await Promise.all(tokenIdsOwner)
            }

            const rocksPromise = tokenIds.map((tokenId) => getRockData({tokenId, rocks: rocksHook}));
            const rockers = await Promise.all(rocksPromise);
            setRocks(rockers);
            setLoading(false);
        }
    },[rocksHook, owner, library?.utils]);

    useEffect(() => {
        update();
    },[update])

    return {loading, rocks, update}
};

const useRockData = (tokenId = null) => {
    const [rock, setRock] = useState({});
    const [loading, setLoading] = useState(true);
    const rocksHook = useRocks();
    const update = useCallback(async () => {
        if (rocksHook && tokenId != null) {
            setLoading(true);
            const rocker = await getRockData({tokenId, rocks: rocksHook});
            setRock(rocker);
            setLoading(false);
        }
    },[rocksHook, tokenId]);

    useEffect(() => {
        update();
    },[update])

    return {loading, rock, update}

}

export { useRocksData, useRockData };