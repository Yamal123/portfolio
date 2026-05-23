'use client'

import Image from 'next/image'

function formatInlineHtml(line: string) {
  return line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
}

export function ArticleMarkdown({
  content,
  theme,
}: {
  content: string
  theme: string
}) {
  const orangeColor = theme === 'dark' ? 'text-orange-400' : 'text-orange-500'
  const mutedBorder = theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
  const codeBg = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'

  const lines = content.split('\n')
  const nodes: React.ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      nodes.push(
        <pre
          key={key++}
          className={`my-4 overflow-x-auto rounded-xl border p-4 text-sm ${mutedBorder} ${codeBg} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}
        >
          {lang && (
            <div className={`mb-2 text-xs font-medium ${orangeColor}`}>{lang}</div>
          )}
          <code className="font-mono whitespace-pre">{codeLines.join('\n')}</code>
        </pre>
      )
      i++
      continue
    }

    if (line.startsWith('|') && line.includes('|', 1)) {
      const tableRows: string[][] = []
      while (i < lines.length && lines[i].startsWith('|')) {
        const row = lines[i]
          .split('|')
          .slice(1, -1)
          .map((cell) => cell.trim())
        const isSeparator = row.every((cell) => /^[-:]+$/.test(cell))
        if (!isSeparator) tableRows.push(row)
        i++
      }
      if (tableRows.length > 0) {
        const [header, ...body] = tableRows
        nodes.push(
          <div key={key++} className={`my-6 overflow-x-auto rounded-xl border ${mutedBorder}`}>
            <table className="w-full text-sm text-left">
              <thead className={theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}>
                <tr>
                  {header.map((cell, ci) => (
                    <th key={ci} className={`px-4 py-3 font-semibold ${orangeColor}`}>
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, ri) => (
                  <tr
                    key={ri}
                    className={theme === 'dark' ? 'border-t border-gray-800' : 'border-t border-gray-100'}
                  >
                    {row.map((cell, ci) => (
                      <td key={ci} className={`px-4 py-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span dangerouslySetInnerHTML={{ __html: formatInlineHtml(cell) }} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
      continue
    }

    const imageMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/)
    if (imageMatch) {
      const [, alt, src] = imageMatch
      const isSvg = src.endsWith('.svg')
      nodes.push(
        <figure key={key++} className="my-8">
          <div
            className={`overflow-hidden rounded-2xl border shadow-sm ${mutedBorder} ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white'}`}
          >
            {isSvg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={alt} className="w-full h-auto" />
            ) : (
              <Image
                src={src}
                alt={alt}
                width={1200}
                height={630}
                className="w-full h-auto"
              />
            )}
          </div>
          {alt && (
            <figcaption
              className={`mt-2 text-center text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}
            >
              {alt}
            </figcaption>
          )}
        </figure>
      )
      i++
      continue
    }

    if (line.startsWith('> ')) {
      nodes.push(
        <blockquote
          key={key++}
          className={`my-4 border-l-4 border-orange-500 pl-4 italic ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
          dangerouslySetInnerHTML={{ __html: formatInlineHtml(line.slice(2)) }}
        />
      )
      i++
      continue
    }

    if (line.startsWith('### ')) {
      nodes.push(
        <h3 key={key++} className={`text-xl font-bold mt-6 mb-3 ${orangeColor}`}>
          {line.slice(4)}
        </h3>
      )
    } else if (line.startsWith('## ')) {
      nodes.push(
        <h2 key={key++} className={`text-2xl font-bold mt-8 mb-4 ${orangeColor}`}>
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith('# ')) {
      nodes.push(
        <h1 key={key++} className={`text-3xl font-bold mt-10 mb-6 ${orangeColor}`}>
          {line.slice(2)}
        </h1>
      )
    } else if (line.startsWith('- **')) {
      const end = line.indexOf('**', 3)
      nodes.push(
        <li key={key++} className="ml-6 my-2 list-disc">
          <strong>{line.slice(3, end)}</strong>
          {line.slice(end + 2)}
        </li>
      )
    } else if (line.startsWith('- ')) {
      nodes.push(
        <li key={key++} className="ml-6 my-2 list-disc">
          {line.slice(2)}
        </li>
      )
    } else if (line.match(/^\d+\. /)) {
      nodes.push(
        <li key={key++} className="ml-6 my-2 list-decimal">
          {line.replace(/^\d+\. /, '')}
        </li>
      )
    } else if (line.trim() === '') {
      nodes.push(<br key={key++} />)
    } else {
      nodes.push(
        <p
          key={key++}
          className="my-3 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatInlineHtml(line) }}
        />
      )
    }
    i++
  }

  return <div>{nodes}</div>
}
