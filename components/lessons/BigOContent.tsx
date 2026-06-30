import { Accordion, RevealQuestion } from '@/components/Accordion'

export default function BigOContent() {
  return (
    <div>
      <Accordion title="1. Why do we need a way to 'measure' an algorithm?">
        <p>Imagine two algorithms that both correctly sort a list. One takes 1 second on 1000 items; the other takes 1 hour. Both "work" — but clearly one is much better. Big-O notation is how we describe and compare this kind of performance, without needing to actually run the code on a specific computer.</p>
      </Accordion>

      <Accordion title="2. What does O(1) mean?">
        <p>O(1) means <strong>constant time</strong> — the work doesn't grow at all, no matter how big the input gets. Example: checking if the first item in a list exists, regardless of whether the list has 10 or 10 million items.</p>
      </Accordion>

      <Accordion title="3. What does O(n) mean?">
        <p>O(n) means: if you double the input size, the work roughly doubles too. A simple loop through a list of n items is O(n) — check each item exactly once.</p>
      </Accordion>

      <Accordion title="4. What about O(n²)?">
        <p>This means: doubling the input roughly quadruples the work. This often happens with nested loops — for every item, you loop through every other item again.</p>
      </Accordion>

      <Accordion title="5. Quick Recap">
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          <li>O(1) — constant time, doesn't grow with input size</li>
          <li>O(n) — grows directly with input size</li>
          <li>O(n²) — grows much faster, common with nested loops</li>
        </ul>
      </Accordion>

      <RevealQuestion
        question="If an algorithm is O(n²) and you double the input size, roughly how much more work will it do?"
        answer="About 4 times more work — that's what squaring the input growth means."
      />

      <RevealQuestion
        question="What's an example of an O(1) operation?"
        answer="Checking a specific known position in a list (like 'what's the first item?') — this takes the same amount of work no matter how large the list is."
      />
    </div>
  )
}