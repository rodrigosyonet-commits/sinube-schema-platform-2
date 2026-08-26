
export interface FieldSchema {
  name: string;
  type: string;

  /**
   * Detectado posteriormente
   */
  indexed?: boolean;

  /**
   * Ejemplo de valor
   */
  sample?: string | number | boolean | null;
}

export interface EntitySchema {
  entity: string;

  fields: FieldSchema[];

  /**
   * Cantidad de campos
   */
  fieldCount?: number;

  /**
   * Cantidad de registros de muestra
   */
  sampleCount?: number;
}

export interface RelationshipSchema {
  fromEntity: string;

  toEntity: string;

  keys: string[];

  confidence: number;
}

export interface GraphNode {
  id: string;

  label: string;

  fieldCount: number;
}

export interface GraphEdge {
  source: string;

  target: string;

  confidence?: number;
}

export interface GraphSchema {
  nodes: GraphNode[];

  edges: GraphEdge[];
}
