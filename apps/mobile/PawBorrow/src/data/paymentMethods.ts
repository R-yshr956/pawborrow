export interface Card {
    id: string;
    brand: string;
    last4: string;
}

export const mockCards: Card[] = [
    { id: '1', brand: 'Visa', last4: '4242' },
    { id: '2', brand: 'Mastercard', last4: '5555' },
    { id: '3', brand: 'American Express', last4: '3782' },
];