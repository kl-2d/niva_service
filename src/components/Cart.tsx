"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import CheckoutModal from "./CheckoutModal";

export default function Cart() {
  const { items, totalPrice, removeItem } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Hidden unless there are items
  if (items.length === 0) return null;

  return (
    <>
      {/* Mobile: compact round button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 bg-[#C8553D] text-white p-4 rounded-full shadow-lg shadow-[#C8553D]/30 hover:bg-[#A8442F] hover:-translate-y-1 transition-all flex items-center justify-center"
      >
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-[#1C1F23] text-[#E8A88C] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
            {items.length}
          </span>
        </div>
      </button>

      {/* Desktop: wide pill with label + count + total */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex fixed bottom-8 right-8 z-40 items-center gap-3 bg-[#C8553D] hover:bg-[#A8442F] text-white font-semibold px-5 py-4 rounded-2xl shadow-xl shadow-[#C8553D]/30 hover:-translate-y-1 transition-all"
      >
        <div className="relative shrink-0">
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2.5 -right-2.5 bg-[#1C1F23] text-[#E8A88C] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
            {items.length}
          </span>
        </div>
        <div className="flex flex-col items-start leading-tight">
          <span className="text-sm font-bold">Моя корзина</span>
          <span className="text-xs text-[#FAE8E4]">{items.length} {items.length === 1 ? "услуга" : items.length < 5 ? "услуги" : "услуг"} · {totalPrice.toLocaleString("ru-RU")} ₽</span>
        </div>
        <ArrowRight className="w-5 h-5 ml-1 shrink-0" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#1C1F23]/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white border-l border-[#D1CBC3] shadow-2xl z-50 flex flex-col"
            >
              <div className="p-6 border-b border-[#DDD8D1] flex justify-between items-center bg-[#F0EDE8]">
                <h2 className="text-xl font-bold text-[#1C1F23] flex items-center gap-2">
                  <ShoppingCart className="text-[#C8553D]" />
                  Ваша корзина услуг
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[#6B635C] hover:text-[#1C1F23] transition-colors p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 bg-white">
                {items.length === 0 ? (
                  <div className="text-[#6B635C] text-center h-full flex items-center justify-center">
                    Корзина пуста
                  </div>
                ) : (
                  <ul className="space-y-4">
                    <AnimatePresence>
                      {items.map((item) => (
                        <motion.li
                          key={item.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-[#F0EDE8] border border-[#D1CBC3] p-4 rounded-xl flex justify-between items-center group shadow-sm"
                        >
                          <div>
                            <h4 className="text-[#1C1F23] font-medium mb-1">{item.title}</h4>
                            <span className="text-[#C8553D] text-sm font-semibold" style={{ fontFamily: "var(--font-roboto-mono, var(--font-mono))" }}>{item.price.toLocaleString("ru-RU")} ₽</span>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-[#9C9488] hover:text-red-500 p-2 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                )}
              </div>

              <div className="p-6 border-t border-[#DDD8D1] bg-[#F0EDE8]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[#6B635C] text-sm">Итого (предварительно)</span>
                  <span className="text-2xl font-bold text-[#1C1F23]" style={{ fontFamily: "var(--font-roboto-mono, var(--font-mono))" }}>{totalPrice.toLocaleString("ru-RU")} ₽</span>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full bg-[#C8553D] hover:bg-[#A8442F] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 shadow-md shadow-[#C8553D]/20 hover:shadow-lg hover:shadow-[#C8553D]/30"
                >
                  Оформить заявку
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setIsOpen(false);
        }}
      />
    </>
  );
}
