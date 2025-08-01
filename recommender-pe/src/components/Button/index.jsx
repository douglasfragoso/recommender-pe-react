const Button = ({
  cor = "",
  tamanho = "md",
  outline = false,
  aoClicar,
  children,
  className = "",
  ...props 
}) => {
  return (
    <button
      className={`
        btn 
        ${outline ? `btn-outline-${cor}` : `btn-${cor}`} 
        btn-${tamanho} 
        d-flex 
        align-items-center 
        gap-2 
        ${className}
      `}
      onClick={aoClicar}
      {...props} 
    >
      {children}
    </button>
  );
}

export default Button;
