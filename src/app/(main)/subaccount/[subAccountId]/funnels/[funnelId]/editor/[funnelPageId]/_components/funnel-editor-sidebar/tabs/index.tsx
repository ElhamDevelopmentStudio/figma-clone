import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Plus, SettingsIcon, SquareStackIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {};

const TabList = (props: Props) => {
  return (
    <TooltipProvider>
      <TabsList className="flex items-center flex-col justify-evenly w-full bg-transparent h-fit gap-4">
        <Tooltip>
          <TooltipTrigger>
            <TabsTrigger
              value="Settings"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted relative"
            >
              <SettingsIcon />
            </TabsTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Settings</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <TabsTrigger
              value="Components"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted relative"
            >
              <Plus />
            </TabsTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add Components</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <TabsTrigger
              value="Layers"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted relative"
            >
              <SquareStackIcon />
            </TabsTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Layers</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <TabsTrigger
              value="Media"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted relative"
            >
              <Database />
            </TabsTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Media</p>
          </TooltipContent>
        </Tooltip>
      </TabsList>
    </TooltipProvider>
  );
};

export default TabList;
