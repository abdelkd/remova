import { Client } from '@gradio/client';
import { env } from '@/lib/env/server';

type RemoveBGFn = (
  image_source: string,
  filename?: string | undefined,
) => Promise<File | null>;

type GradioResultData = {
  path: string;
  url: string;
  size?: number;
  orig_name?: string;
  mime_type?: string;
  is_stream: boolean;
};

export const removeBgGradio: RemoveBGFn = async (
  image_source,
  filename = 'image-bg-removed.png',
) => {
  const app = await Client.connect(env.GRADIO_API_URL);
  const result = await app.predict('/process_image_1', {
    image_source,
  });

  const resultData = result.data as GradioResultData[][];
  const resultImage = resultData[0][0];

  const imageBlob = await fetch(resultImage.url).then((r) => r.blob());
  const file = new File([imageBlob], filename, { type: 'image/png' });

  return file;
};

// TODO: implement replicate function
export const removeBgReplicate: RemoveBGFn = async (
  image_source,
  filename = 'image-bg-removed.png',
) => {
  void filename;
  void image_source;
  return null;
};
