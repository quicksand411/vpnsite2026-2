import React, { useEffect, useRef, useState } from 'react';
import { 
  Shield, 
  CheckCircle2, 
  X, 
  Zap, 
  User, 
  Menu, 
  ArrowRight,
  Terminal,
  Server,
  Lock,
  Globe
} from 'lucide-react';

const Background3D = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let animationId;
    
    const init = () => {
      if (!window.THREE) {
        setTimeout(init, 100);
        return;
      }
      
      const THREE = window.THREE;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);

      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 20;

      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const geometries = [
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.BoxGeometry(1.5, 1.5, 1.5),
        new THREE.OctahedronGeometry(2, 0),
        new THREE.TetrahedronGeometry(2, 0)
      ];

      const materials = [
        new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true }),
        new THREE.MeshBasicMaterial({ color: 0xfbbf24 }),
        new THREE.MeshBasicMaterial({ color: 0x000000 })
      ];

      const objects = [];
      for (let i = 0; i < 40; i++) {
        const geo = geometries[Math.floor(Math.random() * geometries.length)];
        const mat = materials[Math.floor(Math.random() * materials.length)];
        const mesh = new THREE.Mesh(geo, mat);

        mesh.position.set(
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 20 - 5
        );

        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        
        mesh.userData = {
          rx: (Math.random() - 0.5) * 0.02,
          ry: (Math.random() - 0.5) * 0.02,
          dy: (Math.random() - 0.5) * 0.05
        };

        scene.add(mesh);
        objects.push(mesh);
      }

      let mouseX = 0;
      let mouseY = 0;
      const onMouseMove = (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      };
      window.addEventListener('mousemove', onMouseMove);

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        
        objects.forEach(mesh => {
          mesh.rotation.x += mesh.userData.rx;
          mesh.rotation.y += mesh.userData.ry;
          mesh.position.y += mesh.userData.dy;
          
          if (mesh.position.y > 30) mesh.position.y = -30;
          if (mesh.position.y < -30) mesh.position.y = 30;
        });

        camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationId);
        objects.forEach(obj => {
            if(obj.geometry) obj.geometry.dispose();
            if(obj.material) obj.material.dispose();
        });
        renderer.dispose();
      };
    };

    let cleanupFn;
    if (!window.THREE) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = () => {
        cleanupFn = init();
      };
      document.head.appendChild(script);
    } else {
      cleanupFn = init();
    }

    return () => {
      if(cleanupFn) cleanupFn();
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" 
    />
  );
};

const vpnData = [
  {
    id: 'vpn-1',
    name: 'SecureGuard VPN',
    rating: 9.8,
    badge: 'Выбор редакции',
    speed: '890 Мбит/с',
    servers: '5400+ в 60 странах',
    netflix: true,
    logs: 'Строгий No-Logs',
    price: 'от $2.99/мес',
    link: '#',
    color: 'bg-yellow-400 hover:bg-yellow-300 text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]'
  },
  {
    id: 'vpn-2',
    name: 'GhostNet Proxy',
    rating: 9.5,
    badge: 'Для игр (Ping)',
    speed: '850 Мбит/с',
    servers: '3200+ в 100 странах',
    netflix: true,
    logs: 'No-Logs (аудит)',
    price: 'от $3.49/мес',
    link: '#',
    color: 'bg-black hover:bg-neutral-800 text-white border-2 border-black shadow-[4px_4px_0px_0px_#FBBF24] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]'
  },
  {
    id: 'vpn-3',
    name: 'OpenShield',
    rating: 8.9,
    badge: null,
    speed: '400 Мбит/с',
    servers: '1200+ в 40 странах',
    netflix: false,
    logs: 'Логи 14 дней',
    price: 'Free / $1.99',
    link: '#',
    color: 'bg-white hover:bg-neutral-100 text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]'
  }
];

