"use client";
import { useModal } from "@/providers/ModalProvider";
import React from "react";
import { Button } from "../ui/button";
import CustomModal from "../global/CustomModal";
import UploadMediaForm from "../forms/UploadMediaForm";

type Props = {
  subAccountId: string;
};

const MediaUploadButton = ({ subAccountId }: Props) => {
  const { isOpen, setOpen, setClose } = useModal();
  return (
    <Button
      onClick={() => {
        setOpen(
          <CustomModal
            title="Upload Media"
            subheading="Upload a file to your media bucket."
          >
            <UploadMediaForm subccountId={subAccountId} />
          </CustomModal>
        );
      }}
    >
      Upload
    </Button>
  );
};

export default MediaUploadButton;
