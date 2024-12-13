// src/client/interfaces.ts
export interface WhatsAppProps {
  collectionName?: string;
  data?: any[];
  loading?: boolean;
  block?: {
    title?: string;
  };
}

export interface BlockAssociationContext {
  block: {
    title?: string;
  };
  updateBlock: (data: any) => void;
  removeBlock: () => void;
}