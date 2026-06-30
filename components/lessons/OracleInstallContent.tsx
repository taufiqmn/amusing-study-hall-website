import { Accordion, RevealQuestion } from '@/components/Accordion'

export default function OracleInstallContent() {
  return (
    <div>
      <Accordion title="1. What two things do I actually need to install?">
        <p>You need <strong>two separate pieces</strong> working together:</p>
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          <li><strong>Oracle Database</strong> — the actual database engine that stores and manages your data</li>
          <li><strong>Oracle SQL Developer</strong> — the tool (IDE) you'll use to write and run SQL commands against that database</li>
        </ul>
        <p>Think of it like Code::Blocks for C: the database is the "engine," SQL Developer is the "editor" you actually type in.</p>
      </Accordion>

      <Accordion title="2. Installing Oracle Database (free edition)">
        <p>Go to <a href="https://www.oracle.com/database/free/get-started/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>oracle.com/database/free/get-started</a>. You'll see two options:</p>
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          <li><strong>Oracle Database 23ai Free</strong> — the latest free edition, what we'll use in this course</li>
          <li><strong>Oracle Database 18c Express Edition</strong> — an older free edition, only needed if your system can't run 23ai</li>
        </ul>
        <p>Choose the version matching your operating system, download, and run the installer — keep all default settings unless you have a specific reason to change them.</p>
      </Accordion>

      <Accordion title="3. Installing Oracle SQL Developer">
        <p>Go to <a href="https://www.oracle.com/database/sqldeveloper/technologies/download/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>oracle.com/database/sqldeveloper/technologies/download</a>, click the download button for your operating system, and install it like any normal application.</p>
      </Accordion>

      <Accordion title="4. Common installation issues">
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          <li><strong>"Listener not found" or connection errors</strong> — usually means the Oracle Database service isn't running yet. Check your system's services list to confirm it's started.</li>
          <li><strong>SQL Developer asks for a JDK path</strong> — point it to a Java installation on your system; SQL Developer will usually detect this automatically, but you can install a JDK separately if prompted.</li>
          <li><strong>Forgotten password during setup</strong> — Oracle lets you set this during installation; write it down somewhere safe immediately, since recovering it later is a hassle.</li>
        </ul>
      </Accordion>

      <RevealQuestion
        question="What's the difference between Oracle Database and Oracle SQL Developer?"
        answer="Oracle Database is the actual engine that stores and manages your data. Oracle SQL Developer is the tool/IDE you use to write and run SQL commands against that database — similar to how Code::Blocks is the editor you use to write C code."
      />
    </div>
  )
}