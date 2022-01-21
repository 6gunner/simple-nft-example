// 测试的脚本
const watch = require("node-watch");
const { exec } = require("child_process");
const { ethers } = require("hardhat");

// const run = () => {
//   console.log("🛠  Compiling & Deploying...");
//   exec("yarn deploy", function (error, stdout, stderr) {
//     console.log(stdout);
//     if (error) console.log(error);
//     if (stderr) console.log(stderr);
//   });
// };

// console.log("🔬 Watching Contracts...");
// watch("./contracts", { recursive: true }, function (evt, name) {
//   console.log("%s changed.", name);
//   run();
// });
// run();

const main = async () => {
  const contractName = "CodaCollectible";
  const { deployer } = await getNamedAccounts();
  console.log(deployer);
  const YourContract = await ethers.getContract(contractName, deployer);
  console.log(YourContract.address);
  const balance = await YourContract.balanceOf(
    "0x8ef9F0acfEF3D9AB023812BB889A8F5a214B9B82"
  );
  console.log(balance.toNumber());
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
