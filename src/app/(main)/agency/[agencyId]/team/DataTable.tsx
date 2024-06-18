"use client";

import React from "react";
import { Table, TableBody } from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useModal } from "@/providers/ModalProvider";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>;
  data: TData[];
  filterValue: string;
  actionButtonText?: React.ReactNode;
  modalChildren?: React.ReactNode;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  filterValue,
  actionButtonText,
  modalChildren,
}: DataTableProps<TData, TValue>) {
  const { setOpen } = useModal();
}
