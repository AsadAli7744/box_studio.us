import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { fileKind, isImageType, validateIncomingFile } from '../utils/files';

const RequestContext = createContext(null);

export const initialQuote = {
  productSlug: '',
  customDesign: false,
  length: '',
  width: '',
  height: '',
  unit: 'mm',
  dimensionsUnsure: false,
  quantity: '',
  quantityGuidance: false,
  materialId: '',
  finishIds: [],
  insertId: 'none',
  notes: '',
  files: [],
  name: '',
  email: '',
  company: '',
  phone: '',
  step: 'box',
  prepared: false,
};

function revokeFile(entry) {
  if (entry?.previewUrl) URL.revokeObjectURL(entry.previewUrl);
}

export function RequestProvider({ children }) {
  const [quote, setQuote] = useState(initialQuote);
  const filesRef = useRef([]);

  useEffect(() => {
    filesRef.current = quote.files;
  }, [quote.files]);

  useEffect(() => {
    return () => {
      filesRef.current.forEach(revokeFile);
    };
  }, []);

  const updateQuote = useCallback((patch) => {
    setQuote((current) => ({
      ...current,
      ...(typeof patch === 'function' ? patch(current) : patch),
    }));
  }, []);

  const addFiles = useCallback((fileList) => {
    const incoming = Array.from(fileList || []);
    const errors = [];
    const accepted = [];
    let count = filesRef.current.length;
    incoming.forEach((file) => {
      const message = validateIncomingFile(file, count);
      if (message) {
        errors.push(message);
        return;
      }
      count += 1;
      const kind = fileKind(file);
      accepted.push({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        size: file.size,
        type: kind,
        previewUrl: isImageType(kind) ? URL.createObjectURL(file) : '',
      });
    });
    if (accepted.length) {
      filesRef.current = [...filesRef.current, ...accepted];
      setQuote((current) => ({
        ...current,
        files: [...current.files, ...accepted],
        prepared: false,
      }));
    }
    return errors;
  }, []);

  const removeFile = useCallback((id) => {
    setQuote((current) => {
      const target = current.files.find((file) => file.id === id);
      revokeFile(target);
      const files = current.files.filter((file) => file.id !== id);
      filesRef.current = files;
      return { ...current, files, prepared: false };
    });
  }, []);

  const resetQuote = useCallback(() => {
    filesRef.current.forEach(revokeFile);
    filesRef.current = [];
    setQuote({
      ...initialQuote,
      finishIds: [],
      files: [],
    });
  }, []);

  const value = useMemo(
    () => ({ quote, updateQuote, addFiles, removeFile, resetQuote }),
    [quote, updateQuote, addFiles, removeFile, resetQuote]
  );

  return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>;
}

export function useRequest() {
  const value = useContext(RequestContext);
  if (!value) throw new Error('useRequest must be used within RequestProvider');
  return value;
}
