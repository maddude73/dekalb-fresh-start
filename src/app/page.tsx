'use client';

import { useState } from 'react';
import Image from "next/image";

export default function Home() {
  const initialFormState = {
    fullName: '',
    phone: '',
    email: '',
    propertyAddress: '',
    city: '',
    state: '',
    zip: '',
    freshStartAmount: '',
  };
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState(initialFormState);
  const [touched, setTouched] = useState(initialFormState);
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'duplicate' | 'error' | null>(null);

  const validate = () => {
    const newErrors = { ...initialFormState };
    const emailRegex = /^\S+@\S+\.\S+$/;
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

    if (touched.email && !emailRegex.test(form.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (touched.phone && !phoneRegex.test(form.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    setErrors(newErrors);
    return Object.values(newErrors).every(x => x === '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: 'true' });
    validate();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: form.fullName,
        phone: form.phone,
        email: form.email,
        address: form.propertyAddress,
        city: form.city,
        state: form.state,
        zip: form.zip,
        freshStartAmount: form.freshStartAmount,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status === "updated") {
        setSubmissionStatus('duplicate'); // Use duplicate status to display the updated message
      } else {
        setSubmissionStatus('success');
      }
    } else {
      setSubmissionStatus('error');
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 smooth-scroll max-w-[1200px] mx-auto">

      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
                <Image src="/silas-f-logo.png" alt="Silas Frazier Realty Logo" width={60} height={60} />
                <div className="text-4xl font-serif font-bold text-brand-blue">
                    Dekalb <span className="text-brand-gold">Fresh Start</span>
                </div>
            </div>
          <div>
            <a href="#contact-form" className="bg-brand-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-900 transition duration-300">Get Help Now</a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="hero-bg text-white">
        <div className="container mx-auto px-6 py-24 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-extrabold leading-tight mb-4">Facing Foreclosure? You&apos;re Not Alone.</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">We provide a compassionate alternative. Let us pay off your mortgage and give you the cash you need for a true fresh start, without the stress and uncertainty.</p>
          <a href="#contact-form" className="bg-brand-gold text-brand-blue font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-400 transition duration-300 transform hover:scale-105">Find Out How We Can Help</a>
        </div>
      </main>

      {/* How It Works Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-brand-blue">A Simple, Dignified Process</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">We&apos;ve streamlined our process to be quick, transparent, and respectful of your situation.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="p-8 bg-gray-50 rounded-xl shadow-lg transform hover:-translate-y-2 transition duration-300">
              <div className="bg-brand-blue text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold font-sans">1</div>
              <h3 className="text-2xl font-serif font-bold mb-3 text-brand-blue">Tell Us Your Goal</h3>
              <p className="text-gray-600">Fill out the short, confidential form below. The most important question is simply how much you need for your fresh start.</p>
            </div>
            {/* Step 2 */}
            <div className="p-8 bg-gray-50 rounded-xl shadow-lg transform hover:-translate-y-2 transition duration-300">
              <div className="bg-brand-blue text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold font-sans">2</div>
              <h3 className="text-2xl font-serif font-bold mb-3 text-brand-blue">Receive a Personal Call</h3>
              <p className="text-gray-600">No automated systems. You&apos;ll speak directly with Silas to discuss your situation and explore your options in a no-pressure conversation.</p>
            </div>
            {/* Step 3 */}
            <div className="p-8 bg-gray-50 rounded-xl shadow-lg transform hover:-translate-y-2 transition duration-300">
              <div className="bg-brand-blue text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold font-sans">3</div>
              <h3 className="text-2xl font-serif font-bold mb-3 text-brand-blue">Get Your Fresh Start</h3>
              <p className="text-gray-600">If we're a good fit, we'll handle the mortgage and provide your funds. Move forward with cash in hand and peace of mind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-gray-100">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/3 text-center">
            <Image src="https://placehold.co/300x300/E2E8F0/4A5568?text=Silas+F." alt="Silas Frazier" width={192} height={192} className="rounded-full shadow-2xl mx-auto object-cover" onError={(e) => { e.currentTarget.src = 'https://placehold.co/300x300/E2E8F0/4A5568?text=Silas+F.'; }} />
          </div>
          <div className="md:w-2/3">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-brand-blue">A Message From Silas</h2>
            <p className="text-gray-600 text-lg mb-4">&quot;I started this service because I saw too many good people in our community losing everything to foreclosure. My goal isn&apos;t just to buy property; it&apos;s to provide a helping hand. I believe in giving people the resources and respect they deserve to start a new, positive chapter in their lives. When you contact us, you&apos;re not just a number—you&apos;re a neighbor, and I&apos;m here to listen and to help.&quot;</p>
            <p className="font-semibold text-gray-700">- Silas Frazier, Founder</p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          {submissionStatus === 'success' ? (
            <div id="success-message" className="max-w-2xl mx-auto text-center bg-white p-12 rounded-xl shadow-2xl">
              <div className="bg-green-100 text-green-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Thank You!</h2>
              <p className="text-gray-600 text-lg">We&apos;ve received your information. Silas will personally review it and reach out to you by phone within the next 24 hours to discuss your situation.</p>
              <p className="text-gray-500 text-sm mt-6">Your new beginning is just around the corner.</p>
            </div>
          ) : submissionStatus === 'duplicate' ? (
            <div id="success-message" className="max-w-2xl mx-auto text-center bg-white p-12 rounded-xl shadow-2xl">
              <div className="bg-green-100 text-green-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Thank You!</h2>
              <p className="text-gray-600 text-lg">Your address is already on file. We have updated your contact information with your latest changes.</p>
              <p className="text-gray-500 text-sm mt-6">Your new beginning is just around the corner.</p>
            </div>
          ) : (
            <div id="form-container" className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-blue">Let's Start the Conversation</h2>
                <p className="text-gray-600 mt-4">Your information is 100% confidential and there is no obligation.</p>
              </div>
              <form id="lead-form" onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-2xl space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" id="fullName" name="fullName" required onChange={handleChange} onBlur={handleBlur} value={form.fullName} className="mt-1 block w-full px-4 py-3 bg-gray-100 border-gray-200 rounded-lg focus:ring-brand-blue focus:border-brand-blue transition" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input type="tel" id="phone" name="phone" required onChange={handleChange} onBlur={handleBlur} value={form.phone} className={`mt-1 block w-full px-4 py-3 bg-gray-100 border-gray-200 rounded-lg focus:ring-brand-blue focus:border-brand-blue transition ${errors.phone && touched.phone ? 'border-red-500' : ''}`} />
                  {errors.phone && touched.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input type="email" id="email" name="email" required onChange={handleChange} onBlur={handleBlur} value={form.email} className={`mt-1 block w-full px-4 py-3 bg-gray-100 border-gray-200 rounded-lg focus:ring-brand-blue focus:border-brand-blue transition ${errors.email && touched.email ? 'border-red-500' : ''}`} />
                  {errors.email && touched.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="propertyAddress" className="block text-sm font-medium text-gray-700">Property Address</label>
                  <input type="text" id="propertyAddress" name="propertyAddress" required onChange={handleChange} onBlur={handleBlur} value={form.propertyAddress} className="mt-1 block w-full px-4 py-3 bg-gray-100 border-gray-200 rounded-lg focus:ring-brand-blue focus:border-brand-blue transition" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                    <input type="text" id="city" name="city" required onChange={handleChange} onBlur={handleBlur} value={form.city} className="mt-1 block w-full px-4 py-3 bg-gray-100 border-gray-200 rounded-lg focus:ring-brand-blue focus:border-brand-blue transition" />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                    <input type="text" id="state" name="state" required onChange={handleChange} onBlur={handleBlur} value={form.state} className="mt-1 block w-full px-4 py-3 bg-gray-100 border-gray-200 rounded-lg focus:ring-brand-blue focus:border-brand-blue transition" />
                  </div>
                  <div>
                    <label htmlFor="zip" className="block text-sm font-medium text-gray-700">Zip Code</label>
                    <input type="text" id="zip" name="zip" required onChange={handleChange} onBlur={handleBlur} value={form.zip} className="mt-1 block w-full px-4 py-3 bg-gray-100 border-gray-200 rounded-lg focus:ring-brand-blue focus:border-brand-blue transition" />
                  </div>
                </div>
                <div>
                  <label htmlFor="freshStartAmount" className="block font-medium text-gray-800 text-lg">How much cash would you need for your fresh start?</label>
                  <p className="text-sm text-gray-500 mb-2">This helps us understand your primary goal.</p>
                  <input type="text" id="freshStartAmount" name="freshStartAmount" placeholder="e.g., $20,000" required onChange={handleChange} onBlur={handleBlur} value={form.freshStartAmount} className="mt-1 block w-full px-4 py-3 bg-gray-100 border-gray-200 rounded-lg focus:ring-brand-blue focus:border-brand-blue transition text-lg" />
                </div>
                <div>
                  <button type="submit" className="w-full bg-brand-blue text-white font-bold py-4 px-6 rounded-lg text-lg hover:bg-blue-900 transition duration-300 transform hover:scale-105">
                    Get My Fresh Start Offer
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="font-bold text-xl mb-2 font-serif">Dekalb <span className="text-brand-gold">Fresh Start</span></p>
          <p className="text-gray-400">Serving homeowners in DeKalb County, Georgia</p>
          <p className="text-gray-400 mt-1">Phone: (770) 873-6552 | Email: silas@silasfrazierrealty.com</p>
          <p className="text-xs text-gray-500 mt-6">&copy; 2025 Dekalb Fresh Start. All Rights Reserved. We are a real estate solutions company. We are not attorneys or financial advisors. Please consult a professional for legal or financial advice.</p>
        </div>
      </footer>

    </div>
  );
}