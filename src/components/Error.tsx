interface ErrorProps {
  message: string;
}

const Error = ({ message }: ErrorProps) => (
  <div className="error-message animate-fade-in">
    <i className="bi bi-exclamation-triangle me-2"></i>
    <strong>Errore:</strong> {message}
  </div>
);

export default Error; 