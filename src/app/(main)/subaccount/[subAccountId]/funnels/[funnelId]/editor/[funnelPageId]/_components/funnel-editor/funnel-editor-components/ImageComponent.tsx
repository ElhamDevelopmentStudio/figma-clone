/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useRef, useState, useEffect } from "react";
import { Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type EditorElement } from "@/lib/types/editor";
import { cn } from "@/lib/utils";
import { useEditor } from "@/providers/editor/editor-provider";

interface EditorImageProps {
  element: EditorElement;
}

const ImageComponent: React.FC<EditorImageProps> = ({ element }) => {
  const { dispatch, state: editorState } = useEditor();
  const { editor } = editorState;
  const imageRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: element },
    });
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  const handleResize = (e: MouseEvent) => {
    if (!isResizing || !imageRef.current) return;

    const image = imageRef.current;
    const newWidth = e.clientX - image.getBoundingClientRect().left;
    const newHeight = e.clientY - image.getBoundingClientRect().top;

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...element,
          styles: {
            ...element.styles,
            width: `${newWidth}px`,
            height: `${newHeight}px`,
          },
        },
      },
    });
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleResize);
      window.addEventListener("mouseup", handleResizeEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", handleResizeEnd);
    };
  }, [isResizing]);

  return (
    <div
      ref={imageRef}
      style={{
        ...element.styles,
        minWidth: "50px",
        minHeight: "50px",
      }}
      draggable={!editor.liveMode}
      onClick={handleOnClickBody}
      className={cn("p-0.5 w-full m-1 relative min-h-7 transition-all", {
        "border-blue-500 border-solid":
          editor.selectedElement.id === element.id,
        "border-dashed border": !editor.liveMode,
      })}
    >
      {editor.selectedElement.id === element.id && !editor.liveMode && (
        <Badge className="absolute -top-6 -left-0.5 rounded-none rounded-t-md">
          {editor.selectedElement.name}
        </Badge>
      )}
      {!Array.isArray(element.content) && element.content.src && (
        <img
          src={element.content.src}
          alt={element.content.alt as string}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}
      {editor.selectedElement.id === element.id && !editor.liveMode && (
        <>
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
            <Trash
              className="cursor-pointer"
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
          <div
            className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize"
            onMouseDown={handleResizeStart}
          />
        </>
      )}
    </div>
  );
};

export default ImageComponent;