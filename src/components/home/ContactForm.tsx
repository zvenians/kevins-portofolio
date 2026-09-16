"use client";

import { useState } from "react";
import { submitContactForm } from "@/app/actions";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);

    try {
      await submitContactForm(formData);
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to send message. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-16 text-left">
      {success ? (
        <div className="p-8 bg-surface-elevated border border-border rounded-lg text-center">
          <h3 className="text-2xl font-medium mb-4">Message Sent</h3>
          <p className="text-text-secondary">Thank you for reaching out. I&apos;ll get back to you as soon as possible.</p>
          <button 
            onClick={() => setSuccess(false)}
            className="mt-8 text-sm text-text-muted hover:text-text-primary underline transition-colors"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot field (hidden from screen readers and visual rendering) */}
          <div aria-hidden="true" className="opacity-0 absolute -left-[9999px] h-0 w-0">
            <label htmlFor="website_url">Website</label>
            <input type="text" id="website_url" name="website_url" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <label htmlFor="name" className="block text-xs font-mono uppercase tracking-widest mb-3 text-text-muted">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                disabled={loading}
                className="w-full px-0 py-3 bg-transparent border-0 border-b border-border/50 focus:border-text-primary outline-none transition-colors disabled:opacity-50 text-text-primary rounded-none" 
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-mono uppercase tracking-widest mb-3 text-text-muted">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                disabled={loading}
                className="w-full px-0 py-3 bg-transparent border-0 border-b border-border/50 focus:border-text-primary outline-none transition-colors disabled:opacity-50 text-text-primary rounded-none" 
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-xs font-mono uppercase tracking-widest mb-3 text-text-muted mt-4">Subject</label>
            <input 
              type="text" 
              id="subject" 
              name="subject"
              disabled={loading}
              className="w-full px-0 py-3 bg-transparent border-0 border-b border-border/50 focus:border-text-primary outline-none transition-colors disabled:opacity-50 text-text-primary rounded-none" 
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-mono uppercase tracking-widest mb-3 text-text-muted mt-4">Message</label>
            <textarea 
              id="message" 
              name="message" 
              required
              disabled={loading}
              rows={4}
              className="w-full px-0 py-3 bg-transparent border-0 border-b border-border/50 focus:border-text-primary outline-none transition-colors resize-y disabled:opacity-50 text-text-primary rounded-none" 
            />
          </div>

          {error && (
            <div className="p-4 bg-danger/10 border border-danger/20 text-danger rounded text-sm mt-4">
              {error}
            </div>
          )}

          <div className="pt-8 text-right">
            <button 
              type="submit" 
              disabled={loading}
              className="group inline-flex items-center text-sm font-semibold tracking-wider uppercase text-text-primary disabled:opacity-50 transition-colors"
            >
              {loading ? "Sending..." : "Send Message"}
              {!loading && <span className="ml-3 transform transition-transform group-hover:translate-x-1">→</span>}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
