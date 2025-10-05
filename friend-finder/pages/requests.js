import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

export default function Requests(){
  const [user] = useState(() => { try{ return JSON.parse(localStorage.getItem('ff_user')); }catch(e){return null} });
  const [list, setList] = useState([]);

  useEffect(()=>{
    fetchList();
  },[]);

  async function fetchList(){
    const q = user ? ('?userId='+user.id) : '';
    const res = await fetch('/api/requests'+q);
    const data = await res.json();
    setList(data);
  }

  async function accept(id){
    await fetch('/api/requests', {method:'PUT', headers:{'content-type':'application/json'}, body: JSON.stringify({id, status:'accepted'})});
    fetchList();
  }

  return (
    <div className="container">
      <Navbar />
      <h3>Connection Requests</h3>
      {!user && <div className="alert alert-warning">Register first (Share location) to manage requests.</div>}
      {!list.length && <div className="text-muted">No requests</div>}
      {list.map(r => (
        <div className="card mb-2" key={r.id}>
          <div className="card-body d-flex justify-content-between">
            <div>
              <div><strong>From:</strong> {r.fromId}</div>
              <div><strong>To:</strong> {r.toId}</div>
              <div><small>Status: {r.status}</small></div>
            </div>
            {r.status === 'pending' && r.toId === user?.id && (
              <button className="btn btn-success" onClick={() => accept(r.id)}>Accept</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
