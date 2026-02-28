import { MapPin, Phone, Clock, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 pt-12 pb-8 text-white" id="contacts">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-4">
              Нива Сервис
            </h2>
            <p className="text-gray-300 mb-4 whitespace-pre-wrap">
              Единственный специализированный сервис НИВА и CHEVROLET NIVA в Воронеже.
            </p>
            <div className="text-sm text-gray-400">
              <p>ОГРН 304366434500094</p>
            </div>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-300">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span>г. Воронеж, ул. Матросова, 100</span>
              </li>
              <li className="flex flex-col gap-2">
                <a href="tel:+79202295656" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                  <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                  <span className="font-medium">+7 920 229-56-56</span>
                </a>
                <a href="tel:+74732361818" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                  <Phone className="w-5 h-5 text-blue-600 opacity-0 shrink-0" />
                  <span className="font-medium">+7 473 236-18-18</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Режим работы</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-300">
                <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p>Пн-Пт: 9:00 - 18:00</p>
                  <p>Сб: 10:00 - 16:00</p>
                  <p className="text-gray-500 mt-1">Вс: Выходной</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Map (Small viewport preview or CTA to scroll) */}
          <div className="h-48 lg:h-auto rounded-lg overflow-hidden border border-gray-700 relative bg-gray-800 shadow-sm">
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=39.158141%2C51.637505&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1NjQyMDk3NxJI0KDQvtGB0YHQuNGPLCDQktC-0YDQvtC90LXQtiwg0YPQu9C40YbQsCDQnNCw0YLRgNC-0YHQvtCy0LAsIDEwMCIKDQnQ_UEVX8BMQg%2C%2C&z=16.63"
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen={true}
              className="absolute inset-0"
            ></iframe>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Нива Сервис. Все права защищены.</p>
          <a href="#" className="hover:text-white transition-colors">
            Политика конфиденциальности
          </a>
        </div>
      </div>
    </footer>
  );
}
