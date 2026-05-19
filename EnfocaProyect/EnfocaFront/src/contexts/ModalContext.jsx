import { createContext, useContext, useState } from 'react';
import SessionEndModal from "../components/timer/SessionEndModal.jsx";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modalData, setModalData] = useState({ isOpen: false, topic: null });
    const openEndModal = (topic) => setModalData({ isOpen: true, topic });
    const closeEndModal = () => setModalData({ isOpen: false, topic: null });

    return (
        <ModalContext.Provider value={{ modalData, openEndModal, closeEndModal }}>
            {children}
            {/* El modal vive aquí, fuera de las páginas */}
            <SessionEndModal
                isOpen={modalData.isOpen}
                onClose={closeEndModal}
                topic={modalData.topic}
                onComplete={() => { /* lógica */ closeEndModal(); }}
            />
        </ModalContext.Provider>
    );
};
export const useModal = () => useContext(ModalContext);