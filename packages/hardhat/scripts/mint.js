/* eslint no-use-before-define: "warn" */
const { NFTStorage, File, Blob } = require("nft.storage");
// const fs = require("fs");
const https = require("https");
const { config, ethers } = require("hardhat");
// const { utils } = require("ethers");
// const R = require("ramda");
// const ipfsAPI = require("ipfs-http-client");

// const ipfs = ipfsAPI({
//   host: "ipfs.infura.io",
//   port: "5001",
//   protocol: "https",
// });
const ipfsClient = new NFTStorage({
  token: process.env.NFT_STORAGE_KEY,
});

const downloadFile = (url, fileName, type) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      // const data = await fs.promises.readFile("pinpie.jpg");

      res.setEncoding("binary");
      let files = "";
      res.on("data", (chunk) => {
        files += chunk;
      });
      res.on("end", () => {
        const buf = Buffer.from(files, "binary");
        const blob = new Blob([buf]);
        console.log(blob);
        const file = new File([buf], fileName, { type });
        console.log(file);
        // resolve(blob);
        resolve(file);
      });
    });
  });
};

const delayMS = 1000; // sometimes xDAI needs a 6000ms break lol 😅

const contractName = "CodaCollectible";
const main = async () => {
  // ADDRESS TO MINT TO:
  const toAddress = "0x8ef9F0acfEF3D9AB023812BB889A8F5a214B9B82";
  // const toAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  console.log("\n\n 🎫 Minting to " + toAddress + "...\n");
  const { deployer } = await getNamedAccounts(); // 全局的一个方法，能拿到部署好的合约
  const yourCollectible = await ethers.getContract(contractName, deployer);
  console.log("yourCollectible的合约地址是 " + yourCollectible.address);
  let image = await downloadFile(
    "https://austingriffith.com/images/paintings/buffalo.jpg",
    "buffalo.jpg",
    "image/jpg"
  );
  const buffalo = {
    description: "It's actually a bison?",
    external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
    image,
    name: "Buffalo",
    attributes: [
      {
        trait_type: "BackgroundColor",
        value: "green",
      },
      {
        trait_type: "Eyes",
        value: "googly",
      },
      {
        trait_type: "Stamina",
        value: 42,
      },
    ],
  };
  console.log("Uploading buffalo...");
  const uploaded = await ipfsClient.store(buffalo);
  // const uploaded = await ipfs.add(JSON.stringify(buffalo));
  console.log(
    "Minting buffalo with IPFS hash (" + JSON.stringify(uploaded) + ")"
  );
  await yourCollectible.mintItem(toAddress, uploaded.url, {
    gasLimit: 400000,
  });

  await sleep(delayMS);

  image = await downloadFile(
    "https://austingriffith.com/images/paintings/zebra.jpg",
    "zebra.jpg",
    "image/jpg"
  );
  const zebra = {
    description: "What is it so worried about?",
    external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
    image,
    name: "Zebra",
    attributes: [
      {
        trait_type: "BackgroundColor",
        value: "blue",
      },
      {
        trait_type: "Eyes",
        value: "googly",
      },
      {
        trait_type: "Stamina",
        value: 38,
      },
    ],
  };
  console.log("Uploading zebra...");
  // const uploadedzebra = await ipfs.add(JSON.stringify(zebra));
  const uploadedzebra = await ipfsClient.store(zebra);

  console.log("Minting zebra with IPFS hash (" + uploadedzebra.ipnft + ")");
  await yourCollectible.mintItem(toAddress, uploadedzebra.url, {
    gasLimit: 400000,
  });

  await sleep(delayMS);

  // const rhino = {
  //   description: "What a horn!",
  //   external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
  //   image: "https://austingriffith.com/images/paintings/rhino.jpg",
  //   name: "Rhino",
  //   attributes: [
  //     {
  //       trait_type: "BackgroundColor",
  //       value: "pink",
  //     },
  //     {
  //       trait_type: "Eyes",
  //       value: "googly",
  //     },
  //     {
  //       trait_type: "Stamina",
  //       value: 22,
  //     },
  //   ],
  // };
  // console.log("Uploading rhino...");
  // const uploadedrhino = await ipfs.add(JSON.stringify(rhino));

  // console.log("Minting rhino with IPFS hash (" + uploadedrhino.path + ")");
  // await yourCollectible.mintItem(toAddress, uploadedrhino.path, {
  //   gasLimit: 400000,
  // });

  // await sleep(delayMS);

  // const fish = {
  //   description: "Is that an underbyte?",
  //   external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
  //   image: "https://austingriffith.com/images/paintings/fish.jpg",
  //   name: "Fish",
  //   attributes: [
  //     {
  //       trait_type: "BackgroundColor",
  //       value: "blue",
  //     },
  //     {
  //       trait_type: "Eyes",
  //       value: "googly",
  //     },
  //     {
  //       trait_type: "Stamina",
  //       value: 15,
  //     },
  //   ],
  // };
  // console.log("Uploading fish...");
  // const uploadedfish = await ipfs.add(JSON.stringify(fish));

  // console.log("Minting fish with IPFS hash (" + uploadedfish.path + ")");
  // await yourCollectible.mintItem(toAddress, uploadedfish.path, {
  //   gasLimit: 400000,
  // });

  // await sleep(delayMS);

  // const flamingo = {
  //   description: "So delicate.",
  //   external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
  //   image: "https://austingriffith.com/images/paintings/flamingo.jpg",
  //   name: "Flamingo",
  //   attributes: [
  //     {
  //       trait_type: "BackgroundColor",
  //       value: "black",
  //     },
  //     {
  //       trait_type: "Eyes",
  //       value: "googly",
  //     },
  //     {
  //       trait_type: "Stamina",
  //       value: 6,
  //     },
  //   ],
  // };
  // console.log("Uploading flamingo...");
  // const uploadedflamingo = await ipfs.add(JSON.stringify(flamingo));

  // console.log(
  //   "Minting flamingo with IPFS hash (" + uploadedflamingo.path + ")"
  // );
  // await yourCollectible.mintItem(toAddress, uploadedflamingo.path, {
  //   gasLimit: 400000,
  // });

  // const godzilla = {
  //   description: "Raaaar!",
  //   external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
  //   image: "https://austingriffith.com/images/paintings/godzilla.jpg",
  //   name: "Godzilla",
  //   attributes: [
  //     {
  //       trait_type: "BackgroundColor",
  //       value: "orange",
  //     },
  //     {
  //       trait_type: "Eyes",
  //       value: "googly",
  //     },
  //     {
  //       trait_type: "Stamina",
  //       value: 99,
  //     },
  //   ],
  // };
  // console.log("Uploading godzilla...");
  // const uploadedgodzilla = await ipfs.add(JSON.stringify(godzilla));

  // console.log(
  //   "Minting godzilla with IPFS hash (" + uploadedgodzilla.path + ")"
  // );
  // await yourCollectible.mintItem(toAddress, uploadedgodzilla.path, {
  //   gasLimit: 400000,
  // });

  // await sleep(delayMS);

  // console.log(
  //   "Transferring Ownership of CodaCollectible to " + toAddress + "..."
  // );

  // await yourCollectible.transferOwnership(toAddress, { gasLimit: 400000 });
  // await sleep(delayMS);

  /*
  console.log("Minting zebra...")
  await yourCollectible.mintItem("0xD75b0609ed51307E13bae0F9394b5f63A7f8b6A1","zebra.jpg")
  */

  // const secondContract = await deploy("SecondContract")

  // const exampleToken = await deploy("ExampleToken")
  // const examplePriceOracle = await deploy("ExamplePriceOracle")
  // const smartContractWallet = await deploy("SmartContractWallet",[exampleToken.address,examplePriceOracle.address])

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
