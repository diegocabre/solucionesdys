import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  // Con href se dibuja un enlace con aspecto de botón: navegar es un enlace, no un botón.
  href?: string;
  // Con external el enlace sale del sitio y abre en una pestaña nueva.
  external?: boolean;
  children: ReactNode;
}

// El verde es el color de las acciones (docs/rediseno-plan.md): el botón principal lo rellena,
// el secundario lo usa solo en el borde. Sin animación de escala: el cambio de color basta.
const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dys-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none motion-reduce:transition-none';

const variants: Record<Variant, string> = {
  primary: 'bg-dys-primary text-dys-on-primary hover:bg-dys-primary/85',
  outline: 'border-2 border-dys-primary text-dys-text hover:bg-dys-primary hover:text-dys-on-primary',
  ghost: 'text-dys-text hover:bg-dys-text/10',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-12 px-7 text-base sm:text-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  external = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener" className={classes}>
        {children}
        <span className="sr-only"> (abre en una pestaña nueva)</span>
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
