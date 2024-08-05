"use client";
import { useModal } from "@/providers/ModalProvider";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Subtitle } from "@tremor/react";

type Props = {
  title: string;
  subheading: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  scrollShadow?: boolean;
};

const CustomModal = ({
  children,
  defaultOpen,
  subheading,
  title,
  scrollShadow,
}: Props) => {
  const { isOpen, setClose } = useModal();
  return (
    <Dialog open={isOpen || defaultOpen} onOpenChange={setClose}>
      <DialogContent className="bg-card max-w-xl">
        <ScrollArea scrollShadow={scrollShadow} className="md:max-h-[700px]">
          <div className="flex flex-col gap-4">
            <DialogHeader className="text-left">
              <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
              <DialogDescription>{subheading}</DialogDescription>
            </DialogHeader>
            {children}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
