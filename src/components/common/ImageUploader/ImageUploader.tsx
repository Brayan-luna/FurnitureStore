import React, { useRef, useState, ChangeEvent, DragEvent } from 'react';
import { Upload, Image as ImageIcon, Trash2, RefreshCw, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { compressImageFile } from '../../../utils/imageCompressor';
import './ImageUploader.css';

export interface ImageUploaderProps {
  value: string;
  onChange: (imageUrl: string) => void;
  label?: string;
  placeholder?: string;
  previewHeight?: number;
}

export default function ImageUploader({
  value,
  onChange,
  label = 'Imagen del Producto',
  placeholder = 'https://ejemplo.com/foto.jpg o selecciona un archivo...',
  previewHeight = 200
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUrlMode, setIsUrlMode] = useState(false);

  // Abrir el selector nativo de archivos (PC o Celular)
  const triggerFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Procesar archivo seleccionado
  const handleFileProcess = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Por favor selecciona un archivo de imagen válido (JPEG, PNG, WebP).');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage(null);

      // Comprimir y redimensionar imagen en el cliente
      const compressedDataUrl = await compressImageFile(file, 1000, 1000, 0.82);
      onChange(compressedDataUrl);
    } catch (err) {
      console.error('Error al procesar la imagen:', err);
      setErrorMessage('No se pudo procesar la imagen. Intenta con otra foto.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileProcess(files[0]);
    }
    // Resetear valor del input para permitir subir la misma foto si se desea
    e.target.value = '';
  };

  // Soporte Drag & Drop
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileProcess(files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setErrorMessage(null);
  };

  return (
    <div className="image-uploader">
      {/* Etiqueta y alternador de modo */}
      <div className="image-uploader-label">
        <span>{label}</span>
        <button
          type="button"
          className="image-uploader-mode-toggle"
          onClick={() => setIsUrlMode(!isUrlMode)}
        >
          {isUrlMode ? 'Subir desde archivo / galería' : 'O escribir URL'}
        </button>
      </div>

      {/* Input de archivo nativo oculto (Abre selector en PC o galería/cámara en Celular) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {isUrlMode ? (
        <div>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="input-field"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
            />
          </div>
          {value && (
            <div className="image-uploader-preview-card" style={{ marginTop: '10px' }}>
              <div className="image-uploader-img-container">
                <img
                  src={value}
                  alt="Vista previa"
                  className="image-uploader-preview-img"
                  style={{ maxHeight: `${previewHeight}px` }}
                  onError={() => setErrorMessage('No se pudo cargar la imagen desde la URL ingresada.')}
                  onLoad={() => setErrorMessage(null)}
                />
              </div>
              <div className="image-uploader-bottom-bar">
                <span className="image-uploader-status-badge">✓ Vista previa URL</span>
                <div className="image-uploader-bottom-actions">
                  <button
                    type="button"
                    className="image-uploader-btn remove"
                    onClick={handleRemove}
                    title="Quitar foto"
                  >
                    <Trash2 size={14} /> <span>Quitar</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : value ? (
        /* Vista previa con opciones en la barra inferior para no tapar el logo */
        <div className="image-uploader-preview-card">
          <div className="image-uploader-img-container">
            <img
              src={value}
              alt="Vista previa"
              className="image-uploader-preview-img"
              style={{ maxHeight: `${previewHeight}px` }}
            />
          </div>

          <div className="image-uploader-bottom-bar">
            <span className="image-uploader-status-badge">✓ Imagen lista</span>
            <div className="image-uploader-bottom-actions">
              <button
                type="button"
                className="image-uploader-btn change"
                onClick={triggerFileDialog}
                title="Seleccionar otra imagen"
              >
                <RefreshCw size={14} /> <span>Cambiar</span>
              </button>
              <button
                type="button"
                className="image-uploader-btn remove"
                onClick={handleRemove}
                title="Quitar foto"
              >
                <Trash2 size={14} /> <span>Quitar</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Zona de carga amigable para hacer clic o arrastrar */
        <div
          className={`image-uploader-dropzone ${isDragActive ? 'drag-active' : ''} ${isProcessing ? 'processing' : ''}`}
          onClick={triggerFileDialog}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="image-uploader-icon-wrap">
            {isProcessing ? (
              <RefreshCw size={22} className="spin" />
            ) : (
              <Upload size={22} />
            )}
          </div>

          <div className="image-uploader-title">
            {isProcessing
              ? 'Optimizando foto...'
              : 'Toca aquí o arrastra para subir foto'}
          </div>

          <div className="image-uploader-subtitle">
            Abre la galería/cámara en tu celular o el explorador de tu PC
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="image-uploader-error">
          <AlertCircle size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
          {errorMessage}
        </div>
      )}
    </div>
  );
}
