import React from 'react';
import { ExternalLink, Check } from 'lucide-react';

const parseInline = (text: string) => {
    // Regex matches:
    // 1. Images: ![alt](url)
    // 2. Links: [text](url)
    // 3. Bold: **text**
    // 4. Code: `text`
    // 5. Strikethrough: ~~text~~
    // 6. Italic: *text*
    const regex = /(!\[.*?\]\(.*?\))|(\[.*?\]\(.*?\))|(\*\*.*?\*\*)|(`.*?`)|(~~.*?~~)|(\*.*?\*)/g;
    
    const parts = text.split(regex).filter(part => part !== undefined && part !== '');
    
    return parts.map((part, index) => {
        // Images
        const imgMatch = part.match(/^!\[(.*?)\]\((.*?)\)$/);
        if (imgMatch) {
            return (
                <img 
                    key={index} 
                    src={imgMatch[2]} 
                    alt={imgMatch[1]} 
                    className="max-w-full h-auto rounded-lg border border-white/10 my-2" 
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
            );
        }

        // Links
        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
            return (
                <a 
                    key={index} 
                    href={linkMatch[2]} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-indigo-400 hover:text-indigo-300 underline inline-flex items-center gap-0.5"
                >
                    {linkMatch[1]} <ExternalLink size={10} />
                </a>
            );
        }

        // Bold
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-bold text-indigo-300">{part.slice(2, -2)}</strong>;
        }

        // Code
        if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={index} className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-[0.85em] text-pink-400 border border-white/10">{part.slice(1, -1)}</code>;
        }

        // Strikethrough
        if (part.startsWith('~~') && part.endsWith('~~')) {
            return <del key={index} className="text-slate-500 decoration-slate-500">{part.slice(2, -2)}</del>;
        }

        // Italic
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={index} className="italic text-emerald-300/90">{part.slice(1, -1)}</em>;
        }

        return part;
    });
};

