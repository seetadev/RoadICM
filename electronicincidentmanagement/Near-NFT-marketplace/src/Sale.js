import React from 'react'

const Sale = () => {

    

    const approveNFTForSale = async (token_id) => {
        sendStorageDeposit();
        let sale_conditions = {
          sale_conditions: values.assetPrice,
        };
        console.log("sale conditions: ", sale_conditions);
        await walletConnection.account().functionCall({
          contractId: nearConfig.contractName,
          methodName: "nft_approve",
          args: {
            token_id: token_id,
            account_id: nearConfig.marketContractName,
            msg: JSON.stringify(sale_conditions),
          },
          attachedDeposit: parseNearAmount("0.01"),
        });
      };
  return (
    <div>Sale</div>
  )
}

export default Sale