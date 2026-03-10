'use client';

import { useState } from 'react';

export default function SubscribeSection() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your subscription logic here
    setEmail('');
  };

  return (
    <section className="subscribe-wrapper">
      <div className="container">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <h1>Subscribe to Newsletter</h1>
            <p>Subscribe to get update and information. Don't worry, we won't send spam!</p>
            <form onSubmit={handleSubmit} className="subscribe-form m-top-40">
              <div className="form-group">
                <span className="la la-envelope-o"></span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-gradient btn-gradient-one">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

