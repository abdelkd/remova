import { Client } from '@gradio/client';
import Replicate from 'replicate';

import { env } from '@/lib/env/server';
import { RequestInitExtended } from '@/types';

type FileBody = File | ArrayBuffer | Blob | ReadableStream<Uint8Array>;

type RemoveBGFn = (image_source: string | File) => Promise<FileBody | null>;

type GradioResultData = {
  path: string;
  url: string;
  size?: number;
  orig_name?: string;
  mime_type?: string;
  is_stream: boolean;
};

export const removeBgGradio: RemoveBGFn = async (image_source) => {
  const app = await Client.connect(env.GRADIO_API_URL);
  const result = await app.predict('/process_image_1', {
    image_source,
  });

  const resultData = result.data as GradioResultData[][];
  const resultImage = resultData[0][0];

  const params: RequestInitExtended = {
    duplex: 'half',
  };
  const imageBlob = await fetch(resultImage.url, params).then((r) => r.blob());
  return imageBlob;
};

export const removeBgReplicate: RemoveBGFn = async (image) => {
  const replicate = new Replicate();
  const input = {
    image,
  };

  const output = (await replicate.run(
    'men1scus/birefnet:f74986db0355b58403ed20963af156525e2891ea3c2d499bfbfb2a28cd87c5d7',
    { input },
  )) as ReadableStream<Uint8Array>;

  return output;
};
