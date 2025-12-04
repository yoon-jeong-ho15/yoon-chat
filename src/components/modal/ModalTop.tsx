type ModalTopProps = {
  title: string;
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
};

export default function ModalTop({
  title,
  isMinimized,
  onClose,
  onMinimize,
}: ModalTopProps) {
  return (
    <div className="flex items-center bg-gray-100 rounded-t-lg">
      <button
        id="tracker-close"
        className="
        size-4
        mx-1 
        bg-red-300
        hover:bg-red-400
        rounded-lg
      "
        onClick={onClose}
      ></button>
      <button
        id="tracker-open"
        className={`
        size-4
        mx-1
        ${
          isMinimized
            ? "bg-green-300 hover:bg-green-400"
            : "bg-yellow-300 hover:bg-yellow-400"
        }
        rounded-lg
          `}
        onClick={onMinimize}
      ></button>
      <div className="flex flex-1 justify-center">
        <h2 className="text-lg text-gray-900">{title}</h2>
      </div>
    </div>
  );
}
