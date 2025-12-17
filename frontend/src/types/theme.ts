/**
 * Theme type definitions
 */

export type ThemeType = 'default' | 'christmas' | 'new-year';

export interface Theme {
    name: ThemeType;
    displayName: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
    };
    gradients: {
        header: string;
        background: string;
        button: string;
    };
    emojis: {
        main: string;
        celebration: string[];
        decoration: string[];
    };
    decorations: {
        showSnow: boolean;
        showConfetti: boolean;
    };
}

export const themes: Record<ThemeType, Theme> = {
    default: {
        name: 'default',
        displayName: 'Default',
        colors: {
            primary: 'blue-600',
            secondary: 'purple-600',
            accent: 'pink-600',
            background: 'from-blue-50 via-purple-50 to-pink-50',
        },
        gradients: {
            header: 'from-blue-600 to-purple-600',
            background: 'from-blue-50 via-purple-50 to-pink-50',
            button: 'from-blue-600 to-purple-600',
        },
        emojis: {
            main: '🎰',
            celebration: ['🎉', '🎊', '✨', '🎈', '🏆', '🎁'],
            decoration: ['🎊', '✨', '🎈', '🏆', '🎁'],
        },
        decorations: {
            showSnow: false,
            showConfetti: false,
        },
    },
    christmas: {
        name: 'christmas',
        displayName: '🎄 Christmas',
        colors: {
            primary: 'red-600',
            secondary: 'green-700',
            accent: 'yellow-500',
            background: 'from-red-50 via-green-50 to-red-50',
        },
        gradients: {
            header: 'from-red-600 to-green-700',
            background: 'from-red-50 via-green-50 to-red-50',
            button: 'from-red-600 to-green-700',
        },
        emojis: {
            main: '🎄',
            celebration: ['🎄', '🎅', '⛄', '🎁', '🔔', '❄️'],
            decoration: ['🎄', '⛄', '🎁', '🔔', '❄️', '🦌', '⭐'],
        },
        decorations: {
            showSnow: true,
            showConfetti: false,
        },
    },
    'new-year': {
        name: 'new-year',
        displayName: '🎆 New Year',
        colors: {
            primary: 'purple-600',
            secondary: 'yellow-500',
            accent: 'pink-500',
            background: 'from-purple-50 via-yellow-50 to-pink-50',
        },
        gradients: {
            header: 'from-purple-600 via-pink-500 to-yellow-500',
            background: 'from-purple-50 via-yellow-50 to-pink-50',
            button: 'from-purple-600 via-pink-500 to-yellow-500',
        },
        emojis: {
            main: '🍾',
            celebration: ['🎆', '🎇', '🎉', '🥳', '🍾', '✨'],
            decoration: ['🎆', '🎇', '🥳', '🍾', '✨', '🎊', '🎈'],
        },
        decorations: {
            showSnow: false,
            showConfetti: true,
        },
    },
};