const { ethers } = require("hardhat")

const networkConfig = {
    4: {
        name: "rinkeby",
        blockConfirmations: 6,
    },
    5: {
        name: "goerli",
        blockConfirmations: 6,
    },
    31337: {
        name: "hardhat",
        blockConfirmations: 1,
    },
}

const developmentChains = ["hardhat", "localhost"]
const INITIAL_SUPPLY = ethers.utils.parseEther("50")

module.exports = {
    networkConfig,
    developmentChains,
    INITIAL_SUPPLY,
}
