export const sampleLeads = [
  { name: 'Aarav Sharma', email: 'aarav.sharma@example.com', phone: '+91 98765 43210', status: 'New', id: '1', property: '' },
  { name: 'Priya Mehta', email: 'priya.mehta@example.com', phone: '+91 98234 56789', status: 'Contacted', id: '2', property: '' },
  { name: 'Rohan Patel', email: 'rohan.patel@example.com', phone: '+91 97654 32108', status: 'Converted', id: '3', property: '' }
];

export const storageKey = 'homestead-leads';

export function parseLeads(value, propertyNames) {
  const leads = JSON.parse(value);
  const ids = new Set();
  if (!Array.isArray(leads)) throw new Error('Invalid saved leads.');

  return leads.map(lead => {
    if (!lead || typeof lead.id !== 'string' || !lead.id.trim() || ids.has(lead.id) ||
      typeof lead.name !== 'string' || !lead.name.trim() || lead.name.length > 80 ||
      typeof lead.email !== 'string' || !lead.email.trim() || lead.email.length > 120 ||
      typeof lead.phone !== 'string' || !lead.phone.trim() || lead.phone.length > 25 ||
      !['New', 'Contacted', 'Converted'].includes(lead.status) ||
      (lead.property !== undefined && lead.property !== '' && !propertyNames.includes(lead.property))) {
      throw new Error('Invalid saved leads.');
    }
    ids.add(lead.id);
    return { id: lead.id, name: lead.name, email: lead.email, phone: lead.phone, status: lead.status, property: lead.property || '' };
  });
}
