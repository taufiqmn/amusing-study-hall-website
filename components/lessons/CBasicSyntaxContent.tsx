import { Accordion, RevealQuestion } from '@/components/Accordion'

export default function CBasicSyntaxContent() {
  return (
    <div>
      <Accordion title="1. The smallest possible C program">
        <p>Every C program needs a few essential pieces, even the simplest one:</p>
        <pre style={{ background: 'var(--background)', padding: 12, borderRadius: 8, fontSize: 13, overflowX: 'auto' }}>{`#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}`}</pre>
      </Accordion>

      <Accordion title="2. Breaking down every line — what does each part actually do?">
        <p><strong>#include &lt;stdio.h&gt;</strong> — brings in pre-written code for input/output functions like printf, so you can use them.</p>
        <p><strong>int main()</strong> — every C program starts running from here; "main" is the entry point.</p>
        <p><strong>printf("Hello, World!")</strong> — prints text to the screen.</p>
        <p><strong>return 0;</strong> — tells the operating system the program finished successfully.</p>
      </Accordion>

      <Accordion title="3. Why the semicolons everywhere?">
        <p>In C, a semicolon <code>;</code> marks the end of a statement — similar to a period ending a sentence. Forgetting one is the single most common beginner mistake, and it stops the whole program from compiling.</p>
      </Accordion>

      <Accordion title="4. Why the curly braces { }?">
        <p>Curly braces group statements together into a "block" — everything inside <code>{'{ }'}</code> belongs to that function. Every opening brace needs exactly one matching closing brace.</p>
      </Accordion>

      <Accordion title="5. Common first-time mistakes">
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          <li>Forgetting the semicolon <code>;</code> at the end of a line</li>
          <li>Misspelling <code>printf</code> as <code>print</code> (that's Python, not C)</li>
          <li>Forgetting the closing curly brace <code>{'}'}</code></li>
          <li>Forgetting <code>#include &lt;stdio.h&gt;</code> when using printf</li>
        </ul>
      </Accordion>

      <RevealQuestion
        question="What happens if you forget the semicolon after printf(\"Hello, World!\")?"
        answer="The compiler will show a syntax error and refuse to build the program — C requires a semicolon at the end of most statements."
      />

      <RevealQuestion
        question="What does #include <stdio.h> actually do?"
        answer="It brings in pre-written code for standard input/output functions, like printf and scanf, so you can use them in your program."
      />
    </div>
  )
}