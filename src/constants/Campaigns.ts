export interface Campaign {
    id: string;
    title: string;
    description: string;
    imageUrl: any; // Using 'any' for require(), or string for remote URLs
    date: string;
    active: boolean;
}

export const CAMPAIGNS: Campaign[] = [
    {
        id: '1',
        title: 'Januarkampanje!',
        description: 'Start året med en fresh glød! Vi gir deg -20% på alle hudbehandlinger ut januar. Bestill time i dag og sikre deg plassen.',
        imageUrl: require('@/assets/images/illustrations/time_is_valuable.png'), // Placeholder or existing image
        date: '2025-01-02',
        active: true,
    },
    {
        id: '2',
        title: 'Nyhet: Dermapen 4',
        description: 'Vi har fått inn siste nytt innen microneedling. Dermapen 4 er mer effektiv og mindre smertefull. Prøv den nå!',
        imageUrl: require('@/assets/images/illustrations/doctor_v2.png'),
        date: '2024-12-15',
        active: true,
    },
    {
        id: '3',
        title: 'Gavekort til jul?',
        description: 'Gi bort velvære til noen du er glad i. Vi har gavekort på valgfrie beløp.',
        imageUrl: require('@/assets/images/tm-logo.png'),
        date: '2024-12-01',
        active: false,
    }
];
