"use client";

import React from "react";

import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";
import { type EditorElement } from "@/lib/types/editor";
import { useEditor } from "@/providers/editor/editor-provider";
import Recursive from "./Recursive";

interface ThreeColumnsProps {
  element: EditorElement;
}

const ThreeColumns: React.FC<ThreeColumnsProps> = ({ element }) => {
  const { id, content, type } = element;
  const { state: editorState, dispatch } = useEditor();
  const { editor } = editorState;

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  return (
    <div
      style={element.styles}
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
    </div>
  );
};

export default ThreeColumns;
