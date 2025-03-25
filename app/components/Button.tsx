import { Link } from "@remix-run/react";

interface ButtonProps {
  children: React.ReactNode;
  to?: string; 
  onClick?: () => void;
  className?: string;
}

export default function Button({
  children,
  to,
  onClick,
  className,
}: ButtonProps) {
  const baseClass = "w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 " +
    (className || "");
  return to ? (
    <Link to={to} className={baseClass}>
      {children}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={baseClass}>
      {children}
    </button>
  );
}
