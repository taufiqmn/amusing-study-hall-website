import { Accordion, RevealQuestion } from '@/components/Accordion'

export default function WhatIsAlgorithmContent() {
  return (
    <div>
      <Accordion title="1. Isn't an algorithm just 'code'?">
        <p>Not quite — an <strong>algorithm</strong> is the step-by-step plan or recipe for solving a problem, independent of any specific programming language. Code is just one way of writing that plan down so a computer can follow it. You could describe the same algorithm in plain English, in C, in Python — the algorithm itself doesn't change.</p>
      </Accordion>

      <Accordion title="2. A real-life example, before any code">
        <p>"Find the largest number in a list" — the algorithm: look at the first number, assume it's the biggest so far. Then check each remaining number; if you find one bigger, update your "biggest so far." Repeat until you've checked everything. That's a complete algorithm — no code needed to describe it.</p>
      </Accordion>

      <Accordion title="3. Why does this even matter for programming?">
        <p>The same problem can often be solved by different algorithms with very different performance — one might take seconds, another might take hours, on the exact same data. Learning DSA (Data Structures & Algorithms) is really about learning to recognize and choose the efficient approach, not just any approach that works.</p>
      </Accordion>

      <RevealQuestion
        question="Could you write the 'find the largest number' algorithm in completely different programming languages, and still have it be the same algorithm?"
        answer="Yes — the algorithm (the logical steps) stays identical regardless of language. Only the syntax used to express it changes from language to language."
      />
    </div>
  )
}