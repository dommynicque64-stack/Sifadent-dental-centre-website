import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Menu,
  X,
  MapPin,
  Phone,
  Mail,
  Check,
  ShieldCheck,
  Heart,
  UsersRound,
  ScanLine,
  Wallet,
  Star,
  Clock3,
  Plus,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";
import { clinic, services, gallery, tour, reviews } from "./data";
import type { Service, GalleryItem } from "./data";
import {
  Reveal,
  SocialStrip,
  Modal,
  Lightbox,
  WhatsAppIcon,
} from "./components/UI";

const navItems = [
  { label: "About", id: "about" },
  { label: "Services", id: "services" },
  { label: "Location", id: "location" },
  { label: "Gallery", id: "gallery" },
  { label: "Contact", id: "contact" },
];
const heroItems = [
  {
    image: "braces",
    label: "BRACES",
    service: "braces",
    position: "center 48%",
  },
  {
    image: "whitening",
    label: "Teeth Whitening",
    service: "whitening",
    position: "center 48%",
  },
  {
    image: "crowns",
    label: "Crown & Bridges",
    service: "replacement",
    position: "center 52%",
  },
  {
    image: "pain-relief",
    label: "Pain Relief",
    service: "consultation",
    position: "center 38%",
  },
];
const familyFeatures = [
  {
    icon: UsersRound,
    title: "Professional Dental Team",
    text: "Our clinicians guide every treatment with clear options and gentle care.",
  },
  {
    icon: ScanLine,
    title: "Modern Dental Technology",
    text: "Clean treatment rooms, modern tools, and precise diagnostics.",
  },
  {
    icon: Heart,
    title: "Comfortable Environment",
    text: "A calm clinic experience designed around patient reassurance.",
  },
  {
    icon: Wallet,
    title: "Affordable Treatment Options",
    text: "Transparent pricing and staged care plans for families.",
  },
];
const benefits = [
  "Same day treatment",
  "Gentle, comfortable procedures",
  "Experienced dental professionals",
  "State-of-the-art dental clinic",
  "Patient-centred care",
  "Affordable dental solutions",
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [lightbox, setLightbox] = useState<{
    items: GalleryItem[];
    index: number;
  } | null>(null);
  const [booking, setBooking] = useState({
    name: "",
    phone: "",
    service: "Dental Consultation",
    message: "",
  });
  const [bookingReview, setBookingReview] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-18% 0px -62% 0px" },
    );
    document
      .querySelectorAll("section[id]")
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const bookService = (title: string) => {
    setBooking((previous) => ({ ...previous, service: title }));
    setSelectedService(null);
    window.setTimeout(
      () =>
        document
          .getElementById("appointment")
          ?.scrollIntoView({ behavior: "smooth" }),
      30,
    );
  };

  const handleBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBookingReview(true);
  };
  const bookingMessage = `Hello Sifa-dent Dental Centre, I would like to request an appointment.\n\nName: ${booking.name.trim()}\nPhone: ${booking.phone.trim()}\nService: ${booking.service}${booking.message.trim() ? `\nMessage: ${booking.message.trim()}` : ""}\n\nPlease contact me to confirm an available appointment time. Thank you!`;

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header" id="home">
        <div className="header-inner">
          <a
            className="brand"
            href="#home"
            aria-label="Sifa-dent Dental Centre home"
          >
            <img
              src="/images/logo-header.webp"
              alt="Sifa-dent Dental Centre — Excellence in Dental Practice"
              width="92"
              height="82"
            />
            <span className="brand-wordmark">
              SIFA-DENT<small>DENTAL CENTRE</small>
            </span>
          </a>
          <nav
            className={`main-nav ${menuOpen ? "is-open" : ""}`}
            aria-label="Main navigation"
            id="main-nav"
          >
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={activeSection === item.id ? "is-active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              className="button book-button"
              href="#appointment"
              onClick={() => setMenuOpen(false)}
            >
              Book Now <ArrowUpRight size={17} />
            </a>
          </nav>
          <a
            className="mobile-book button book-button"
            href="#appointment"
            onClick={() => setMenuOpen(false)}
          >
            Book Now
          </a>
          <button
            className="menu-toggle icon-button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main id="main-content">
        <section
          className="hero"
          aria-label="Expert dental care for your smile"
        >
          <div className="hero-grid hero-grid--uploaded" aria-label="Explore our dental services">
            <img
              className="hero-uploaded-image"
              src="/images/landing-hero.jpg"
              alt="Sifa-Dent Dental Centre services: braces, crowns and bridges, teeth whitening, and pain relief"
              fetchPriority="high"
            />
            {heroItems.map((item) => (
              <button
                key={item.image}
                className={`hero-tile hero-tile--${item.image}`}
                onClick={() =>
                  setSelectedService(
                    services.find((service) => service.id === item.service) ??
                      null,
                  )
                }
                aria-label={`Explore ${item.label}`}
              >
                <span className="sr-only">{item.label}</span>
              </button>
            ))}
          </div>
          <SocialStrip />
        </section>

        <section className="about-section section" id="about">
          <div className="container">
            <div className="about-grid">
              <Reveal className="about-copy">
                <span className="location-badge">
                  <span /> Professional dental care in Mihang’o
                </span>
                <h1>
                  Sifa-dent
                  <br />
                  Dental Centre<span className="heading-dot">.</span>
                </h1>
                <p className="intro">
                  Your neighbourhood clinic.
                  <br className="desktop-break" /> Your family’s healthiest
                  smiles.
                </p>
                <p>
                  Sifa-dent Dental Centre is a registered professional dental
                  clinic located in Mihang’o, Utawala, on Kiguathi Road at SDA
                  stage. We offer full-scale dental services in a
                  state-of-the-art clinic.
                </p>
                <p>
                  We listen to the needs of our patients and offer same-day
                  solutions. We give you value for your money because we
                  understand the sensitivity of dental treatment. Visit us for
                  comprehensive care that puts you first.
                </p>
                <a className="text-link" href="#services">
                  Find the right care for you <ArrowRight size={18} />
                </a>
              </Reveal>
              <div className="purpose-cards">
                <Reveal className="purpose-card" delay={0.1}>
                  <span className="red-rule" />
                  <h2>Our Vision</h2>
                  <p>Excellence in dental practice.</p>
                  <span className="purpose-watermark" aria-hidden="true">
                    <SparkleMark />
                  </span>
                </Reveal>
                <Reveal className="purpose-card" delay={0.12}>
                  <span className="red-rule" />
                  <h2>Our Mission</h2>
                  <p>
                    To offer quality dental services that are patient friendly
                    and meet world standards.
                  </p>
                </Reveal>
                <Reveal className="purpose-card core-values-card" delay={0.15}>
                  <span className="red-rule" />
                  <h2>Our Core Values</h2>
                  <ul className="core-values-list">
                    {["Honesty", "Teamwork", "Efficiency", "Integrity", "Accountability", "Love", "Transparency"].map((value) => (
                      <li key={value}><CheckCircle2 size={17} aria-hidden="true" />{value}</li>
                    ))}
                  </ul>
                </Reveal>
                <Reveal className="values-line" delay={0.2}>
                  <Heart size={18} />
                  <p>
                    Honesty. Integrity. Care.
                    <br />
                    <strong>Our values, in every visit.</strong>
                  </p>
                </Reveal>
              </div>
            </div>

            <div className="family-section">
              <Reveal className="family-heading">
                <span className="eyebrow">CARE YOU CAN FEEL GOOD ABOUT</span>
                <h2>
                  Complete Dental
                  <br />
                  Solutions For Your
                  <br />
                  Entire Family
                </h2>
                <p>
                  From the first checkup to a whole new smile, you’re in caring
                  hands.
                </p>
                <a href="#appointment" className="button button-purple">
                  Let’s care for your smile <ArrowUpRight size={17} />
                </a>
              </Reveal>
              <div className="family-grid">
                {familyFeatures.map((feature, index) => (
                  <Reveal
                    className="feature-card"
                    key={feature.title}
                    delay={index * 0.05}
                  >
                    <feature.icon size={25} strokeWidth={1.6} />
                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="services-section section" id="services">
          <div className="container">
            <Reveal className="section-heading">
              <span className="section-kicker" />
              <h2>OUR SERVICES</h2>
              <p>Expert care for every stage of your smile.</p>
            </Reveal>
            <div className="services-grid">
              {services.map((service, index) => (
                <Reveal
                  key={service.id}
                  className="service-reveal"
                  delay={(index % 3) * 0.04}
                >
                  <button
                    className="service-card"
                    onClick={() => setSelectedService(service)}
                    aria-label={`Learn more about ${service.title}`}
                  >
                    <span className="service-top">
                      <service.icon size={26} strokeWidth={1.7} />
                      <ArrowUpRight className="service-arrow" size={20} />
                    </span>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    {service.price && (
                      <span className="service-price">{service.price}</span>
                    )}
                  </button>
                </Reveal>
              ))}
            </div>
            <p className="pricing-note">
              Your care is personal. Final treatment options and costs are
              confirmed at your consultation.
            </p>
          </div>
        </section>

        <section className="gallery-section section" id="gallery">
          <div className="container">
            <Reveal className="section-heading">
              <span className="section-kicker" />
              <h2>OUR GALLERY</h2>
              <p>A closer look at the care behind confident smiles.</p>
            </Reveal>
            <div className="gallery-grid">
              {gallery.map((item, index) => (
                <Reveal key={item.image} delay={(index % 3) * 0.05}>
                  <button
                    className="gallery-item"
                    onClick={() => setLightbox({ items: gallery, index })}
                    aria-label={`View ${item.title}`}
                  >
                    <img
                      src={`/images/${item.image}.webp`}
                      alt={item.title}
                      loading="lazy"
                      width="600"
                      height="500"
                    />
                    <span className="gallery-overlay">
                      <span>{item.title}</span>
                      <Plus size={23} />
                    </span>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="why-section section">
          <div className="container why-grid">
            <Reveal>
              <span className="eyebrow">THE SIFA-DENT DIFFERENCE</span>
              <h2 className="section-title">WHY CHOOSE US</h2>
              <ul className="benefits-list">
                {benefits.map((benefit) => (
                  <li key={benefit}>
                    <span>
                      <Check size={18} strokeWidth={2.5} />
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="comfort-card" delay={0.12}>
              <div className="comfort-icon">
                <ShieldCheck size={37} strokeWidth={1.5} />
              </div>
              <h3>
                Your Safety & Comfort
                <br />
                Come First
              </h3>
              <p>
                We combine clinical hygiene, gentle communication, and
                transparent treatment planning to make every visit easier.
              </p>
              <div className="comfort-points">
                <span>
                  <Check size={15} /> Sterile instruments
                </span>
                <span>
                  <Check size={15} /> Private treatment rooms
                </span>
                <span>
                  <Check size={15} /> Friendly patient support
                </span>
              </div>
              <a className="text-link" href="#appointment">
                Experience a different kind of dental care{" "}
                <ArrowRight size={18} />
              </a>
            </Reveal>
          </div>
        </section>
        <SocialStrip compact />

        <section className="tour-section section" id="tour">
          <div className="container wide-container">
            <Reveal className="section-heading">
              <span className="section-kicker" />
              <h2>VIRTUAL TOUR</h2>
              <p className="section-subtitle">
                Take a Virtual Tour of
                <br />
                SIFA-DENT Dental Centre
              </p>
            </Reveal>
            <div className="tour-grid">
              {tour.map((item, index) => (
                <Reveal
                  className="tour-card"
                  key={item.image}
                  delay={index * 0.06}
                >
                  <button
                    className="tour-photo"
                    onClick={() => setLightbox({ items: tour, index })}
                    aria-label={`Take a closer look at ${item.title}`}
                  >
                    <img
                      src={`/images/${item.image}.webp`}
                      alt={item.title}
                      loading="lazy"
                      width="500"
                      height="540"
                    />
                    <span className="tour-expand">
                      <ArrowUpRight size={18} />
                    </span>
                  </button>
                  <div className="tour-card-copy">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="reviews-section section" id="reviews">
          <div className="container">
            <Reveal className="section-heading">
              <span className="section-kicker" />
              <h2>REVIEWS</h2>
              <div className="rating-line">
                <strong>5.0</strong>
                <Stars />
              </div>
              <p>Based on real patient experiences and family referrals.</p>
              <a
                className="button button-purple review-button"
                href={clinic.reviews}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Reviews <ArrowUpRight size={16} />
              </a>
            </Reveal>
            <div className="reviews-grid">
              {reviews.map((review, index) => (
                <Reveal
                  className="review-card"
                  key={review.name}
                  delay={index * 0.06}
                >
                  <Stars />
                  <blockquote>“{review.text}”</blockquote>
                  <div className="review-author">
                    <span>{review.initials}</span>
                    <div>
                      <strong>{review.name}</strong>
                      <small>Sifa-dent patient</small>
                    </div>
                    <span className="review-quote" aria-hidden="true">
                      ”
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <SocialStrip compact />

        <section className="location-section section" id="location">
          <div className="container">
            <Reveal className="section-heading">
              <span className="section-kicker" />
              <h2>VISIT OUR CLINIC</h2>
              <p className="section-subtitle">
                Visit Our Premium Clinic in
                <br />
                Mihang’o Utawala, Nairobi
              </p>
            </Reveal>
            <div className="location-grid">
              <Reveal className="location-card">
                <span className="location-icon">
                  <MapPin size={27} strokeWidth={1.6} />
                </span>
                <h3>SIFA-DENT Dental Centre</h3>
                <p>
                  Mihang’o / Utawala, Nairobi, Kenya.
                  <br />
                  Serving families across Nairobi East.
                </p>
                <p className="address-detail">Kiguathi Road, at SDA stage</p>
                <div className="location-actions">
                  <a
                    className="button button-purple"
                    href={`tel:${clinic.phone}`}
                  >
                    <Phone size={16} /> Call Now
                  </a>
                  <a
                    className="button button-pink"
                    href={clinic.directions}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Directions <ArrowUpRight size={17} />
                  </a>
                </div>
                <div className="opening-hours">
                  <h4>
                    <Clock3 size={18} /> Opening Hours
                  </h4>
                  <dl>
                    <div>
                      <dt>Monday – Friday</dt>
                      <dd>8:00 AM – 6:00 PM</dd>
                    </div>
                    <div>
                      <dt>Saturday</dt>
                      <dd>8:00 AM – 4:00 PM</dd>
                    </div>
                    <div>
                      <dt>Sunday</dt>
                      <dd>From 2:00 PM</dd>
                    </div>
                  </dl>
                  <p>Emergency visits by appointment</p>
                </div>
              </Reveal>
              <Reveal className="map-card" delay={0.1}>
                <a
                  href={clinic.directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open Sifa-dent Dental Centre in Google Maps"
                >
                  <img
                    src="/images/clinic-map.webp"
                    alt="Map showing Sifa-dent Dental Centre near Mihang’o and Utawala, Nairobi"
                    loading="lazy"
                    width="517"
                    height="344"
                  />
                  <span className="map-link">
                    <MapPin size={17} /> Find us on Google Maps{" "}
                    <ArrowUpRight size={17} />
                  </span>
                </a>
                <div className="map-caption">
                  <span>
                    <MapPin size={18} /> Along Mihang’o / Utawala access routes
                  </span>
                  <span className="location-tag">Easy to find</span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="appointment-section section" id="appointment">
          <div className="container appointment-grid">
            <Reveal className="appointment-copy">
              <span className="eyebrow">APPOINTMENT</span>
              <h2>
                Ready to Book Your
                <br />
                Dental Appointment?
              </h2>
              <p>
                A healthier, happier smile starts here. Fill out your details
                and send your request to our team. We’ll help confirm your
                appointment time.
              </p>
              <p>For urgent dental care, please call us directly.</p>
              <a className="appointment-phone" href={`tel:${clinic.phone}`}>
                <span>
                  <Phone size={23} />
                </span>
                <div>
                  <small>A friendly team is just a call away</small>
                  <strong>{clinic.phoneDisplay}</strong>
                </div>
                <ArrowUpRight size={22} />
              </a>
              <div className="appointment-promise">
                <ShieldCheck size={19} />
                <span>Gentle care. Clear advice. A reason to smile.</span>
              </div>
            </Reveal>
            <Reveal className="appointment-form-wrap" delay={0.1}>
              <form className="appointment-form" onSubmit={handleBooking}>
                <div className="form-title">
                  <h3>Schedule Appointment Today</h3>
                  <CalendarDays size={25} />
                </div>
                <label htmlFor="full-name">
                  Full name <span>*</span>
                </label>
                <input
                  id="full-name"
                  name="name"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={100}
                  placeholder="Your full name"
                  value={booking.name}
                  onChange={(event) =>
                    setBooking({ ...booking, name: event.target.value })
                  }
                />
                <div className="form-row">
                  <div>
                    <label htmlFor="phone">
                      Phone <span>*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      pattern="\+?[0-9](?:[\s\-]?[0-9]){6,14}"
                      title="Enter a valid phone number, for example 0793 644 620"
                      placeholder="07XX XXX XXX"
                      value={booking.phone}
                      onChange={(event) =>
                        setBooking({ ...booking, phone: event.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="service">
                      Service <span>*</span>
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={booking.service}
                      onChange={(event) =>
                        setBooking({ ...booking, service: event.target.value })
                      }
                    >
                      {services.map((service) => (
                        <option key={service.id}>{service.title}</option>
                      ))}
                      <option>Custom Sports Mouth Guard</option>
                    </select>
                  </div>
                </div>
                <label htmlFor="message">
                  Message <span className="optional">(optional)</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  maxLength={2000}
                  placeholder="How can we help you? You can also share a preferred day or time."
                  value={booking.message}
                  onChange={(event) =>
                    setBooking({ ...booking, message: event.target.value })
                  }
                />
                <p className="form-note">
                  <ShieldCheck size={15} /> Review your request before sending
                  it via WhatsApp.
                </p>
                <button className="button submit-button" type="submit">
                  Book Appointment Now <ArrowRight size={18} />
                </button>
              </form>
            </Reveal>
          </div>
        </section>
      </main>

      <footer id="contact" className="site-footer">
        <SocialStrip />
        <div className="container footer-content">
          <div className="footer-intro">
            <h2>
              SIFA-DENT <span>DENTAL CENTRE</span>
            </h2>
            <p>
              Excellence in dental practice.
              <br />
              Built for confident smiles.
            </p>
          </div>
          <div>
            <h3>Find us</h3>
            <a
              href={clinic.directions}
              target="_blank"
              rel="noopener noreferrer"
            >
              Mihang’o Utawala, Kiguathi Road
              <br />
              at SDA stage, Nairobi, Kenya <ArrowUpRight size={14} />
            </a>
          </div>
          <div>
            <h3>Let’s connect</h3>
            <a href={`tel:${clinic.phone}`}>{clinic.phoneDisplay}</a>
            <a href={`mailto:${clinic.email}`} className="footer-email">
              {clinic.email}
            </a>
          </div>
          <a className="button footer-book" href="#appointment">
            Book your visit <ArrowUpRight size={17} />
          </a>
        </div>
        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} SIFA-DENT Dental Centre. All rights
            reserved.
          </span>
          <a href="#home">Back to top ↑</a>
        </div>
      </footer>

      {selectedService && (
        <Modal
          title={selectedService.title}
          onClose={() => setSelectedService(null)}
          className="service-modal"
        >
          <span className="modal-service-icon">
            <selectedService.icon size={32} strokeWidth={1.6} />
          </span>
          <span className="eyebrow">PERSONALISED DENTAL CARE</span>
          <h2>{selectedService.title}</h2>
          <p>{selectedService.details}</p>
          {selectedService.price && (
            <div className="modal-price">
              <span>Clinic pricing</span>
              <strong>{selectedService.price}</strong>
            </div>
          )}
          <p className="modal-note">
            Your dentist will confirm treatment suitability and final costs
            during your consultation.
          </p>
          <button
            className="button button-purple full-width"
            onClick={() => bookService(selectedService.title)}
          >
            Book this service <ArrowRight size={18} />
          </button>
          <a className="modal-phone" href={`tel:${clinic.phone}`}>
            <Phone size={15} /> Have a question? Call {clinic.phoneDisplay}
          </a>
        </Modal>
      )}
      {lightbox && (
        <Lightbox
          items={lightbox.items}
          index={lightbox.index}
          onChange={(index) => setLightbox({ ...lightbox, index })}
          onClose={() => setLightbox(null)}
        />
      )}
      {bookingReview && (
        <Modal
          title="Review your appointment request"
          onClose={() => setBookingReview(false)}
          className="booking-modal"
        >
          <span className="booking-check">
            <CheckCircle2 size={35} />
          </span>
          <span className="eyebrow">ONE MORE STEP TO YOUR NEXT SMILE</span>
          <h2>Your request is ready.</h2>
          <p>
            Hi {booking.name.trim().split(" ")[0]}, review your details below,
            then send your request to our clinic on WhatsApp.
          </p>
          <dl className="booking-summary">
            <div>
              <dt>Name</dt>
              <dd>{booking.name}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{booking.phone}</dd>
            </div>
            <div>
              <dt>Service</dt>
              <dd>{booking.service}</dd>
            </div>
            {booking.message && (
              <div>
                <dt>Message</dt>
                <dd>{booking.message}</dd>
              </div>
            )}
          </dl>
          <a
            className="button whatsapp-button full-width"
            href={`${clinic.whatsapp}?text=${encodeURIComponent(bookingMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon size={22} /> Send via WhatsApp{" "}
            <ArrowUpRight size={18} />
          </a>
          <a
            className="modal-phone"
            href={`mailto:${clinic.email}?subject=${encodeURIComponent("Dental appointment request — " + booking.name)}&body=${encodeURIComponent(bookingMessage)}`}
          >
            <Mail size={16} /> Prefer email? Send your request by email
          </a>
          <p className="modal-note">
            Your appointment is not confirmed until our team responds. Your
            details are only shared when you choose to send.
          </p>
          <button
            className="edit-request"
            onClick={() => setBookingReview(false)}
          >
            Edit my details
          </button>
        </Modal>
      )}
    </>
  );
}

function Stars() {
  return (
    <span className="stars" role="img" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={17} fill="currentColor" strokeWidth={0} />
      ))}
    </span>
  );
}

function SparkleMark() {
  return (
    <svg width="76" height="76" viewBox="0 0 80 80" fill="none">
      <path
        d="M40 6c2 24 10 32 34 34-24 2-32 10-34 34C38 50 30 42 6 40 30 38 38 30 40 6Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default App;
