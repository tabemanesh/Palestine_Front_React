import type { JSX } from "react";

export default function PageLayout({
  children,
  header,
  footer,
}: {
  children?: JSX.Element | JSX.Element[];
  header?: JSX.Element;
  footer?: JSX.Element;
}) {
  return (
    <div className="w-screen min-h-screen flex flex-col items-center">
      {header}
      <main className="w-[1440px] min-h-screen flex flex-col items-center">
        {children}
      </main>
      {footer}
    </div>
  );
}