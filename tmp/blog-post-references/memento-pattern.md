How To Avoid Losing Your App State
The Memento Pattern
João Victor Voglerby João Victor VoglerJuly 3, 2025
Memento mori. There are only two guaranteed things in life: one, we both are going to die. And while I’d prefer you go first… and it’s nothing personal – I do hope you go peacefully in your sleep, just like my grandmother. And not screaming like the passengers in her car.

The second guarantee? A new revolutionary JavaScript framework will be released before you even think about finishing your coffee, but don’t panic — we can’t let a mere existential crisis (of course, mostly due to the JavaScript frameworks spam) get in the way of honing our programming skills. Today, we’re going to discuss: the Memento Pattern.

Remember This
According to the Cambridge Dictionary, a memento is an object kept to remember a person, place, or event. This meaning aligns perfectly with the Memento Design Pattern, a behavioral pattern that lets you save an object’s internal state and restore it later without exposing its internal implementation.

This pattern is a great complement to the Command Design Pattern, which focuses on executing and undoing operations, whereas the Memento Pattern stores object state. We’ll explore how to implement it soon enough but if we didn’t know when this pattern is or is not the right choice, that would be as useful as those meetings that could easily have been an email.

Digging Up the Details
The most common use case for the Memento Pattern is implementing undo/redo functionality. Think of text editors, drawing apps, or any tool where users expect to backtrack without losing their progress.

But it doesn’t stop there! The pattern also shows up in games (think save/load mechanics), simulations (rolling back to a previous state), and even custom transaction flows in the UI or domain logic such as multi-step forms where you want to group operations and revert them all if something goes wrong. In each case, the goal is the same: snapshot the state, restore it later, and do it all without leaking the object’s internal workings.

Grave Mistakes
Like any design pattern, the Memento Pattern isn’t a silver bullet; it’s all about trade-offs. Here are some important considerations before reaching for it:

Memory: When there are frequent state changes by the client, or when creating a large object state, RAM consumption becomes a concern.

Immutability: In dynamic languages like JavaScript, Python, or Ruby, it’s difficult to guarantee that a saved state remains truly untouched. Without strict immutability, a memento might be accidentally mutated after it’s saved.

Overhead: Introducing this pattern adds architectural complexity. If your application doesn’t require features like state rollback, undo functionality, or checkpointing, the added abstraction might do more harm than good.

Bringing it to Life
To implement the pattern, we split responsibilities among three participants: the Originator, the Memento, and the Caretaker.

Originator: The object whose state we want to save and restore. It creates and accepts mementos, but never exposes its internal structure to the outside world.

Memento: A snapshot of the originator’s internal state. It should be immutable and only accessible by the originator. The memento is opaque to all other parts of the system, including the caretaker.

Caretaker: The manager of mementos. It decides when to capture or restore the state, but it doesn’t inspect or modify the state; it just holds the snapshots.

Key Characteristics
Mementos are often made immutable to prevent accidental changes after being saved.

The pattern maintains encapsulation by ensuring only the originator can interpret or modify its saved state.

If language features allow, the memento class is often nested inside the originator to tightly control access.

The caretaker knows when to capture and restore the state, but should never touch the contents of a memento.

Enough theory. Let’s check out a more practical (yet simple) application:

Memento
class CounterMemento {
constructor(private readonly state: number) {}

getState() {
return this.state
}
}
The Memento stores a snapshot of the Counter’s internal state. It is immutable and only exposes a getter to retrieve the saved value. The Counter is the only one that knows how to use it.

Originator
class Counter {
private value = 0

increment() {
this.value++
}

decrement() {
this.value--
}

getValue() {
return this.value
}

save(): CounterMemento {
return new CounterMemento(this.value)
}

restore(memento: CounterMemento) {
this.value = memento.getState()
}
}
The Originator is the main object whose state we want to save and restore. It can generate mementos representing its current state (which in this case it’s the value property), and it can also restore a previous state from a given memento.

Caretaker
class History {
private stack: CounterMemento[] = []

push(memento: CounterMemento) {
this.stack.push(memento)
}

pop(): CounterMemento | undefined {
return this.stack.pop()
}
}
The Caretaker stores and manages mementos. It doesn’t know or care about what’s inside them, it simply knows when to save and restore the originator’s state.

Usage
const counter = new Counter()
const history = new History()

counter.increment() // 1
history.push(counter.save())

counter.increment() // 2
history.push(counter.save())

counter.increment() // 3
console.log(counter.getValue()) // 3

// Undo
counter.restore(history.pop()!)
console.log(counter.getValue()) // 2

counter.restore(history.pop()!)
console.log(counter.getValue()) // 1
Here we simulate a simple undo mechanism:

The counter is incremented multiple times, and after each change, we store a snapshot (memento) in the history.
Later, when we want to undo those changes, we call restore() with the last saved memento popped from the history stack.
This effectively decouples how we perform changes (increment) from when we decide to preserve or revert them. Notice how the Originator (the Counter) is in full control of its state, while the Caretaker (the History) only handles the when; the sequencing of state saves and rollbacks.

However, this separation also introduces a risk: if we forget to save the state before a change (e.g., forgetting history.push(counter.save())), the undo history becomes inconsistent. This fragility is a signal that the Memento Pattern works best when paired with a higher-level orchestration — and that’s where the Command Pattern often fits naturally. It allows us to bundle both the action and its associated state into an atomic unit, making undo flows much more reliable.

Bonus: Redux Time-Travel Debugging as a Real-World Analogy
If you’ve used Redux DevTools, you’ve already experienced the Memento Pattern; whether you realized it or not.

Redux time-travel debugging allows you to inspect and revert the application state at any point in time. Under the hood, Redux stores a sequence of state snapshots; each one a frozen copy of the app state after a dispatched action. That sequence is essentially acting as a caretaker. Each state in the timeline is a memento, and the Redux store is the originator, managing current state and emitting changes.

Here’s the parallel:

Concept Redux Memento Pattern
Originator Redux Store Counter
Memento Previous application state CounterMemento
Caretaker Redux DevTools (or internal history) History
Save state After dispatching an action history.push(counter.save())
Restore state Jumping to a previous state counter.restore(memento)
Redux enhances this with time-travel and action replay, but the core idea remains the same: store snapshots, and restore them when needed, without breaking encapsulation or mutating past states.

This pattern is also conceptually embedded in libraries like Recoil (useRecoilTransactionObserver), or in state machines (like XState) where you can checkpoint and roll back; all variations of the same idea.

Conclusion
There’s something elegant and maybe even poetic about capturing moments in code just as we do in life. The Memento Pattern empowers us to pause, snapshot, and rewind an object’s state without cracking open its internals. It preserves encapsulation while enabling rollback logic that feels clean and purposeful.

But like all patterns, it’s not meant to be overused. If your app doesn’t need undo/redo flows or state checkpointing, this might just be overengineering. Yet when you do need it, especially alongside complementary patterns like Command, Memento provides a clear and flexible way to separate state management concerns in complex applications.

Ultimately, it’s not just about how we implement the pattern.. it’s about why and when. Mastering that judgment is what separates good design from just memorizing diagrams.
