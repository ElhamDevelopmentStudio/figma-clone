"use client";
import React, { useRef, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type EditorElement } from "@/lib/types/editor";
import { Trash } from "lucide-react";
import { useEditor } from "@/providers/editor/editor-provider";
import Recursive from "./Recursive";

interface EditorSectionProps {
  element: EditorElement;
}

const Section: React.FC<EditorSectionProps> = ({ element }) => {
  const { content, type } = element;
  const { state: editorState, dispatch } = useEditor();
  const { editor } = editorState;
  const sectionRef = useRef<HTMLElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
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
    if (!isResizing || !sectionRef.current) return;

    const section = sectionRef.current;
    const newWidth = e.clientX - section.getBoundingClientRect().left;
    const newHeight = e.clientY - section.getBoundingClientRect().top;

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
    <section
      ref={sectionRef}
      style={{
        ...element.styles,
        minWidth: "50px",
        minHeight: "50px",
      }}
      className={cn("relative p-4 transition-all", {
        "h-fit": type === "container",
        "h-full": type === "__body",
        "m-4": type === "container",
        "border-blue-500":
          editor.selectedElement.id === element.id && !editor.liveMode,
        "border-solid":
          editor.selectedElement.id === element.id && !editor.liveMode,
        "border-dashed border": !editor.liveMode,
      })}
      id="innerContainer"
      onClick={handleOnClickBody}
    >
      {editor.selectedElement.id === element.id && !editor.liveMode && (
        <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">
          {editor.selectedElement.name}
        </Badge>
      )}
      {Array.isArray(content) &&
        content.map((childElement) => (
          <Recursive key={childElement.id} element={childElement} />
        ))}
      {editor.selectedElement.id === element.id &&
        !editor.liveMode &&
        editor.selectedElement.type !== "__body" && (
          <>
            <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
              <Trash
                className="cursor-pointer w-4 h-4"
                onClick={handleDeleteElement}
              />
            </div>
            <div
              className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize"
              onMouseDown={handleResizeStart}
            />
          </>
        )}
    </section>
  );
};

export default Section;