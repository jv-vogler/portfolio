Everything You Need To Know About Redux
Down in a hole uncovering why you would use it, no excuses now!
João Victor Voglerby João Victor VoglerJuly 29, 2025
This is the day. You will finally learn how to use Redux once and for all, or get all of the money you’ve spent to be able to read this post refunded. We’ll cover what Redux is, some good practices, useful tools to use alongside it, and how to decide if it is even the right tool for your project.

What is Redux
Redux is an event based JavaScript library for centralized state management, and it follows a few core principles:

Single Source of Truth: The global state of your entire application is stored in a single JavaScript object called the store. This makes it easier to track and manage the state.

State is Read-Only: The only way to change the state is to emit an event (also known as action in Redux) that carries an action object describing what happened. This ensures that state changes are predictable and traceable.

Changes are Made with Pure Functions: To specify how the state tree is transformed by actions, you write pure functions called reducers. A reducer takes the previous state and an action, and returns the next state.

How it works
To make things easier to reason about, let’s try using an analogy to understand how Redux works.

1. Store: The Restaurant’s Kitchen
   The store is like the restaurant’s kitchen. It holds all the ingredients (the application state) and ensures the food (data) is prepared and served properly. Everything starts and ends here.

2. Actions: The Waiter’s Order Pad
   Actions are like the orders written on the waiter’s pad. They describe what needs to happen in the kitchen, such as:

"Make a pizza with extra cheese." ({ type: 'MAKE_PIZZA', data: { extraCheese: true }})
"Prepare a rare steak." ({ type: 'PREPARE_MEAT', data: { doneness: 'rare' }})

The waiter doesn’t cook; they just relay the orders.

Customers act as action creators as they will create the action that the waiter will write down.

3. Reducers: The Chefs
   Reducers are the chefs in the kitchen. They read the orders (actions) from the waiter and decide how to prepare the food (update the state). For example:

If the waiter asks for "MAKE_PIZZA", the chef starts with the dough and toppings.
If the waiter asks for "PREPARE_MEAT", the chef ensures the steak is cooked to the requested doneness.
The chefs always return the updated food (new state) after preparing it.

4. Dispatch: The Waiter Delivering the Order
   Dispatch is the waiter handing the order (action) to the chefs (reducers). When you dispatch({ type: 'MAKE_PIZZA' }), you’re giving the chefs instructions to prepare the dish.

5. Subscribers: The Hungry Customers
   Subscribers are the customers waiting for their food. When the chefs finish cooking (state updates), the kitchen (store) notifies the waiter (representing the subscription itself), who serves the food to the customers (subscribers get notified and update accordingly).

Tying it Together:
The kitchen (store) is where all the action happens.
The waiter (dispatch) takes orders (actions) from customers and relays them to the chefs (reducers).
The chefs (reducers) follow the instructions and update the kitchen inventory (state).
The customers (subscribers) get their food (updates) when it’s ready.
Redux Thunk
For Redux specifically, "thunks" are a pattern of writing functions with logic inside that can interact with a Redux store’s dispatch and getState methods.

Using thunks require the redux-thunk middleware, which will enable asynchronous actions in Redux.

It is a separate library that allows for two types of actions: standard actions, which are plain objects, and thunk actions, which are functions capable of performing operations, using the store’s state and dispatching actions during their execution.

Both types of actions can be created using action creators. Thunks also support dependency injection out of the box, providing flexibility for managing complex logic.

Good Practices
As with any technology, there are some good practices to follow that will make your life a whole lot easier when working with Redux.

Action Creators
Action Creators are functions that will return our action objects.

Remember that to change state, we need to dispatch actions, right? But what if we need to dispatch that same action in different places? Well, that’s what action creators are for. Instead of defining that object manually every time, we just use the action creator function that will return our action:

const prepareSteak = (doneness) => {
return {
type: 'PREPARE_MEAT',
data: { doneness }
}
}
Composition (combineReducers)
Maybe when we start with Redux, a reducer for your app might look something like this:

{
// STARTERS REDUCER
"starters": [
{ id: 1, name: "Caesar Salad", available: 5 },
{ id: 2, name: "Bruschetta", available: 2 },
],

// MAINS REDUCER
"mains": [
{ id: 3, name: "Grilled Salmon", available: 16 },
{ id: 4, name: "Rare Steak", available: 20 },
],

// DESSERTS REDUCER
"desserts": [
{ id: 5, name: "Tiramisu", available: 15 },
{ id: 6, name: "Panna Cotta", available: 0 },
],
}
But this could be broken down into smaller pieces to make our code easier to maintain:

const rootReducer = combineReducers({
starters: startersReducer,
mains: mainsReducer,
desserts: dessertsReducer,
});
Custom Hooks
One of the good practices is to use custom hooks to abstract away useDispatch, useSelector, and such, but this is an extensive topic that would require a blog post of its own.

If you’re interested in diving deep into this topic, here’s a great video you can check out (after you finish reading this blog post, of course): https://www.youtube.com/watch?v=qmczXuCWT-Y

