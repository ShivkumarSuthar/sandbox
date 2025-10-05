import { v4 as uuidv4 } from 'uuid';
import usersHelper from './_users_helper_empty';

export default function handler(req, res) {
  const USERS = usersHelper.getUsers();
  if (req.method === 'POST') {
    const { id, name, lat, lon, avatar } = req.body;
    if (!id) {
      const newId = uuidv4();
      const user = { id: newId, name: name || 'Anonymous', lat, lon, avatar };
      usersHelper.setUser(newId, user);
      return res.status(201).json(user);
    }
    if (!USERS[id]) return res.status(404).json({ error: 'User not found' });
    const user = { ...USERS[id], lat, lon, name: name || USERS[id].name, avatar };
    usersHelper.setUser(id, user);
    return res.status(200).json(user);
  }

  if (req.method === 'GET') {
    return res.status(200).json(Object.values(USERS));
  }

  res.status(405).end();
}
