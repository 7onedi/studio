import React from "react";
import styles from "./Button.module.scss";
import clsx from "clsx";

type ButtonProps = {
  variant?: "accent" | "accent-alt" | "primary" | "secondary"| "secondary-alt" | "tertiary"| "tertiary-alt";
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({
  variant = "accent",
  disabled = false,
  children,
  onClick,
  iconOnly,
  className
}) => {
  return (
    <button
      className={clsx(
        styles.buttonBase,
        styles[variant],
        iconOnly && styles.iconOnly,
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
