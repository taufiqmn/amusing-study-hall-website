import { Accordion, RevealQuestion } from '@/components/Accordion'

export default function WhatIsDatabaseContent() {
  return (
    <div>
      <Accordion title="1. Why not just save everything in a text file or Excel sheet?">
        <p>You could — for a handful of records, a spreadsheet works fine. But imagine a system with millions of users, where thousands of people are reading and writing data at the exact same second. A plain file would become impossibly slow, prone to corruption, and impossible to search quickly. A <strong>database</strong> is software specifically built to store, organize, and retrieve large amounts of data, reliably and fast.</p>
      </Accordion>

      <Accordion title="2. What does 'organized' actually mean here?">
        <p>Databases organize data into <strong>tables</strong> — think of each table as a structured spreadsheet, with strict rules about what kind of data goes in each column (numbers, text, dates...). This structure is exactly what makes searching and filtering fast, even with millions of records.</p>
      </Accordion>

      <Accordion title="3. What is SQL, and how does it relate?">
        <p><strong>SQL (Structured Query Language)</strong> is the language we use to actually talk to a database — to ask it questions ("show me all users from Dhaka") or give it instructions ("add this new user"). We'll start writing real SQL in a few lessons.</p>
      </Accordion>

      <Accordion title="4. Quick Properties Recap">
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          <li>A database stores large amounts of data reliably and efficiently</li>
          <li>Data is organized into tables, similar to structured spreadsheets</li>
          <li>SQL is the language used to interact with most databases</li>
        </ul>
      </Accordion>

      <RevealQuestion
        question="Why can't a simple text file handle a system with millions of simultaneous users well?"
        answer="Text files aren't built for fast searching, concurrent reading/writing, or data integrity at scale — they become slow and risk corruption under heavy simultaneous use. Databases are specifically engineered to handle this reliably."
      />
    </div>
  )
}