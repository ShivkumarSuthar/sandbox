import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import UserCard from '../components/UserCard';

function getStored() {
  try { return JSON.parse(localStorage.getItem('ff_user')); } catch(e){return null}
}

export default function Home(){
  const [user, setUser] = useState(typeof window !== 'undefined' ? getStored() : null);
  const [nearby, setNearby] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    // ping socket endpoint to initialize socket server on first load
    fetch('/api/socket').catch(()=>{});
  },[]);

  useEffect(()=>{
    if (!user) return;
    // update our location on server
    fetch('/api/users', {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(user)});
  },[user]);

  function askLocation() {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(async pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      let u = user;
      if (!u) {
        u = { name: prompt('Enter display name') || 'You', avatar: null };
        u.id = null; // will be created
      }
      u.lat = lat; u.lon = lon;
      // register or update
      const res = await fetch('/api/users', {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(u)});
      const data = await res.json();
      localStorage.setItem('ff_user', JSON.stringify(data));
      setUser(data);
      fetchNearby(lat, lon);
    }, err => alert('Permission denied or error: '+err.message));
  }

  async function fetchNearby(lat, lon) {
    setLoading(true);
    const q = new URLSearchParams({lat, lon, radius:500}).toString();
    const res = await fetch('/api/nearby?'+q);
    const list = await res.json();
    setNearby(list.filter(x => x.id !== user?.id));
    setLoading(false);
  }

  async function onSendRequest(target) {
    if (!user) return alert('Register your location first');
    const res = await fetch('/api/requests', {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({fromId: user.id, toId: target.id})});
    const data = await res.json();
    if (res.ok) alert('Request sent'); else alert(data.error || 'Error');
  }

  return (
    <div className="container">
      <Navbar />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Find friends near you</h3>
        <div>
          <button className="btn btn-primary me-2" onClick={askLocation}>Share my location</button>
          <button className="btn btn-secondary" onClick={() => {navigator.geolocation.getCurrentPosition(p=>fetchNearby(p.coords.latitude,p.coords.longitude));}}>Refresh</button>
        </div>
      </div>

      {user ? (
        <div className="mb-3">
          <strong>Your name:</strong> {user.name}
        </div>
      ) : (
        <div className="alert alert-warning">You haven't shared location yet.</div>
      )}

      <h5>Nearby (within 500m)</h5>
      {loading && <div>Loading...</div>}
      {nearby.length === 0 && !loading && <div className="text-muted">No users nearby.</div>}
      {nearby.map(u => <UserCard key={u.id} user={u} onSendRequest={onSendRequest} />)}

    </div>
  );
}
