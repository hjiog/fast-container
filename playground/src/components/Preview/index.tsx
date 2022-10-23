import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const Preview: React.FC = () => {
  const [sourceCode, setSourceCode] = useState<Record<string, string>>();
  useEffect(() => {
    const request = async () => {
      try {
        const data = await (await fetch('/source.json')).json();
        setSourceCode(data);
      } catch (e) {
        console.log(e);
      }
    };
    request();
  });
  const currentSourceCode = Object.entries(sourceCode || {}).find(([key]) =>
    location.pathname.includes(key),
  )?.[1];

  return (
    <SyntaxHighlighter language="tsx" style={vscDarkPlus}>
      {currentSourceCode || ''}
    </SyntaxHighlighter>
  );
};
