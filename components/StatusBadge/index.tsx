'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  FileTextIcon,
  MagnifyingGlassIcon,
  Pencil2Icon,
  CrossCircledIcon,
  MinusCircledIcon,
} from '@radix-ui/react-icons';
import { Printer } from 'lucide-react';

type StatusType = 'lime' | 'amber' | 'red';

interface StatusBadgeProps {
  label: string;
  status: StatusType;
  icon: React.ReactNode;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ label, status, icon }) => {
  const statusColors = {
    lime: 'bg-lime-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          className="flex items-center gap-2 p-2 cursor-pointer"
        >
          {icon}
          <span className="relative flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${statusColors[status]} opacity-75`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${statusColors[status]}`}
            ></span>
          </span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="top" align="center" className="bg-gray-800 text-white p-2 rounded-md shadow-md">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default function StatusBadges() {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 w-38 rounded-lg">
        <StatusBadge
          label="Emissão"
          status="lime"
          icon={<FileTextIcon className="h-4 w-4" />}
        />
        <StatusBadge
          label="Consulta"
          status="lime"
          icon={<MagnifyingGlassIcon className="h-4 w-4" />}
        />
        <StatusBadge
          label="Impressão"
          status="amber"
          icon={<Printer className="h-4 w-4 stroke-[1px]" />}
        />
        <StatusBadge
          label="C. Correção"
          status="lime"
          icon={<Pencil2Icon className="h-4 w-4" />}
        />
        <StatusBadge
          label="Cancelar"
          status="red"
          icon={<CrossCircledIcon className="h-4 w-4" />}
        />
        <StatusBadge
          label="Inativação"
          status="lime"
          icon={<MinusCircledIcon className="h-4 w-4" />}
        />
      </div>
    </TooltipProvider>
  );
}
