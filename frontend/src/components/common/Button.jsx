const Button = ({ onClick, children, className, type = 'button' }) => {
  return (
    <button
        type={type}
        onClick={onClick}
        className={`px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${className}`}
    >   
      {children}
    </button>
  );
};

export default Button;