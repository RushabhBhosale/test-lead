import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';

const sampleLeads = [
  { name: 'Aarav Sharma', email: 'aarav.sharma@example.com', phone: '+91 98765 43210', status: 'New' },
  { name: 'Priya Mehta', email: 'priya.mehta@example.com', phone: '+91 98234 56789', status: 'Contacted' },
  { name: 'Rohan Patel', email: 'rohan.patel@example.com', phone: '+91 97654 32108', status: 'Converted' }
];

const directory = path.join(process.cwd(), 'data');
const file = path.join(directory, 'leads.json');
let pending = Promise.resolve();

export async function readLeads() {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return sampleLeads.map((lead, index) => ({ ...lead, id: String(index + 1) }));
    }
    throw error;
  }
}

export function updateLeads(change) {
  const result = pending.then(async () => {
    const leads = await readLeads();
    const value = change(leads);
    await mkdir(directory, { recursive: true });
    await writeFile(`${file}.tmp`, JSON.stringify(leads, null, 2));
    await rename(`${file}.tmp`, file);
    return value;
  });
  pending = result.catch(() => {});
  return result;
}
