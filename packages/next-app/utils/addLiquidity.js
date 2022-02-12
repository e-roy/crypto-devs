import { utils } from "ethers";

/**
 * addLiquidity helps add liquidity to the exchange,
 * If the user is adding initial liquidity, user decides the ether and CD tokens he wants to add
 * to the exchange. If we he adding the liquidity after the initial liquidity has already been added
 * then we calculate the crypto dev tokens he can add, given the eth he wants to add by keeping the ratios
 * constant
 */
export const addLiquidity = async (
  addCDAmountWei,
  addEtherAmountWei,
  ExchangeContract,
  CryptoDevTokenContract
) => {
  try {
    // Because CD tokens are an ERC20, user would need to give the contract allowance
    // to take the required number CD tokens out of his contract

    let tx = await CryptoDevTokenContract.approve(
      ExchangeContract.address,
      addCDAmountWei.toString()
    );
    await tx.wait();
    // After the contract has the approval, add the ether and cd tokens in the liquidity
    tx = await ExchangeContract.addLiquidity(addCDAmountWei, {
      value: addEtherAmountWei,
    });
    await tx.wait();
  } catch (err) {
    console.error(err);
  }
};

/**
 * calculateCD calculates the CD tokens that need to be added to the liquidity
 * given `_addEtherAmountWei` amount of ether
 */
export const calculateCD = async (
  _addEther = "0",
  etherBalanceContract,
  cdTokenReserve
) => {
  // `_addEther` is a string, we need to convert it to a Bignumber before we can do our calculations
  // We do that using the `parseEther` function from `ethers.js`
  const _addEtherAmountWei = utils.parseEther(_addEther);
  // Ratio needs to be maintained when we add liquiidty.
  // We need to let the user know who a specific amount of ether how many `CD` tokens
  // he can add so that the price impact is not large
  // The ratio we follow is (Amount of Crypto Dev tokens to be added)/(Crypto Dev tokens balance) = (Ether that would be added)/ (Eth reseve in the contract)
  // So by maths we get (Amount of Crypto Dev tokens to be added) = (Ether that would be added*rypto Dev tokens balance)/ (Eth reseve in the contract)
  const cryptoDevTokenAmount = _addEtherAmountWei
    .mul(cdTokenReserve)
    .div(etherBalanceContract);
  return cryptoDevTokenAmount;
};
