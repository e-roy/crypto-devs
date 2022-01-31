export type ModalProps = {
  children?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
};

export const Modal = ({ children, isOpen, onClose }: ModalProps) => {
  if (!isOpen) return null;
  else
    return (
      <div
        onClick={() => {
          onClose();
        }}
        className="main-modal fixed w-full h-100 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster"
        style={{ background: "rgba(0,0,0,.7)" }}
      >
        <div className="shadow-lg modal-container bg-white text-black w-11/12 md:max-w-md mx-auto rounded z-50 overflow-y-auto">
          <div className="p-2">{children}</div>
        </div>
      </div>
    );
};
