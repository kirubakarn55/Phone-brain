const EXAMPLES = {
  python: 'def greet(name):\n    return "Hello, " + name\n\nprint(greet("Ada"))',
  js: 'function greet(name) {\n  return "Hello, " + name;\n}\n\nconsole.log(greet("Ada"));',
  html: '<!doctype html>\n<html lang="en">\n  <body><h1>Hello</h1></body>\n</html>',
  css: 'body {\n  background: #000;\n  color: #00f0ff;\n}',
  sql: 'SELECT name, COUNT(*) AS total\nFROM users\nGROUP BY name\nORDER BY total DESC;'
};
function languageName(language) { var value = String(language || 'js').toLowerCase(); return value === 'javascript' ? 'js' : value; }
const Coding = {
  explain: function (language, code) { var source = String(code || '').trim(); var lang = languageName(language); if (!source) return 'Paste code into Coding Mode and I will explain its structure without executing it.'; return 'Safe ' + lang + ' review: this snippet contains ' + source.split(/\r?\n/).length + ' line(s). I can describe syntax and likely intent, but Phone Brain never executes code entered here.'; },
  findLikelyErrors: function (language, code) { var source = String(code || ''); var lang = languageName(language); var issues = []; if (!source.trim()) return ['No code supplied.']; if (lang === 'python' && /(^|\n)\s*(if|for|while|def|class|try|except|with)\b[^:\n]*\n/.test(source)) issues.push('A Python block may be missing a colon. Check lines beginning with if, for, while, def, class, try, except, or with.'); if (lang === 'javascript' && /\b(const|let|var)\s+[A-Za-z_$][\w$]*\s*=\s*[^;\n]+\n/.test(source)) issues.push('A JavaScript statement may need a semicolon depending on your style and surrounding code.'); if (lang === 'sql' && /\bSELECT\b/i.test(source) && !/\bFROM\b/i.test(source)) issues.push('A SELECT query usually needs a FROM clause unless it only selects expressions.'); if (/[({[][^)}\]]*$/.test(source.trim())) issues.push('The final line may contain an unmatched opening bracket. Check paired parentheses, braces, and brackets.'); return issues.length ? issues : ['No obvious static issue was detected. This is a heuristic review, not code execution or a full compiler.']; },
  suggestFixes: function () { return 'Suggested safe workflow: isolate the smallest failing section, compare brackets and indentation, check names and inputs, then test in your own trusted development environment. Phone Brain does not execute arbitrary code in the browser.'; },
  example: function (language) { return EXAMPLES[languageName(language)] || EXAMPLES.javascript; }
};
export { Coding };