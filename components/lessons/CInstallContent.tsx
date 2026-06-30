import { Accordion, RevealQuestion } from '@/components/Accordion'

export default function CInstallContent() {
  return (
    <div>
      <Accordion title="1. Why do I need an IDE before writing any code?">
        <p>Your computer doesn't understand C code directly — it needs a program that lets you write code, then translates it into something the computer can run. That program is called an <strong>IDE (Integrated Development Environment)</strong>. We use Code::Blocks because it's free, lightweight, and beginner-friendly.</p>
      </Accordion>

      <Accordion title="2. Which version should I download?">
        <p>Always pick the version that includes <strong>"mingw"</strong> in the filename (e.g. "codeblocks-20.03mingw-setup.exe") — this bundles the compiler together with the IDE, so you don't need to install anything separately.</p>
      </Accordion>

      <Accordion title="3. Common installation issues">
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          <li><strong>"Build target needs a compiler"</strong> error — almost always means you downloaded the version without mingw bundled. Reinstall using the correct file.</li>
          <li><strong>Antivirus blocking installation</strong> — Code::Blocks is safe; temporarily allow it through your antivirus if blocked.</li>
          <li><strong>Windows SmartScreen warning</strong> — click "More info" → "Run anyway." This is normal for free, less mainstream software, not a sign of danger.</li>
        </ul>
      </Accordion>

      <RevealQuestion
        question="If you get a 'Build target needs a compiler' error, what's the most likely cause?"
        answer="You probably installed the version WITHOUT mingw bundled. Reinstall using the file with 'mingw' in its name, which includes the compiler."
      />
    </div>
  )
}