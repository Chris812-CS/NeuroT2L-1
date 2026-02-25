import "./StandardBackground.css";

export default function StandardBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="std-bg">
      <div className="std-bg-bubble std-bg-bubble--a" />
      <div className="std-bg-bubble std-bg-bubble--b" />
      <div className="std-bg-bubble std-bg-bubble--c" />
      <div className="std-bg-bubble std-bg-bubble--d" />

      <div className="std-bg-content">{children}</div>
    </div>
  );
}
