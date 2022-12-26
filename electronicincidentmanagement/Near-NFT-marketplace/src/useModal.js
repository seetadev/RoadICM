import { useState } from "react";

const useModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleSale, setIsVisibleSale] = useState(false);
  const [isVisibleBid, setIsVisibleBid] = useState(false);
  function toggleModal() {
    setIsVisible(!isVisible);
  }
  function toggleSaleModal() {
    setIsVisibleSale(!isVisibleSale);
  }
  function toggleBidModal() {
    setIsVisibleBid(!isVisibleBid);
  }
  return {
    isVisible,
    toggleModal,
    isVisibleSale,
    toggleSaleModal,
    isVisibleBid,
    toggleBidModal,
  };
};
export default useModal;
