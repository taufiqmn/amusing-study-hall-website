import { Accordion, RevealQuestion } from '@/components/Accordion'

export default function CBasicSyntaxContent() {
  return (
    <div>
      <Accordion title="1. The smallest possible C program">
        <p>Every C program needs a few essential pieces, even the simplest one:</p>

        <pre
          style={{
            background: 'var(--background)',
            padding: 12,
            borderRadius: 8,
            fontSize: 13,
            overflowX: 'auto',
          }}
        >
{`#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}`}
        </pre>
      </Accordion>

      <Accordion title="2. Breaking down every line — what does each part actually do?">
        <p>
          <strong>#include &lt;stdio.h&gt;</strong> — tells the compiler to include
          the Standard Input/Output header file so you can use functions like{' '}
          <code>printf()</code> and <code>scanf()</code>.
        </p>

        <p>
          <strong>int main()</strong> — every C program starts running from
          here. The <code>main()</code> function is called the entry point of a
          C program.
        </p>

        <p>
          <strong>printf("Hello, World!");</strong> — prints the text to the
          console (screen).
        </p>

        <p>
          <strong>return 0;</strong> — ends the <code>main()</code> function and
          tells the operating system that the program finished successfully.
        </p>
      </Accordion>

      <Accordion title="3. Why the semicolons everywhere?">
        <p>
          In C, a semicolon <code>;</code> marks the end of a statement—similar
          to a period ending a sentence. Forgetting one is one of the most
          common beginner mistakes and prevents the program from compiling.
        </p>
      </Accordion>

      <Accordion title="4. Why the curly braces {'{ }'}?">
        <p>
          Curly braces group statements into a block (or scope). Everything
          inside <code>{'{ }'}</code> belongs to that function or control
          structure. Every opening brace must have one matching closing brace.
        </p>
      </Accordion>

      <Accordion title="5. Common first-time mistakes">
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          <li>
            Forgetting the semicolon <code>;</code> at the end of a statement
          </li>
          <li>
            Writing <code>print()</code> instead of <code>printf()</code>
          </li>
          <li>
            Forgetting a closing curly brace <code>{'}'}</code>
          </li>
          <li>
            Forgetting <code>#include &lt;stdio.h&gt;</code> before using{' '}
            <code>printf()</code>
          </li>
          <li>
            Using smart quotes (“ ”) instead of normal quotes (")
          </li>
        </ul>
      </Accordion>

      <RevealQuestion
        question={
          'What happens if you forget the semicolon after printf("Hello, World!")?'
        }
        answer="The compiler will show a syntax error and refuse to build the program because C requires a semicolon at the end of most statements."
      />

      <RevealQuestion
        question={'What does #include <stdio.h> actually do?'}
        answer="It tells the compiler to include the Standard Input/Output header file, allowing you to use functions like printf() and scanf()."
      />
    </div>
  )
}