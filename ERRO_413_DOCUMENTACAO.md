# Solução para Erro 413 - Request Entity Too Large

## Problema

O erro 413 (Request Entity Too Large) ocorre quando o payload das requisições excede o limite máximo permitido pelo servidor. Isso acontece especialmente na rota `/api/documentos-pdf` quando enviamos arquivos PDF convertidos em base64.

## Causa

- Arquivos PDF convertidos em base64 ficam ~33% maiores que o arquivo original
- O Next.js tem um limite padrão de 4MB para o body das requisições
- Múltiplos arquivos PDF podem facilmente exceder esse limite

## Soluções Implementadas

### 1. Configuração do Next.js (`next.config.ts`)

```typescript
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "4.5mb", // Limite para 4.5MB
    },
  },
  api: {
    bodyParser: {
      sizeLimit: "4.5mb",
    },
  },
};
```

### 2. Validação no Backend (`src/app/api/documentos-pdf/route.ts`)

- Verifica o `Content-Length` do request
- Valida tamanho total dos arquivos base64
- Retorna erro 413 com mensagem específica se exceder limites

### 3. Validação no Frontend (`src/app/anexos-padrao/page.tsx`)

- Valida tamanho do arquivo original (máximo 1.2MB)
- Valida tamanho do base64 após conversão (máximo 2MB por arquivo)
- Mostra feedback ao usuário sobre o tamanho do arquivo

### 4. Tratamento de Erro no Hook (`src/app/hooks/documentos-pdf/useDocumentosPDF.ts`)

- Detecta erro 413 especificamente
- Mostra mensagem amigável ao usuário
- Fornece dicas para resolver o problema

### 5. Configuração do Vercel (`vercel.json`)

- Define timeout de 60 segundos para rotas específicas
- Configura headers CORS se necessário

## Limites Definidos


- **Arquivo individual**: 1.2MB
- **Total em base64**: 4.5MB
- **Timeout**: 60 segundos
- **Suporte**: 3 arquivos de 1.2MB cada

## Dicas para Usuários

1. Use ferramentas online para compactar PDFs antes do upload

2. Cada arquivo pode ter até 1.2MB (total de 4.5MB)
3. Suporte para até 3 arquivos de 1.2MB cada

4. Considere dividir documentos muito grandes em partes menores

## Monitoramento

- Logs detalhados no console para debugar problemas
- Mensagens de erro específicas para cada tipo de problema
- Feedback visual para o usuário sobre o progresso do upload

## Testes

Para testar a solução:


1. Tente enviar um arquivo PDF maior que 1.2MB
2. Tente enviar múltiplos arquivos que somem mais de 4.5MB
3. Teste com 3 arquivos de 1.2MB cada (deve funcionar)
ivos de 10MB cada (deve funcionar)
4. Verifique se as mensagens de erro são exibidas corretamente
5. Confirme que arquivos dentro dos limites funcionam normalmente
