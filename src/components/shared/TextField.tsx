import { classNames } from "@/utils/classNames";
import React from "react";
import { Input, InputProps } from "@/components/ui";

// extend input element with some styles and props
export type TextFieldProps = InputProps & {
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
      <Input
        className={classNames(inputClassName)}
        {...props}
        type={props.type || "text"}
      />
    </div>
  );
}
