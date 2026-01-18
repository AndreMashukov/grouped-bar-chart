import {useState, useRef, useEffect} from "react";

interface UseResponsiveDimensionsProps {
  width?: number;
  height?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  marginHorizontal?: number;
  marginVertical?: number;
}

interface ResponsiveDimensions {
  width: number;
  height: number;
}

const useResponsiveDimensions = ({
  width,
  height,
  defaultWidth = 460,
  defaultHeight = 400,
  maxWidth = 800,
  maxHeight = 600,
  marginHorizontal = 40,
  marginVertical = 100,
}: UseResponsiveDimensionsProps) => {
  const [calculatedDimensions, setCalculatedDimensions] =
    useState<ResponsiveDimensions>({
      width: width || defaultWidth,
      height: height || defaultHeight,
    });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!width || !height) {
      const updateDimensions = () => {
        if (containerRef.current) {
          const parent = containerRef.current.parentElement;
          if (parent) {
            const parentRect = parent.getBoundingClientRect();

            setCalculatedDimensions({
              width:
                width ||
                Math.min(parentRect.width - marginHorizontal, maxWidth) ||
                defaultWidth,
              height:
                height ||
                Math.min(parentRect.height - marginVertical, maxHeight) ||
                defaultHeight,
            });
          }
        }
      };

      const timeoutId = setTimeout(updateDimensions, 50);
      window.addEventListener("resize", updateDimensions);

      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener("resize", updateDimensions);
      };
    }
  }, [
    width,
    height,
    defaultWidth,
    defaultHeight,
    maxWidth,
    maxHeight,
    marginHorizontal,
    marginVertical,
  ]);

  return {
    calculatedDimensions,
    containerRef,
  };
};

export default useResponsiveDimensions;
