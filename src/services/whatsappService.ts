import { formatPrice, cleanPhoneNumber } from '../utils/formatters';
import { Product, ProductTypeOption, ProductAdditionalOption, BusinessConfig, CartItem } from '../types';

export interface CustomerOrderData {
  name?: string;
  city?: string;
  notes?: string;
}

const KNOWN_SHORTLINK_PHONES: Record<string, string> = {
  'MGA7KPPOQIPVK1': '573117596281',
};

const DEFAULT_PHONE = '573117596281';
const DEFAULT_WHATSAPP_LINK = 'https://wa.me/message/MGA7KPPOQIPVK1';

export const whatsappService = {
  /**
   * Extrae el número de teléfono con código de país para poder enviar mensajes dinámicos (?text=...)
   * WhatsApp no permite adjuntar mensajes personalizados a enlaces cortos wa.me/message/CODE,
   * por lo que se requiere el número de teléfono de destino.
   */
  getPhoneNumber: (businessConfig?: Partial<BusinessConfig> | null): string => {
    const rawNumber = businessConfig?.whatsappNumber?.trim() || '';
    const rawLink = businessConfig?.whatsappLink?.trim() || '';

    // Si coincide con el enlace corto conocido o contiene su código
    for (const [code, phone] of Object.entries(KNOWN_SHORTLINK_PHONES)) {
      if (rawNumber.includes(code) || rawLink.includes(code)) {
        return phone;
      }
    }

    // Si es un número numérico directo
    const cleaned = cleanPhoneNumber(rawNumber);
    if (cleaned.length >= 7) {
      return cleaned;
    }

    return DEFAULT_PHONE;
  },

  /**
   * Obtiene la URL base directa a WhatsApp (enlace directo wa.me/message/... o wa.me/numero)
   */
  getDirectWhatsAppUrl: (businessConfig?: Partial<BusinessConfig> | null): string => {
    if (businessConfig?.whatsappLink && businessConfig.whatsappLink.trim()) {
      return businessConfig.whatsappLink.trim();
    }
    const raw = businessConfig?.whatsappNumber?.trim();
    if (raw && (raw.startsWith('http://') || raw.startsWith('https://'))) {
      return raw.split('?')[0];
    }
    if (raw && raw.startsWith('wa.me/')) {
      return `https://${raw.split('?')[0]}`;
    }
    const phone = whatsappService.getPhoneNumber(businessConfig);
    return phone === DEFAULT_PHONE ? DEFAULT_WHATSAPP_LINK : `https://wa.me/${phone}`;
  },

  /**
   * Construye una URL de WhatsApp con mensaje de texto prellenado.
   * Envía siempre al número con código de país para que WhatsApp prellene el mensaje
   * en el chat del cliente sin omitir el carrito ni las consultas.
   */
  buildWhatsAppUrlWithText: (
    businessConfig: Partial<BusinessConfig> | null | undefined,
    message: string
  ): string => {
    const phone = whatsappService.getPhoneNumber(businessConfig);
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encodedMessage}`;
  },

  /**
   * Genera el enlace para enviar el pedido completo del carrito por WhatsApp
   */
  generateCartOrderUrl: (
    items: CartItem[],
    totalAmount: number,
    businessConfig?: Partial<BusinessConfig> | null,
    customerData: CustomerOrderData = {}
  ): string => {
    const businessName = businessConfig?.name || 'Zona Kids Home';

    let message = `👋 ¡Hola *${businessName}*! Quiero realizar el siguiente pedido:\n\n`;

    items.forEach((item) => {
      const productName = item.product?.name || (item as unknown as { name?: string }).name || 'Producto';
      const itemSubtotal = formatPrice(item.unitPrice * item.quantity);

      if (item.isAddon) {
        message += `✨ *${item.quantity}x ${productName}* (Accesorio adicional)\n`;
        message += `   • *Subtotal:* ${itemSubtotal}\n\n`;
      } else {
        const typeLabel = item.selectedType?.name || 'Estándar';
        const addLabel = item.selectedAdditional?.name || 'Sin adicionales';

        message += `🛋️ *${item.quantity}x ${productName}*\n`;
        message += `   • *Tipo:* ${typeLabel}\n`;
        message += `   • *Adicional:* ${addLabel}\n`;
        message += `   • *Subtotal:* ${itemSubtotal}\n\n`;
      }
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

    return whatsappService.buildWhatsAppUrlWithText(businessConfig, message);
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
    const businessName = businessConfig?.name || 'Zona Kids Home';

    const typeLabel = selectedType?.name || 'Sencilla';
    const addLabel = selectedAdditional?.name || 'Solita';

    let message = `👋 ¡Hola *${businessName}*! Tengo una consulta sobre este producto:\n\n`;
    message += `🛋️ *${product.name}*\n`;
    message += `   • *Tipo:* ${typeLabel}\n`;
    message += `   • *Adicional:* ${addLabel}\n`;
    message += `   • *Precio cotizado:* ${formatPrice(calculatedPrice ?? product.basePrice)}\n\n`;
    message += `¿Me podrían brindar más información o fotos de esta opción? ¡Gracias!`;

    return whatsappService.buildWhatsAppUrlWithText(businessConfig, message);
  },

  /**
   * Enlace de contacto general para el botón del Hero
   */
  generateHeroContactUrl: (businessConfig?: Partial<BusinessConfig> | null): string => {
    const businessName = businessConfig?.name || 'Zona Kids Home';
    const message = `👋 ¡Hola *${businessName}*! Vi su catálogo web y me gustaría recibir asesoría para muebles infantiles.`;
    return whatsappService.buildWhatsAppUrlWithText(businessConfig, message);
  }
};
