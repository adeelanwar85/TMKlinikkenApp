import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/Theme';

export interface AdminMenuItem {
    id: string;
    title: string;
    subtitle: string;
    icon: keyof typeof Ionicons.glyphMap;
    route?: string; // If it's an internal route
    color: string;
    bg: string;
    section: 'content' | 'operations' | 'system';
    requiredRole?: 'superuser' | 'admin';
}

export const ADMIN_MENU: AdminMenuItem[] = [
    // Content & Structure
    {
        id: 'cms',
        title: 'Behandlingssider (CMS)',
        subtitle: 'Rediger tekst, bilder og innhold',
        icon: 'document-text',
        route: '/admin/content-editor',
        color: '#1565C0',
        bg: '#E3F2FD',
        section: 'content'
    },
    {
        id: 'campaigns',
        title: 'Kampanjer',
        subtitle: 'Administrer tilbud og nyheter',
        icon: 'megaphone',
        route: '/admin/campaigns',
        color: '#7B1FA2',
        bg: '#F3E5F5',
        section: 'content'
    },
    {
        id: 'employees',
        title: 'Ansatte',
        subtitle: 'Rediger team-oversikten',
        icon: 'people',
        route: '/admin/employees',
        color: '#00796B',
        bg: '#E0F2F1',
        section: 'content'
    },
    // Operations
    {
        id: 'notifications',
        title: 'Push-varsel',
        subtitle: 'Send melding til alle kunder',
        icon: 'notifications',
        route: '/admin/notifications',
        color: '#2E7D32',
        bg: '#E8F5E9',
        section: 'operations'
    },
    {
        id: 'config',
        title: 'Drift & Info',
        subtitle: 'Åpningstider, nød-banner m.m.',
        icon: 'settings',
        route: '/admin/config',
        color: '#C62828',
        bg: '#FFEBEE',
        section: 'operations'
    },
    {
        id: 'legal',
        title: 'Juridisk',
        subtitle: 'Rediger vilkår og personvern',
        icon: 'shield-checkmark',
        route: '/admin/legal',
        color: '#0288D1',
        bg: '#E1F5FE',
        section: 'operations'
    },
    // System
    {
        id: 'users',
        title: 'Brukere',
        subtitle: 'Administrer tilganger og passord',
        icon: 'key',
        route: '/admin/users',
        color: '#EF6C00',
        bg: '#FFF3E0',
        section: 'system',
        requiredRole: 'superuser'
    },
    // Seed is special, maybe keep it separate or add custom action logic?
    // We'll keep seed separate in the UI as a footer link
];

export interface DashboardTab {
    id: string;
    label: string;
    type: 'filter' | 'webview' | 'navigation';
    target?: string; // Url or Route
    title?: string; // For webview title
    displayLabel?: string; // Override label for display
}

export const DASHBOARD_TABS: DashboardTab[] = [
    { id: 'booking', label: 'Bestill time', type: 'navigation', target: '/booking' },
    { id: 'giftcard', label: 'Gavekort', type: 'navigation', target: '/giftcard' },
    { id: 'prices', label: 'Priser', type: 'navigation', target: '/prices', displayLabel: 'Priser og behandlinger' },
    { id: 'about', label: 'Om oss', type: 'navigation', target: '/about' },
    { id: 'legetjenester', label: 'TM Legetjenester', type: 'webview', target: 'https://tmlegetjenester.no', title: 'TM Legetjenester' },
    { id: 'contact', label: 'Kontakt', type: 'navigation', target: '/contact' }
];
