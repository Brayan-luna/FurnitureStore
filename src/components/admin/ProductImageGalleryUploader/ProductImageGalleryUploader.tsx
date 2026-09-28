import React, { ChangeEvent, useId, useState } from 'react';
import { ImagePlus, Trash2, Upload, AlertCircle } from 'lucide-react';
import { compressImageFile } from '../../../utils/imageCompressor';
import './ProductImageGalleryUploader.css';

export interface ProductImageGalleryUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ProductImageGalleryUploader({ images, onChange }: ProductImageGalleryUploaderProps) {
  const inputId = useId();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files || []);
    event.currentTarget.value = '';
    if (!files.length) return;

    const invalidFile = files.find((file) => !file.type.startsWith('image/'));
    if (invalidFile) {
      setError('Selecciona únicamente archivos de imagen.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      const newImages = await Promise.all(files.map((file) => compressImageFile(file, 1000, 1000, 0.82)));
      onChange([...images, ...newImages]);
    } catch (cause) {
      console.error('Error al procesar imágenes del producto:', cause);
      setError('No se pudieron procesar todas las imágenes. Intenta con archivos más pequeños.');
    } finally {
      setIsProcessing(false);
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, imageIndex) => imageIndex !== index));
  };

  return (
    <section className="product-image-gallery-uploader" aria-label="Galería de imágenes del producto">
      <div className="product-image-gallery-heading">
        <div>
          <strong>Fotos del producto</strong>
          <p>La primera foto será la portada. Puedes seleccionar varias a la vez.</p>
        </div>
        <label className="product-image-gallery-add" htmlFor={inputId}>
          <ImagePlus size={17} />
          <span>{isProcessing ? 'Procesando…' : 'Agregar fotos'}</span>
        </label>
      </div>
      <input
        id={inputId}
        className="product-image-gallery-input"
        type="file"
        accept="image/*"
        multiple
        disabled={isProcessing}
        onChange={handleFiles}
        aria-label="Seleccionar una o varias fotos del producto"
      />

      {images.length > 0 ? (
        <div className="product-image-gallery-grid">
          {images.map((image, index) => (
            <figure className="product-image-gallery-item" key={`${index}-${image.slice(0, 32)}`}>
              <img src={image} alt={`Foto ${index + 1} del producto`} />
              {index === 0 && <figcaption>Portada</figcaption>}
              <button type="button" onClick={() => removeImage(index)} aria-label={`Quitar foto ${index + 1}`}>
                <Trash2 size={15} />
              </button>
            </figure>
          ))}
          <label className="product-image-gallery-add-tile" htmlFor={inputId}>
            <Upload size={20} />
            <span>Agregar</span>
          </label>
        </div>
      ) : (
        <label className="product-image-gallery-empty" htmlFor={inputId}>
          <Upload size={21} />
          <span>Toca para elegir fotos desde tu dispositivo</span>
        </label>
      )}

      {error && <p className="product-image-gallery-error"><AlertCircle size={15} />{error}</p>}
    </section>
  );
}
