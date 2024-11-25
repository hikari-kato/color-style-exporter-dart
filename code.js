figma.showUI(__html__, { width: 500, height: 600 });
function rgbToHex(r, g, b) {
    const toHex = (n) => {
        const hex = Math.round(n * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    return `0xFF${toHex(r)}${toHex(g)}${toHex(b)}`;
}
async function generateColorScheme() {
    const styles = figma.getLocalPaintStyles();
    const m3Styles = styles.filter(style => style.name.startsWith('M3/sys/light/'));
    let colorScheme = `import 'package:flutter/material.dart';\n\n`;
    colorScheme += `const lightColorScheme = ColorScheme(\n`;
    colorScheme += `  brightness: Brightness.light,\n`;
    const colorMap = new Map();
    // Figmaのスタイル名をColorSchemeのプロパティ名にマッピング
    const styleMapping = {
        'primary': 'primary',
        'on-primary': 'onPrimary',
        'primary-container': 'primaryContainer',
        'on-primary-container': 'onPrimaryContainer',
        'secondary': 'secondary',
        'on-secondary': 'onSecondary',
        'secondary-container': 'secondaryContainer',
        'on-secondary-container': 'onSecondaryContainer',
        'tertiary': 'tertiary',
        'on-tertiary': 'onTertiary',
        'tertiary-container': 'tertiaryContainer',
        'on-tertiary-container': 'onTertiaryContainer',
        'error': 'error',
        'error-container': 'errorContainer',
        'on-error': 'onError',
        'on-error-container': 'onErrorContainer',
        'background': 'background',
        'on-background': 'onBackground',
        'surface': 'surface',
        'on-surface': 'onSurface',
        'surface-variant': 'surfaceVariant',
        'on-surface-variant': 'onSurfaceVariant',
        'outline': 'outline',
        'inverse-on-surface': 'onInverseSurface',
        'inverse-surface': 'inverseSurface',
        'inverse-primary': 'inversePrimary',
        'shadow': 'shadow',
        'surface-tint': 'surfaceTint',
        'outline-variant': 'outlineVariant',
        'scrim': 'scrim'
    };
    m3Styles.forEach(style => {
        const styleName = style.name.replace('M3/sys/light/', '');
        if (style.paints[0].type === 'SOLID') {
            const paint = style.paints[0];
            const color = paint.color;
            const hex = rgbToHex(color.r, color.g, color.b);
            // マッピングされたプロパティ名を使用
            if (styleMapping[styleName]) {
                colorMap.set(styleMapping[styleName], hex);
            }
        }
    });
    // ColorSchemeのプロパティ順序
    const colorProperties = Object.values(styleMapping);
    colorProperties.forEach((prop, index) => {
        const hex = colorMap.get(prop) || '0xFF000000';
        const comma = index < colorProperties.length - 1 ? ',' : '';
        colorScheme += `  ${prop}: Color(${hex})${comma}\n`;
    });
    colorScheme += `);\n`;
    figma.ui.postMessage({ type: 'export-colors', data: colorScheme });
}
figma.ui.onmessage = (msg) => {
    if (msg.type === 'generate') {
        generateColorScheme();
    }
};
