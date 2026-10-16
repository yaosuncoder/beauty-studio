
export type BaseLayer = {
  id: string;
  x: number;
  y: number;
  rotation: number;
  opacity: number;
};

export type TextLayer = BaseLayer & {
  type: "text";
  text: string;
  fontSize: number;
  fill: string;
};

export type ImageLayer = BaseLayer & {
  type: "image";
  assetId: string;
  src: string;
  width: number;
  height: number;
};

export type EditorLayer = TextLayer | ImageLayer;
