import React, { useState, ChangeEvent } from 'react';
import { Download, RotateCcw, Check, AlertTriangle } from 'lucide-react';
import { useProducts } from '../../../context/ProductContext';
import { useBusiness } from '../../../context/BusinessContext';
import './BackupRestore.css';

export default function BackupRestore() {
  const { products, categories, addons, resetAllProducts } = useProducts();
  const { business, updateBusiness, resetBusiness } = useBusiness();

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Exportar configuración completa como JSON
  const handleExport = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      business,
      categories,
      products,
      addons
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `catalogo_muebles_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setMessage({ type: 'success', text: '¡Archivo JSON exportado exitosamente!' });
  };

  // Importar desde archivo JSON
  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (!e.target.files?.[0]) return;

    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.business) updateBusiness(parsed.business);
        if (parsed.products) {
          localStorage.setItem('furniture_store_products_v1', JSON.stringify(parsed.products));
        }
        if (parsed.categories) {
          localStorage.setItem('furniture_store_categories_v1', JSON.stringify(parsed.categories));
        }
        if (parsed.addons) {
          localStorage.setItem('furniture_store_addons_v1', JSON.stringify(parsed.addons));
        }
        setMessage({ type: 'success', text: '¡Copia restaurada correctamente! Recarga la página para visualizar.' });
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        setMessage({ type: 'error', text: 'Error al leer el archivo JSON. Verifica que sea válido.' });
      }
    };
  };

  const handleResetTotal = () => {
    if (window.confirm('¿Deseas restablecer todo el catálogo y empresa a los valores por defecto?')) {
      resetAllProducts();
      resetBusiness();
      setMessage({ type: 'success', text: 'Se restablecieron todos los datos a los valores de muestra iniciales.' });
      setTimeout(() => window.location.reload(), 1200);
    }
  };

  return (
    <div className="backup-container">
      {message && (
        <div className={`backup-msg ${message.type}`}>
          {message.type === 'success' ? <Check size={20} /> : <AlertTriangle size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="backup-card">
        <h3 className="backup-title">Exportar Catálogo y Marca</h3>
        <p className="backup-desc">
          Descarga un archivo JSON con todos los productos, tipos, adicionales y textos de la empresa para respaldar o usar en otra tienda.
        </p>
        <button
          type="button"
          onClick={handleExport}
          className="btn-add-to-cart"
          style={{ width: 'auto', padding: '10px 22px' }}
        >
          <Download size={18} />
          <span>Descargar Respaldo JSON</span>
        </button>
      </div>

      <div className="backup-card">
        <h3 className="backup-title">Importar Catálogo desde JSON</h3>
        <p className="backup-desc">
          Sube un archivo de configuración previamente exportado para restaurar la tienda.
        </p>
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ fontSize: '0.88rem' }}
        />
      </div>

      <div className="backup-card-danger">
        <h3 className="backup-title" style={{ color: '#BE123C' }}>Zona de Peligro</h3>
        <p className="backup-desc" style={{ color: '#9F1239' }}>
          Restablece la tienda completa (productos de muestra, categorías y marca Zona Kids Home original).
        </p>
        <button
          type="button"
          onClick={handleResetTotal}
          className="btn-reset-factory"
        >
          <RotateCcw size={16} />
          <span>Restablecer Todo a Valores de Fábrica</span>
        </button>
      </div>
    </div>
  );
}
