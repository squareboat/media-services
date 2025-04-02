export interface ImageVariant {
  width: number;
  height: number;
  path: string;
  format?: string;
}

export interface VideoVariant {
  path: string;
  format?: string;
  quality?: "HIGH" | "BALANCED" | "COMPRESS";
  dimensions?: string;
}

export interface CompressImageResponse {
  status: "success" | "error";
  msg: string;
  variants?: ImageVariant[];
  dimensions?: {
    originalWidth: number;
    originalHeight: number;
    originalChannels: number;
  };
  dominantColor?: {
    r: number;
    g: number;
    b: number;
  };
}

export interface VideoCompressInputs {
  key?: string;
  contentType?: string;
}
