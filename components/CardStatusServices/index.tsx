import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, User } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface IncidentCardProps {
  service_name: string;
  start_time: string;
  end_time: string;
  duration: number;
  cause: string;
  downtime_status: string;
  impact_description: string;
  resolution_action: string;
  resolution_time: string;
  resolution_by: string;
  preventive_action: string;
  preventive_time: string;
  preventive_by: string;
  created_at: string;
  updated_at: string;
}

export default function IncidentCard({
  service_name,
  start_time,
  end_time,
  duration,
  cause,
  downtime_status,
  impact_description,
  resolution_action,
  resolution_time,
  resolution_by,
  preventive_action,
  preventive_time,
  preventive_by,
  created_at,
  updated_at,
}: IncidentCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{service_name}</CardTitle>
          <Badge
            variant="default"
            className={
              downtime_status === "Resolved"
                ? "bg-lime-500 text-xs"
                : "bg-rose-500 text-xs"
            }
          >
            {downtime_status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Início: {formatDate(start_time)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Fim: {formatDate(end_time)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Duração: {duration ? `${duration} minutos` : "N/A"}</span>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="detalhes">
          <AccordionTrigger className="hover:no-underline">Detalhes</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Causa:</h3>
                  <p>{cause}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Impacto:</h3>
                  <p>{impact_description}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Resolução:</h3>
                  <p>{resolution_action}</p>
                  <div className="mt-2 flex items-center space-x-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{resolution_by}</span>
                    <Clock className="h-4 w-4 ml-2" />
                    <span>{formatDate(resolution_time)}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Ação Preventiva:</h3>
                  <p>{preventive_action}</p>
                  <div className="mt-2 flex items-center space-x-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{preventive_by}</span>
                    <Clock className="h-4 w-4 ml-2" />
                    <span>{formatDate(preventive_time)}</span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <span>Criado em: {formatDate(created_at)}</span>
        <span>Atualizado em: {formatDate(updated_at)}</span>
      </CardFooter>
    </Card>
  );
}
