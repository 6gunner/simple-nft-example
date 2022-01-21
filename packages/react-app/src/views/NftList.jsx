import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List } from "antd";
import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import ipfsAPI from "ipfs-http-client";
import { Transactor } from "../helpers";
import { BufferList } from "bl";

import { Address, AddressInput } from "../components";

const ipfs = ipfsAPI({ host: "ipfs.infura.io", port: "5001", protocol: "https" });

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 */
function NftList(props) {
  const { address, userSigner, gasPrice, writeContracts, readContracts } = props;
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const [data, setData] = useState([]);

  const [transferToAddresses, setTransferToAddresses] = useState({});

  // 读取一下合约地址上的余额
  // keep track of a variable from the contract in the local React state:
  const balance = useContractReader(readContracts, "CodaCollectible", "balanceOf", [address], 1000);
  const yourBalance = balance && balance.toNumber && balance.toNumber();
  console.log("🤗 balance:", yourBalance);

  // helper function to "Get" from IPFS
  // you usually go content.toString() after this...
  const getFromIPFS = async hashToGet => {
    for await (const file of ipfs.get(hashToGet)) {
      console.log(file.path);
      if (!file.content) {
        continue;
      }
      const content = new BufferList();
      for await (const chunk of file.content) {
        content.append(chunk);
      }
      console.log(content);
      return content;
    }
  };

  useEffect(() => {
    const updateYourCollectibles = async () => {
      const collectibleUpdate = [];
      for (let tokenIndex = 0; tokenIndex < balance; tokenIndex++) {
        try {
          console.log("GEtting token index", tokenIndex);
          const tokenId = await readContracts.CodaCollectible.tokenOfOwnerByIndex(address, tokenIndex);
          // console.log("tokenId", tokenId);
          const tokenURI = await readContracts.CodaCollectible.tokenURI(tokenId);
          console.log("tokenURI", tokenURI);

          // const ipfsHash = tokenURI.replace("https://ipfs.io/ipfs/", "");
          const ipfsHash = tokenURI.replace("ipfs://", "");
          console.log("ipfsHash", ipfsHash);

          const jsonManifestBuffer = await getFromIPFS(ipfsHash);

          try {
            const jsonManifest = JSON.parse(jsonManifestBuffer.toString());
            console.log("jsonManifest", jsonManifest);
            collectibleUpdate.push({
              id: tokenId,
              uri: tokenURI,
              owner: address,
              ...jsonManifest,
              image: jsonManifest.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
            });
          } catch (e) {
            console.error(e);
          }
        } catch (e) {
          console.error(e);
        }
      }
      setData(collectibleUpdate);
    };
    updateYourCollectibles();
  }, [address, balance, readContracts]);

  const tx = Transactor(userSigner, gasPrice);

  return (
    <div style={{ width: 640, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      <List
        bordered
        dataSource={data}
        renderItem={item => {
          const id = item.id.toNumber();
          return (
            <List.Item key={`${id}_${item.uri}_${item.owner}`}>
              <Card
                title={
                  <div>
                    <span style={{ fontSize: 16, marginRight: 8 }}>#{id}</span> {item.name}
                  </div>
                }
              >
                <div>
                  <img src={item.image} style={{ maxWidth: 150 }} />
                </div>
                <div>{item.description}</div>
              </Card>
              <div>
                owner:{" "}
                <Address
                  address={item.owner}
                  fontSize={16}
                // ensProvider={mainnetProvider}
                // blockExplorer={blockExplorer}
                />
                <AddressInput
                  // ensProvider={mainnetProvider}
                  placeholder="transfer to address"
                  value={transferToAddresses[id]}
                  onChange={newValue => {
                    const update = {};
                    update[id] = newValue;
                    setTransferToAddresses({ ...transferToAddresses, ...update });
                  }}
                />
                <Button
                  onClick={() => {
                    console.log("writeContracts", writeContracts);
                    // from, to, tokenId
                    tx(writeContracts.CodaCollectible.transferFrom(address, transferToAddresses[id], id));
                  }}
                >
                  Transfer
                </Button>
              </div>
            </List.Item>
          );
        }}
      ></List>
    </div>
  );
}

export default NftList;