Selectors
"Selectors are primarily used to encapsulate logic for looking up specific values from state, logic for actually deriving values, and improving performance by avoiding unnecessary recalculations."

So, let’s say we want to select a piece of state because we need that information to use in a custom hook:

const useOrder = () => {
const order = useSelector((state) => state.orders.currentOrder);
// ...

return {
order,
// ...
}
}
const useOrder = () => {
const order = useSelector((state) => state.orders.currentOrder);
const dispatch = useDispatch();

const addDishToOrder = (dish) => {
dispatch({ type: 'ADD_DISH_TO_ORDER', payload: dish });
};

return {
order,
addDishToOrder,
};
};
But, if you actually needed to select the order in other places, outside of the hook, you would have to repeat this function (state) => state.orders.currentOrder again and again. So, the solution here is to extract this logic into a function so it becomes reusable and therefore more maintainable:

// orders.ts

export const getOrder = (state) => state.orders.currentOrder
// useOrder.ts

import { getOrder } from '../state/orders'

const useOrder = () => {
const order = useSelector(getOrder)
// ...

return {
order,
// ...
}
}
What’s next?
Some tools and skills will greatly improve what you’re able to achieve when working with Redux. For example:

Redux Toolkit
The Redux Toolkit package is intended to be the standard way to write Redux logic. It was originally created to help address three common concerns about Redux:

"Configuring a Redux store is too complicated"
"I have to add a lot of packages to get Redux to do anything useful"
"Redux requires too much boilerplate code"
However, I like to compare it to React vs JavaScript. There’s no point in trying to learn React if you’re not comfortable with JavaScript’s fundamentals. The same applies to Redux Toolkit vs Redux.

This is why it’s extremely important to focus on the core concepts, as the docs will be enough to make the necessary changes, or to understand Redux Toolkit.

Normalization
I apologize in advance because I can’t explain it any better than this short page of the Redux docs.

I can’t stress how useful normalization is, even outside of Redux! This is a technique that will help reduce overhead during queries and updates, avoid excessive nesting, improve readability, and simplify state management, particularly when there are relationships between lists.

Redux DevTools
Redux DevTools is an extremely useful tool that can be used as a browser extension, as a standalone app, or as a React component integrated in the client app.

It will help you visualize and debug everything we talked about today, from actions that were dispatched to how the state is currently, and much more. I definitely recommend checking it out whenever working with Redux.

Why Use Redux?
Ok, but just because you have a new tool available, it doesn’t mean it’s the right tool, right? So why (and when) would it be appropriate to choose Redux as a tool?

A considerable amount of state is necessary in lots of different parts of your application.
State will be updated frequently.
Your "state updating" logic is complex.
Your application has a medium/large size, and lots of different people work on it.
Conclusion
Hopefully, this can help you get started with Redux. I will leave a glossary below with some of the keywords that you can reference to because I know all those fancy terms can get a bit overwhelming when you’re first starting out.

Good luck on your Redux journey!

Glossary
store
The central location where the entire application’s state is kept.

action
An object that describes a change or event in the application, containing a type property and optionally additional data (usually called "payload" or "data").

It’s recommended to treat actions as "describing events that occurred".

Example:

// An action is simply an object.
const incrementByOneAction = {
type: 'INCREMENT',
payload: 1,
}

// An action creator is a function that returns an action object.
const incrementActionCreator = (amount) => ({
type: 'INCREMENT',
payload: amount,
})
reducer
A function that determines how the state should change in response to an action. Reducers are pure functions that take the current state and an action as input and return the new state.

It’s encouraged to have many reduced functions all handle the same action separately if possible.

Example:

const counterReducer = (state = initialState, action) => {
switch (action.type) {
case 'INCREMENT':
return { ...state, counter: state.counter + action.payload }
case 'DECREMENT':
return { ...state, counter: state.counter - action.payload }
default:
return state
}
}
selector
A function that retrieves specific data from the store’s state. Generally, it’s recommended to keep the state minimal and derive additional values from that state whenever possible.

Example:

const counter = useSelector((state) => state.counter)
subscribers
They are parts of the code that want to get notified when the state of the store changes, for example, the UI which needs to update the view after the state changes.

thunk
For Redux specifically, "thunks" are a pattern of writing functions with logic inside that can interact with a Redux store’s dispatch and getState methods.

Some uses for thunks include:

Moving complex logic out of components.
Making async requests or other async logic.
Writing logic that needs to dispatch multiple actions in a row or over time.
Writing logic that needs access to getState to make decisions or include other state values in an action.
https://redux.js.org/usage/writing-logic-thunks

pure function
A deterministic function that do not cause any side-effects.

deterministic function
A function that always produces the same output given the same inputs, ensuring predictability and consistency in behavior.

side effects
Any operation in a function that interacts with the outside world or modifies something outside its scope, such as API calls, logging, or updating the DOM.
