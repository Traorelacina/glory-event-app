import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Service } from '../types';
import Footer from '../components/Footer';

interface ServicesPageProps {
  onNavigate: (page: string, serviceId?: string) => void;
}

export default function ServicesPage({ onNavigate }: ServicesPageProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const services: Service[] = [
    {
      id: 'mariages',
      title: 'Mariages de Luxe',
      description:
        'Transformez le plus beau jour de votre vie en un moment magique et inoubliable. Notre équipe d\'experts orchestre chaque détail avec passion et professionnalisme pour créer une célébration à votre image.',
      image:
        'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=1920',
      gallery: [
        'https://scontent.fabj5-2.fna.fbcdn.net/v/t39.30808-6/558455144_792108313615912_2798952595938159567_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEbj8oFgGOihZjy6ekWUxbGRAQhTiXs1TtEBCFOJezVO_XZbiEp0cqORgrCI-OE7UrLQAH4wazyFLT3wy3QC_lO&_nc_ohc=KbNKsWH1yWUQ7kNvwEzthiM&_nc_oc=AdmVGo1D7ea42Y_Pp31Y_f4ubQcSAJR2HH5l00MM0JQzkg2joV0tjfooRYUYIqfiodY&_nc_zt=23&_nc_ht=scontent.fabj5-2.fna&_nc_gid=F4hu4LqHkKWTZ2CDMdKL7Q&oh=00_AfgeHu5iErGY3ohtcjdfnNAprrYj1d5qAo2qdhY6wCXu5A&oe=69277DA8',
        'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      icon: 'https://cdn-icons-png.flaticon.com/512/747/747376.png',
    },
    {
      id: 'corporate',
      title: 'Événements Corporate',
      description:
        'Donnez à vos événements professionnels une dimension exceptionnelle. Séminaires, lancements de produits, galas d\'entreprise : nous créons des expériences qui marquent les esprits et renforcent votre image de marque.',
      image:
        'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=1920',
      gallery: [
        'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      icon: 'https://cdn-icons-png.flaticon.com/512/1067/1067566.png',
    },
    {
      id: 'receptions',
      title: 'Réceptions Privées',
      description:
        'Anniversaires, fiançailles, baptêmes ou simplement l\'envie de célébrer : nous créons des moments de partage authentiques dans des cadres enchanteurs. Chaque réception est unique, à votre image.',
      image:
        'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=1920',
      gallery: [
        'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1157557/pexels-photo-1157557.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      icon: 'https://cdn-icons-png.flaticon.com/512/3290/3290425.png',
    },
    {
      id: 'restauration',
      title: 'Service de Restauration',
      description:
        'Une expérience culinaire raffinée pour sublimer vos événements. Notre chef et son équipe créent des menus sur mesure, alliant créativité et excellence gustative pour émerveiller vos convives.',
      image:
        'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1920',
      gallery: [
        'https://scontent.fabj5-1.fna.fbcdn.net/v/t39.30808-6/474460810_591402047019874_5302692506335260921_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHjUScCOWc-49kvUS4YFTugaz_HfWGNDFBrP8d9YY0MUBWTi9DzSUguUFL5RYCxP9j6VrRDncdeQbx-fZXPbzHq&_nc_ohc=ROHekJBwXAkQ7kNvwETIGAw&_nc_oc=AdmAoC5ngph4vQlYOX-PJddYZu1hxS4_5FrXZ5Y-GOFycj958n9ZU36FhWb1KLer7Fw&_nc_zt=23&_nc_ht=scontent.fabj5-1.fna&_nc_gid=qknFJdk8c_vTX6EXeDEDdg&oh=00_AfjicdhciVBfKrJL6oS5agAyvaY-99POGa-IH_FkOz3EZA&oe=69275D30',
        'https://scontent.fabj5-1.fna.fbcdn.net/v/t39.30808-6/474700308_591402277019851_1044336786120214148_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGGvr4Aqe3p-kx9PqYBGuwIC5kFvK_EemoLmQW8r8R6aqA_Gqhqc-FKrZ6zVAh8Ha2uGbTYkdXKCgnFOjRtTOI0&_nc_ohc=sEXBHGZXUcEQ7kNvwGFWNGm&_nc_oc=AdlThcvQXYPS4uyHaHKcEXaA3f9ng6MrkZgC-89SLfP_yGv5vEsUjU-cjnLsNuQTnRA&_nc_zt=23&_nc_ht=scontent.fabj5-1.fna&_nc_gid=iKeXmEWTokcnikAnjoHJNA&oh=00_AfjeGkPMvaS5HyY_QTpS9B_2fofXuIna6hEDKMdMYd201g&oe=69277FD0',
        'https://scontent.fabj5-1.fna.fbcdn.net/v/t39.30808-6/474662104_591402373686508_7233185737982302691_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFn2lHgMka55V2VkEJqupT_yBdKITuZ0_fIF0ohO5nT90k2a66y5LLWh8na-S27mNNLEx9VTMHw5ZT4y8YRYFcY&_nc_ohc=F_gz9pi7-RwQ7kNvwHaRE8T&_nc_oc=AdmPIwuqqwFcIjg4Ah7EOPfDkB-9YDGATP0BL_inbYp_B6O88Rw8kBpIVxaO393F7R8&_nc_zt=23&_nc_ht=scontent.fabj5-1.fna&_nc_gid=nTEwLIgbW4K8j2330I3QWg&oh=00_Afh40eSo5UW3YHVNuQvZBCeKdyJJr0lFz3CHmfyqJv6S8g&oe=69277E00',
        'https://scontent.fabj5-2.fna.fbcdn.net/v/t39.30808-6/474640101_591402350353177_1889578150718329059_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeESxdi2q7ufYOSuKLcaUdsxOTaRw00UMJ05NpHDTRQwnaqBBrnrjln5swIZ4kr4bK8B1WfqMZ09J0Xa_oqN8yEL&_nc_ohc=ZtOHetO3DNgQ7kNvwEK6o20&_nc_oc=AdnHnzFQMHb5GUTYpcBc6cFM6rUW9ZySMUyyupWEPH74HVymBjNWpdZVglrOoc7oTJg&_nc_zt=23&_nc_ht=scontent.fabj5-2.fna&_nc_gid=0KvTibFgpSiKYIMherggjA&oh=00_AfjpNuPpT-KZugehulPqZ26geRPGGZmVMDvW5-Qn7HjitQ&oe=692759D2',
      ],
      icon: 'https://cdn-icons-png.flaticon.com/512/2738/2738730.png',
    },
    {
      id: 'decoration',
      title: 'Décoration sur Mesure',
      description:
        'L\'art de créer des ambiances qui racontent votre histoire. Notre équipe de décorateurs talentueux conçoit des univers visuels époustouflants, du concept initial jusqu\'à la réalisation finale.',
      image:
        'https://scontent.fabj5-2.fna.fbcdn.net/v/t51.82787-15/561846531_17984930459906860_3449748711829899152_n.jpg?stp=dst-jpegr_tt6&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeE-97ASt1R-tFyGboBYyqlhyjwfjU_pK1bKPB-NT-krVp5qtP4UMyKfIREn082A8ERfuTeW_dRomWFJnLgjZTbg&_nc_ohc=ROK8SXoyv38Q7kNvwFyQDBH&_nc_oc=AdlWggG2iid5xhJ82zFWXhcuxSfKLShSmbRKMW1a6WxZ4Nl_5NUKpX0-swCzx4KkPNY&_nc_zt=23&se=-1&_nc_ht=scontent.fabj5-2.fna&_nc_gid=IL9NZczTjXZ78SY9I-D4WA&oh=00_Afjlm7Bt_GSumAERoroCO9KPyWrHIOGBFThIiFy2kx_bVQ&oe=692773C0',
      gallery: [
        'https://scontent.fabj5-1.fna.fbcdn.net/v/t39.30808-6/565690055_802299149263495_5241726712948988641_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHqmn6Mg1k5KHHjQA3xnpryVCwmStiPL3lULCZK2I8veVW_UcozuXcd_j2_KJ_1_z_33kZc4KKGvI5t6CyYmHQX&_nc_ohc=dmYopNbPV0MQ7kNvwHt2Pai&_nc_oc=AdmEGr5BTojp671ASzZQUqvqOB45regpAP5vWGwHHFgxFGvDLw5t31shp72bIiF3hZ8&_nc_zt=23&_nc_ht=scontent.fabj5-1.fna&_nc_gid=-FQu5vq5kSGjfhsXBn0w0g&oh=00_AfiYmYBe75WP0TvYDyVPzVQI5AudFtqhNoxq-00r20U-rg&oe=69277332',
        'https://scontent.fabj5-1.fna.fbcdn.net/v/t39.30808-6/473570381_586580980835314_5699410999367893011_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEjZmKOT3Upn1xVzeiBs4mjz6uQ9o2-FkDPq5D2jb4WQGa0IVuvL3nzZEUylTQC-aey7udEcgW_A3oy1Fjh5Ji4&_nc_ohc=vhTwHd2Gx88Q7kNvwG3_agQ&_nc_oc=AdkShAoSR1MPPHJ6EYUlC4YTUa3Vx7vK99pcl8aPV56Oq349vlM3yCF3wVcJATWOU5g&_nc_zt=23&_nc_ht=scontent.fabj5-1.fna&_nc_gid=VWVgF6SPGPnuBquHCcmX0w&oh=00_Afgig4tc1o3hWXcMFssaQve1kd6Ti1GVTdEO51dVQ5tKBg&oe=69276631',
        'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://scontent.fabj5-2.fna.fbcdn.net/v/t51.82787-15/561846531_17984930459906860_3449748711829899152_n.jpg?stp=dst-jpegr_tt6&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeE-97ASt1R-tFyGboBYyqlhyjwfjU_pK1bKPB-NT-krVp5qtP4UMyKfIREn082A8ERfuTeW_dRomWFJnLgjZTbg&_nc_ohc=ROK8SXoyv38Q7kNvwFyQDBH&_nc_oc=AdlWggG2iid5xhJ82zFWXhcuxSfKLShSmbRKMW1a6WxZ4Nl_5NUKpX0-swCzx4KkPNY&_nc_zt=23&se=-1&_nc_ht=scontent.fabj5-2.fna&_nc_gid=IL9NZczTjXZ78SY9I-D4WA&oh=00_Afjlm7Bt_GSumAERoroCO9KPyWrHIOGBFThIiFy2kx_bVQ&oe=692773C0',
      ],
      icon: 'https://cdn-icons-png.flaticon.com/512/3144/3144456.png',
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white font-playfair overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

        .font-playfair {
          font-family: 'Playfair Display', serif;
        }

        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        .font-cormorant {
          font-family: 'Cormorant Garamond', serif;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes floatUp {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(173, 89, 69, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(173, 89, 69, 0.6);
          }
        }

        @keyframes morphBlob {
          0%, 100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          50% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.6s ease-out forwards;
        }

        .animate-float {
          animation: floatUp 4s ease-in-out infinite;
        }

        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(50px) scale(0.95);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .reveal-on-scroll.in-view {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .service-card {
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
        }

        .service-card::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, #ad5945, #d38074, #ad5945);
          border-radius: 24px;
          opacity: 0;
          z-index: -1;
          transition: opacity 0.6s ease;
          animation: shimmer 3s linear infinite;
          background-size: 200% 100%;
        }

        .service-card:hover::before {
          opacity: 0.1;
        }

        .service-card:hover {
          transform: translateY(-12px);
        }

        .icon-box {
          background: white;
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          position: relative;
        }

        .icon-box::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(135deg, rgba(173, 89, 69, 0.1), rgba(211, 128, 116, 0.1));
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .service-card:hover .icon-box {
          transform: rotate(12deg) scale(1.15);
          box-shadow: 0 20px 50px rgba(173, 89, 69, 0.25);
          animation: glowPulse 2s ease-in-out infinite;
        }

        .service-card:hover .icon-box::after {
          opacity: 1;
        }

        .gallery-expand {
          animation: fadeInUp 0.5s ease-out;
        }

        .button-hover {
          position: relative;
          overflow: hidden;
        }

        .button-hover::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          transform: translate(-50%, -50%);
          transition: width 0.6s ease, height 0.6s ease;
        }

        .button-hover:hover::before {
          width: 300px;
          height: 300px;
        }

        .image-overlay {
          transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .service-card:hover .image-overlay {
          background: linear-gradient(135deg, rgba(173, 89, 69, 0.3) 0%, rgba(211, 128, 116, 0.3) 100%);
        }

        .service-image {
          position: relative;
          overflow: hidden;
        }

        .service-image img {
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .service-card:hover .service-image img {
          transform: scale(1.08) rotate(1deg);
        }

        .service-image::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.2) 100%);
          opacity: 0;
          transition: opacity 0.7s ease;
          pointer-events: none;
        }

        .service-card:hover .service-image::after {
          opacity: 1;
        }

        .chevron-rotate {
          transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .chevron-rotate.rotated {
          transform: rotate(180deg);
        }

        .header-parallax {
          transform: translateY(${scrollY * 0.3}px);
          opacity: ${Math.max(0, 1 - scrollY / 400)};
        }

        .text-gradient {
          background: linear-gradient(135deg, #ad5945 0%, #d38074 50%, #ad5945 100%);
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }

        .floating-shapes {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }

        .shape {
          position: absolute;
          background: linear-gradient(135deg, rgba(173, 89, 69, 0.05), rgba(211, 128, 116, 0.05));
          animation: morphBlob 8s ease-in-out infinite, floatUp 6s ease-in-out infinite;
        }

        .shape-1 {
          width: 300px;
          height: 300px;
          top: 10%;
          left: 5%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 200px;
          height: 200px;
          top: 60%;
          right: 10%;
          animation-delay: 2s;
        }

        .shape-3 {
          width: 150px;
          height: 150px;
          bottom: 10%;
          left: 50%;
          animation-delay: 4s;
        }

        .magnetic-button {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .gallery-image-wrapper {
          position: relative;
          overflow: hidden;
        }

        .gallery-image-wrapper::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .gallery-image-wrapper:hover::before {
          transform: translateX(100%);
        }

        @keyframes dotPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.5;
          }
        }

        .dot-pulse {
          animation: dotPulse 1.5s ease-in-out infinite;
        }

        .stagger-item {
          opacity: 0;
          animation: fadeInUp 0.8s ease-out forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="pt-32 pb-20 relative" ref={containerRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={headerRef}
            className="header-parallax text-center mb-20 relative z-10"
            style={{
              transform: `translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px)`
            }}
          >
            <div className="stagger-item" style={{ animationDelay: '0s' }}>
              <h1 className="font-cormorant text-5xl md:text-7xl font-light text-gradient mb-8 leading-tight tracking-tight">
                Nos Services
              </h1>
            </div>
            <div className="stagger-item" style={{ animationDelay: '0.2s' }}>
              <p className="font-inter text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
                Des prestations d'excellence pour transformer vos événements en expériences mémorables
              </p>
            </div>
            <div
              className="stagger-item mt-8 flex justify-center gap-2"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ad5945] to-[#d38074] dot-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ad5945] to-[#d38074] dot-pulse" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ad5945] to-[#d38074] dot-pulse" style={{ animationDelay: '0.6s' }}></div>
            </div>
          </div>

          <div className="space-y-24 relative z-10">
            {services.map((service, index) => {
              const isExpanded = selectedService === service.id;

              return (
                <div
                  key={service.id}
                  className="reveal-on-scroll service-card"
                  style={{ transitionDelay: `${0.1 * index}s` }}
                >
                  <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500 border border-slate-100">
                    <div className={`grid md:grid-cols-2 gap-0 ${index % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
                      <div className={`relative h-96 md:h-auto service-image ${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 image-overlay bg-gradient-to-t from-black/40 to-transparent"></div>
                      </div>

                      <div className="p-8 md:p-12 flex flex-col justify-center">
                        <div className="w-16 h-16 icon-box rounded-2xl flex items-center justify-center mb-8 border border-slate-200">
                          <img 
                            src={service.icon} 
                            alt={service.title}
                            className="w-10 h-10"
                          />
                        </div>

                        <h2 className="font-cormorant text-3xl md:text-4xl font-semibold text-slate-900 mb-5 leading-tight tracking-tight">
                          {service.title}
                        </h2>

                        <p className="font-inter text-slate-600 text-lg leading-relaxed mb-8 font-light">
                          {service.description}
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                          <button
                            onClick={() => setSelectedService(isExpanded ? null : service.id)}
                            className={`button-hover magnetic-button font-inter relative px-8 py-3 rounded-full font-semibold transition-all duration-300 border border-slate-200 flex items-center gap-2 ${
                              isExpanded
                                ? 'bg-slate-100 text-slate-900 border-slate-300'
                                : 'bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                            }`}
                          >
                            {isExpanded ? 'Masquer la galerie' : 'Voir la galerie'}
                            <ChevronDown className={`chevron-rotate w-4 h-4 ${isExpanded ? 'rotated' : ''}`} />
                          </button>
                          <button
                            onClick={() => onNavigate('contact', service.id)}
                            className="button-hover magnetic-button font-inter relative px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-[#ad5945] to-[#d38074] hover:shadow-2xl hover:shadow-[#ad5945]/30 transition-all duration-300 flex items-center gap-2 group"
                          >
                            Demander un devis
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="gallery-expand p-8 bg-gradient-to-b from-slate-50 to-white border-t border-slate-200">
                        <h3 className="font-cormorant text-2xl font-semibold text-slate-900 mb-8">
                          Galerie
                        </h3>
                        <Swiper
                          modules={[Navigation, Pagination]}
                          navigation={{
                            nextEl: `.swiper-button-next-${service.id}`,
                            prevEl: `.swiper-button-prev-${service.id}`,
                          }}
                          pagination={{
                            clickable: true,
                            dynamicBullets: true,
                            el: `.swiper-pagination-${service.id}`
                          }}
                          spaceBetween={20}
                          slidesPerView={1}
                          breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 4 },
                          }}
                          className="swiper-custom"
                        >
                          {service.gallery.map((image, idx) => (
                            <SwiperSlide key={idx}>
                              <div className="gallery-image-wrapper relative aspect-square rounded-xl overflow-hidden group cursor-pointer">
                                <img
                                  src={image}
                                  alt={`${service.title} ${idx + 1}`}
                                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl transform scale-0 group-hover:scale-100 transition-transform duration-500">
                                    <Sparkles className="w-6 h-6 text-[#ad5945]" />
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>

                        <div className="flex justify-center gap-4 mt-6">
                          <button className={`swiper-button-prev-${service.id} w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-gradient-to-r hover:from-[#ad5945] hover:to-[#d38074] hover:border-0 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110`}>
                            <ArrowRight className="w-5 h-5 rotate-180" />
                          </button>
                          <div className={`swiper-pagination-${service.id} flex justify-center gap-2`}></div>
                          <button className={`swiper-button-next-${service.id} w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-gradient-to-r hover:from-[#ad5945] hover:to-[#d38074] hover:border-0 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110`}>
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}