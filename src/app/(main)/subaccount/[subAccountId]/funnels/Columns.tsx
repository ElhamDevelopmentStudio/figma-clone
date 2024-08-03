"use client";
import React, { useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { FunnelsForSubAccount } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FaviconModalProps {
  src: string;
  onClose: () => void;
}

const FaviconModal: React.FC<FaviconModalProps> = ({ src, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded-lg max-w-[90%] max-h-[90%]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt="Favicon"
          width={256}
          height={256}
          className="object-contain"
        />
      </div>
    </div>
  );
};

interface FaviconCellProps {
  favicon: string | undefined;
}

const FaviconCell: React.FC<FaviconCellProps> = ({ favicon }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <div
        className="w-8 h-8 relative  flex items-center justify-center ml-4"
        onClick={handleClick}
      >
        {favicon ? (
          <span className="text-sm text-black p-2 bg-white dark:text-white cursor-pointer dark:bg-gray-700 rounded-md">
            Favicon
          </span>
        ) : (
          <span className="text-sm text-gray-500 cursor-default">
            No Favicon
          </span>
        )}
      </div>
      {favicon && isModalOpen && (
        <FaviconModal src={favicon} onClose={handleClose} />
      )}
    </>
  );
};

export const columns: ColumnDef<FunnelsForSubAccount>[] = [
  {
    accessorKey: "favicon",
    header: "Favicon",
    cell: ({ row }) => {
      const favicon = row.getValue("favicon") as string | undefined;
      return <FaviconCell favicon={favicon} />;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <Link
          className="flex gap-2 items-center"
          href={`/subaccount/${row.original.subAccountId}/funnels/${row.original.id}`}
        >
          {row.getValue("name")}
          <ExternalLink size={15} />
        </Link>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => {
      const date = ` ${row.original.updatedAt.toDateString()} ${row.original.updatedAt.toLocaleTimeString()} `;
      return <span className="text-muted-foreground">{date}</span>;
    },
  },
  {
    accessorKey: "published",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.published;
      return status ? (
        <Badge variant={"default"}>Live - {row.original.subDomainName}</Badge>
      ) : (
        <Badge variant={"secondary"}>Draft</Badge>
      );
    },
  },
];
