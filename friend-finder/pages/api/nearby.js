import { distanceInMeters } from '../../lib/haversine';
// NOTE: This imports the in-memory USERS from users.js by re-requiring the module.
// For this demo we'll re-create a shared in-memory store by referencing the same module file.
// In production use a DB with geo queries.

// To access the same USERS, we'll require the users module and read its exported USERS object.
import usersModule from './_users_helper_empty';

export default function handler(req, res) {
  const { lat, lon, radius = 500 } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'lat/lon required' });
  const meLat = parseFloat(lat);
  const meLon = parseFloat(lon);
  const USERS = usersModule.getUsers();
  const results = Object.values(USERS).filter(u => {
    if (u.lat == null || u.lon == null) return false;
    const d = distanceInMeters(meLat, meLon, u.lat, u.lon);
    return d <= Number(radius);
  });
  res.status(200).json(results);
}
