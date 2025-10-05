import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Navbar from '../../components/Navbar';

let socket;

export default function Chat(){
  const router = useRouter();
  const { id } = router.query; // room id: e.g. <myid>_<theirid>
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('ff_user')||'null') : null;
  const boxRef = useRef();

  useEffect(()=>{
    if (!id) return;
    if (!socket) socket = io();
    socket.emit('join', id);
    socket.on('message', m => setMessages(prev => [...prev, m]));
    return () => { socket.off('message'); };
  },[id]);

  function send(){
    if (!text) return;
    socket.emit('message', { roomId: id, from: user?.id || 'anon', text });
    setText('');
  }

  return (
    <div className="container">
      <Navbar />
      <h4>Chat room: {id}</h4>
      <div className="border p-3 mb-3" style={{height:300, overflow:'auto'}} ref={boxRef}>
        {messages.map((m,i)=>(
          <div key={i} className={m.from === user?.id ? 'text-end' : ''}>
            <small className="text-muted">{m.from}</small>
            <div>{m.text}</div>
            <small className="text-muted">{new Date(m.ts).toLocaleTimeString()}</small>
            <hr />
          </div>
        ))}
      </div>

      <div className="input-group">
        <input value={text} onChange={e=>setText(e.target.value)} className="form-control" placeholder="Type a message" />
        <button className="btn btn-primary" onClick={send}>Send</button>
      </div>
    </div>
  );
}
