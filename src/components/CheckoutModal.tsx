"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, Phone, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          services: items,
          totalPrice,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          clearCart();
          onClose();
          setSuccess(false);
        }, 3000);
      } else {
        alert("Произошла ошибка при отправке заявки.");
      }
    } catch (err) {
      console.error(err);
      alert("Ошибка сети.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-stone-50">
              <h2 className="text-xl font-bold text-stone-900">Оформление заявки</h2>
              <button onClick={onClose} className="text-stone-500 hover:text-stone-900 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-orange-50 text-[#E07B00] rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 mb-2">Заявка отправлена!</h3>
                  <p className="text-stone-700">Наш менеджер свяжется с вами в ближайшее время.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm text-stone-700 font-medium">Имя *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
                      <input
                        required
                        type="text"
                        placeholder="Иван"
                        className="w-full bg-white border border-stone-300 text-stone-900 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#E07B00] focus:border-[#E07B00] transition-all placeholder:text-stone-500"
                        value={formData.name}
                        onChange={(e) => {
                          // Запрет цифр в имени
                          const val = e.target.value.replace(/[0-9]/g, "");
                          setFormData({ ...formData, name: val });
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-stone-700 font-medium">Телефон *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
                      <input
                        required
                        type="tel"
                        placeholder="+7 (999) 000-00-00"
                        className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#E07B00] focus:border-[#E07B00] transition-all placeholder:text-stone-500"
                        value={formData.phone}
                        onChange={(e) => {
                          // Оставляем только цифры
                          const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                          // Форматируем: +7 (XXX) XXX-XX-XX
                          let formatted = "";
                          if (digits.length === 0) { formatted = ""; }
                          else if (digits.length <= 1) { formatted = "+7"; }
                          else if (digits.length <= 4) { formatted = `+7 (${digits.slice(1)}`; }
                          else if (digits.length <= 7) { formatted = `+7 (${digits.slice(1, 4)}) ${digits.slice(4)}`; }
                          else if (digits.length <= 9) { formatted = `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`; }
                          else { formatted = `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`; }
                          setFormData({ ...formData, phone: formatted });
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-stone-700 font-medium">Желаемая дата (необязательно)</label>
                    <div
                      className="relative flex items-center gap-2 bg-white border border-stone-300 rounded-lg px-3 py-3 focus-within:ring-2 focus-within:ring-[#E07B00] focus-within:border-[#E07B00] transition-all cursor-pointer"
                      onClick={() => { (document.getElementById('checkout-date') as HTMLInputElement)?.showPicker?.(); }}
                    >
                      <Calendar className="w-5 h-5 text-stone-400 shrink-0" />
                      <span className={`flex-1 text-sm ${formData.date ? 'text-stone-900' : 'text-stone-400'}`}>
                        {formData.date
                          ? new Date(formData.date).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })
                          : 'дд.мм.гггг'}
                      </span>
                      <button
                        type="button"
                        className="flex items-center gap-1.5 bg-[#E07B00] hover:bg-[#B86300] text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors shrink-0"
                        onClick={(ev) => { ev.stopPropagation(); (document.getElementById('checkout-date') as HTMLInputElement)?.showPicker?.(); }}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Выбрать дату
                      </button>
                      <input
                        id="checkout-date"
                        type="date"
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 mt-6 shadow-sm">
                    <div className="flex justify-between items-center text-sm text-stone-500 mb-2">
                      <span>Выбрано услуг: {items.length}</span>
                      <span>Сумма:</span>
                    </div>
                    <div className="text-right text-2xl font-mono text-stone-900 font-bold">{totalPrice} ₽</div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#E07B00] hover:bg-[#B86300] text-white font-bold py-4 rounded-xl flex items-center justify-center mt-6 transition-colors shadow-sm"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Отправить заявку"}
                  </button>
                  <p className="text-xs text-center text-stone-500 mt-4">
                    Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Quick inline check icon for success state
function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

