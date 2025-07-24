interface ErrorProps {
  message: string;
}

const Error = ({ message }: ErrorProps) => (
  <div className="alert alert-danger text-center my-3">{message}</div>
);

export default Error; 