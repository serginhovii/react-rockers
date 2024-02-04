import {
    Stack,
    Flex,
    Heading,
    Text,
    Button,
    Image,
    Badge,
    useToast,
  } from "@chakra-ui/react";
  import { Link } from "react-router-dom";
  import { useWeb3React } from "@web3-react/core";
  import { useCallback, useEffect, useState } from "react";
  import useRocks from "../../hooks/useRocks";
  import useTruncatedAddress from "../../hooks/useTruncatedAddress";
  
  const Home = () => {
    const [imageSrc, setImageSrc] = useState("");
    const [isMinting, setIsMinting] = useState(false);
    const [totalSupply, setTotalSupply] = useState(0);
    const { active, account } = useWeb3React();
    const truncatedAddress = useTruncatedAddress(account);
    const rocks = useRocks();
    const toast = useToast();
  
    const getRocksData = useCallback(async () => {
      if (rocks) {
        const totalSupply = await rocks.methods.totalSupply().call();
        const dnaPreview = await rocks.methods
          .deterministicPseudoRandomDNA(totalSupply, account)
          .call();
        const image = await rocks.methods.imageByDNA(dnaPreview).call();
        setImageSrc(image);
        setTotalSupply(Number(totalSupply));
      }
    }, [rocks, account]);
  
    useEffect(() => {
      getRocksData();
    }, [getRocksData]);

    const mint = () => {
        setIsMinting(true)
        rocks.methods.mint().send({
            from: account,
        })
        .on("transactionHash", (txHash) => {
            setIsMinting(false)
            toast({
                title:"Transaction sent",
                description: txHash,
                status: "info"
            })

        })
        .on("receipt", () => {
            setIsMinting(false)
            toast({
                title:"Transaction confirmed",
                description: "",
                status: "success"
            })
        })
        .on("error", (error, receipt) => {
            setIsMinting(false)
            
            toast({
                title:"Transaction failed",
                description: error.message,
                status: "error"
            })
        }).catch(error => {
            setIsMinting(false)
            toast({
                title:"Transaction failed",
                description: error.message,
                status: "error"
            })
        })
        
        

    }
  
    return (
      <Stack
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
        direction={{ base: "column-reverse", md: "row" }}
      >
        <Flex
          flex={1}
          direction="column-reverse"
          justify={"center"}
          align={"center"}
          position={"relative"}
          w={"full"}
        >
          <Image src={active ? imageSrc : "https://avataaars.io/"} />
          {active ? (
            <>
              <Flex mt={2}>
                <Badge>
                  Next ID:
                  <Badge ml={totalSupply} colorScheme="red">
                    {totalSupply}
                  </Badge>
                </Badge>
                <Badge ml={2}>
                  Address:
                  <Badge ml={1} colorScheme="red">
                    {truncatedAddress}
                  </Badge>
                </Badge>
              </Flex>
            </>
          ) : (
            <Badge mt={2}>Wallet disconnected</Badge>
          )}
        </Flex>
        <Stack flex={1} spacing={{ base: 5, md: 10 }}>
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
          >
            <Text
              as={"span"}
              position={"relative"}
              _after={{
                content: "''",
                width: "full",
                height: "30%",
                position: "absolute",
                bottom: 1,
                left: 0,
                bg: "red.400",
                zIndex: -1,
              }}
            >
              Rock avatar
            </Text>
            <br />
            <Text as={"span"} color={"red.400"}>
              your own avatar
            </Text>
          </Heading>
          <Text color={"gray.500"}>
            Create your Avatar collection.
            The avatars created randomly and with all the information stored in the blockchain.
            There are only 10000, and they are unique.
          </Text>
          <Text color={"red.500"}>
            Every avatar is randomly generated with your address,
            use the pre-visualizer to find out which would be your Avatar if you generate it now.
          </Text>
          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={{ base: "column", sm: "row" }}
          >
            <Button
              rounded={"full"}
              size={"lg"}
              fontWeight={"normal"}
              px={6}
              colorScheme={"red"}
              bg={"red.400"}
              _hover={{ bg: "red.500" }}
              disabled={!rocks}
              onClick={mint}
              isLoading={isMinting}
            >
              Get your rocker
            </Button>
            <Link to="/rocks">
              <Button rounded={"full"} size={"lg"} fontWeight={"normal"} px={6}>
                Gallery
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Stack>
    );
  };
  
  export default Home;