const renderTable = (lines: string[], keyPrefix: string) => {
    // Basic markdown table parser
    // Expects header row, separator row, data rows
    const rows = lines.filter(l => l.trim().startsWith('|'));
    if (rows.length < 2) return null;

    const headers = rows[0].split('|').filter(c => c.trim() !== '').map(c => c.trim());
    const alignments = rows[1].split('|').filter(c => c.trim() !== '').map(c => {
        if (c.includes(':-') && c.includes('-:')) return 'center';
        if (c.includes('-:')) return 'right';
        return 'left';
    });
    const bodyRows = rows.slice(2).map(r => r.split('|').filter(c => c.trim() !== '').map(c => c.trim()));

    return (
        <div key={keyPrefix} className="overflow-x-auto my-4 rounded-lg border border-white/10 bg-black/20">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-indigo-900/30 border-b border-indigo-500/30">
                        {headers.map((h, i) => (
                            <th key={i} className={`p-3 font-bold text-indigo-200 text-sm whitespace-nowrap text-${alignments[i] || 'left'}`}>
                                {parseInline(h)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {bodyRows.map((row, rIdx) => (
                        <tr key={rIdx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            {row.map((cell, cIdx) => (
                                <td key={cIdx} className={`p-3 text-slate-300 text-sm text-${alignments[cIdx] || 'left'}`}>
                                    {parseInline(cell)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

interface MarkdownRendererProps {
    text: string;
    isUser: boolean;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ text, isUser }) => {
  if (!text) return null;

  // Split by code blocks first
  const blocks = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 w-full break-words">
      {blocks.map((block, blockIdx) => {
        if (block.startsWith('```') && block.endsWith('```')) {
            const codeContent = block.replace(/^```[a-z]*\n?/i, '').replace(/```$/, '');
            return (
                <div key={blockIdx} className="bg-black/50 text-emerald-400 p-3 rounded-lg font-mono text-xs md:text-sm overflow-x-auto my-2 border border-white/10 shadow-inner">
                    <pre className="whitespace-pre-wrap">{codeContent}</pre>
                </div>
            );
        }

        // Detect Table Block
        const lines = block.split('\n');
        const elements: React.ReactNode[] = [];
        let tableBuffer: string[] = [];
        let inTable = false;

        lines.forEach((line, lineIdx) => {
            const trimmed = line.trim();
            const key = `${blockIdx}-${lineIdx}`;

            // Handle Tables
            if (trimmed.startsWith('|')) {
                inTable = true;
                tableBuffer.push(trimmed);
                return;
            } else if (inTable) {
                if (tableBuffer.length > 0) {
                    elements.push(renderTable(tableBuffer, `${key}-table`));
                    tableBuffer = [];
                }
                inTable = false;
            }

            if (!trimmed) {
                elements.push(<div key={key} className="h-2" />);
                return;
            }

            // Horizontal Rule (---, ***, ___)
            if (/^([-*_])\1{2,}$/.test(trimmed)) {
                elements.push(<hr key={key} className="my-6 border-white/20" />);
                return;
            }

            // Headings
            if (trimmed.startsWith('# ')) {
                elements.push(<h1 key={key} className="font-serif font-bold text-2xl md:text-3xl mt-6 mb-3 text-indigo-300 border-b border-indigo-500/30 pb-2">{parseInline(trimmed.slice(2))}</h1>);
                return;
            }
            if (trimmed.startsWith('## ')) {
                elements.push(<h2 key={key} className="font-serif font-bold text-xl md:text-2xl mt-5 mb-2 text-indigo-400">{parseInline(trimmed.slice(3))}</h2>);
                return;
            }
            if (trimmed.startsWith('### ')) {
                elements.push(<h3 key={key} className="font-bold text-lg md:text-xl mt-4 mb-2 text-purple-400">{parseInline(trimmed.slice(4))}</h3>);
                return;
            }
            if (trimmed.startsWith('#### ')) {
                elements.push(<h4 key={key} className="font-bold text-base md:text-lg mt-3 mb-1 text-emerald-400 uppercase tracking-wide">{parseInline(trimmed.slice(5))}</h4>);
                return;
            }
            if (trimmed.startsWith('##### ')) {
                elements.push(<h5 key={key} className="font-bold text-sm md:text-base mt-2 mb-1 text-slate-300">{parseInline(trimmed.slice(6))}</h5>);
                return;
            }

            // Blockquote
            if (trimmed.startsWith('> ')) {
                elements.push(<div key={key} className="border-l-4 border-indigo-500 bg-indigo-500/10 pl-4 py-2 italic text-slate-300 rounded-r-lg my-2">{parseInline(trimmed.slice(2))}</div>);
                return;
            }

            // Task Lists
            // - [ ] Task
            // - [x] Completed
            const taskMatch = trimmed.match(/^- \[( |x)\] (.*)/);
            if (taskMatch) {
                const isChecked = taskMatch[1] === 'x';
                elements.push(
                    <div key={key} className="flex gap-3 items-start my-1 ml-1 group">
                         <div className={`mt-1 w-4 h-4 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500 bg-transparent'}`}>
                             {isChecked && <Check size={12} className="text-white" />}
                         </div>
                         <span className={`${isChecked ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{parseInline(taskMatch[2])}</span>
                    </div>
                );
                return;
            }

            // Bullet Lists
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('+ ')) {
                elements.push(
                    <div key={key} className="flex gap-2 ml-1 items-start my-1">
                        <span className={`min-w-[6px] mt-2 h-1.5 w-1.5 rounded-full shrink-0 ${isUser ? 'bg-indigo-300' : 'bg-indigo-500'}`}></span>
                        <span className="flex-1 leading-relaxed">{parseInline(trimmed.slice(2))}</span>
                    </div>
                );
                return;
            }

            // Numbered Lists
            if (/^\d+\.\s/.test(trimmed)) {
                 const [number, ...rest] = trimmed.split('.');
                 elements.push(
                    <div key={key} className="flex gap-2 ml-1 items-start my-1">
                        <span className="font-mono font-bold text-indigo-400 text-sm mt-0.5 min-w-[1.2rem]">{number}.</span>
                        <span className="flex-1 leading-relaxed">{parseInline(rest.join('.').trim())}</span>
                    </div>
                 );
                 return;
            }

            // Paragraph
            elements.push(<p key={key} className="min-h-[1em] leading-relaxed my-1">{parseInline(line)}</p>);
        });
        
        // Flush remaining table if any
        if (tableBuffer.length > 0) {
             elements.push(renderTable(tableBuffer, `${blockIdx}-end-table`));
        }

        return <div key={blockIdx}>{elements}</div>;
      })}
    </div>
  );
};

export default MarkdownRenderer;