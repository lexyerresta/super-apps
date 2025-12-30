'use client';

import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

type IconName =
    // Weather & Nature
    | 'cloud-sun' | 'cloud' | 'cloud-rain' | 'snowflake' | 'sun' | 'moon'
    | 'thermometer' | 'droplets' | 'wind'
    // Basic UI
    | 'search' | 'x' | 'menu' | 'check' | 'plus' | 'minus'
    | 'chevron-right' | 'chevron-left' | 'chevron-up' | 'chevron-down'
    | 'arrow-up' | 'arrow-down' | 'arrow-left' | 'arrow-right' | 'arrow-left-right'
    | 'loader-2' | 'refresh-cw' | 'rotate-ccw'
    // Actions
    | 'copy' | 'trash-2' | 'save' | 'play' | 'pause' | 'download' | 'upload'
    | 'share-2' | 'external-link'
    // Status
    | 'alert-circle' | 'info' | 'heart' | 'star' | 'bookmark'
    // Files & Documents
    | 'file-text' | 'file-json' | 'file-code' | 'file-stack' | 'file-image'
    // Productivity
    | 'calculator' | 'timer' | 'clock' | 'calendar' | 'calendar-clock'
    | 'ruler' | 'map-pin' | 'settings'
    // Finance
    | 'trending-up' | 'trending-down' | 'banknote' | 'wallet' | 'piggy-bank'
    | 'dollar-sign' | 'receipt' | 'tag' | 'shopping-cart'
    // Code & Dev
    | 'code' | 'code-2' | 'terminal' | 'binary' | 'braces' | 'brackets'
    | 'hash' | 'regex' | 'github'
    // Text & Content
    | 'quote' | 'type' | 'text' | 'scroll-text' | 'book-open'
    // Media
    | 'image' | 'video' | 'music' | 'volume-2' | 'mic' | 'mic-off'
    // Communication
    | 'globe' | 'globe-2' | 'wifi' | 'languages' | 'radio'
    // Fun & Games
    | 'smile' | 'brain' | 'zap' | 'sparkles' | 'lightbulb' | 'dices'
    | 'cat' | 'dog' | 'gamepad-2'
    // Health
    | 'heart-pulse' | 'activity' | 'scale' | 'cake'
    // Security
    | 'key' | 'lock' | 'unlock' | 'shield' | 'eye' | 'eye-off' | 'fingerprint'
    // Design
    | 'palette' | 'paintbrush' | 'maximize' | 'minimize' | 'ratio' | 'crop'
    // Layout & UI
    | 'layout-grid' | 'tv' | 'wrench' | 'workflow'
    // Other
    | 'qr-code' | 'link' | 'clipboard' | 'keyboard' | 'percent' | 'target'
    | 'users' | 'user' | 'building-2' | 'printer' | 'split' | 'award' | 'flame'
    | 'telescope' | 'map' | 'square-stack' | 'arrow-left';