const SeoMarkup = () => {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": vpnData[0].name,
      "applicationCategory": "SecurityApplication",
      "operatingSystem": "Windows, macOS, iOS, Android, Linux",
      "offers": {
        "@type": "Offer",
        "price": "2.99",
        "priceCurrency": "USD"
      },
      "review": {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "9.8",
          "bestRating": "10"
        },
        "author": {
          "@type": "Person",
          "name": "Алексей Иванов"
        }
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return null;
};

const Header = ({ navigate, currentPage }) => (
  <header className="border-b-4 border-black bg-white sticky top-0 z-50">
    <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
      <button 
        onClick={() => navigate('home')}
        className="flex items-center gap-2 font-inter font-black text-2xl tracking-tighter text-black uppercase hover:opacity-80 transition-opacity"
      >
        <div className="bg-yellow-400 p-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
          <Shield className="w-6 h-6 text-black" />
        </div>
        VPN<span className="bg-black text-white px-2 py-0.5 ml-1">Review</span>
      </button>
      <nav className="hidden md:flex gap-8 text-base font-inter font-bold text-black uppercase">
        <button 
          onClick={() => navigate('home')} 
          className={`hover:text-yellow-500 hover:underline decoration-4 underline-offset-4 transition-all ${currentPage === 'home' ? 'text-yellow-500 underline' : ''}`}
        >
          Рейтинги
        </button>
        <button 
          onClick={() => navigate('pc')} 
          className={`hover:text-yellow-500 hover:underline decoration-4 underline-offset-4 transition-all ${currentPage === 'pc' ? 'text-yellow-500 underline' : ''}`}
        >
          Для ПК
        </button>
        <button 
          onClick={() => navigate('howto')} 
          className={`hover:text-yellow-500 hover:underline decoration-4 underline-offset-4 transition-all ${currentPage === 'howto' ? 'text-yellow-500 underline' : ''}`}
        >
          How-To
        </button>
      </nav>
      <div className="flex items-center gap-4">
        <button className="font-inter font-bold text-black border-2 border-black px-3 py-1 bg-yellow-400 hover:bg-white transition-colors shadow-[2px_2px_0px_0px_#000]">RU</button>
        <Menu className="w-8 h-8 md:hidden text-black cursor-pointer" />
      </div>
    </div>
  </header>
);

const Footer = ({ navigate }) => (
  <footer className="bg-black border-t-8 border-yellow-400 py-16 mt-auto">
    <div className="max-w-6xl mx-auto px-4 text-center">
      <p className="mb-6 font-inter font-black text-3xl text-yellow-400 uppercase tracking-tighter">
        VPNReview2026
      </p>
      <p className="max-w-2xl mx-auto mb-10 font-bebas text-xl text-white tracking-widest leading-relaxed opacity-90">
        ОТКАЗ ОТ ОТВЕТСТВЕННОСТИ: НАШ САЙТ ПОДДЕРЖИВАЕТСЯ ЗА СЧЕТ ЧИТАТЕЛЕЙ. КОГДА ВЫ ПОКУПАЕТЕ УСЛУГИ ПО НАШИМ ССЫЛКАМ, МЫ МОЖЕМ ПОЛУЧАТЬ ПАРТНЕРСКУЮ КОМИССИЮ.
      </p>
      <div className="flex justify-center gap-8 font-inter font-bold text-sm text-white uppercase">
        <button onClick={() => navigate('methodology')} className="hover:text-yellow-400 hover:underline underline-offset-4 decoration-2">О проекте</button>
        <button onClick={() => navigate('methodology')} className="hover:text-yellow-400 hover:underline underline-offset-4 decoration-2">Как мы тестируем</button>
        <button className="hover:text-yellow-400 hover:underline underline-offset-4 decoration-2">Политика</button>
      </div>
    </div>
  </footer>
);

