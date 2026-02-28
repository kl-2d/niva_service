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
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
      >
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-white text-blue-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
            {items.length}
          </span>
        </div>
        <span className="hidden group-hover:inline font-semibold pr-2">Оформить</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col"
            >
              <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <ShoppingCart className="text-blue-600"/>
                  Ваша корзина услуг
                </h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-slate-500 hover:text-slate-800 transition-colors p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-grow overflow-y-auto p-6 bg-white">
                {items.length === 0 ? (
                  <div className="text-slate-500 text-center h-full flex items-center justify-center">
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
                          className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex justify-between items-center group shadow-sm"
                        >
                          <div>
                            <h4 className="text-slate-800 font-medium mb-1">{item.title}</h4>
                            <span className="text-blue-600 font-mono text-sm font-semibold">{item.price} ₽</span>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-slate-400 hover:text-red-500 p-2 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                )}
              </div>

              <div className="p-6 border-t border-slate-200 bg-slate-50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-slate-500 text-sm">Итого (предварительно)</span>
                  <span className="text-2xl font-bold font-mono text-slate-900">{totalPrice} ₽</span>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 shadow-sm"
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
