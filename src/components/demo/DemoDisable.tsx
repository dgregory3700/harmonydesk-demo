"use client";

import React from "react";

type Props = {
  children: React.ReactElement;
  message?: string;
};

export function DemoDisable({
  children,
  message = "Demo mode — read-only",
}: Props) {
  const child = React.Children.only(children);

  return React.cloneElement(child, {
    onClick: (e: any) => {
      e.preventDefault();
      e.stopPropagation?.();
      // Replace with your toast lib if present
      // eslint-disable-next-line no-alert
      alert(message);
    },
    disabled: true,
    "aria-disabled": true,
    title: message,
  } as any);
}
