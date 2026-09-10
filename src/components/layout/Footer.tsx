import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

const Footer: React.FC = () => {
  return (
    
// {/*    // <footer className="relative z-[100] overflow-hidden bg-gradient-to-br from-[#3D1F0A] to-[#7A6352] pt-[10px] pb-[5px] text-white">
//       {/* Animated top bar (was .footer::before) */} */}
    <footer className="w-full bg-gradient-to-br from-[#3D1F0A] to-[#7A6352] pt-[10px] pb-[5px] text-white">
     <div className="absolute inset-x-0 top-0 h-1 animate-gradient-shift bg-gradient-to-r from-[#1E0F05] via-[#3D1F0A] via-[#7B4F2E] to-[#C8A882]" />
      <div className="mx-auto max-w-[1200px] px-5">
        {/* Main Footer Content */}
        <div className="mb-[10px] grid grid-cols-1 gap-5 text-center md:grid-cols-2 md:gap-[30px] md:text-left lg:grid-cols-[2fr_1fr]">
          {/* Brand Section */}
          <div className="pr-0 lg:pr-5">
            <h3 className="mb-[5px] bg-gradient-to-r from-white to-[#f0f8ff] bg-clip-text text-lg font-bold text-transparent md:mb-[15px] md:text-4xl">
              JMS Commerce
            </h3>
            <p className="mb-[5px] text-[0.6rem] leading-none opacity-90 md:mb-[25px] md:text-base md:leading-[1.6]">
              Your trusted partner for quality products and exceptional
              service.
            </p>
            <div className="flex justify-center gap-[15px] lg:justify-start">
              <a
                href="https://www.facebook.com/saumya.keservani.7"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-[#3b5998]/20 text-[0.85rem] text-white backdrop-blur-[10px] transition-all duration-300 hover:-translate-y-[5px] hover:scale-105 hover:shadow-[0_15px_35px_rgba(0,0,0,0.3)] md:h-[50px] md:w-[50px] md:rounded-xl md:border-2 md:border-white/10 md:text-xl"
              >
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a
                href="https://www.instagram.com/saumyakeservani/"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-[#e1306c]/20 text-[0.85rem] text-white backdrop-blur-[10px] transition-all duration-300 hover:-translate-y-[5px] hover:scale-105 hover:shadow-[0_15px_35px_rgba(0,0,0,0.3)] md:h-[50px] md:w-[50px] md:rounded-xl md:border-2 md:border-white/10 md:text-xl"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href="https://twitter.com/KeservaniS16527"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-[#1da1f2]/20 text-[0.85rem] text-white backdrop-blur-[10px] transition-all duration-300 hover:-translate-y-[5px] hover:scale-105 hover:shadow-[0_15px_35px_rgba(0,0,0,0.3)] md:h-[50px] md:w-[50px] md:rounded-xl md:border-2 md:border-white/10 md:text-xl"
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a
                href="https://www.youtube.com/channel/UCHWbzfO5hbwKs1KttjYmtTA"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-[#ff0000]/20 text-[0.85rem] text-white backdrop-blur-[10px] transition-all duration-300 hover:-translate-y-[5px] hover:scale-105 hover:shadow-[0_15px_35px_rgba(0,0,0,0.3)] md:h-[50px] md:w-[50px] md:rounded-xl md:border-2 md:border-white/10 md:text-xl"
              >
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <div className="flex flex-col gap-[15px] md:flex-row lg:flex-col">
              <div className="flex items-start justify-center gap-3 opacity-90 transition-opacity duration-300 hover:opacity-100 md:justify-start">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="mt-0.5 h-3.5 w-3.5 text-[#4ecdc4] md:h-[22px] md:w-[22px]"
                />
                <span className="text-[0.8rem] leading-[1.3] opacity-90 md:text-base">
                  hello@jmscommerce.com
                </span>
              </div>
              <div className="flex items-start justify-center gap-3 opacity-90 transition-opacity duration-300 hover:opacity-100 md:justify-start">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="mt-0.5 h-3.5 w-3.5 text-[#4ecdc4] md:h-[22px] md:w-[22px]"
                />
                <span className="text-[0.8rem] leading-[1.3] opacity-90 md:text-base">
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-start justify-center gap-3 opacity-90 transition-opacity duration-300 hover:opacity-100 md:justify-start">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="mt-0.5 h-3.5 w-3.5 text-[#4ecdc4] md:h-[22px] md:w-[22px]"
                />
                <span className="text-[0.8rem] leading-[1.3] opacity-90 md:text-base">
                  123 Commerce St, Business City
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Bottom Links */}
        <div className="flex flex-col flex-wrap items-center justify-between gap-5 border-t border-white/10 pt-[5px] text-center md:flex-row md:pt-[25px] md:text-left">
          <div className="flex flex-wrap gap-[10px] md:gap-5">
            <Link
              to="/about"
              className="text-[0.6rem] text-white/70 transition-all duration-300 hover:text-white hover:underline md:text-base"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-[0.6rem] text-white/70 transition-all duration-300 hover:text-white hover:underline md:text-base"
            >
              Contact
            </Link>
            <Link
              to="/policy"
              className="text-[0.6rem] text-white/70 transition-all duration-300 hover:text-white hover:underline md:text-base"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-[0.6rem] text-white/70 transition-all duration-300 hover:text-white hover:underline md:text-base"
            >
              Terms of Service
            </Link>
            <Link
              to="/shipping"
              className="text-[0.6rem] text-white/70 transition-all duration-300 hover:text-white hover:underline md:text-base"
            >
              Shipping Info
            </Link>
          </div>
          <div className="text-[0.7rem] opacity-80 md:text-[0.9rem]">
            <p>&copy; 2024 JMS Commerce. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;