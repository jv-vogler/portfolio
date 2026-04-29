CodeTips#10: Throttle and Debounce
Because your code could use a little discipline
João Victor Voglerby João Victor VoglerJuly 18, 2024
Last Updated on September 4, 2024

When you learn to code, you usually start with understanding types and declaring variables, then reusing code through functions, calling pieces of code conditionally, calling code multiple times with loops, and so on.

Once you grasp these universal concepts, learning another programming language becomes mostly a matter of searching: "How do I declare a function in JavaScript?". Even if you don’t know the syntax, at least you know what you’re looking for.

But what if you don’t know what you’re after? There are things you only learn about when you face a real-life scenario of that problem. Or if you have someone more experienced guiding you. Or perhaps if you’re fortunate enough to stumble upon a blog post about it! 😉

This was the case for me when I learned about throttle and debounce. I had no idea that I needed to know about them until I had to use them in practice.

Whether you are a backend or frontend developer, knowing what debounce and throttle are will make your developer toolbox more equipped. These techniques will come in handy sooner or later, wanna bet?

What is it?
Think about the many events that happen throughout the day. Events that may not even be needed at all. I could be talking about work calls easily replaceable by an email, but what I’m actually thinking about is browser events like window resizing or scrolling which can get triggered hundreds of times in a row.

Both techniques I mentioned aim to limit the amount of times a function is invoked, despite how many times we attempt to call it. This is useful because invoking a function has a computational cost (which increases with complexity), so calling them multiple times can impact the performance of your app.

Throttle
Boring explanation: You define a delay amount. After you call and execute the throttled function, this delay starts counting. It doesn’t matter how many times the function gets called again, it will not get executed during this delay interval.

Real-life explanation: When performing CPR, compressions need to be delivered at a steady, controlled pace. No matter how urgently you want to help, you can’t speed up the compressions beyond the recommended rate.

Fun fact: If you don’t know the recommended frequency of CPR compressions, ironically, both "Stayin’ Alive" by the Bee Gees and "Another One Bites the Dust" by Queen are songs with ideal BPMs to use as a reference.

Gamer explanation: In lots of games, spells have cooldown timers that dictate how long they require to recharge, functioning like a throttle. Even in cases where they might not have a cooldown, there is almost always a mechanism like a global cooldown that prevents actions from being spammed regardless of how much the player mashes the keyboard.

Debounce
Boring explanation: You define a delay amount. After you call the debounced function, this delay starts counting and will only execute the called function after the counting finishes. However, if the function gets called again, the count will start from the beginning.

Real-life explanation: Think of it as having a conversation where you’re listening to the other person and patiently waiting for your turn to talk. The other person pauses for a brief moment but then starts talking some more. Only when they finally pause long enough it becomes your turn to speak.

Gamer explanation: It’s like casting a spell that requires charging a cast bar. If you move or are stopped before the cast time finishes, you have to start over. The spell will go off once the cast bar completes without any interruptions.

Seeing it in action
Example

I prepared a demo so you can check this out in action and experiment with it. Keep in mind that I used button clicks as the "main event" for this example since it’s more interactive, but the same idea would work for all sorts of events you can imagine.

Pay attention to the event count as the click count only serves to show that it doesn’t matter how many times you click, the event will only get triggered when it is supposed to be.

If you’re interested, you can check out the source code for the example on this repo: https://github.com/jv-vogler/throttle-debounce.

How to implement it?
"Cool, but how do I apply this in practice?" you may ask. Luckily, some libraries can spare us from the work of implementing by hand. A popular choice that comes to mind is lodash.

But creating your own is not rocket science. In fact, it might be a good way to practice important concepts such as high-order functions and closures.

function debounce(func, delay) {
let timeout

return function executedFunction(...args) {
const later = () => {
clearTimeout(timeout)
func.apply(this, args)
}

    clearTimeout(timeout)
    timeout = setTimeout(later, delay)

}
}

// Example usage:
const myDebouncedFunction = debounce(() => {
console.log('Debounced function executed')
}, 1000)
function throttle(func, delay) {
let inThrottle = false

return function executedFunction(...args) {
if (!inThrottle) {
func.apply(this, args)
inThrottle = true
setTimeout(() => (inThrottle = false), delay)
}
}
}

// Example usage:
const myThrottledFunction = throttle(() => {
console.log('Throttled function executed')
}, 1000)
Use cases
Like most things in software engineering, there are no "set in stone" rules saying when you should or should not apply a specific technique. However, I’ll list some scenarios where you might see them being used.

Debounce on the Frontend
Search Input: Trigger search queries only after the user has stopped typing for a certain period.
Form Validation: Validate form fields only after the user stops typing to avoid constant validation checks.
Window Resize: Adjust layouts or elements only after the user has finished resizing the window.
Auto-Save Drafts: Save form data or text input automatically, but only after the user stops typing.
Navigation menus: Keep the menu open for a few moments preventing it from closing immediately after hovering off to improve the UX.
Debounce on the Backend:
Database Writes: Batch updates to the database to avoid frequent write operations.
Logging: Consolidate log entries to reduce the frequency of writes to log files.
Notifications: Send notifications only after a certain period of inactivity, to avoid spamming.
Cache Updates: Update caches only after a certain period to reduce the frequency of cache refreshes.
Rate-Limited Operations: Prevent excessive API calls to rate-limited services by debouncing the requests.
Throttle on the Frontend:
Scroll Event: Limit the frequency of scroll position checks to improve performance.
Resize Event: Limit the frequency of layout adjustments during window resizing.
Button Clicks: Prevent multiple clicks on a button within a short time frame to avoid accidental double-clicks.
Drag and Drop: Limit the frequency of position updates during drag-and-drop operations.
Infinite Scrolling: Control the rate of loading more content as the user scrolls down.
Throttle on the Backend:
API Rate Limiting: Ensure that API endpoints are not overwhelmed by too many requests in a short time.
Job Processing: Control the rate of processing jobs from a queue to prevent overloading the system.
Email Sending: Throttle the sending of bulk emails to avoid hitting email provider limits.
Data Aggregation: Throttle the frequency of data aggregation tasks to manage the load on the database.
Resource-Intensive Operations: Throttle resource-heavy operations to ensure they don’t consume too many resources at once.
Caveats
Note that you should NOT add a debounce or throttle to absolutely everything you see in front of you as this could end up backfiring and making your app feel sluggish and unresponsive. Also, there isn’t a silver-bullet value for delay amounts as each use case will be different and require some tinkering until you find the sweet spot.

Another common issue is that non-deterministic behavior from debounce/throttle functions can introduce race conditions, particularly when state is involved, which can potentially become a headache to debug.

Wrapping up
There are lots of scenarios I haven’t covered where a throttled function would be a great call, or a debounce would fit like a glove, but hopefully from now on, if you ever come across a situation like this, at least now you know what you might be looking for.

Don’t forget to check out the interactive example if you missed it, and thank you for reading!
