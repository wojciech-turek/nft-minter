import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Dimmer,
  Form,
  Input,
  Label,
  Loader,
  Message,
  Segment,
} from "semantic-ui-react";
import { useRouter } from "next/router";
import web3 from "../web3";
import ChainWaveNFT from "../../ethereum/contract";
import Layout from "../components/Layout";

export default function NewNFT() {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    file: {},
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  let accounts;
  const router = useRouter();

  const onSubmit = async (e) => {
    setError(false);
    setSuccess(false);
    setLoading(true);
    e.preventDefault();

    const fileData = new FormData();
    fileData.append("file", formData.file);
    // ! THIS SHOULD BE ON A SERVER SIDE
    let rawResponse;
    try {
      rawResponse = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            pinata_api_key: process.env.NEXT_PUBLIC_PINIATA_API_KEY,
            pinata_secret_api_key:
              process.env.NEXT_PUBLIC_PINIATA_API_SECRET_KEY,
          },
          body: fileData,
        }
      );
    } catch (error) {
      setError(error.message);
    }
    const content = await rawResponse.json();
    const imageIpfs = content.IpfsHash;
    let rawTokenURI;
    try {
      rawTokenURI = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: process.env.NEXT_PUBLIC_PINIATA_API_KEY,
            pinata_secret_api_key:
              process.env.NEXT_PUBLIC_PINIATA_API_SECRET_KEY,
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            value: formData.amount,
            image: imageIpfs,
          }),
        }
      );
    } catch (error) {
      setError(error.message);
    }

    const rawTokenURIData = await rawTokenURI.json();
    const tokenURI = rawTokenURIData.IpfsHash;
    accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    const instance = new web3.eth.Contract(
      ChainWaveNFT.abi,
      "0xc796c931c210BbaDf13c3A2858fe40659723C7c3"
    );
    await instance.methods
      .mintItem(accounts[0], tokenURI)
      .send({ from: accounts[0] });
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      router.replace("/");
    }, 5000);
  };

  useEffect(() => {
    window.ethereum.request({ method: "eth_requestAccounts" });
  }, []);

  const handleFormDataChange = (e) => {
    setFormData(() => {
      return {
        ...formData,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    setFormData(() => {
      return {
        ...formData,
        [e.target.name]: file,
      };
    });
  };

  return (
    <Layout>
      <Dimmer active={loading}>
        <Loader>
          <div>Please wait, your NFT is being minted!</div>
          <div>This shouldn't take long</div>
        </Loader>
      </Dimmer>
      <Container style={{ marginTop: 80 }}>
        <Segment>
          <h2>Mint a new NFT and list for sale immediately!</h2>
          <Form onSubmit={onSubmit} error={!!error} success={success}>
            <Form.Field>
              <Label>Name</Label>
              <Input
                value={formData.name}
                name="name"
                placeholder="Name of your NFT"
                type="text"
                onChange={handleFormDataChange}
              />
            </Form.Field>
            <Form.Field>
              <Label>Description</Label>
              <Input
                placeholder="Describe your NFT"
                type="text"
                name="description"
                value={formData.description}
                onChange={handleFormDataChange}
              />
            </Form.Field>
            <Form.Field>
              <Label>Listing price</Label>
              <Input
                placeholder="The amount you want to receive for your NFT"
                type="number"
                label="ETH"
                labelPosition="right"
                step="0.00001"
                name="amount"
                value={formData.amount}
                onChange={handleFormDataChange}
              />
            </Form.Field>
            <Form.Field>
              <Label>Upload image for your NFT</Label>
              <Input type="file" name="file" onChange={handleChangeImage} />
            </Form.Field>
            <Button type="submit" primary>
              Create
            </Button>
            <Message error header="Error!" content={error}></Message>
            <Message success>
              <p> Congratulations your NFT has been created!</p>
              <p>You will be redirected to main page in 5 seconds...</p>
            </Message>
          </Form>
        </Segment>
      </Container>
    </Layout>
  );
}
