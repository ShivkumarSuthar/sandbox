export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">FriendFinder</a>
        <div className="d-flex">
          <a className="btn btn-outline-primary me-2" href="/requests">Requests</a>
        </div>
      </div>
    </nav>
  );
}
