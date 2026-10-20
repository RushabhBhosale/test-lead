import { randomUUID } from 'node:crypto';
import { readLeads, updateLeads } from '../../../lib/leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const statuses = ['New', 'Contacted', 'Converted'];

export async function GET() {
  try {
    return Response.json(await readLeads());
  } catch {
    return Response.json({ error: 'Could not load leads.' }, { status: 500 });
  }
}

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const name = typeof data?.name === 'string' ? data.name.trim() : '';
  const email = typeof data?.email === 'string' ? data.email.trim() : '';
  const phone = typeof data?.phone === 'string' ? data.phone.trim() : '';
  const property = typeof data?.property === 'string' ? data.property.trim() : '';

  if (!name || name.length > 80) {
    return Response.json({ error: 'Name is required and must be 80 characters or fewer.' }, { status: 400 });
  }

  if (!email || email.length > 120) {
    return Response.json({ error: 'Email is required and must be 120 characters or fewer.' }, { status: 400 });
  }

  if (!phone || phone.length > 25) {
    return Response.json({ error: 'Phone is required and must be 25 characters or fewer.' }, { status: 400 });
  }

  if (!statuses.includes(data?.status)) {
    return Response.json({ error: 'Status must be New, Contacted, or Converted.' }, { status: 400 });
  }

  try {
    const lead = { id: randomUUID(), name, email, phone, property, status: data.status };
    await updateLeads(leads => leads.push(lead));
    return Response.json(lead, { status: 201 });
  } catch {
    return Response.json({ error: 'Could not save lead. Please try again.' }, { status: 500 });
  }
}

export async function PUT(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (typeof data?.id !== 'string' || !data.id.trim()) {
    return Response.json({ error: 'Lead ID is required.' }, { status: 400 });
  }

  if (data.status !== undefined && !statuses.includes(data.status)) {
    return Response.json({ error: 'Status must be New, Contacted, or Converted.' }, { status: 400 });
  }

  if (data.property !== undefined && (typeof data.property !== 'string' || data.property.length > 120)) {
    return Response.json({ error: 'Property must be text with 120 characters or fewer.' }, { status: 400 });
  }

  if (data.status === undefined && data.property === undefined) {
    return Response.json({ error: 'Provide a status or property to update.' }, { status: 400 });
  }

  try {
    const lead = await updateLeads(leads => {
      const lead = leads.find(item => item.id === data.id);
      if (lead) {
        if (data.status !== undefined) lead.status = data.status;
        if (data.property !== undefined) lead.property = data.property.trim();
      }
      return lead;
    });
    if (!lead) return Response.json({ error: 'Lead not found.' }, { status: 404 });
    return Response.json(lead);
  } catch {
    return Response.json({ error: 'Could not update lead. Please try again.' }, { status: 500 });
  }
}
