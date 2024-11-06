"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import IncidentCard from "@/components/CardStatusServices";

interface Incident {
  id: string;
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
  preventive_action: string | null;
  preventive_time: string | null;
  preventive_by: string | null;
  created_at: string;
  updated_at: string;
}

export default function Incident() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIncidents() {
      try {
        const response = await fetch('/api/downtime');
        if (!response.ok) {
          throw new Error('Failed to fetch incidents');
        }
        const data = await response.json();
        setIncidents(data);
      } catch (err) {
        setError('Failed to load incidents. Please try again later.');
        console.error('Error fetching incidents:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchIncidents();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
        className="h-full"
      />
      <div className="flex-1 overflow-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Incidentes</h1>
        {isLoading ? (
          <p>Carregando incidentes...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {incidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                service_name={incident.service_name}
                start_time={incident.start_time}
                end_time={incident.end_time}
                duration={incident.duration}
                cause={incident.cause}
                downtime_status={incident.downtime_status}
                impact_description={incident.impact_description}
                resolution_action={incident.resolution_action}
                resolution_time={incident.resolution_time}
                resolution_by={incident.resolution_by}
                preventive_action={incident.preventive_action ?? ''}
                preventive_time={incident.preventive_time ?? ''}
                preventive_by={incident.preventive_by ?? ''}
                created_at={incident.created_at}
                updated_at={incident.updated_at}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}