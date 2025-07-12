export interface DocumentosPDF {
  id?: string;
  nome: string;
  arquivo_1_base64: string;
  arquivo_2_base64?: string;
  arquivo_3_base64?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface DocumentosPDFInputValues {
  nome: string;
  arquivo_1_base64: string;
  arquivo_2_base64?: string;
  arquivo_3_base64?: string;
}

export interface GetDocumentosPDFResponse {
  documento: DocumentosPDF;
  status_code: number;
}

export interface ListDocumentosPDFResponse {
  documentos: DocumentosPDF[];
  page: number;
  perpage: number;
  lastPage: number;
  totalCount: number;
}

export interface CreateDocumentosPDFData {
  nome: string;
  arquivo_1_base64: string;
  arquivo_2_base64?: string;
  arquivo_3_base64?: string;
}

export interface DocumentosPDFResponse {
  documentos: DocumentosPDF[];
  page: number;
  perpage: number;
  totalCount: number;
  lastPage: number;
}
