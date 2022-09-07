const { developmentChains } = require("../../helper-hardhat-config")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { assert, expect } = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("ERC20 Token Unit Tests", async function () {
          let ourToken, deployer, user1
          const multiplier = 10 ** 18

          beforeEach(async function () {
              const accounts = await getNamedAccounts()
              deployer = accounts.deployer
              user1 = accounts.player

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
          })

          describe("Minting Tests", async () => {
              it("user can not mint", async () => {
                  try {
                      await ourToken._mint(deployer, 100)
                      assert(false)
                  } catch (e) {
                      assert(e)
                  }
              })
          })

          describe("Transferring", async () => {
              it("Should be able to transfer tokens successfully to an address", async () => {
                  console.log("user1")
                  console.log(user1)

                  const tokensToSend = ethers.utils.parseEther("10")
                  await ourToken.transfer(user1, tokensToSend)
                  expect(await ourToken.balanceOf(user1)).to.equal(tokensToSend)
              })
              it("emits an transfer event, when an transfer occurs", async () => {
                  await expect(ourToken.transfer(user1, (10 * multiplier).toString())).to.emit(
                      ourToken,
                      "Transfer"
                  )
              })
          })
          describe("allowances", () => {
              const amount = (20 * multiplier).toString()
              beforeEach(async () => {
                  playerToken = await ethers.getContract("OurToken", user1)
              })
              it("Should approve other address to spend token", async () => {
                  const tokensToSpend = ethers.utils.parseEther("5")
                  await ourToken.approve(user1, tokensToSpend)
                  const ourToken1 = await ethers.getContract("OurToken", user1)
                  await ourToken1.transferFrom(deployer, user1, tokensToSpend)
                  expect(await ourToken1.balanceOf(user1)).to.equal(tokensToSpend)
              })
              it("doesn't allow an unnaproved member to do transfers", async () => {
                  //Deployer is approving that user1 can spend 20 of their precious OT's

                  await expect(
                      playerToken.transferFrom(deployer, user1, amount)
                  ).to.be.revertedWith("ERC20: insufficient allowance")
              })
              it("emits an approval event, when an approval occurs", async () => {
                  await expect(ourToken.approve(user1, amount)).to.emit(ourToken, "Approval")
              })
              it("the allowance being set is accurate", async () => {
                  await ourToken.approve(user1, amount)
                  const allowance = await ourToken.allowance(deployer, user1)
                  assert.equal(allowance.toString(), amount)
              })
              it("won't allow a user to go over the allowance", async () => {
                  await ourToken.approve(user1, amount)
                  await expect(
                      playerToken.transferFrom(deployer, user1, (40 * multiplier).toString())
                  ).to.be.revertedWith("ERC20: insufficient allowance")
              })
          })
      })
