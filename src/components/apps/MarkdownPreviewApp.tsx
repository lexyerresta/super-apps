'use client';

import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { FileText, Eye, Code, Copy, Check, RefreshCw } from 'lucide-react';

export default function MarkdownPreviewApp() {
    const [markdown, setMarkdown] = useState(`# Welcome to Markdown Preview! 🎉

## Features
- **Bold text** and *italic text*
- Lists and checklists
- Code blocks and inline \`code\`

### Code Example
\`\`\`javascript
function greet(name) {
    return \`Hello, \${name}!\`;
}
\`\`\`

### Table Example
| Name | Type | Status |
|------|------|--------|
| React | Library | ✅ |
| Next.js | Framework | ✅ |

### Checklist
- [x] Create markdown editor
- [x] Add live preview
- [ ] Add more features

> This is a blockquote. Perfect for highlighting important information!

---

Made with ❤️ using SuperApps`);
    const [copied, setCopied] = useState(false);
    const [view, setView] = useState<'split' | 'edit' | 'preview'>('split');

    const parseMarkdown = (text: string): string => {
        let html = text
            // Escape HTML
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            // Headers
            .replace(/^### (.*$)/gim, '<h3 style="color: var(--text-primary); margin: 0.75em 0 0.5em; font-size: 1.1rem;">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 style="color: var(--text-primary); margin: 1em 0 0.5em; font-size: 1.25rem;">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 style="color: var(--text-primary); margin: 0 0 0.75em; font-size: 1.5rem;">$1</h1>')
            // Bold and Italic
            .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
            .replace(/\*\*(.*?)\*\*/gim, '<strong style="color: var(--text-primary);">$1</strong>')
            .replace(/\*(.*?)\*/gim, '<em>$1</em>')
            // Strikethrough
            .replace(/~~(.*?)~~/gim, '<del>$1</del>')
            // Inline code
            .replace(/`([^`]+)`/gim, '<code style="background: var(--bg-tertiary); padding: 0.15em 0.4em; border-radius: 4px; font-family: monospace; font-size: 0.85em; color: var(--primary);">$1</code>')
            // Code blocks
            .replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre style="background: var(--bg-tertiary); padding: 1rem; border-radius: 8px; overflow-x: auto; margin: 0.75em 0;"><code style="font-family: monospace; font-size: 0.85rem; color: var(--text-primary);">$2</code></pre>')
            // Blockquotes
            .replace(/^&gt; (.*$)/gim, '<blockquote style="border-left: 3px solid var(--primary); padding-left: 1rem; margin: 0.75em 0; color: var(--text-secondary); font-style: italic;">$1</blockquote>')
            // Horizontal rule
            .replace(/^---$/gim, '<hr style="border: none; border-top: 1px solid var(--glass-border); margin: 1.5em 0;" />')
            // Checkboxes
            .replace(/^- \[x\] (.*$)/gim, '<div style="display: flex; align-items: center; gap: 0.5rem; margin: 0.25em 0;"><span style="color: var(--accent-green);">✅</span> <span style="text-decoration: line-through; color: var(--text-tertiary);">$1</span></div>')
            .replace(/^- \[ \] (.*$)/gim, '<div style="display: flex; align-items: center; gap: 0.5rem; margin: 0.25em 0;"><span>⬜</span> $1</div>')
            // Unordered lists
            .replace(/^- (.*$)/gim, '<li style="margin: 0.25em 0; margin-left: 1.5em;">$1</li>')
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" style="color: var(--primary); text-decoration: none;">$1</a>')
            // Tables (basic)
            .replace(/^\|(.+)\|$/gim, (match, content) => {
                const cells = content.split('|').map((c: string) => c.trim());
                if (cells.every((c: string) => /^[-:]+$/.test(c))) {
                    return ''; // Skip separator row
                }
                const row = cells.map((c: string) => `<td style="padding: 0.5rem 0.75rem; border: 1px solid var(--glass-border);">${c}</td>`).join('');
                return `<tr>${row}</tr>`;
            })
            // Line breaks
            .replace(/\n\n/gim, '<br /><br />');

        // Wrap table rows
        html = html.replace(/(<tr>[\s\S]*?<\/tr>)+/g, '<table style="border-collapse: collapse; width: 100%; margin: 0.75em 0;">$&</table>');

        return html;
    };

    const copyMarkdown = async () => {
        await navigator.clipboard.writeText(markdown);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={styles.appContainer}>
            {/* View Toggle */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tabBtn} ${view === 'edit' ? styles.active : ''}`}
                    onClick={() => setView('edit')}
                >
                    <Code size={16} /> Edit
                </button>
                <button
                    className={`${styles.tabBtn} ${view === 'split' ? styles.active : ''}`}
                    onClick={() => setView('split')}
                >
                    <FileText size={16} /> Split
                </button>
                <button
                    className={`${styles.tabBtn} ${view === 'preview' ? styles.active : ''}`}
                    onClick={() => setView('preview')}
                >
                    <Eye size={16} /> Preview
                </button>
            </div>

            {/* Editor/Preview */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: view === 'split' ? '1fr 1fr' : '1fr',
                gap: '1rem',
                minHeight: '350px',
            }}>
                {/* Editor */}
                {(view === 'edit' || view === 'split') && (
                    <div>
                        <label style={{
                            display: 'block',
                            color: 'var(--text-tertiary)',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                        }}>
                            Markdown
                        </label>
                        <textarea
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            className={styles.searchInput}
                            style={{
                                height: '100%',
                                minHeight: '300px',
                                resize: 'vertical',
                                fontFamily: 'monospace',
                                fontSize: '0.85rem',
                                lineHeight: 1.6,
                            }}
                        />
                    </div>
                )}

                {/* Preview */}
                {(view === 'preview' || view === 'split') && (
                    <div>
                        <label style={{
                            display: 'block',
                            color: 'var(--text-tertiary)',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                        }}>
                            Preview
                        </label>
                        <div
                            style={{
                                height: '100%',
                                minHeight: '300px',
                                padding: '1rem',
                                background: 'var(--bg-tertiary)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '14px',
                                overflow: 'auto',
                                color: 'var(--text-secondary)',
                                fontSize: '0.9rem',
                                lineHeight: 1.6,
                            }}
                            dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
                        />
                    </div>
                )}
            </div>

            <div className={styles.actions}>
                <button onClick={copyMarkdown} className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy Markdown'}
                </button>
                <button onClick={() => setMarkdown('')} className={styles.actionBtn}>
                    <RefreshCw size={16} /> Clear
                </button>
            </div>
        </div>
    );
}
