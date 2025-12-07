import React from 'react';

const parseInline = (text: string) => {
    // Split by bold (**), code (`), or italic (*)
    // Regex explanation:
    // (\*\*.*?\*\*) matches bold
    // (`.*?`) matches code
    // (\*.*?\*) matches italic (lazy match)
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
    
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-bold text-indigo-300">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={index} className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-[0.85em] text-pink-400 border border-white/10">{part.slice(1, -1)}</code>;
        }
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

            if (trimmed.startsWith('|')) {
                inTable = true;
                tableBuffer.push(trimmed);
                return;
            } else if (inTable) {
                // End of table
                if (tableBuffer.length > 0) {
                    elements.push(renderTable(tableBuffer, `${key}-table`));
                    tableBuffer = [];
                }
                inTable = false;
            }

            if (!trimmed) {
                elements.push(<div key={key} className="h-1" />);
                return;
            }
            if (trimmed.startsWith('> ')) {
                elements.push(<div key={key} className="border-l-4 border-indigo-500 bg-indigo-500/10 pl-3 py-2 italic text-slate-300 rounded-r-lg my-1">{parseInline(trimmed.slice(2))}</div>);
                return;
            }
            if (trimmed.startsWith('### ')) {
                elements.push(<h3 key={key} className="font-bold text-base md:text-lg mt-3 mb-1 text-purple-400">{parseInline(trimmed.slice(4))}</h3>);
                return;
            }
            if (trimmed.startsWith('## ')) {
                elements.push(<h2 key={key} className="font-bold text-lg md:text-xl mt-3 mb-1 text-indigo-400 border-b border-indigo-500/30 pb-1">{parseInline(trimmed.slice(3))}</h2>);
                return;
            }
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                elements.push(
                    <div key={key} className="flex gap-2 ml-1 items-start">
                        <span className={`min-w-[6px] mt-2 h-1.5 w-1.5 rounded-full shrink-0 ${isUser ? 'bg-indigo-300' : 'bg-indigo-500'}`}></span>
                        <span className="flex-1">{parseInline(trimmed.slice(2))}</span>
                    </div>
                );
                return;
            }
            if (/^\d+\.\s/.test(trimmed)) {
                 const [number, ...rest] = trimmed.split('.');
                 elements.push(
                    <div key={key} className="flex gap-2 ml-1 items-start">
                        <span className="font-mono font-bold text-indigo-400 text-sm mt-0.5">{number}.</span>
                        <span className="flex-1">{parseInline(rest.join('.').trim())}</span>
                    </div>
                 );
                 return;
            }

            elements.push(<p key={key} className="min-h-[1em] leading-relaxed">{parseInline(line)}</p>);
        });
        
        // Flush remaining table if any (e.g. table at end of message)
        if (tableBuffer.length > 0) {
             elements.push(renderTable(tableBuffer, `${blockIdx}-end-table`));
        }

        return <div key={blockIdx}>{elements}</div>;
      })}
    </div>
  );
};

export default MarkdownRenderer;