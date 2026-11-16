import "./globals.css";
export const metadata = {
  title: "QA Agent Lab | AI-First QA Engineer Accelerator",
  description:
    "Build, inspect, and evaluate supervised QA agents. A branded student starter with fictional demo evidence.",
};
export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
