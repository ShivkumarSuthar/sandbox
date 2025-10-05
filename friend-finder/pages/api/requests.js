// Simple in-memory requests store
const REQUESTS = []; // { id, fromId, toId, status: 'pending' | 'accepted' }
import { v4 as uuidv4 } from 'uuid';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { fromId, toId } = req.body;
    if (!fromId || !toId) return res.status(400).json({ error: 'fromId and toId required' });
    const existing = REQUESTS.find(r => r.fromId === fromId && r.toId === toId);
    if (existing) return res.status(400).json({ error: 'request exists' });
    const r = { id: uuidv4(), fromId, toId, status: 'pending', createdAt: Date.now() };
    REQUESTS.push(r);
    return res.status(201).json(r);
  }

  if (req.method === 'PUT') {
    const { id, status } = req.body; // status = 'accepted' or 'rejected'
    const r = REQUESTS.find(x => x.id === id);
    if (!r) return res.status(404).json({ error: 'not found' });
    r.status = status;
    return res.status(200).json(r);
  }

  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) return res.status(200).json(REQUESTS);
    const list = REQUESTS.filter(r => r.toId === userId || r.fromId === userId);
    return res.status(200).json(list);
  }

  res.status(405).end();
}
