import React, { useState, useEffect, useCallback } from 'react';
import './PriceInput.css';

export interface PriceInputProps {
  /** Valor numérico actual (number o string vacío) */
  value: number | string;
  /** Callback cuando cambia el valor — devuelve el número limpio o '' si vacío */
  onChange: (value: number | string) => void;
  /** Placeholder visible */
  placeholder?: string;
  /** Campo requerido */
  required?: boolean;
  /** Valor mínimo permitido (default 0) */
  min?: number;
  /** className extra para el input */
  className?: string;
  /** id del input */
  id?: string;
}

/**
 * Formatea un número con puntos como separador de miles (formato colombiano).
 * Ejemplo: 2700000 → "2.700.000"
 */
function formatWithDots(num: number | string): string {
  const raw = String(num).replace(/\D/g, '');
  if (!raw) return '';
  return raw.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Elimina los puntos de formato y devuelve solo dígitos.
 */
function stripDots(formatted: string): string {
  return formatted.replace(/\./g, '');
}

export default function PriceInput({
  value,
  onChange,
  placeholder = '0',
  required = false,
  min = 0,
  className = '',
  id,
}: PriceInputProps) {
  const [displayValue, setDisplayValue] = useState(() => {
    if (value === '' || value === undefined || value === null) return '';
    return formatWithDots(value);
  });

  // Sincronizar cuando el valor externo cambia (ej. presets, reset)
  useEffect(() => {
    if (value === '' || value === undefined || value === null) {
      setDisplayValue('');
      return;
    }
    const numericValue = Number(value);
    const currentRaw = stripDots(displayValue);
    // Solo actualizar si el valor externo difiere del que ya tenemos
    if (currentRaw !== String(numericValue)) {
      setDisplayValue(formatWithDots(numericValue));
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInput = e.target.value;

      // Permitir vaciar el campo
      if (rawInput === '') {
        setDisplayValue('');
        onChange('');
        return;
      }

      // Solo permitir dígitos y puntos (los puntos los manejamos nosotros)
      const digits = rawInput.replace(/\D/g, '');
      if (!digits) {
        setDisplayValue('');
        onChange('');
        return;
      }

      const numericValue = Math.max(min, Number(digits));
      const formatted = formatWithDots(numericValue);

      setDisplayValue(formatted);
      onChange(numericValue);
    },
    [onChange, min]
  );

  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      className={`input-field price-input-no-arrows ${className}`}
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      required={required}
      autoComplete="off"
    />
  );
}
