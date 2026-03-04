"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, Phone, Car, Hash, Loader2, MessageSquare } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import PrivacyPolicyModal from "./PrivacyPolicyModal";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    carBrand: "",
    carPlate: "",
    comment: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
          setFormData({ name: "", phone: "", date: "", carBrand: "", carPlate: "", comment: "" });
        }, 3000);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Произошла ошибка при отправке заявки. Попробуйте ещё раз.");
      }
    } catch {
      setError("Ошибка сети. Проверьте подключение к интернету.");
    } finally {
      setLoading(false);
    }
  };

  // Усиленные boundary для полей — явные и чёткие границы
  const inputClass =
    "w-full bg-white border-2 border-stone-400 text-stone-900 text-base rounded-xl pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-[#E07B00] focus:border-[#E07B00] transition-all placeholder:text-stone-400 placeholder:text-sm";

  const labelClass = "text-sm font-bold text-stone-700 block mb-1.5";

  return (
    <>
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
              className="relative bg-white border-2 border-stone-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b-2 border-stone-200 flex justify-between items-center bg-stone-50 sticky top-0 z-10">
                <h2 className="text-xl font-black text-stone-900">Оформление заявки</h2>
                <button onClick={onClose} className="text-stone-500 hover:text-stone-900 transition-colors p-1">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                {success ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-orange-50 text-[#E07B00] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-orange-200">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-stone-900 mb-2">Заявка отправлена!</h3>
                    <p className="text-stone-700">Наш менеджер свяжется с вами в ближайшее время.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Имя */}
                    <div>
                      <label className={labelClass}>Имя *</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
                        <input
                          required
                          type="text"
                          placeholder="Введите ваше имя"
                          className={inputClass}
                          value={formData.name}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[0-9]/g, "");
                            setFormData({ ...formData, name: val });
                          }}
                        />
                      </div>
                    </div>

                    {/* Телефон */}
                    <div>
                      <label className={labelClass}>Телефон *</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
                        <input
                          required
                          type="tel"
                          placeholder="+7 (999) 000-00-00"
                          className={inputClass}
                          value={formData.phone}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
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

                    {/* Марка автомобиля */}
                    <div>
                      <label className={labelClass}>Марка автомобиля</label>
                      <div className="relative">
                        <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
                        <input
                          type="text"
                          placeholder="Lada Niva, Chevrolet Niva..."
                          className={inputClass}
                          value={formData.carBrand}
                          onChange={(e) => setFormData({ ...formData, carBrand: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Госномер */}
                    <div>
                      <label className={labelClass}>Государственный номер</label>
                      <div className="relative">
                        <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
                        <input
                          type="text"
                          placeholder="А123БВ777"
                          className={`${inputClass} uppercase`}
                          value={formData.carPlate}
                          onChange={(e) =>
                            setFormData({ ...formData, carPlate: e.target.value.toUpperCase() })
                          }
                        />
                      </div>
                    </div>

                    {/* Дата */}
                    <div>
                      <label className={labelClass}>Желаемая дата (необязательно)</label>
                      <div
                        className="relative flex items-center gap-2 bg-white border-2 border-stone-400 rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-[#E07B00] focus-within:border-[#E07B00] transition-all cursor-pointer"
                        onClick={() => { (document.getElementById('checkout-date') as HTMLInputElement)?.showPicker?.(); }}
                      >
                        <Calendar className="w-5 h-5 text-stone-500 shrink-0" />
                        <span className={`flex-1 text-base ${formData.date ? 'text-stone-900' : 'text-stone-400'}`}>
                          {formData.date
                            ? new Date(formData.date).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })
                            : 'дд.мм.гггг'}
                        </span>
                        <button
                          type="button"
                          className="flex items-center gap-1.5 bg-[#E07B00] hover:bg-[#B86300] text-white text-sm font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0"
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

                    {/* Дополнительная информация */}
                    <div>
                      <label className={labelClass}>Дополнительная информация / пожелания</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3.5 top-3.5 w-5 h-5 text-stone-500" />
                        <textarea
                          rows={3}
                          placeholder="Опишите проблему или укажите важные детали..."
                          className="w-full bg-white border-2 border-stone-400 text-stone-900 text-base rounded-xl pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-[#E07B00] focus:border-[#E07B00] transition-all placeholder:text-stone-400 placeholder:text-sm resize-none"
                          value={formData.comment}
                          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Итого */}
                    <div className="bg-stone-50 p-4 rounded-xl border-2 border-stone-200 shadow-sm">
                      <div className="flex justify-between items-center text-sm text-stone-500 mb-2">
                        <span>Выбрано услуг: {items.length}</span>
                        <span>Сумма:</span>
                      </div>
                      <div className="text-right text-2xl font-mono text-stone-900 font-black">{totalPrice.toLocaleString("ru-RU")} ₽</div>
                    </div>

                    {error && (
                      <div className="flex items-start gap-2 bg-red-50 border-2 border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                        <span className="shrink-0 mt-0.5">⚠</span>
                        <span>{error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#E07B00] hover:bg-[#B86300] text-white font-black py-4 rounded-xl flex items-center justify-center mt-2 transition-colors shadow-sm text-lg"
                    >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Отправить заявку"}
                    </button>
                    <p className="text-sm text-center text-stone-500 mt-3">
                      Нажимая кнопку, вы соглашаетесь с{" "}
                      <button
                        type="button"
                        onClick={() => setPrivacyOpen(true)}
                        className="underline underline-offset-2 hover:text-stone-800 transition-colors"
                      >
                        политикой конфиденциальности
                      </button>
                      .
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <PrivacyPolicyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </>
  );
}

function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
