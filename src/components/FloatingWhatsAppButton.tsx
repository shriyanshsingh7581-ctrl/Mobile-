import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { WhatsAppOrderModal } from './WhatsAppOrderModal';

export const FloatingWhatsAppButton: React.FC = () => {
  const { cart, openWhatsAppEnquiry } = useStore();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);

  const isProductDetail = location.pathname.startsWith('/product/');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (isProductDetail || totalItems === 0) return null;

  const handleClick = () => {
    if (cart.length > 0) {
      setModalOpen(true);
    } else {
      openWhatsAppEnquiry({});
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Order on WhatsApp"
        className="fixed bottom-16 md:bottom-5 left-1/2 -translate-x-1/2 z-40 h-10 px-5 bg-[#2A1810] hover:bg-[#1A1A1A] text-[#F4D993] border border-[#B5893D] shadow-xl flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
      >
        <MessageCircle className="w-4 h-4 fill-[#25D366] text-[#25D366] shrink-0" />
        <span className="text-[11px] font-bold uppercase tracking-wider">
          Order Bag ({totalItems}) on WhatsApp
        </span>
      </button>

      <WhatsAppOrderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode="cart"
      />
    </>
  );
};

