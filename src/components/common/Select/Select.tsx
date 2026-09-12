import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './Select.css';

export interface SelectOption {
  id: string;
  name: string;
  priceModifier?: number;
}

export interface SelectProps {
  value?: string;
  onChange: (value: string) => void;
  options?: SelectOption[];
  name?: string;
  ariaLabel?: string;
}

export default function Select({ value, onChange, options = [], name, ariaLabel }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id === value) || options[0];

  // Cerrar al hacer clic fuera o presionar Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
  };

  return (
    <div
      className={`custom-select-wrapper ${isOpen ? 'is-open' : ''}`}
      ref={wrapperRef}
    >
      <button
        type="button"
        className="custom-select-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        name={name}
      >
        <span className="custom-select-label">
          {selectedOption?.name || 'Seleccionar'}
        </span>
        <ChevronDown
          className={`select-arrow ${isOpen ? 'is-open' : ''}`}
          size={16}
        />
      </button>

      {isOpen && (
        <div
          className="custom-select-dropdown"
          role="listbox"
          aria-label={ariaLabel}
          tabIndex={-1}
        >
          {options.map((opt) => {
            const isSelected = opt.id === value;
            return (
              <button
                key={opt.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`custom-select-option ${isSelected ? 'is-selected' : ''}`}
                onClick={() => handleSelect(opt.id)}
              >
                <span className="custom-select-opt-name">{opt.name}</span>
                {opt.priceModifier !== undefined && opt.priceModifier > 0 && (
                  <span className="custom-select-opt-price">
                    +${Number(opt.priceModifier).toLocaleString('es-CO')}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
