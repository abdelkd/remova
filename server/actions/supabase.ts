'use server';

export const getBucketName = (id: string) => {
  return `user_${id}`;
};
