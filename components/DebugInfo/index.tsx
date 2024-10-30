'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DebugInfoProps {
  error: string | null;
  tvIdentifier: string;
  isTvBrowser: boolean;
}

export function DebugInfo({ error, tvIdentifier, isTvBrowser }: DebugInfoProps) {
  const [ipAddress, setIpAddress] = useState<string | null>(null);

  useEffect(() => {
    const getIpAddress = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error('Erro ao obter endereço IP:', error);
        setIpAddress('Não foi possível obter o IP');
      }
    };

    getIpAddress();
  }, []);

  return (
    <Card className="mt-4 bg-gray-100 text-gray-800">
      <CardHeader>
        <CardTitle className="text-lg">Informações de Depuração</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          <li><strong>Erro de Autenticação:</strong> {error || 'Nenhum erro'}</li>
          <li><strong>Identificador da TV:</strong> {tvIdentifier || 'Não disponível'}</li>
          <li><strong>É navegador de TV:</strong> {isTvBrowser ? 'Sim' : 'Não'}</li>
          <li><strong>Endereço IP:</strong> {ipAddress || 'Carregando...'}</li>
          <li><strong>User Agent:</strong> {navigator.userAgent}</li>
        </ul>
      </CardContent>
    </Card>
  )
}