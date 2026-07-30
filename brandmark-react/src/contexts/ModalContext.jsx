import React, { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);
  const [isTalkToMarkOpen, setIsTalkToMarkOpen] = useState(false);

  const openStrategyModal = () => setIsStrategyModalOpen(true);
  const closeStrategyModal = () => setIsStrategyModalOpen(false);

  const openTalkToMark = () => setIsTalkToMarkOpen(true);
  const closeTalkToMark = () => setIsTalkToMarkOpen(false);

  return (
    <ModalContext.Provider value={{ 
      isStrategyModalOpen, openStrategyModal, closeStrategyModal,
      isTalkToMarkOpen, openTalkToMark, closeTalkToMark
    }}>
      {children}
    </ModalContext.Provider>
  );
};

