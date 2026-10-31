import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ContactRound,
  Mail,
  Globe2,
  Facebook,
  Instagram,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { clinic } from "../data";
import type { GalleryItem } from "../data";

export function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20.6 11.7a8.6 8.6 0 0 1-12.7 7.6L3 20.7l1.4-4.8a8.6 8.6 0 1 1 16.2-4.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8 7.5c.2-.4.5-.4.8-.4h.4c.2 0 .4.1.5.5l.7 1.6c.1.3 0 .5-.2.7l-.6.7c-.1.2-.1.3 0 .5.7 1.2 1.6 2.1 2.8 2.7.3.2.5.2.7 0l.9-1.1c.2-.2.4-.2.7-.1l1.8.9c.3.2.4.3.3.6 0 .6-.3 1.4-.9 1.7-.6.4-1.2.6-2.1.3-1-.2-2.4-.7-4-2.1-1.9-1.6-3.1-3.7-3.2-4.6 0-.8.4-1.5.6-1.9Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-35px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SocialStrip({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`social-strip ${compact ? "social-strip--compact" : ""}`}>
      <div className="social-inner">
        <a
          className="strip-brand"
          href="#home"
          aria-label="Sifa-dent Dental Centre, back to top"
        >
          <img
            src="/images/logo-header.webp"
            alt="Sifa-dent Dental Centre"
            width="62"
            height="58"
          />
          <span>
            Excellence in
            <br />
            <strong>dental practice.</strong>
          </span>
        </a>
        <span className="strip-divider" />
        <div className="social-links">
          <a
            href={`tel:${clinic.phone}`}
            aria-label="Call Sifa-dent"
            title={`Call ${clinic.phoneDisplay}`}
          >
            <ContactRound />
          </a>
          <a
            href={`mailto:${clinic.email}`}
            aria-label="Email Sifa-dent"
            title="Email our team"
          >
            <Mail />
          </a>
          <a
            className="coral"
            href="#about"
            aria-label="About our clinic"
            title="About our clinic"
          >
            <Globe2 />
          </a>
          <a
            className="coral"
            href="https://www.facebook.com/sifadentdentalcentre"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Sifa-dent on Facebook"
            title="Facebook"
          >
            <Facebook />
          </a>
          <a
            className="coral"
            href="https://www.instagram.com/sifadentdental/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Sifa-dent on Instagram"
            title="Instagram"
          >
            <Instagram />
          </a>
          <a
            className="whatsapp-icon"
            href={clinic.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Sifa-dent on WhatsApp"
            title="Chat on WhatsApp"
          >
            <WhatsAppIcon size={34} />
          </a>
        </div>
        {!compact && (
          <a className="strip-phone" href={`tel:${clinic.phone}`}>
            <small>Let’s talk about your smile</small>
            <strong>{clinic.phoneDisplay}</strong>
          </a>
        )}
      </div>
    </div>
  );
}

export function Modal({
  children,
  title,
  onClose,
  className = "",
}: {
  children: ReactNode;
  title: string;
  onClose: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = oldOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`dialog ${className}`}
      aria-label={title}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog-content">
        <button
          className="icon-button dialog-close"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={22} />
        </button>
        {children}
      </div>
    </dialog>
  );
}

export function Lightbox({
  items,
  index,
  onChange,
  onClose,
}: {
  items: GalleryItem[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const item = items[index];
  const change = (direction: number) =>
    onChange((index + direction + items.length) % items.length);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const direction = event.key === "ArrowLeft" ? -1 : 1;
      onChange((index + direction + items.length) % items.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, items.length, onChange]);
  return (
    <Modal title={item.title} onClose={onClose} className="lightbox">
      <div className="lightbox-inner">
        <div className="lightbox-image">
          <img src={`/images/${item.image}.webp`} alt={item.title} />
          <button
            className="lightbox-prev icon-button"
            onClick={() => change(-1)}
            aria-label="Previous photo"
          >
            <ChevronLeft />
          </button>
          <button
            className="lightbox-next icon-button"
            onClick={() => change(1)}
            aria-label="Next photo"
          >
            <ChevronRight />
          </button>
        </div>
        <div className="lightbox-caption">
          <div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
          <span>
            {index + 1} / {items.length}
          </span>
        </div>
      </div>
    </Modal>
  );
}
