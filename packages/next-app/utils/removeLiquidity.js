/**
 * removeLiquidity: Removes the `removeLPTokensWei` amount of LP tokens from
 * liquidity and also the calculated amount of `ether` and `CD` tokens
 */
export const removeLiquidity = async (removeLPTokensWei, ExchangeContract) => {
  const tx = await ExchangeContract.removeLiquidity(removeLPTokensWei);
  await tx.wait();
};

/**
 * getTokensAfterRemove: Calculates the amount of `Ether` and `CD` tokens
 * that would be returned back to user after he removes `removeLPTokenWei` amount
 * of LP tokens from the contract
 */
export const getTokensAfterRemove = async (
  removeLPTokenWei,
  _ethBalance,
  cryptoDevTokenReserve,
  ExchangeContract
) => {
  try {
    const _totalSupply = await ExchangeContract.totalSupply();

    // Here we are using the Bignumber methods of multiplication and division
    // The amount of ether that would be sent back to the user after he withdraws the LP token
    // id calculated based on a ratio,
    // Ratio is -> (amount of ether that would be sent back to the user/ Eth reserves) = (LP tokens withdrawn)/(Total supply of LP tokens)
    // By some maths we get -> (amount of ether that would be sent back to the user) = (Eth Reserve * LP tokens withdrawn)/(Total supply of LP tokens)
    // Similariy we also maintain a ratio for the `CD` tokens, so here in our case
    // Ratio is -> (amount of CD tokens sent back to the user/ CD Token reserve) = (LP tokens withdrawn)/(Total supply of LP tokens)
    // Then (amount of CD tokens sent back to the user) = (CD token reserve * LP tokens withdrawn)/(Total supply of LP tokens)
    const _removeEther = _ethBalance.mul(removeLPTokenWei).div(_totalSupply);
    const _removeCD = cryptoDevTokenReserve
      .mul(removeLPTokenWei)
      .div(_totalSupply);
    return {
      _removeEther,
      _removeCD,
    };
  } catch (err) {
    console.error(err);
  }
};
