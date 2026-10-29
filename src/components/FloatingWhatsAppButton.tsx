import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { WhatsAppOrderModal } from './WhatsAppOrderModal';

export const FloatingWhatsAppButton: React.FC = () => {
  const { cart, openWhatsAppEnquiry } = useStore();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);

  // Product detail page has its own sticky bottom bar with a prominent WhatsApp Order button
  const isProductDetail = location.pathname.startsWith('/product/');
  if (isProductDetail) return null;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleClick = () => {
    if (cart.length > 0) {
      setModalOpen(true);
    } else {
      openWhatsAppEnquiry({
        customMessage:
          'Hello *CHARLIE MOBILES & ACCESSORIES*, I want to place an order on WhatsApp. Please share available models and offers.',
      });
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Order on WhatsApp"
        className="fixed bottom-4 right-4 z-40 h-12 px-4 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-lg flex items-center gap-2 transition-transform active:scale-95 cursor-pointer border-2 border-white"
      >
        <MessageCircle className="w-5 h-5 fill-white text-white shrink-0" />
        <span className="text-xs sm:text-sm font-extrabold tracking-tight">
          {totalItems > 0 ? `Order Cart (${totalItems}) on WhatsApp` : 'Order on WhatsApp'}
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
