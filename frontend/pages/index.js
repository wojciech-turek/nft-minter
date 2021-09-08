import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Image from "next/image";
import ChainWaveNFT from "../../ethereum/contract";
import {
  Button,
  Card,
  Container,
  Dimmer,
  Grid,
  Icon,
  Loader,
  Menu,
} from "semantic-ui-react";
import web3 from "../web3";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [nftData, setNftData] = useState([]);
  const contractAddr = "0xc796c931c210BbaDf13c3A2858fe40659723C7c3";

  useEffect(async () => {
    const getData = async () => {
      const data = await getTokenData();
      return data;
    };
    const data = await getData();
    setNftData(data.tokens);
    setLoading(false);
  }, []);
  const cards = nftData.map((nft, index) => {
    return (
      <Grid.Column width={4} key={nft.tokenData.name}>
        <Card>
          <Image
            layout="responsive"
            width={200}
            height={200}
            className="image"
            src={`https://gateway.pinata.cloud/ipfs/${nft.tokenData.image}`}
            objectFit="cover"
          />
          <Card.Content>
            <Card.Header>{nft.tokenData?.name}</Card.Header>
            <Card.Meta>
              {`Owner: ${nft.owner.slice(0, 6)}...${nft.owner.slice(
                nft.owner.length - 5
              )}`}
            </Card.Meta>
            <Card.Description>{nft.tokenData.description}</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Menu borderless stackable>
              <Menu.Item>
                <Icon name="ethereum" /> {nft.tokenData?.value}
              </Menu.Item>
              <Menu.Item position="right">
                <a
                  target="_blank"
                  href={`https://testnets.opensea.io/assets/0xc796c931c210bbadf13c3a2858fe40659723c7c3/${
                    index + 4
                  }`}
                >
                  <Button color="green">Buy</Button>
                </a>
              </Menu.Item>
            </Menu>
          </Card.Content>
        </Card>
      </Grid.Column>
    );
  });
  return (
    <Layout>
      <Dimmer active={loading}>
        <Loader>Loading all NFTs</Loader>
      </Dimmer>
      <Container style={{ marginTop: 80 }}>
        <Grid doubling>
          <Grid.Column width={4}>
            <Card
              image="/elliot.jpg"
              header="Elliot Baker"
              meta={`Owner: ${contractAddr.slice(0, 6)}...${contractAddr.slice(
                contractAddr.length - 5
              )}`}
              description="This is an example token description populated by text you enter in description field when minting."
              extra={
                <Menu borderless stackable>
                  <Menu.Item>
                    <Icon name="ethereum" /> 2
                  </Menu.Item>
                  <Menu.Item position="right">
                    <Button color="green">Buy</Button>
                  </Menu.Item>
                </Menu>
              }
            />
          </Grid.Column>
          {cards}
        </Grid>
      </Container>
    </Layout>
  );
}
async function getTokenData() {
  const instance = new web3.eth.Contract(
    ChainWaveNFT.abi,
    "0xc796c931c210BbaDf13c3A2858fe40659723C7c3"
  );
  const getDataFromURI = async (hash) => {
    const url = `https://gateway.pinata.cloud/ipfs/${hash}`;
    const data = await fetch(url);
    const content = await data.json();
    return content;
  };
  let tokenCount = 2;
  const startingTokenId = 4;
  const tokens = [];

  async function getTokens(tokenId) {
    try {
      const owner = await instance.methods.ownerOf(tokenId).call();
      const tokenURI = await instance.methods.tokenURI(tokenId).call();
      const data = await getDataFromURI(tokenURI);
      const tokenData = {
        name: data.name,
        description: data.description,
        value: data.value,
        image: data.image,
      };
      tokens.push({ tokenData, owner });
      tokenCount++;
    } catch (err) {
      console.log("Total Tokens Founds:", tokenCount - 1);
      throw new Error("err");
    }
  }

  for (let i = startingTokenId; ; i++) {
    try {
      console.log("fetching");
      await getTokens(i);
    } catch (err) {
      break;
    }
  }
  return { tokens: tokens };
}
