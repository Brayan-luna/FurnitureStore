import { formatPrice, cleanPhoneNumber } from '../utils/formatters';
import { Product, ProductTypeOption, ProductAdditionalOption, BusinessConfig, CartItem } from '../types';

export interface CustomerOrderData {
  name?: string;
  city?: string;
  notes?: string;
}

export const whatsappService = {
  /**
   * Genera el enlace para enviar el pedido completo del carrito por WhatsApp
   */
  generateCartOrderUrl: (
    items: CartItem[],
    totalAmount: number,
    businessConfig?: Partial<BusinessConfig> | null,
    customerData: CustomerOrderData = {}
  ): string => {
    const rawPhone = businessConfig?.whatsappNumber || '573214028890';
    const phone = cleanPhoneNumber(rawPhone);
    const businessName = businessConfig?.name || 'Zona Kids Home';

    let message = `👋 ¡Hola *${businessName}*! Quiero realizar el siguiente pedido:\n\n`;

    items.forEach((item) => {
      const productName = item.product?.name || (item as unknown as { name?: string }).name || 'Producto';
      const typeLabel = item.selectedType?.name || 'Estándar';
      const addLabel = item.selectedAdditional?.name || 'Sin adicionales';
      const itemSubtotal = formatPrice(item.unitPrice * item.quantity);

      message += `🛋️ *${item.quantity}x ${productName}*\n`;
      message += `   • *Tipo:* ${typeLabel}\n`;
      message += `   • *Adicional:* ${addLabel}\n`;
      message += `   • *Subtotal:* ${itemSubtotal}\n\n`;
    });

    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💰 *TOTAL DEL PEDIDO: ${formatPrice(totalAmount)}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    if (customerData.name) {
      message += `👤 *Cliente:* ${customerData.name.trim()}\n`;
    }
    if (customerData.city) {
      message += `📍 *Ciudad / Dirección:* ${customerData.city.trim()}\n`;
    }
    if (customerData.notes) {
      message += `📝 *Notas:* ${customerData.notes.trim()}\n`;
    }

    message += `\n¿Me confirman disponibilidad y tiempo de entrega, por favor? Muchas gracias! ✨`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encodedMessage}`;
  },

  /**
   * Genera el enlace para consultar de forma rápida sobre un solo producto con sus opciones seleccionadas
   */
  generateQuickProductUrl: (
    product: Product,
    selectedType?: ProductTypeOption,
    selectedAdditional?: ProductAdditionalOption,
    calculatedPrice?: number,
    businessConfig?: Partial<BusinessConfig> | null
  ): string => {
    const rawPhone = businessConfig?.whatsappNumber || '573214028890';
    const phone = cleanPhoneNumber(rawPhone);
    const businessName = businessConfig?.name || 'Zona Kids Home';

    const typeLabel = selectedType?.name || 'Sencilla';
    const addLabel = selectedAdditional?.name || 'Solita';

    let message = `👋 ¡Hola *${businessName}*! Tengo una consulta sobre este producto:\n\n`;
    message += `🛋️ *${product.name}*\n`;
    message += `   • *Tipo:* ${typeLabel}\n`;
    message += `   • *Adicional:* ${addLabel}\n`;
    message += `   • *Precio cotizado:* ${formatPrice(calculatedPrice ?? product.basePrice)}\n\n`;
    message += `¿Me podrían brindar más información o fotos de esta opción? ¡Gracias!`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encodedMessage}`;
  },

  /**
   * Enlace de contacto general para el botón del Hero
   */
  generateHeroContactUrl: (businessConfig?: Partial<BusinessConfig> | null): string => {
    const rawPhone = businessConfig?.whatsappNumber || '573214028890';
    const phone = cleanPhoneNumber(rawPhone);
    const businessName = businessConfig?.name || 'Zona Kids Home';

    const message = `👋 ¡Hola *${businessName}*! Vi su catálogo web y me gustaría recibir asesoría para muebles infantiles.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }
};
