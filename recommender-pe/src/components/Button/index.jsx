function Button({ 
  cor = "primary", 
  tamanho = "md", 
  outline = false, 
  aoClicar, 
  children,
  className = "" 
}) {
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
    >
      {children}
    </button>
  );
}

export default Button;