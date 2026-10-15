
export type Point = {
  x: number;
  y: number;
};

export type BaseLayer = {
  id: string;
  x: number;
  y: number;
  rotation: number;
};

export type TextLayer = BaseLayer & {
  type: "text";
  text: string;
  fontSize: number;
  fill: string;
};

export type ImageLayer = BaseLayer & {
  type: "image";
  src: string;
  width: number;
  height: number;
};

export type EditorLayer = TextLayer | ImageLayer;
