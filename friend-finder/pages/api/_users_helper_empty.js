// Shared in-memory store helper
const USERS = {}; // id -> { id, name, lat, lon, avatar }

export function getUsers() { return USERS; }
export function setUser(id, data) { USERS[id] = data; }
export default { getUsers, setUser };
