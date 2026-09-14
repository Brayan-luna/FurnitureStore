import { formatPrice, cleanPhoneNumber } from '../utils/formatters';
import { Product, ProductTypeOption, ProductAdditionalOption, BusinessConfig, CartItem, SelectedCustomization } from '../types';

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
  getPhoneNumber: (businessConfig?: Partial<BusinessConfig> | null): string => {
    const rawNumber = businessConfig?.whatsappNumber?.trim() || '';
    const rawLink = businessConfig?.whatsappLink?.trim() || '';

    for (const [code, phone] of Object.entries(KNOWN_SHORTLINK_PHONES)) {
      if (rawNumber.includes(code) || rawLink.includes(code)) {
        return phone;
      }
    }

    const cleaned = cleanPhoneNumber(rawNumber);
    if (cleaned.length >= 7) {
      return cleaned;
    }

    return DEFAULT_PHONE;
  },

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

  buildWhatsAppUrlWithText: (
    businessConfig: Partial<BusinessConfig> | null | undefined,
    message: string
  ): string => {
    const phone = whatsappService.getPhoneNumber(businessConfig);
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encodedMessage}`;
  },

  generateCartOrderUrl: (
    items: CartItem[],
    totalAmount: number,
    businessConfig?: Partial<BusinessConfig> | null,
    customerData: CustomerOrderData = {}
  ): string => {
    const businessName = businessConfig?.name || 'Zona Kids Home';

    let message = `👋 ¡Hola *${businessName}*! Quiero realizar el siguiente pedido:\n\n`;

    items.forEach((item) => {
      const productName = item.name || 'Producto';
      const itemSubtotal = formatPrice(item.unitPrice * item.quantity);

      if (item.isAddon) {
        message += `✨ *${item.quantity}x ${productName}* (Accesorio adicional)\n`;
        message += `   • *Subtotal:* ${itemSubtotal}\n\n`;
      } else if (item.customization) {
        const c = item.customization;
        message += `🛋️ *${item.quantity}x ${productName}*\n`;
        message += `   • *Línea / Calidad:* ${c.quality} ${c.quality === 'PREMIUM' ? '(+$300.000)' : '(Base Roble)'}\n`;
        message += `   • *Medida:* ${c.size.name} (${c.size.label})\n`;
        message += `   • *Colchón:* ${c.mattress ? c.mattress.name : 'Sin colchón'}\n`;
        if (c.color) {
          message += `   • *Color:* ${c.color.name}\n`;
        }
        if (c.addons && c.addons.length > 0) {
          const addonNames = c.addons.map((a) => a.name).join(', ');
          message += `   • *Adicionales:* ${addonNames}\n`;
        }
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

  generateCustomizedProductUrl: (
    product: Product,
    customization: SelectedCustomization,
    businessConfig?: Partial<BusinessConfig> | null
  ): string => {
    const businessName = businessConfig?.name || 'Zona Kids Home';

    let message = `👋 ¡Hola *${businessName}*! Acabo de personalizar esta cama y quiero cotizarla:\n\n`;
    message += `🛋️ *${product.name}*\n`;
    message += `   • *Línea / Calidad:* ${customization.quality} (${customization.quality === 'PREMIUM' ? 'Poliuretano +$300.000' : 'Catalizada - Base'})\n`;
    message += `   • *Medida:* ${customization.size.name} (${customization.size.label})\n`;
    message += `   • *Colchón:* ${customization.mattress ? customization.mattress.name : 'Sin colchón'}\n`;
    if (customization.color) {
      message += `   • *Color elegido:* ${customization.color.name}\n`;
    }
    if (customization.addons && customization.addons.length > 0) {
      message += `   • *Adicionales:* ${customization.addons.map((a) => a.name).join(', ')}\n`;
    }
    message += `   • *Total Cotizado:* ${formatPrice(customization.totalPrice)}\n\n`;
    message += `¿Me podrían asesorar con el tiempo de entrega y medios de pago? ¡Muchas gracias!`;

    return whatsappService.buildWhatsAppUrlWithText(businessConfig, message);
  },

  generateHeroContactUrl: (businessConfig?: Partial<BusinessConfig> | null): string => {
    const businessName = businessConfig?.name || 'Zona Kids Home';
    const message = `👋 ¡Hola *${businessName}*! Vi su catálogo web y me gustaría recibir asesoría para muebles infantiles.`;
    return whatsappService.buildWhatsAppUrlWithText(businessConfig, message);
  }
};

