"use client";

import { CheckCircle2, Clock } from "lucide-react";
import { useEffect, useState } from "react";

export default function DocumentsSent({ status }: { status: number }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (status > 5) {
    return (
      <div className="min-h-screen bg-sky-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl w-full text-center">
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="Logo" className="h-24 w-auto" />
          </div>

          <div className="flex flex-col items-center space-y-6">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>

            <h1 className="text-3xl font-bold text-gray-800">
              Documentos Recebidos com Sucesso!
            </h1>

            <p className="text-gray-600 text-lg">
              Seus documentos foram recebidos e serão analisados. Em breve
              entraremos em contato para confirmar o agendamento.
            </p>

            <div className="bg-blue-50 p-6 rounded-lg w-full">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">
                Próximos Passos
              </h2>
              <ul className="text-left space-y-3 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Análise dos documentos enviados
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Confirmação do agendamento
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Envio de instruções detalhadas
                </li>
              </ul>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Em caso de dúvidas, entre em contato com nossa equipe de suporte.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl w-full text-center">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="h-24 w-auto" />
        </div>

        <div className="flex flex-col items-center space-y-6">
          <div className="bg-yellow-100 p-4 rounded-full">
            <Clock className="h-16 w-16 text-yellow-500" />
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            Aguarde a Aprovação
          </h1>

          <p className="text-gray-600 text-lg">
            Seu pedido ainda está em aguardando aprovação. Assim que for
            aprovado, você receberá um e-mail com instruções para enviar seus
            documentos.
          </p>

          <div className="bg-blue-50 p-6 rounded-lg w-full">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              O que acontece agora?
            </h2>
            <ul className="text-left space-y-3 text-gray-700">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Análise e aprovação do orçamento
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Envio de e-mail com link para envio de documentos
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Confirmação do agendamento
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg w-full">
            <p className="text-sm text-gray-600">
              <strong>Importante:</strong> Não envie documentos antes de receber
              o e-mail de confirmação.
            </p>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Em caso de dúvidas, entre em contato com nossa equipe de suporte.
          </p>
        </div>
      </div>
    </div>
  );
}
