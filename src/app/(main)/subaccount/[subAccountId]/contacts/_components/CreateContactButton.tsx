"use client";
import CustomModal from "@/components/global/CustomModal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/ModalProvider";
import React from "react";
import ContactUserForm from "../../../../../../components/forms/ContactUserForm";

type Props = {
  subAccountId: string;
};

const CreateContactButton = ({ subAccountId }: Props) => {
  const { setOpen } = useModal();

  const handleCreateContact = () => {
    setOpen(
      <CustomModal
        title="Create or Update Contact Information"
        subheading="Contacts are like customers."
      >
        <ContactUserForm subAccountId={subAccountId} />
      </CustomModal>
    );
  };

  return <Button onClick={handleCreateContact}>Create Contact</Button>;
};

export default CreateContactButton;
