export type ButtonProps = {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  className?: string;
};

export const Button = ({
  children,
  onClick,
  disabled,
  className,
}: ButtonProps) => {
  const base =
    "w-full font-semibold uppercase tracking-wider bg-transparent hover:bg-yellow-300 text-yellow-300 hover:text-black rounded shadow hover:shadow-lg py-2 px-4 border border-yellow-300 hover:border-transparent";
  return (
    <button
      className={`${base} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
