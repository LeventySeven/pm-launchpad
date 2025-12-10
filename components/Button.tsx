import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  // shadcn/ui inspired base styles
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF1D] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    // Primary matches shadcn 'default' but with our green accent logic or neutral inverse
    primary: "bg-[#f4f4f5] text-black hover:bg-[#f4f4f5]/90", 
    // We can also treat 'primary' as our brand green if preferred, but usually shadcn primary is foreground color. 
    // Let's stick to the previous active gray/white feel for main actions or use Brand Green for emphasis.
    // Actually, let's map 'primary' to a solid white/gray interaction to stand out on dark bg.
    
    // For specific "Brand" buttons we might use inline styles or specific classes in parent. 
    // Let's keep primary as the high-contrast option.
    
    secondary: "bg-zinc-800 text-zinc-50 hover:bg-zinc-800/80",
    outline: "border border-zinc-800 bg-black hover:bg-zinc-800 hover:text-zinc-50",
    ghost: "hover:bg-zinc-800 hover:text-zinc-50",
    destructive: "bg-red-900 text-red-50 hover:bg-red-900/90",
  };

  const sizes = {
    sm: "h-9 rounded-md px-3",
    md: "h-10 px-4 py-2",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  // Override mapping for legacy props to new look
  const variantClass = variants[variant];
  const sizeClass = sizes[size];

  return (
    <button 
      className={`${baseStyles} ${variantClass} ${sizeClass} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;