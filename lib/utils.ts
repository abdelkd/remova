import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getBucketName = (id: string) => {
  return `user_${id}`;
};

export function fileToBase64(file: File) {
  return new Promise((res, rej) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      console.log({ base64String });
      res(base64String);
    };

    reader.onerror = () => rej();

    reader.readAsDataURL(file);
  });
}
