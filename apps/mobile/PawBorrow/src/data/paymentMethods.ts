export interface PaymentMethod {
    id: string;
    brand: string;
    type: string;
    last4: string;
    isDefault?: boolean;
}

export const paymentMethods: PaymentMethod[] = [
    { id: 'pm_visa_4242', brand: 'Visa', type: 'Credit Card', last4: '4242', isDefault: true },
    { id: 'pm_mastercard_5555', brand: 'Mastercard', type: 'Credit Card', last4: '5555' },
    { id: 'pm_amex_3782', brand: 'American Express', type: 'Credit Card', last4: '3782' },
];

export const mockCards: PaymentMethod[] = paymentMethods;