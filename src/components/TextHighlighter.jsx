function TextHighlighter({ text, currentCharIndex }) {
  const beforeHighlight = text.substring(0, currentCharIndex);
  const highlightedChar = text[currentCharIndex] || '';
  const afterHighlight = text.substring(currentCharIndex + 1);

  return (
    <span style={{ whiteSpace: "pre-wrap" }}>
      <span>{beforeHighlight}</span>
      <span style={{ backgroundColor: "#fff59d" }}>{highlightedChar}</span>
      <span>{afterHighlight}</span>
    </span>
  );
}

export default TextHighlighter;
