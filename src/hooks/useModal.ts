import { useCallback, useState } from "react";

type UseModalReturn = {
  isVisible: boolean;
  handleOpen: () => void;
  handleClose: () => void;
};

export function useModal(): UseModalReturn {
  const [isVisible, setIsVisible] = useState(false);

  const handleOpen = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  return { isVisible, handleOpen, handleClose };
}
