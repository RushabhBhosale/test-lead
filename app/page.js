'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const properties = [
  { name: 'The Palm Residence', location: 'Whitefield, Bengaluru', price: '₹85 lakh', type: 'Apartment', beds: 2, baths: 2, area: '1,250', image: 'photo-1600585154340-be6161a56a0c' },
  { name: 'Cedar Park Villa', location: 'Baner, Pune', price: '₹1.65 crore', type: 'Villa', beds: 3, baths: 3, area: '2,400', image: 'photo-1600607687920-4e2a09cf159d' },
  { name: 'Skyline Apartment', location: 'Powai, Mumbai', price: '₹1.2 crore', type: 'Apartment', beds: 2, baths: 2, area: '1,100', image: 'photo-1600566753086-00f18fb6b3ea' }
];

const statuses = ['New', 'Contacted', 'Converted'];
export default function Home() {
  const [leads, setLeads] = useState([]);
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadLeads() {
      try {
        const response = await axios.get('/api/leads');
        setLeads(response.data);
      } catch (error) {
        setMessage(error.response?.data?.error || 'Could not load leads. Please refresh to try again.');
      } finally {
        setLoading(false);
      }
    }
    loadLeads();
  }, []);

  async function addLead(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const lead = {
      name: data.get('name').trim(),
      email: data.get('email').trim(),
      phone: data.get('phone').trim(),
      status: data.get('status'),
      property: data.get('property')
    };
    setSaving(true);
    setMessage('');
    try {
      const response = await axios.post('/api/leads', lead);
      setLeads(current => [...current, response.data]);
      form.reset();
      setMessage('Lead added successfully.');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Could not add lead. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function updateLead(id, changes) {
    setSaving(true);
    setMessage('');
    try {
      const response = await axios.put('/api/leads', { id, ...changes });
      setLeads(current => current.map(lead => lead.id === id ? response.data : lead));
    } catch (error) {
      setMessage(error.response?.data?.error || 'Could not update lead. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
<header>
    <div className="header-inner">
      <a className="brand" href="#">⌂ <span>homestead<span className="brand-dot">.</span></span></a>
      <span className="header-label">Property & lead manager</span>
    </div>
  </header>
  <main>
    <section className="page-heading">
      <div><p className="eyebrow">YOUR WORKSPACE</p><h1>A place for every possibility.</h1><p>Keep your properties and your next conversations in one place.</p></div>
      <a className="button" href="#lead-form">+ Add lead</a>
    </section>
    <section className="stats" aria-label="Dashboard">
      <div className="stat"><span>Total properties</span><strong>{properties.length}</strong><span className="stat-note">In your portfolio</span></div>
      <div className="stat"><span>Total leads</span><strong>{loading ? '…' : leads.length}</strong><span className="stat-note">Connections that count</span></div>
    </section>
    <section className="properties-section">
      <div className="section-heading"><div><p className="eyebrow">THE PORTFOLIO</p><h2>Property listings</h2></div><span className="muted">Sample properties</span></div>
      <div className="property-grid">
            {properties.map(property => (
              <article className="property-card" key={property.name}>
                <div className="property-image">
                  <img src={`https://images.unsplash.com/${property.image}?auto=format&fit=crop&w=800&q=80`} alt={property.name} loading="lazy" />
                  <span className="property-type">{property.type}</span>
                </div>
                <div className="property-content">
                  <p className="property-price">{property.price}</p>
                  <h3>{property.name}</h3>
                  <p className="location">{property.location}</p>
                  <div className="property-details"><span>{property.beds} beds</span><span>{property.baths} baths</span><span>{property.area} sq ft</span></div>
                </div>
              </article>
            ))}
          </div>
    </section>
    <section className="leads-section">
      <div className="section-heading"><div><p className="eyebrow">YOUR CONNECTIONS</p><h2>Lead management</h2></div><span className="muted">A little follow-up goes a long way.</span></div>
      <div className="leads-layout">
        <div className="table-card"><div className="table-scroll"><table><thead><tr><th>Name</th><th>Contact details</th><th>Property</th><th>Status</th></tr></thead><tbody>
                  {loading && <tr><td colSpan="4">Loading leads…</td></tr>}
                  {!loading && leads.length === 0 && <tr><td colSpan="4">No leads yet. Add your first lead using the form.</td></tr>}
                  {leads.map(lead => (
                    <tr key={lead.id}>
                      <td className="lead-name">{lead.name}</td>
                      <td><div>{lead.email}</div><div className="phone">{lead.phone}</div></td>
                      <td>
                        <select className="property-select" value={lead.property || ''} disabled={saving} aria-label={`Property for ${lead.name}`} onChange={event => updateLead(lead.id, { property: event.target.value })}>
                          <option value="">Not specified</option>
                          {properties.map(property => <option key={property.name} value={property.name}>{property.name}</option>)}
                        </select>
                      </td>
                      <td>
                        <select className={`status ${lead.status.toLowerCase()}`} value={lead.status} disabled={saving} aria-label={`Status for ${lead.name}`} onChange={event => updateLead(lead.id, { status: event.target.value })}>
                          {statuses.map(status => <option key={status}>{status}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody></table></div><p className="table-note">Update the property or status as the conversation moves forward.</p></div>
        <form id="lead-form" onSubmit={addLead}>
          <h3>Add a new lead</h3><p className="form-description">Start with the basics.</p>
          <label htmlFor="name">Full name</label><input id="name" name="name" placeholder="e.g. Alex Morgan" maxLength="80" required />
          <label htmlFor="email">Email address</label><input id="email" name="email" type="email" placeholder="alex@example.com" maxLength="120" required />
          <label htmlFor="phone">Phone number</label><input id="phone" name="phone" type="tel" placeholder="e.g. +91 98765 43210" maxLength="25" required />
          <label htmlFor="property">Property (optional)</label>
          <select id="property" name="property">
            <option value="">Not specified</option>
            {properties.map(property => <option key={property.name} value={property.name}>{property.name}</option>)}
          </select>
          <label htmlFor="status">Status</label><select id="status" name="status"><option>New</option><option>Contacted</option><option>Converted</option></select>
          <button className="button" type="submit" disabled={saving || loading}>{saving ? 'Saving…' : 'Add lead'} <span>↗</span></button>
          <p id="form-message" role="status">{message}</p>
        </form>
      </div>
    </section>
    <footer><span>homestead.</span><span>A simple space to manage what’s next.</span></footer>
  </main>
    </>
  );
}
