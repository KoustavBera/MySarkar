import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React from "react";
const MarkdownRenderer = ({ content }) => (
	<ReactMarkdown remarkPlugins={[remarkGfm]}>{content || ""}</ReactMarkdown>
);

export default MarkdownRenderer;
