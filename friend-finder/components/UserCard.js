export default function UserCard({ user, onSendRequest }) {
  return (
    <div className="card mb-2">
      <div className="card-body d-flex align-items-center">
        <img src={user.avatar || '/default-avatar.png'} alt="avatar" width={48} height={48} className="rounded-circle me-3" />
        <div style={{flex:1}}>
          <h6 className="mb-0">{user.name}</h6>
          <small className="text-muted">{user.lat?.toFixed(4)}, {user.lon?.toFixed(4)}</small>
        </div>
        <button className="btn btn-sm btn-primary" onClick={() => onSendRequest(user)}>Connect</button>
      </div>
    </div>
  );
}
