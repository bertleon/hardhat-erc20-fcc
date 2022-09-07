const { network, getNamedAccounts, deployments } = require("hardhat")
const { developmentChains, INITIAL_SUPPLY, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const args = [INITIAL_SUPPLY]

    log("Deploying ourToken ... ")

    const ourToken = await deploy("OurToken", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmatinos: network.config.blockConfirmations || 1,
    })

    log(`ourToken deployed at ${ourToken.address}`)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(ourToken.address, args)
    }

    log("--------------------------")
}

module.exports.tags = ["all", "ourToken"]
