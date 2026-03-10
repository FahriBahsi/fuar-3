'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Breadcrumb from '@/components/common/Breadcrumb';
import { apiUrl } from '@/lib/utils';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);

    try {
      const response = await fetch(apiUrl('/api/contact'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Message sent successfully! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        alert(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Header with Breadcrumb */}
      <section className="header-breadcrumb bgimage overlay overlay--dark">
        <div className="bg_image_holder">
          <img src="/images/breadcrumb1.jpg" alt="" />
        </div>
       
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Contact' },
          ]}
          title="Contact"
        />
      </section>

      {/* Contact Area */}
      <section className="contact-area section-bg p-top-100 p-bottom-70">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="widget atbd_widget widget-card contact-block">
                <div className="atbd_widget_title">
                  <h4><span className="la la-envelope"></span> Contact Form</h4>
                </div>
                <div className="atbdp-widget-listing-contact contact-form">
                  <form id="atbdp-contact-form" className="form-vertical" role="form" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <input 
                        type="text" 
                        className="form-control" 
                        id="atbdp-contact-name" 
                        placeholder="Name" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <input 
                        type="email" 
                        className="form-control" 
                        id="atbdp-contact-email" 
                        placeholder="Email" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <input 
                        type="text" 
                        className="form-control" 
                        id="atbdp-contact-subject" 
                        placeholder="Subject" 
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <textarea 
                        className="form-control" 
                        id="atbdp-contact-message" 
                        rows={6} 
                        placeholder="Message" 
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-gradient btn-gradient-one btn-block"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="widget atbd_widget widget-card">
                <div className="atbd_widget_title">
                  <h4><span className="la la-phone"></span>Contact Info</h4>
                </div>
                <div className="widget-body atbd_author_info_widget">
                  <div className="atbd_widget_contact_info">
                    <ul>
                      <li>
                        <span className="la la-map-marker"></span>
                        <span className="atbd_info">25 East Valley Road, Michigan</span>
                      </li>
                      <li>
                        <span className="la la-phone"></span>
                        <span className="atbd_info">(213) 995-7799</span>
                      </li>
                      <li>
                        <span className="la la-envelope"></span>
                        <span className="atbd_info">support@aazztech.com</span>
                      </li>
                      <li>
                        <span className="la la-globe"></span>
                        <a href="" className="atbd_info">www.aazztech.com</a>
                      </li>
                    </ul>
                  </div>

                  <div className="atbd_social_wrap">
                    <p><a href=""><span className="fab fa-facebook-f"></span></a></p>
                    <p><a href=""><span className="fab fa-twitter"></span></a></p>
                    <p><a href=""><span className="fab fa-google-plus-g"></span></a></p>
                    <p><a href=""><span className="fab fa-linkedin-in"></span></a></p>
                    <p><a href=""><span className="fab fa-dribbble"></span></a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
