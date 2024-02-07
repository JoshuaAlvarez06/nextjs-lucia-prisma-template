import { classNames } from "@/utils/classNames";
import React from "react";

// extend input element with some styles and props
export type TextFieldProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
};

export function TextField({
  label,
  containerClassName,
  labelClassName,
  inputClassName,
  ...props
}: TextFieldProps) {
  return (
    <div className={classNames(containerClassName)}>
      <label htmlFor={props.id} className={classNames(labelClassName)}>
        {label}
      </label>
      <input
        className={classNames(inputClassName)}
        {...props}
        type={props.type || "text"}
      />
    </div>
  );
}
