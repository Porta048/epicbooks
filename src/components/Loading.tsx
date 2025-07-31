const Loading = () => (
  <div className="text-center py-5 animate-fade-in">
    <div className="loading-spinner mb-3" style={{ width: '40px', height: '40px', margin: '0 auto' }}></div>
    <p className="text-muted fw-semibold">
      <i className="bi bi-hourglass-split me-2"></i>
      Caricamento in corso...
    </p>
  </div>
);

export default Loading; 