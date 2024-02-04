import {
    Stack,
    Heading,
    Text,
    Table,
    Thead,
    Tr,
    Th,
    Td,
    Tbody,
    Button,
    Tag,
    useToast
  } from "@chakra-ui/react";
  import { useWeb3React } from "@web3-react/core";
  import RequestAccess from "../../components/request-access";
  import RockCard from "../../components/rock-card";
  import { useRockData } from "../../hooks/useRocksData";
  import { useParams } from "react-router-dom";
  import Loading from "../../components/loading";
import { useState } from "react";
import useRocks from "../../hooks/useRocks";
  
  const Rock = () => {
    const { active, account, library } = useWeb3React();
    const { tokenId } = useParams();
    const { loading, rock, update } = useRockData(tokenId);
    const toast = useToast();
    const rocks = useRocks();
    const [transfering, setTransfering] = useState(false);

    const transfer = () => {
        setTransfering(true)
        const address = prompt('Insert the address:')
        const isAddress = library.utils.isAddress(address);
        if (!isAddress) {
            toast({
                status: "error",
                title: "Invalid address",
                description: "The adddress is not an ethereum address"
            })
            setTransfering(false)
            return
        }
        try {
            rocks.methods.safeTransferFrom(rock.owner, address).send({
                from: account,
            })
            .on('transactionHash', (txHash)=> {
                setTransfering(false)
                toast({
                    status: "info",
                    title: "Transaction sent",
                    description: txHash
                })
            })
            .on('receipt', ()=> {
                setTransfering(false)
                toast({
                    status: "success",
                    title: "Transaction confirmed",
                    description: `The rock belongs now to: ${address}`
                })
                update();
            })
            .on('error', (error) => {
                setTransfering(false)
                toast({
                    status: "error",
                    title: "Invalid address",
                    description: "The adddress is not and ethereum address"
                })
            });
        } catch(exc) {
            setTransfering(false)
            toast({
                status: "error",
                title: "Invalid address",
                description: exc.message
            })
        
        }
                
        
    }

  
    if (!active) return <RequestAccess />;
  
    if (loading) return <Loading />;
    return (
      <Stack
        spacing={{ base: 8, md: 10 }}
        py={{ base: 5 }}
        direction={{ base: "column", md: "row" }}
      >
        <Stack>
          <RockCard
            mx={{
              base: "auto",
              md: 0,
            }}
            name={rock.name.replace("Rocks", "Rocker")}
            image={rock.image}
          />
          <Button disabled={account !== rock.owner} 
            colorScheme="red"
            onClick={transfer}
            isLoading={transfering}
            >
            {account !== rock.owner ? "You are not the owner" : "Transfer  "}
          </Button>
        </Stack>
        <Stack width="100%" spacing={5}>
          <Heading>{rock.name}</Heading>
          <Text fontSize="xl">{rock.description}</Text>
          <Text fontWeight={600}>
            DNA:
            <Tag ml={2} colorScheme="red">
              {String(rock.dna)}
            </Tag>
          </Text>
          <Text fontWeight={600}>
            Owner:
            <Tag ml={2} colorScheme="red">
              {rock.owner}
            </Tag>
          </Text>
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th>Attribute</Th>
                <Th>Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.entries(rock.attributes).map(([key, value]) => (
                <Tr key={key}>
                  <Td>{value.name}</Td>
                  <Td>
                    <Tag>{value.value}</Tag>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Stack>
      </Stack>
    );
  };
  
  export default Rock;