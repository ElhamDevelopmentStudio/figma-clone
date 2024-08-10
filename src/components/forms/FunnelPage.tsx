"use client";
import React, { useEffect } from "react";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";

import { Button } from "../ui/button";
import Loading from "../global/Loading";
import { useToast } from "../ui/use-toast";
import { FunnelPage } from "@prisma/client";
import { FunnelPageSchema } from "@/lib/types";
import {
  deleteFunnelePage,
  getFunnels,
  saveActivityLogsNotification,
  upsertFunnelPage,
} from "@/lib/queries";
import { useRouter } from "next/navigation";
import { v4 } from "uuid";
import { CopyPlusIcon, Info, Loader2, Trash } from "lucide-react";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Dialog, DialogPortal } from "../ui/dialog";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface CreateFunnelPageProps {
  defaultData?: FunnelPage;
  funnelId: string;
  order: number;
  subaccountId: string;
}

const CreateFunnelPage: React.FC<CreateFunnelPageProps> = ({
  defaultData,
  funnelId,
  order,
  subaccountId,
}) => {
  const { toast } = useToast();
  const router = useRouter();
  //ch
  const form = useForm<z.infer<typeof FunnelPageSchema>>({
    resolver: zodResolver(FunnelPageSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      pathName: "",
    },
  });

  const isLoading = form.formState.isLoading;

  useEffect(() => {
    if (defaultData) {
      form.reset({ name: defaultData.name, pathName: defaultData.pathName });
    }
  }, [defaultData]);

  const onSubmit = async (values: z.infer<typeof FunnelPageSchema>) => {
    if (order !== 0 && !values.pathName)
      return form.setError("pathName", {
        message:
          "Pages other than the first page in the funnel require a path name example 'secondstep'.",
      });
    try {
      const response = await upsertFunnelPage(
        subaccountId,
        {
          ...values,
          id: defaultData?.id || v4(),
          order: defaultData?.order || order,
          pathName: values.pathName || "",
        },
        funnelId
      );

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a funnel page | ${response?.name}`,
        subAccountId: subaccountId,
      });

      toast({
        title: "Success",
        description: "Saves Funnel Page Details",
      });
      router.refresh();
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Could Save Funnel Page Details",
      });
    }
  };

  const handleDelete = async () => {
    const response = await deleteFunnelePage(defaultData!.id);
    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Deleted a funnel page | ${response?.name}`,
      subAccountId: subaccountId,
    });
    toast({
      title: "Success",
      description: "Funnel page has been deleted.",
    });
    router.refresh();
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle>Funnel Page</CardTitle>
          <CardDescription>
            Funnel pages are flow in the order they are created by default. You
            can move them around to change their order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                disabled={form.formState.isSubmitting}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                // disabled if it's the first page
                disabled={form.formState.isSubmitting || order === 0}
                control={form.control}
                name="pathName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="inline-flex items-center gap-2">
                      Path Name
                      {order === 0 && (
                        <Badge
                          variant="secondary"
                          className="inline-flex gap-2 items-center"
                        >
                          Default
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-3 h-3 cursor-default" />
                            </TooltipTrigger>
                            <TooltipContent>
                              This is default path name for this funnel
                            </TooltipContent>
                          </Tooltip>
                        </Badge>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Path for the page"
                        {...field}
                        value={field.value?.toLowerCase()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end w-full items-center gap-2">
                {defaultData?.id && (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-destructive text-destructive hover:bg-destructive"
                          disabled={isLoading}
                          type="button"
                          size="icon"
                          onClick={handleDelete}
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash className="w-4 h-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete Funnel Page</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={form.formState.isSubmitting}
                          type="button"
                          onClick={async () => {
                            const response = await getFunnels(subaccountId);
                            const lastFunnelPage = response.find(
                              (funnel) => funnel.id === funnelId
                            )?.FunnelPages.length;

                            await upsertFunnelPage(
                              subaccountId,
                              {
                                ...defaultData,
                                id: v4(),
                                order: lastFunnelPage ? lastFunnelPage : 0,
                                visits: 0,
                                name: `${defaultData.name} Copy`,
                                pathName: `${defaultData.pathName}copy`,
                                content: defaultData.content,
                              },
                              funnelId
                            );
                            toast({
                              title: "Success",
                              description: "Saves Funnel Page Details",
                            });
                            router.refresh();
                          }}
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CopyPlusIcon className="w-4 h-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Duplicate Funnel Page</TooltipContent>
                    </Tooltip>
                  </>
                )}
                <Button
                  className="w-22 self-end"
                  disabled={form.formState.isSubmitting}
                  isLoading={isLoading}
                  type="submit"
                >
                  Save page
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default CreateFunnelPage;
