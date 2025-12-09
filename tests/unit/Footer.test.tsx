import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '@/components/Landing/Footer';

describe('Footer Component', () => {
  it('should render the company name', () => {
    render(<Footer />);
    expect(screen.getByText('StyGo')).toBeInTheDocument();
  });

  it('should render tagline', () => {
    render(<Footer />);
    expect(screen.getByText('Book appointments with top salons in your area.')).toBeInTheDocument();
  });

  it('should render Quick Links section', () => {
    render(<Footer />);
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('How It Works')).toBeInTheDocument();
  });

  it('should render Support section', () => {
    render(<Footer />);
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('Help Center')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });

  it('should render Contact section with correct information', () => {
    render(<Footer />);
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('support@stygo.com')).toBeInTheDocument();
    expect(screen.getByText('(555) 123-4567')).toBeInTheDocument();
    expect(screen.getByText('123 Beauty Street, Style City, ST 12345')).toBeInTheDocument();
  });

  it('should render social media links', () => {
    render(<Footer />);
    const socialLinks = screen.getAllByRole('link', { hidden: true });

    // Check that social media links exist (Facebook, Instagram, Twitter)
    const srTexts = screen.getAllByText(/Facebook|Instagram|Twitter/i);
    expect(srTexts.length).toBeGreaterThan(0);
  });

  it('should render copyright text with current year', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2025 StyGo. All rights reserved./i)).toBeInTheDocument();
  });

  it('should render bottom navigation links', () => {
    render(<Footer />);
    const bottomLinks = screen.getAllByText(/Privacy|Terms|Cookies/i);
    expect(bottomLinks.length).toBeGreaterThan(0);
  });

  it('should have correct link to sign-up page', () => {
    render(<Footer />);
    const signUpLink = screen.getByRole('link', { name: /Get Started/i });
    expect(signUpLink).toHaveAttribute('href', '/sign-up');
  });

  it('should have admin link', () => {
    render(<Footer />);
    const adminLink = screen.getByRole('link', { name: /Admin/i });
    expect(adminLink).toHaveAttribute('href', '/setup-admin');
  });
});
