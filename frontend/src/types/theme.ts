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
            primary: 'slate-900',
            secondary: 'indigo-800',
            accent: 'cyan-600',
            background: 'from-blue-50 via-purple-50 to-pink-50',
        },
        gradients: {
            header: 'from-slate-900 to-indigo-900',
            background: 'from-blue-50 via-purple-50 to-pink-50',
            button: 'from-slate-800 to-indigo-900',
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
            primary: 'red-900',
            secondary: 'emerald-900',
            accent: 'amber-600',
            background: 'from-red-50 via-green-50 to-red-50',
        },
        gradients: {
            header: 'from-red-900 to-emerald-900',
            background: 'from-red-50 via-green-50 to-red-50',
            button: 'from-red-800 to-emerald-900',
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
            primary: 'indigo-950',
            secondary: 'amber-500',
            accent: 'rose-500',
            background: 'from-purple-50 via-yellow-50 to-pink-50',
        },
        gradients: {
            header: 'from-indigo-950 via-slate-900 to-amber-600',
            background: 'from-purple-50 via-yellow-50 to-pink-50',
            button: 'from-indigo-900 to-amber-700',
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