const { developmentChains } = require("../../helper-hardhat-config")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { assert } = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("ERC20 Token Unit Tests", async function () {
          let ourToken, deployer, user1

          beforeEach(async function () {
              const accounts = await getNamedAccounts()
              deployer = accounts.deployer
              user1 = accounts.user1

              await deployments.fixture(["all"])
              ourToken = await ethers.getContract("OurToken", deployer)
          })

          describe("Constructor Test", async function () {
              it("was deployed", async () => {
                  assert(ourToken.address)
              })

              it("initializes the token correctly", async () => {
                  const initialSupply = await ourToken.totalSupply()
                  const tokenName = await ourToken.name()
                  const tokenSymbol = await ourToken.symbol()
                  assert.equal(initialSupply.toString(), ethers.utils.parseEther("50").toString())
                  assert.equal(tokenName, "OurToken")
                  assert.equal(tokenSymbol, "OT")
              })

              it("")
          })
      })
