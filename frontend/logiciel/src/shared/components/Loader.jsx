export default function Loader({
  text = "Cargando...",
  bg = "bg-gray-100/70",
  color = "#9CA3AF", 
  size = 64,
  fullscreen = false,
}) {
  return (
    <div
      className={`
        ${
          fullscreen
            ? "fixed top-0 left-0 w-screen h-screen z-50"
            : "absolute top-0 left-0 w-full h-full z-10"
        }
        flex flex-col items-center justify-center
        ${bg}
      `}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Cargando"
      >
        <circle cx="12" cy="3" r="1">
          <animate
            attributeName="r"
            dur="0.6s"
            values="1;2;1"
            repeatCount="indefinite"
          />
        </circle>

        <animateTransform
          attributeName="transform"
          type="rotate"
          dur="6s"
          values="360 12 12;0 12 12"
          repeatCount="indefinite"
        />
      </svg>

      <p className="mt-4 text-gray-400 tracking-widest text-xs uppercase">
        {text}
      </p>
    </div>
  );
}