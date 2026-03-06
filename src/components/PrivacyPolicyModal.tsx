"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#DDD8D1] bg-[#F0EDE8] shrink-0">
              <h2 className="text-lg font-bold text-[#1C1F23]">Политика конфиденциальности</h2>
              <button
                onClick={onClose}
                className="text-[#9C9488] hover:text-[#1C1F23] transition-colors p-1 rounded-lg hover:bg-[#E6E2DC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-6 text-sm text-[#6B635C] space-y-5 leading-relaxed">
              <p className="text-xs text-[#9C9488]">Последнее обновление: январь 2025 г.</p>

              <section>
                <h3 className="font-bold text-[#1C1F23] mb-2">1. Общие положения</h3>
                <p>
                  Настоящая Политика конфиденциальности определяет порядок обработки и защиты
                  персональных данных пользователей сайта <strong>niva-service.ru</strong> (далее — Сайт),
                  принадлежащего ИП «Нива Сервис» (ОГРН 304366434500094, г. Воронеж).
                </p>
              </section>

              <section>
                <h3 className="font-bold text-[#1C1F23] mb-2">2. Какие данные мы собираем</h3>
                <p>При оформлении заявки на сайте мы просим указать:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Имя и контактный телефон</li>
                  <li>Марку автомобиля и государственный номер (необязательно)</li>
                  <li>Удобную дату визита (необязательно)</li>
                  <li>Перечень интересующих услуг</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-[#1C1F23] mb-2">3. Цели использования данных</h3>
                <p>Собранные данные используются исключительно для:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Связи с вами по вопросу записи на ремонт</li>
                  <li>Формирования предварительного заказа</li>
                  <li>Улучшения качества обслуживания</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-[#1C1F23] mb-2">4. Хранение и защита данных</h3>
                <p>
                  Персональные данные хранятся в защищённой базе данных на серверах в России.
                  Мы не передаём ваши данные третьим лицам без вашего согласия, за исключением
                  случаев, предусмотренных законодательством РФ.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-[#1C1F23] mb-2">5. Файлы cookie</h3>
                <p>
                  Сайт использует технические cookies, необходимые для его функционирования.
                  Аналитические cookie не применяются.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-[#1C1F23] mb-2">6. Ваши права</h3>
                <p>
                  Вы вправе в любое время запросить удаление ваших персональных данных,
                  направив обращение по телефону{" "}
                  <a href="tel:+79202295656" className="text-[#C8553D] hover:underline font-medium">
                    +7 920 229-56-56
                  </a>{" "}
                  или по адресу: г. Воронеж, ул. Матросова, 100.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-[#1C1F23] mb-2">7. Согласие</h3>
                <p>
                  Нажимая кнопку «Отправить заявку» или «Заказать звонок», вы подтверждаете
                  своё согласие с настоящей Политикой конфиденциальности и даёте согласие
                  на обработку персональных данных в соответствии с Федеральным законом
                  № 152-ФЗ «О персональных данных».
                </p>
              </section>
            </div>

            {/* Footer */}
            <div className="shrink-0 px-6 py-4 border-t border-[#DDD8D1] bg-[#F0EDE8]">
              <button
                onClick={onClose}
                className="w-full bg-[#C8553D] hover:bg-[#A8442F] text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-[#C8553D]/20 hover:shadow-lg hover:shadow-[#C8553D]/30 text-sm"
              >
                Понятно
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