const ComparisonTable = ({ title = "Детальное сравнение" }) => (
  <section className="max-w-6xl mx-auto px-4 py-8 mb-24">
    <h2 className="font-inter text-3xl md:text-4xl font-black text-black mb-8 uppercase tracking-tight">
      {title} <span className="text-yellow-500 bg-black px-2">(15+ параметров)</span>
    </h2>
    
    <div className="overflow-x-auto border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead className="bg-white sticky top-20 z-40 border-b-4 border-black">
          <tr>
            <th className="p-4 border-r-4 border-black w-1/4 bg-neutral-100">
              <span className="sr-only">Характеристики</span>
            </th>
            {vpnData.map((vpn) => (
              <th key={vpn.id} className="p-6 border-r-4 last:border-r-0 border-black w-1/4 bg-white relative align-top">
                {vpn.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black font-inter text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-black whitespace-nowrap">
                    {vpn.badge}
                  </div>
                )}
                <div className="font-inter text-2xl font-black text-black mb-2 uppercase">{vpn.name}</div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="bg-black text-yellow-400 font-inter text-lg font-black px-2 py-1 border-2 border-black">
                    {vpn.rating}
                  </span>
                  <span className="font-inter text-xs text-neutral-500 font-bold uppercase">/ 10 рейтинг</span>
                </div>
                <a href={vpn.link} className={`block w-full text-center font-inter text-sm font-black uppercase py-3 px-4 transition-all ${vpn.color}`}>
                  Скачать
                </a>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          <tr className="border-b-2 border-black hover:bg-yellow-50 transition-colors">
            <td className="p-5 border-r-4 border-black font-inter font-bold text-black uppercase bg-neutral-100">
              Средняя скорость
            </td>
            {vpnData.map(vpn => (
              <td key={vpn.id} className="p-5 border-r-2 last:border-r-0 border-neutral-300 font-bebas text-2xl tracking-wide text-black">
                {vpn.speed}
              </td>
            ))}
          </tr>
          
          <tr className="border-b-2 border-black hover:bg-yellow-50 transition-colors">
            <td className="p-5 border-r-4 border-black font-inter font-bold text-black uppercase bg-neutral-100">
              Сеть серверов
            </td>
            {vpnData.map(vpn => (
              <td key={vpn.id} className="p-5 border-r-2 last:border-r-0 border-neutral-300 font-bebas text-xl tracking-wide text-black">
                {vpn.servers}
              </td>
            ))}
          </tr>

          <tr className="border-b-2 border-black hover:bg-yellow-50 transition-colors">
            <td className="p-5 border-r-4 border-black font-inter font-bold text-black uppercase bg-neutral-100">
              Стриминги
            </td>
            {vpnData.map(vpn => (
              <td key={vpn.id} className="p-5 border-r-2 last:border-r-0 border-neutral-300">
                {vpn.netflix ? (
                  <CheckCircle2 className="w-8 h-8 text-black bg-yellow-400 rounded-full border-2 border-black p-1" />
                ) : (
                  <X className="w-8 h-8 text-white bg-black rounded-full border-2 border-black p-1" />
                )}
              </td>
            ))}
          </tr>

          <tr className="border-b-2 border-black hover:bg-yellow-50 transition-colors">
            <td className="p-5 border-r-4 border-black font-inter font-bold text-black uppercase bg-neutral-100">
              Логирование
            </td>
            {vpnData.map(vpn => (
              <td key={vpn.id} className="p-5 border-r-2 last:border-r-0 border-neutral-300 font-bebas text-xl tracking-wide text-black">
                {vpn.logs}
              </td>
            ))}
          </tr>

          <tr>
            <td className="p-5 border-r-4 border-black font-inter font-bold text-black uppercase bg-neutral-100">
              Мин. цена
            </td>
            {vpnData.map(vpn => (
              <td key={vpn.id} className="p-5 border-r-2 last:border-r-0 border-neutral-300 font-inter font-black text-2xl text-black">
                {vpn.price}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  </section>
);

const HomePage = ({ navigate }) => (
  <>
    <section className="max-w-4xl mx-auto px-4 py-12 md:py-20 relative z-10">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8 md:p-12 mb-12">
        <div className="flex gap-2 text-sm font-inter font-bold text-neutral-500 mb-8 uppercase tracking-widest">
          <span className="text-black bg-yellow-400 px-2">Главная</span>
          <span>/</span>
          <span>Рейтинг 2026</span>
        </div>

        <h1 className="font-inter text-5xl md:text-7xl font-black text-black mb-8 leading-[1.05] uppercase tracking-tight">
          Топ-3 VPN для обхода блокировок в 2026 году
        </h1>

        <div className="flex flex-wrap items-center gap-4 md:gap-6 font-inter font-bold">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black border-2 border-black shadow-[2px_2px_0px_0px_#FBBF24] flex items-center justify-center text-white">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="text-black text-lg uppercase">Алексей Иванов</div>
              <div className="text-neutral-500 text-sm">Инженер кибербезопасности</div>
            </div>
          </div>
          <div className="h-10 w-1 bg-black hidden md:block"></div>
          <div className="flex items-center gap-2 text-black bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] px-4 py-2 uppercase text-sm">
            <CheckCircle2 className="w-5 h-5 text-yellow-500" />
            <span>Проверено: Июнь 2026</span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-400 border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 md:p-8">
        <div className="flex items-center gap-2 font-inter font-black text-black mb-4 text-2xl uppercase">
          <Zap className="w-8 h-8 fill-black" />
          TL;DR — Выжимка за 10 секунд
        </div>
        <p className="font-bebas text-2xl md:text-3xl text-black leading-[1.2] tracking-wide">
          Для 90% пользователей абсолютным победителем является SECUREGUARD VPN — он показал наименьшее падение скорости (всего -4% от базовой) и доказал работу протокола обфускации. Если вам нужен вариант исключительно для гейминга, выбирайте GHOSTNET PROXY. Бесплатные варианты в 2026 году сильно режут трафик.
        </p>
      </div>
    </section>

    <ComparisonTable />

    <section className="max-w-4xl mx-auto px-4 mb-24 relative z-10">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center justify-between">
        <div className="flex-1">
          <h3 className="font-inter text-3xl font-black text-black mb-4 uppercase">Как мы тестируем</h3>
          <p className="font-bebas text-2xl text-black leading-[1.2] tracking-wide mb-8">
            Мы не переписываем маркетинг с официальных сайтов. Каждый VPN устанавливается на реальное "железо", проверяется на утечки DNS/WebRTC через Wireshark и тестируется на детекцию системами DPI.
          </p>
          <button 
            onClick={() => navigate('methodology')}
            className="inline-flex items-center font-inter font-black text-black bg-yellow-400 border-2 border-black px-6 py-3 uppercase tracking-wider shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
          >
            Изучить процесс <ArrowRight className="w-6 h-6 ml-2" />
          </button>
        </div>
        <div className="w-32 h-32 shrink-0 flex items-center justify-center bg-black border-4 border-yellow-400 shadow-[4px_4px_0px_0px_#FBBF24] rounded-full rotate-12">
          <Shield className="w-16 h-16 text-yellow-400" />
        </div>
      </div>
    </section>
  </>
);

const PcPage = ({ navigate }) => (
  <>
    <section className="max-w-4xl mx-auto px-4 py-12 md:py-20 relative z-10">
      <div className="bg-black border-4 border-yellow-400 shadow-[8px_8px_0px_0px_#FBBF24] p-8 md:p-12 mb-12">
        <h1 className="font-inter text-5xl md:text-7xl font-black text-white mb-6 leading-[1.05] uppercase tracking-tight">
          Топ VPN для <span className="text-yellow-400">Windows & macOS</span>
        </h1>
        <p className="font-bebas text-2xl md:text-3xl text-neutral-300 leading-[1.2] tracking-wide">
          Десктопные клиенты требуют особого внимания к протоколам шифрования и функции Kill Switch. Мы отобрали сервисы, которые не грузят систему и гарантируют защиту на уровне ОС.
        </p>
      </div>
    </section>
    <ComparisonTable title="Сравнение клиентов для ПК" />
  </>
);

const HowToPage = () => {
  const articles = [
    { title: "Как настроить протокол WireGuard вручную", category: "Инструкция", icon: <Terminal /> },
    { title: "Обход систем DPI в 2026 году: Что работает?", category: "Аналитика", icon: <Server /> },
    { title: "Утечки DNS и WebRTC: Как проверить свой VPN", category: "Безопасность", icon: <Lock /> },
    { title: "Настройка VPN на домашнем роутере (OpenWRT)", category: "Хардвар", icon: <Globe /> }
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 md:py-20 relative z-10">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8 md:p-12 mb-12 inline-block">
        <h1 className="font-inter text-5xl md:text-7xl font-black text-black leading-[1.05] uppercase tracking-tight">
          База Знаний <span className="text-yellow-500">& How-To</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((art, idx) => (
          <div key={idx} className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000] p-6 hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#FBBF24] transition-all cursor-pointer group flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-black text-yellow-400 border-2 border-black group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                {art.icon}
              </div>
              <span className="font-inter font-black text-sm uppercase px-2 py-1 bg-neutral-100 border-2 border-black">
                {art.category}
              </span>
            </div>
            <h3 className="font-inter text-2xl font-black text-black uppercase mb-4 mt-auto">
              {art.title}
            </h3>
            <div className="font-inter font-bold text-sm text-black flex items-center gap-1 group-hover:text-yellow-600">
              Читать статью <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const MethodologyPage = () => (
  <section className="max-w-4xl mx-auto px-4 py-12 md:py-20 relative z-10">
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8 md:p-12 mb-12">
      <h1 className="font-inter text-5xl md:text-7xl font-black text-black mb-6 leading-[1.05] uppercase tracking-tight">
        Как мы тестируем VPN <span className="bg-yellow-400 px-2">(20 Шагов)</span>
      </h1>
      
      <div className="space-y-12 mt-12">
        <div>
          <div className="font-inter text-3xl font-black text-black uppercase mb-4 border-l-8 border-yellow-400 pl-4">
            Шаг 1: Анализ скорости и пинга
          </div>
          <p className="font-bebas text-2xl text-black leading-relaxed tracking-wide">
            Мы берем базовый гигабитный канал (1000 Мбит/с) без VPN. Затем мы подключаемся к серверам в США, Европе и Азии. Мы замеряем падение скорости в процентах. Если VPN режет скорость более чем на 30% на европейских серверах — он выбывает из топ-10.
          </p>
        </div>

        <div>
          <div className="font-inter text-3xl font-black text-black uppercase mb-4 border-l-8 border-yellow-400 pl-4">
            Шаг 2: Проверка на утечки (Wireshark)
          </div>
          <p className="font-bebas text-2xl text-black leading-relaxed tracking-wide">
            VPN может показывать вам другой IP, но при этом сливать ваши DNS-запросы вашему провайдеру. Мы используем сниффер трафика Wireshark, чтобы убедиться, что ни один пакет данных не проходит мимо зашифрованного туннеля. Также мы жестко проверяем WebRTC-утечки в браузерах.
          </p>
        </div>

        <div>
          <div className="font-inter text-3xl font-black text-black uppercase mb-4 border-l-8 border-yellow-400 pl-4">
            Шаг 3: Аудит логов и юрисдикции
          </div>
          <p className="font-bebas text-2xl text-black leading-relaxed tracking-wide">
            "No-logs" политика должна быть подтверждена независимым аудитом (PwC, Deloitte, Cure53). Мы также проверяем юридический адрес компании. Сервисы из стран альянса "14 Eyes" получают штрафные баллы в итоговом рейтинге конфиденциальности.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage navigate={setCurrentPage} />;
      case 'pc':
        return <PcPage navigate={setCurrentPage} />;
      case 'howto':
        return <HowToPage />;
      case 'methodology':
        return <MethodologyPage />;
      default:
        return <HomePage navigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen text-black font-sans flex flex-col relative z-0">
      <Background3D />
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;700;900&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
      `}} />
      <SeoMarkup />
      
      <Header navigate={setCurrentPage} currentPage={currentPage} />
      
      <main className="flex-1">
        {renderPage()}
      </main>
      
      <Footer navigate={setCurrentPage} />
    </div>
  );
}
