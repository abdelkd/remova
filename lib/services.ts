import { Client } from '@gradio/client';

import { env } from '@/lib/env/server';
import { urlSchema } from '@/schemas';

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

  const imageBlob = await fetch(resultImage.url).then((r) => r.blob());
  return imageBlob;
};

// TODO: use streaming
export const removeBgReplicate = async (imageSource: string) => {
  const url = 'https://api.replicate.com/v1/predictions';

  if (urlSchema.safeParse(imageSource).success === false) {
    return {
      data: null,
      error: 'A valid url must be passed',
    };
  }

  const payload = {
    version: 'f74986db0355b58403ed20963af156525e2891ea3c2d499bfbfb2a28cd87c5d7',
    input: {
      image: imageSource,
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
        Prefer: 'wait',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // console.log('Prediction created:', data);

    return {
      data: { url: data['output'] },
      error: null,
    };
  } catch (error) {
    console.error('Error creating prediction:', error);
    return {
      data: null,
      error,
    };
  }
};
