import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

interface CodeBlockProps {
	code: string;
	language?: string;
}

export function CodeBlock({ code, language = "tsx" }: CodeBlockProps) {
	const [html, setHtml] = useState<string>("");

	useEffect(() => {
		codeToHtml(code, {
			lang: language,
			theme: "github-dark",
		}).then(setHtml);
	}, [code, language]);

	if (!html) {
		// Fallback while loading
		return (
			<pre className="overflow-x-auto rounded-md border bg-zinc-950 p-4">
				<code className="text-sm text-zinc-100">{code}</code>
			</pre>
		);
	}

	return (
		<div
			className="overflow-hidden rounded-md border [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:text-sm [&_code]:text-sm"
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}
