'use client';

import { useRef, useState, ChangeEventHandler } from "react";
import { fileToBase64 } from '@/lib/utils';

export const useUploadFile = () => {
  const [file, setFile] = useState<File | undefined>(undefined)
  const [base64String, setBase64String] = useState<string | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null)

  const handleOnFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files
    if (!files) return;
    if (files?.length === 0) return;

    const firstFile = files[0]

    fileToBase64(firstFile).then((res) => {
      const extension = firstFile.name.split('.').at(-1)
      const result = `data:image/${extension};base64,${res}`
      setBase64String(result)
      setFile(firstFile)
    })

  }

  const uploadFile = () => {
    inputFileRef.current?.click()
  }

  const inputElement = (<input ref={inputFileRef} type="file" hidden onChange={handleOnFileChange} />)

  return { file, inputFileRef, uploadFile, inputElement, base64String }
}
