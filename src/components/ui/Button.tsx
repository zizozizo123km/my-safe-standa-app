import * as React from 'react';

// Define the shape of the component's props
interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    // Base Styles (Using utility class names mimicking Tailwind structure)
    const baseClasses =
      'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

    // Variant Styles
    const variantClasses = {
      primary:
        'bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus-visible:ring-blue-500',
      secondary:
        'bg-gray-100 text-gray-800 hover:bg-gray-200 focus-visible:ring-gray-300 border border-gray-200',
      danger:
        'bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500',
      ghost: 'hover:bg-gray-100 text-gray-700 focus-visible:ring-gray-300 shadow-none',
    };

    // Size Styles
    const sizeClasses = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 py-2 text-base',
      lg: 'h-11 px-6 text-lg',
    };
    
    // Concatenate all classes
    const classes = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className,
    ].join(' ');

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, ButtonProps };
export default Button;