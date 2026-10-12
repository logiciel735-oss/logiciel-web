export default function BaseModal({
  children,
  onClose,
  size = "md",
  zIndex = 100,
}) {
  const sizes = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div
      className={`fixed inset-0 z-[${zIndex}] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4`}
    >
      <div
        className={`bg-white rounded-xl w-full ${sizes[size]} max-h-[90vh] flex flex-col shadow-2xl animate-fadeIn`}
      >
        {children}
      </div>
    </div>
  );
}