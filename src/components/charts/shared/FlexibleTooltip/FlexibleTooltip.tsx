import React, {useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import Box from "@mui/material/Box";

export interface TooltipDataPoint {
  label: string;
  value: number;
  color: string;
  group?: string;
  category?: string;
  date?: Date;
}

export interface CustomTooltipProps {
  dataPoints: TooltipDataPoint[];
  group?: string;
  date?: Date;
}

interface FlexibleTooltipProps {
  children: React.ReactNode;
  tooltipDataRef: React.MutableRefObject<TooltipDataPoint[] | null>;
  mousePositionRef: React.MutableRefObject<{x: number; y: number}>;
  containerRectRef: React.MutableRefObject<DOMRect | null>;
  darkMode?: boolean;
  customTooltipElement?:
    | React.ReactNode
    | React.ComponentType<CustomTooltipProps>
    | ((props: CustomTooltipProps) => React.ReactNode);
}

const FlexibleTooltip: React.FC<FlexibleTooltipProps> = ({
  children,
  tooltipDataRef,
  mousePositionRef,
  containerRectRef,
  darkMode = false,
  customTooltipElement,
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState({x: 0, y: 0});
  const [isVisible, setIsVisible] = useState(false);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const updateTooltip = () => {
      const tooltipData = tooltipDataRef.current;
      const mousePosition = mousePositionRef.current;
      const containerRect = containerRectRef.current;
      
      const visible = !!tooltipData && tooltipData.length > 0;
      setIsVisible(visible);

      if (visible && tooltipRef.current && containerRect) {
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const tooltipWidth = tooltipRect.width;
        const tooltipHeight = tooltipRect.height;

        // Calculate position relative to viewport
        let x = containerRect.left + mousePosition.x;
        let y = containerRect.top + mousePosition.y + 15; // Position below cursor

        // Adjust horizontal position to keep tooltip within viewport
        if (x + tooltipWidth / 2 > window.innerWidth) {
          x = window.innerWidth - tooltipWidth - 10;
        } else if (x - tooltipWidth / 2 < 0) {
          x = 10;
        } else {
          x = x - tooltipWidth / 2; // Center under cursor
        }

        // Adjust vertical position if tooltip would go below viewport
        if (y + tooltipHeight > window.innerHeight) {
          y = containerRect.top + mousePosition.y - tooltipHeight - 10;
        }

        setTooltipPosition({x, y});
      }

      animationFrameRef.current = requestAnimationFrame(updateTooltip);
    };

    animationFrameRef.current = requestAnimationFrame(updateTooltip);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [tooltipDataRef, mousePositionRef, containerRectRef]);

  const renderTooltipContent = () => {
    const tooltipData = tooltipDataRef.current;
    if (!tooltipData || tooltipData.length === 0) return null;

    const group = tooltipData[0].group;
    const date = tooltipData[0].date;

    // If custom tooltip element is provided, use it
    if (customTooltipElement) {
      const tooltipProps: CustomTooltipProps = {
        dataPoints: tooltipData,
        group,
        date,
      };

      // Handle different types of custom tooltip elements
      if (typeof customTooltipElement === "function") {
        const CustomComponent =
          customTooltipElement as React.ComponentType<CustomTooltipProps>;
        return <CustomComponent {...tooltipProps} />;
      }
      if (React.isValidElement(customTooltipElement)) {
        return React.cloneElement(customTooltipElement, tooltipProps as React.Attributes);
      }
      return customTooltipElement;
    }

    // Default tooltip content
    return (
      <Box
        sx={{
          backgroundColor: darkMode ? "rgba(44, 49, 66, 0.95)" : "rgba(255, 255, 255, 0.95)",
          color: darkMode ? "#E0E0E0" : "#333",
          padding: "8px 12px",
          borderRadius: "4px",
          fontSize: "12px",
          fontFamily: "Arial, sans-serif",
          border: `1px solid ${darkMode ? "#404552" : "#ddd"}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        {group && (
          <Box sx={{marginBottom: "4px", fontWeight: "bold"}}>
            {group}
          </Box>
        )}
        {date && (
          <Box sx={{marginBottom: "4px", fontWeight: "bold"}}>
            {date.toLocaleDateString()}
          </Box>
        )}
        {tooltipData.map((point, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: index > 0 ? "2px" : 0,
            }}
          >
            <Box
              sx={{
                width: "10px",
                height: "10px",
                backgroundColor: point.color,
                marginRight: "5px",
                borderRadius: "2px",
              }}
            />
            <Box>
              {point.label}: {point.value}
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  const tooltipElement = isVisible ? (
    <Box
      ref={tooltipRef}
      sx={{
        position: "fixed",
        left: tooltipPosition.x,
        top: tooltipPosition.y,
        pointerEvents: "none",
        zIndex: 10000,
        visibility: isVisible ? "visible" : "hidden",
      }}
    >
      {renderTooltipContent()}
    </Box>
  ) : null;

  return (
    <>
      {children}
      {tooltipElement && createPortal(tooltipElement, document.body)}
    </>
  );
};

export default FlexibleTooltip;
