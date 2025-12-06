import { useState, useEffect } from 'react'
import './App.css'
import logo from './assets/logo.jpeg'
import instructorBg from './assets/instructor.jpg'
import success01 from './assets/success-01.jpeg'
import success02 from './assets/success-02.jpeg'
import success03 from './assets/success-03.jpeg'
import success04 from './assets/success-04.jpeg'
import success05 from './assets/success-05.jpeg'
import success06 from './assets/success-06.jpeg'
import success07 from './assets/success-07.jpeg'
import success08 from './assets/success-08.jpeg'
import success09 from './assets/success-09.jpeg'

const API_BASE_URL =
  import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? '' : 'http://localhost:4000')

function App() {
  const [formStep, setFormStep] = useState(1)
  const [formStatus, setFormStatus] = useState({ type: 'idle', message: '' })
  const [navOpen, setNavOpen] = useState(false)
  const [mapOverlay, setMapOverlay] = useState({ open: false, city: '', query: '' })
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const testimonials = [
    { name: 'Yachya Grittner', text: "I couldn't be more happier with my driving instructor, Waqas. I passed on my first attempt.", stars: 5 },
    { name: 'Muhammad Yaaseen', text: "Waqas challenges you to the best you can be. Highly recommended. Pass my test first time with him. If your looking for a driving instructor this is the big name in the game.", stars: 5 },
    { name: 'Xiaofeng Yang', text: 'Waqas is a brilliant driving insturtor. I passed with only 4 minors. He explain everything easily and patiently and make driving much more easier and fun. Would definitely recommend!', stars: 5 },
    { name: 'Maheen Syeda', text: "Thank you to Waqas for helping me pass my driving test in first attempt. it wasn\'t possible without your teaching and supervision. your help has been much appreciated!!", stars: 5 },
    { name: 'Osman Ahmed', text: 'Many thanks to Waqas Bashir, what he have done to me is really amazing, I managed to pass my driving test from the 1st attempt, very good instructor, Many thanks', stars: 5 },
    { name: 'Rashid Amin', text: 'Passed first time with 3 minors with the help of my instructor Waqas. Was a very good instructor and helped me get prepared for the test. Highly recommended', stars: 5 },
    { name: 'Tyler Berry', text: 'Waqas bashir was an amazing teacher taught me really well helping me to pass first time with only 1 minor, amazing and positive thank you', stars: 5 },
    { name: 'Adil Aziz', text: 'Waqas was an amazing instructor and helped me pass my driving test on the first try. When I started I was struggling a lot and he helped me really fast and made me more confident.', stars: 5 },
    { name: 'zishan zafar', text: 'I passed first time! With my instructor Waqas. He was amazing! Calm in soo many situations where I know I others would pull their hair out. Taught me everything I needed to know and got me over my nerves and lack of confidence. Amazing instructor. Highly recommend', stars: 5 },
    { name: 'Ronnie Smith', text: "Couldn\'t fault my driving instructor waqas at all made me feel comfortable and confident covered all the basics and every manoeuvre through out my lessons and passed 1st time can\'t thank him enough", stars: 5 },
    { name: 'hasan tamasar', text: "Best driving instructor Waqas helped me a lot from starting till finishing. Highly recommend. Passed my driving test with 2 driving fault\'s. Love bro", stars: 5 },
  ];
  const duplicatedTestimonials = testimonials.concat(testimonials);  const [theme, setTheme] = useState(() => {
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) return savedTheme
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    lessonType: '',
    address: '',
    availability: '',
    message: ''
  })

  // Apply theme on mount and when it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // Auto-advance testimonials every 5s
  useEffect(() => {
    if (!testimonials?.length) return
    const id = setInterval(() => {
      setCurrentTestimonial((i) => (i + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(id)
  }, [testimonials?.length])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setNavOpen(false)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone) {
        setFormStatus({ type: 'error', message: 'Please fill in all required fields.' })
        return false
      }
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setFormStatus({ type: 'error', message: 'Please enter a valid email address.' })
        return false
      }
      // Phone validation (UK + Pakistan format)
      const phoneRegex = /^(\+44\d{10}|07\d{9}|\+92\d{10}|03\d{9}|0\d{10})$/
      const cleanedPhone = formData.phone.replace(/\s/g, '')
      
      if (!phoneRegex.test(cleanedPhone)) {
        setFormStatus({ 
          type: 'error', 
          message: 'Please enter a valid phone number (UK: 07xxx or +44xxx, Pakistan: 03xxx or +92xxx)' 
        })
        return false
      }
    }
    if (step === 2) {
      if (!formData.lessonType || !formData.address) {
        setFormStatus({ type: 'error', message: 'Please fill in all required fields.' })
        return false
      }
    }
    setFormStatus({ type: 'idle', message: '' })
    return true
  }

  const nextStep = () => {
    if (validateStep(formStep)) {
      setFormStep(prev => Math.min(prev + 1, 3))
    }
  }

  const prevStep = () => {
    setFormStatus({ type: 'idle', message: '' })
    setFormStep(prev => Math.max(prev - 1, 1))
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    setFormStatus({ type: 'loading', message: 'Sending your request...' })

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed request')
      }

      setFormStatus({ type: 'success', message: '✓ Booking request sent successfully! We\'ll contact you within 24 hours.' })
      setFormData({
        name: '',
        email: '',
        phone: '',
        lessonType: '',
        address: '',
        availability: '',
        message: ''
      })
      setFormStep(1)
    } catch (error) {
      console.error(error)
      setFormStatus({
        type: 'error',
        message: 'Unable to send request. Please call us directly at 07855 595 078.',
      })
    }
  }

  return (
    <div className="site">
      {/* Navigation */}
      <nav className="nav-shell">
        <div className="nav-wrapper">
          <div className="brand-pill" onClick={() => scrollToSection('home')}>
            <img src={logo} alt="Bash Driving School" />
            <div>
              <span>EST. 2012 • DVSA APPROVED</span>
              <h1>Bash Driving School</h1>
            </div>
          </div>
          <div className={`nav-links ${navOpen ? 'open' : ''}`}>
            <button onClick={() => scrollToSection('home')}>Home</button>
            <button onClick={() => scrollToSection('about')}>About</button>
            <button onClick={() => scrollToSection('services')}>Services</button>
            <button onClick={() => scrollToSection('courses')}>Courses</button>
            <button onClick={() => scrollToSection('pricing')}>Pricing</button>
            <button onClick={() => scrollToSection('areas')}>Areas</button>
            <button onClick={() => scrollToSection('testimonials')}>Reviews</button>
            <button onClick={() => scrollToSection('success')}>Success Stories</button>
          </div>
        </div>
        <div className="nav-actions">
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className="btn btn-primary" onClick={() => scrollToSection('booking')}>
            Book Your Lesson
          </button>
          <button 
            className={`menu-toggle ${navOpen ? 'active' : ''}`}
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-container">
          <div className="hero-content fade-in">
            <h1>Pass Your Driving Test with Confidence & Expert Skill</h1>
            <p className="hero-subtitle">
              Professional DVSA-approved instruction across Greater Manchester. 
              Learn with patient, experienced instructors in modern dual-control vehicles. 
              Manual & Automatic lessons available 7 days a week.
            </p>
            <div className="hero-cta">
              <button className="btn btn-glass" onClick={() => scrollToSection('booking')}>
                <svg className="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 16v-5a5 5 0 0110 0v5h2v3H5v-3h2z"/></svg>
                Book First Lesson
              </button>
              <button className="btn btn-glass" onClick={() => scrollToSection('pricing')}>
                <svg className="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 11h14l-1 9H6zM7 6h10l1 5H6z"/></svg>
                View Packages
              </button>
            </div>
            
          </div>
          <div className="hero-image fade-in">
            <img src={instructorBg} alt="Professional driving instruction" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05C16.69 13.84 18 14.88 18 16.5V19h6v-2.5c0-2.33-4.67-3.5-8-3.5z"/></svg>
            </div>
            <div className="stat-value">2,500+</div>
            <div className="stat-label">Students Trained</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm1 14h-2v-4H7v-2h6z"/></svg>
            </div>
            <div className="stat-value">87%</div>
            <div className="stat-label">First-Time Pass Rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14zm0-12H5V6h14z"/></svg>
            </div>
            <div className="stat-value">12+</div>
            <div className="stat-label">Years of Excellence</div>
          </div>
        </div>
      </section>

      <main>
        {/* About Section */}
        <section id="about" className="section">
          <div className="section-header">
            <span className="section-tag">About Us</span>
            <h2 className="section-title">Professional Driving Instruction You Can Trust</h2>
            <p className="section-subtitle">
              Since 2012, Bash Driving School has been the premier choice for learner drivers across Greater Manchester. 
              Our DVSA-approved instructors provide patient, professional instruction in modern, well-maintained vehicles. 
              Every student receives personalized lesson plans, detailed progress tracking, and continuous support throughout their learning journey.
            </p>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="section">
          <div className="section-header">
            <span className="section-tag">Our Services</span>
            <h2 className="section-title">Comprehensive Driving Instruction</h2>
            <p className="section-subtitle">Professional lessons tailored to your learning style and pace</p>
          </div>
          <div className="card-grid">
            <div className="premium-card">
              <div className="card-icon">🚗</div>
              <h4 className="card-title">Manual & Automatic Lessons</h4>
              <p className="card-description">
                Learn in modern dual-control vehicles with experienced DVSA-approved instructors. 
                Choose between manual or automatic transmission based on your preference.
              </p>
            </div>
            <div className="premium-card">
              <div className="card-icon">⚡</div>
              <h4 className="card-title">Intensive Fast-Track Courses</h4>
              <p className="card-description">
                Need to pass quickly? Our intensive courses offer condensed, focused instruction 
                designed to get you test-ready in the shortest time possible.
              </p>
            </div>
            <div className="premium-card">
              <div className="card-icon">✅</div>
              <h4 className="card-title">Mock Tests & Route Practice</h4>
              <p className="card-description">
                Experience real test conditions with detailed feedback. Practice on actual test 
                routes to build confidence and familiarity before your big day.
              </p>
            </div>
            <div className="premium-card">
              <div className="card-icon">📦</div>
              <h4 className="card-title">Block Booking Packages</h4>
              <p className="card-description">
                Save money with our 10-hour block bookings. Perfect for committed learners who 
                want consistency and the best value for their investment.
              </p>
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section id="courses" className="section">
          <div className="section-header">
            <span className="section-tag">Courses</span>
            <h2 className="section-title">Choose Your Learning Package</h2>
            <p className="section-subtitle">Click any package to start your booking</p>
          </div>
          <div className="card-grid">
            <div className="premium-card" onClick={() => scrollToSection('booking')}>
              <div className="card-icon">🌱</div>
              <h4 className="card-title">Beginner Package</h4>
              <div className="card-price">£32<span className="pricing-period"> per hour – pricing starts from £32</span></div>
              <p className="card-description">
                Perfect for new learners. Master the fundamentals with patient, expert instruction.
              </p>
              <ul className="card-features">
                <li>Flexible scheduling</li>
                <li>Door-to-door pick-up</li>
                <li>Progress tracking</li>
                <li>Patient instruction</li>
              </ul>
              <a href="#booking" className="card-cta">Book Now →</a>
            </div>
            <div className="premium-card" onClick={() => scrollToSection('booking')}>
              <div className="card-icon">🎯</div>
              <h4 className="card-title">Test Ready Package</h4>
              <div className="card-price">£399</div>
              <p className="card-description">
                10 comprehensive lessons + full mock test with detailed feedback.
              </p>
              <ul className="card-features">
                <li>10 structured lessons</li>
                <li>Full mock test included</li>
                <li>Detailed progress reports</li>
                <li>Test route practice</li>
              </ul>
              <a href="#booking" className="card-cta">Book Now →</a>
            </div>
            <div className="premium-card" onClick={() => scrollToSection('booking')}>
              <div className="card-icon">🏆</div>
              <h4 className="card-title">Pass Plus Advanced</h4>
              <div className="card-price">£40<span className="pricing-period">/hour</span></div>
              <p className="card-description">
                Post-test confidence building. Master motorway and challenging conditions.
              </p>
              <ul className="card-features">
                <li>Motorway driving</li>
                <li>Night driving skills</li>
                <li>All-weather training</li>
                <li>Advanced techniques</li>
              </ul>
              <a href="#booking" className="card-cta">Book Now →</a>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="section">
          <div className="section-header">
            <span className="section-tag">Pricing</span>
            <h2 className="section-title">Transparent, Competitive Rates</h2>
            <p className="section-subtitle">Choose the package that suits your needs and budget</p>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card" onClick={() => scrollToSection('booking')}>
              <h4 className="pricing-title">Hourly Lessons</h4>
              <div className="pricing-price">£32<span className="pricing-period"> per hour – pricing starts from £32</span></div>
              <ul className="card-features">
                <li>Pay as you go flexibility</li>
                <li>Manual or automatic</li>
                <li>Available 7 days a week</li>
                <li>Door-to-door service</li>
                <li>Progress tracking included</li>
              </ul>
              <button className="btn btn-primary" style={{width: '100%', border: '1px solid white'}}>Select Package</button>
            </div>
            <div className="pricing-card featured" onClick={() => scrollToSection('booking')}>
              <span className="pricing-badge">Most Popular</span>
              <h4 className="pricing-title">10-Hour Block</h4>
              <div className="pricing-price">£330</div>
              <ul className="card-features">
                <li>Save £20 off regular price</li>
                <li>10 consecutive lessons</li>
                <li>Structured learning plan</li>
                <li>Priority booking</li>
                <li>Mock test option</li>
              </ul>
              <button className="btn btn-primary" style={{width: '100%'}}>Select Package</button>
            </div>
            <div className="pricing-card" onClick={() => scrollToSection('booking')}>
              <h4 className="pricing-title">Refresher Course</h4>
              <div className="pricing-price">£120</div>
              <ul className="card-features">
                <li>3-lesson package</li>
                <li>Rebuild confidence</li>
                <li>Refresh your skills</li>
                <li>Ideal for returning drivers</li>
                <li>Personalized focus areas</li>
              </ul>
              <button className="btn btn-primary" style={{width: '100%'}}>Select Package</button>
            </div>
          </div>
          <div style={{textAlign: 'center', marginTop: 'var(--spacing-xl)', color: 'var(--text-secondary)'}}>
            <p>💡 <strong>Note:</strong> Click any pricing option to continue with your booking</p>
          </div>
        </section>

        {/* Areas Covered */}
        <section id="areas" className="section">
          <div className="section-header">
            <span className="section-tag">Service Areas</span>
            <h2 className="section-title">Serving Greater Manchester & Surrounding Areas</h2>
            <p className="section-subtitle">Professional instruction available across the region</p>
          </div>
          <div className="card-grid">
            {[
              { name: 'Rochdale'  , map: 'Rochdale,+UK' },
              { name: 'Manchester', map: 'Manchester,+UK' },
              { name: 'Bury', map: 'Bury,+Greater+Manchester,+UK' },
              { name: 'Oldham', map: 'Oldham,+UK' },
              { name: 'Middleton', map: 'Middleton,+Greater+Manchester,+UK' },
              { name: 'Bacup', map: 'Bacup,+UK' }
            ].map((area) => (
              <button 
                key={area.name}
                className="premium-card area-card"
                onClick={() => setMapOverlay({ open: true, city: area.name, query: area.map })}
                title={`View ${area.name} map`}
              >
                <div className="card-icon" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#EA4335" d="M12 2c3.87 0 7 3.13 7 7 0 5.25-7 13-7 13S5 14.25 5 9c0-3.87 3.13-7 7-7z"/>
                    <path fill="#4285F4" d="M12 2.6v3.2A3.2 3.2 0 0 1 15.2 9H18.4A6.4 6.4 0 0 0 12 2.6z"/>
                    <path fill="#34A853" d="M12 2.6V5.8A3.2 3.2 0 0 0 8.8 9H5.6A6.4 6.4 0 0 1 12 2.6z"/>
                    <path fill="#FBBC05" d="M12 15.4V12.2A3.2 3.2 0 0 1 8.8 9H5.6A6.4 6.4 0 0 0 12 15.4z"/>
                    <circle cx="12" cy="9" r="3.2" fill="#FFFFFF"/>
                  </svg>
                </div>
                <h4 className="card-title">{area.name}</h4>
                <p className="card-description">{area.detail}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="section">
          <div className="section-header">
            <span className="section-tag">Reviews</span>
            <h2 className="section-title">What Our Students Say</h2>
            <p className="section-subtitle">Real feedback from our learners</p>
          </div>

          <div className="testimonial-carousel">
            <button
              className="tc-nav prev"
              aria-label="Previous review"
              onClick={() => setCurrentTestimonial((i) => (i - 1 + testimonials.length) % testimonials.length)}
            >
              ‹
            </button>

            <div className="tc-track">
              {testimonials.map((t, idx) => (
                <div key={t.name} className={`tc-slide ${idx === currentTestimonial ? 'active' : ''}`} aria-hidden={idx !== currentTestimonial}>
                  <div className="testimonial-card">
                    <div className="testimonial-header">
                      <div className="avatar-fallback" aria-hidden="true">{t.name.substring(0,1)}</div>
                      <div className="testimonial-info">
                        <h5>{t.name}</h5>
                        <div className="testimonial-stars">{'★'.repeat(t.stars)}{'☆'.repeat(5 - t.stars)}</div>
                      </div>
                    </div>
                    <p className="testimonial-text">“{t.text}”</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="tc-nav next"
              aria-label="Next review"
              onClick={() => setCurrentTestimonial((i) => (i + 1) % testimonials.length)}
            >
              ›
            </button>

            <div className="tc-dots" role="tablist" aria-label="Testimonials">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === currentTestimonial}
                  className={`tc-dot ${i === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(i)}
                  aria-label={`Show review ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section id="success" className="section">
          <div className="section-header">
            <span className="section-tag">Success Stories</span>
            <h2 className="section-title">Celebrating Our Newly Qualified Drivers</h2>
            <p className="section-subtitle">Join hundreds of successful students who've passed with Bash Driving School</p>
          </div>
          
          {/* Success Gallery Grid */}
          <div className="success-gallery">
            {[
              { name: 'Amelia B.', detail: 'Passed in Rochdale', image: success01 },
              { name: 'Jutt', detail: 'Jutt Passed in 1st attempt in Rochdale', image: success02 },
              { name: 'Ali', detail: 'Ali passed in Chadderton', image: success03 },
              { name: 'Tiler', detail: 'Tiler Passed in 1st attempt in Rochdale', image: success04 },
              { name: 'Abdul', detail: 'Abdul Passed in 1st attempt in Rochdale', image: success05 },
              { name: 'Maheen', detail: 'Maheen Passed in 1st attempt in Bury', image: success06 },
              { name: 'Yasir', detail: 'Yasir Passed in 1st attempt in Rochdale', image: success07 },
              { name: 'Tariq J.', detail: 'Passed in Middleton', image: success08 },
              { name: 'Sadia', detail: 'Sadia Passed in 1st attempt in Rochdale', image: success09 }
            ].map((student) => (
              <div key={student.name} className="success-card">
                <div className="success-image-wrapper">
                  <img src={student.image} alt={student.name} />
                  <div className="success-overlay">
                    <div className="success-check">✓</div>
                  </div>
                </div>
                <div className="success-info">
                  <h5>{student.name}</h5>
                  <p>{student.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Booking Form */}
        <section id="booking" className="section">
          <div className="section-header">
            <span className="section-tag">Book Now</span>
            <h2 className="section-title">Ready to Start Your Driving Journey?</h2>
            <p className="section-subtitle">Fill out the form below and we'll get back to you within 24 hours</p>
          </div>
          
          <div className="booking-container">
            <div className="form-steps">
              <div className={`form-step ${formStep >= 1 ? 'active' : ''} ${formStep > 1 ? 'completed' : ''}`}>
                <div className="step-circle">{formStep > 1 ? '✓' : '1'}</div>
                <span className="step-label">Personal Info</span>
              </div>
              <div className={`form-step ${formStep >= 2 ? 'active' : ''} ${formStep > 2 ? 'completed' : ''}`}>
                <div className="step-circle">{formStep > 2 ? '✓' : '2'}</div>
                <span className="step-label">Lesson Details</span>
              </div>
              <div className={`form-step ${formStep >= 3 ? 'active' : ''}`}>
                <div className="step-circle">3</div>
                <span className="step-label">Submit</span>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit}>
              {formStatus.type !== 'idle' && formStatus.type !== 'loading' && (
                <div className="form-status-message" style={{
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: 'var(--spacing-md)',
                  background: formStatus.type === 'success' ? '#d1fae5' : '#fee2e2',
                  color: formStatus.type === 'success' ? '#065f46' : '#991b1b',
                  fontWeight: 600,
                  fontSize: '0.9375rem'
                }}>
                  {formStatus.message}
                </div>
              )}
              
              {formStep === 1 && (
                <>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Smith"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john.smith@example.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="07855 595 078"
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn btn-primary" onClick={nextStep}>
                      Next Step →
                    </button>
                  </div>
                </>
              )}

              {formStep === 2 && (
                <>
                  <div className="form-group">
                    <label>Lesson Type *</label>
                    <select
                      name="lessonType"
                      value={formData.lessonType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select your preferred lesson type</option>
                      <option value="Manual Lessons">Manual Lessons</option>
                      <option value="Automatic Lessons">Automatic Lessons</option>
                      <option value="Intensive Course">Intensive Course</option>
                      <option value="Pass Plus">Pass Plus</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Pick-up Address *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Street address, town, postcode (e.g., 123 High Street, Manchester, M1 1AA)"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Your Availability</label>
                    <input
                      type="text"
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      placeholder="e.g., Weekdays after 5pm, Weekends"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn btn-ghost" onClick={prevStep}>
                      ← Back
                    </button>
                    <button type="button" className="btn btn-primary" onClick={nextStep}>
                      Next Step →
                    </button>
                  </div>
                </>
              )}

              {formStep === 3 && (
                <>
                  <div className="form-group">
                    <label>Additional Information</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Tell us about your experience level or any questions you have"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn btn-ghost" onClick={prevStep}>
                      ← Back
                    </button>
                    <button type="submit" className="btn btn-warm">
                      Send Booking Request
                    </button>
                  </div>
                  {formStatus.type !== 'idle' && (
                    <div style={{
                      marginTop: 'var(--spacing-md)',
                      padding: 'var(--spacing-md)',
                      borderRadius: 'var(--radius-lg)',
                      background: formStatus.type === 'success' ? '#d1fae5' : formStatus.type === 'error' ? '#fee2e2' : '#e0e7ff',
                      color: formStatus.type === 'success' ? '#065f46' : formStatus.type === 'error' ? '#991b1b' : '#3730a3',
                      fontWeight: 600
                    }}>
                      {formStatus.message}
                    </div>
                  )}
                </>
              )}
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column">
            <h5>Bash Driving School</h5>
            <p>
              Professional driving instruction across Greater Manchester since 2012. 
              Helping learners become safe, confident drivers with expert tuition and personalized support.
            </p>
            <div className="footer-social">
              <a href="https://www.facebook.com/bashdrivingschool" className="social-icon" target="_blank" rel="noreferrer" title="Follow us on Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@bashdriving" className="social-icon" target="_blank" rel="noreferrer" title="Follow us on TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="footer-column">
            <h5>Quick Links</h5>
            <ul>
              <li><button onClick={() => scrollToSection('home')}>Home</button></li>
              <li><button onClick={() => scrollToSection('about')}>About Us</button></li>
              <li><button onClick={() => scrollToSection('services')}>Services</button></li>
              <li><button onClick={() => scrollToSection('courses')}>Courses</button></li>
              <li><button onClick={() => scrollToSection('pricing')}>Pricing</button></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h5>Training Info</h5>
            <ul>
              <li>Manual Lessons</li>
              <li>Automatic Lessons</li>
              <li>Intensive Courses</li>
              <li>Pass Plus Training</li>
              <li>Mock Test Preparation</li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h5>Contact Info</h5>
            <ul>
              <li>📞 07855 595 078</li>
              <li>✉️ info@bashdrivingschool.com</li>
              <li>📍 Greater Manchester & Oldham</li>
              <li>🕒 Mon - Sun: 8am - 8pm</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Bash Driving School. All rights reserved. | DVSA Approved Driving Instructors</p>
        </div>
      </footer>

      {/* Map Overlay */}
      {mapOverlay?.open && (
        <div className="map-overlay" role="dialog" aria-modal="true" aria-label={`${mapOverlay.city} map`} onClick={() => setMapOverlay({ open: false, city: '', query: '' })}>
          <div className="map-modal" onClick={(e) => e.stopPropagation()}>
            <div className="map-modal-header">
              <h4>{mapOverlay.city}</h4>
              <button className="map-close" aria-label="Close map" onClick={() => setMapOverlay({ open: false, city: '', query: '' })}>✕</button>
            </div>
            <iframe
              title={`${mapOverlay.city} map`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(mapOverlay.query)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      )}

      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/447855595078?text=Hi%20Bash%20Driving%20School%2C%20I%20would%20like%20to%20book%20a%20driving%20lesson" 
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="white" width="32" height="32">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  )
}

export default App
