"use client";
import React, { useRef, useState, useEffect } from "react";
import { Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { EditorElement } from "@/lib/types/editor";
import { cn } from "@/lib/utils";
import { formatTextOnKeyboard } from "@/lib/editor/utils";
import { useEditor } from "@/providers/editor/editor-provider";

interface EditorTextProps {
  element: EditorElement;
}

const EditorText: React.FC<EditorTextProps> = ({ element }) => {
  const { dispatch, state: editorState } = useEditor();
  const { editor } = editorState;
  const spanRef = useRef<HTMLSpanElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  const handleClickOnBody = (event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    formatTextOnKeyboard(event, editor, dispatch);
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
    if (!isResizing || !spanRef.current) return;

    const span = spanRef.current;
    const newWidth = e.clientX - span.getBoundingClientRect().left;
    const newHeight = e.clientY - span.getBoundingClientRect().top;

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
      className={cn(
        "p-0.5 w-full m-1 relative text-base min-h-7 transition-all",
        {
          "border-blue-500 border-solid":
            editor.selectedElement.id === element.id,
          "border-dashed border": !editor.liveMode,
        }
      )}
      style={element.styles}
      onClick={handleClickOnBody}
    >
      {editor.selectedElement.id === element.id && !editor.liveMode && (
        <Badge className="absolute -top-6 -left-0.5 rounded-none rounded-t-md">
          {editor.selectedElement.name}
        </Badge>
      )}
      <span
        ref={spanRef}
        contentEditable={!editor.liveMode}
        className="outline-none inline-block"
        style={{
          minWidth: "50px",
          minHeight: "20px",
          width: element.styles.width || "auto",
          height: element.styles.height || "auto",
        }}
        onKeyDown={onKeyDown}
        onBlur={(e) => {
          const spanElement = e.target as HTMLSpanElement;
          dispatch({
            type: "UPDATE_ELEMENT",
            payload: {
              elementDetails: {
                ...element,
                content: {
                  innerText: spanElement.innerText,
                },
              },
            },
          });
        }}
      >
        {!Array.isArray(element.content) && element.content.innerText}
      </span>
      {editor.selectedElement.id === element.id &&
        !editor.liveMode &&
        !Array.isArray(element.content) &&
        element.content.innerText && (
          <>
            <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
              <Trash
                className="cursor-pointer w-4 h-4"
                onClick={handleDeleteElement}
              />
            </div>
            <div
              className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize"
              onMouseDown={handleResizeStart}
            />
          </>
        )}
    </div>
  );
};

export default EditorText;