const iconMap: Record<string, keyof typeof LucideIcons> = {
    // Weather & Nature
    'cloud-sun': 'CloudSun',
    'cloud': 'Cloud',
    'cloud-rain': 'CloudRain',
    'snowflake': 'Snowflake',
    'sun': 'Sun',
    'moon': 'Moon',
    'thermometer': 'Thermometer',
    'droplets': 'Droplets',
    'wind': 'Wind',

    // Basic UI
    'search': 'Search',
    'x': 'X',
    'menu': 'Menu',
    'check': 'Check',
    'plus': 'Plus',
    'minus': 'Minus',
    'chevron-right': 'ChevronRight',
    'chevron-left': 'ChevronLeft',
    'chevron-up': 'ChevronUp',
    'chevron-down': 'ChevronDown',
    'arrow-up': 'ArrowUp',
    'arrow-down': 'ArrowDown',
    'arrow-left': 'ArrowLeft',
    'arrow-right': 'ArrowRight',
    'arrow-left-right': 'ArrowLeftRight',
    'loader-2': 'Loader2',
    'refresh-cw': 'RefreshCw',
    'rotate-ccw': 'RotateCcw',

    // Actions
    'copy': 'Copy',
    'trash-2': 'Trash2',
    'save': 'Save',
    'play': 'Play',
    'pause': 'Pause',
    'download': 'Download',
    'upload': 'Upload',
    'share-2': 'Share2',
    'external-link': 'ExternalLink',

    // Status
    'alert-circle': 'AlertCircle',
    'info': 'Info',
    'heart': 'Heart',
    'star': 'Star',
    'bookmark': 'Bookmark',

    // Files & Documents
    'file-text': 'FileText',
    'file-json': 'FileJson',
    'file-code': 'FileCode',
    'file-stack': 'FileStack',
    'file-image': 'FileImage',

    // Productivity
    'calculator': 'Calculator',
    'timer': 'Timer',
    'clock': 'Clock',
    'calendar': 'Calendar',
    'calendar-clock': 'CalendarClock',
    'ruler': 'Ruler',
    'map-pin': 'MapPin',
    'settings': 'Settings',

    // Finance
    'trending-up': 'TrendingUp',
    'trending-down': 'TrendingDown',
    'banknote': 'Banknote',
    'wallet': 'Wallet',
    'piggy-bank': 'PiggyBank',
    'dollar-sign': 'DollarSign',
    'receipt': 'Receipt',
    'tag': 'Tag',
    'shopping-cart': 'ShoppingCart',

    // Code & Dev
    'code': 'Code',
    'code-2': 'Code2',
    'terminal': 'Terminal',
    'binary': 'Binary',
    'braces': 'Braces',
    'brackets': 'Brackets',
    'hash': 'Hash',
    'regex': 'Regex',
    'github': 'Github',

    // Text & Content
    'quote': 'Quote',
    'type': 'Type',
    'text': 'Text',
    'scroll-text': 'ScrollText',
    'book-open': 'BookOpen',

    // Media
    'image': 'Image',
    'video': 'Video',
    'music': 'Music',
    'volume-2': 'Volume2',
    'mic': 'Mic',
    'mic-off': 'MicOff',

    // Communication
    'globe': 'Globe',
    'globe-2': 'Globe2',
    'wifi': 'Wifi',
    'languages': 'Languages',
    'radio': 'Radio',

    // Fun & Games
    'smile': 'Smile',
    'brain': 'Brain',
    'zap': 'Zap',
    'sparkles': 'Sparkles',
    'lightbulb': 'Lightbulb',
    'dices': 'Dices',
    'cat': 'Cat',
    'dog': 'Dog',
    'gamepad-2': 'Gamepad2',

    // Health
    'heart-pulse': 'HeartPulse',
    'activity': 'Activity',
    'scale': 'Scale',
    'cake': 'Cake',

    // Security
    'key': 'Key',
    'lock': 'Lock',
    'unlock': 'Unlock',
    'shield': 'Shield',
    'eye': 'Eye',
    'eye-off': 'EyeOff',
    'fingerprint': 'Fingerprint',

    // Design
    'palette': 'Palette',
    'paintbrush': 'Paintbrush',
    'maximize': 'Maximize',
    'minimize': 'Minimize',
    'ratio': 'Ratio',
    'crop': 'Crop',

    // Layout & UI
    'layout-grid': 'LayoutGrid',
    'tv': 'Tv',
    'wrench': 'Wrench',
    'workflow': 'Workflow',

    // Other
    'qr-code': 'QrCode',
    'link': 'Link',
    'clipboard': 'Clipboard',
    'keyboard': 'Keyboard',
    'percent': 'Percent',
    'target': 'Target',
    'users': 'Users',
    'user': 'User',
    'building-2': 'Building2',
    'printer': 'Printer',
    'split': 'Split',
    'award': 'Award',
    'flame': 'Flame',
    'telescope': 'Telescope',
    'map': 'Map',
    'square-stack': 'SquareStack',
    'satellite': 'Satellite',
    'orbit': 'Orbit',
    'coins': 'Coins',
    'swords': 'Swords',
};

interface IconProps extends Omit<LucideProps, 'ref'> {
    name: string;
}

export default function Icon({ name, size = 24, ...props }: IconProps) {
    const lucideIconName = iconMap[name];

    if (!lucideIconName) {
        // Fallback: try to convert kebab-case to PascalCase
        const pascalName = name
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('') as keyof typeof LucideIcons;

        const FallbackIcon = LucideIcons[pascalName] as React.ComponentType<LucideProps>;
        if (FallbackIcon) {
            return <FallbackIcon size={size} {...props} />;
        }

        // Return a default icon if not found
        const DefaultIcon = LucideIcons['HelpCircle'] as React.ComponentType<LucideProps>;
        return <DefaultIcon size={size} {...props} />;
    }

    const LucideIcon = LucideIcons[lucideIconName] as React.ComponentType<LucideProps>;

    if (!LucideIcon) {
        return null;
    }

    return <LucideIcon size={size} {...props} />;
}

export { Icon };
export type { IconName };
