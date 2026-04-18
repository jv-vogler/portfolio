Command and Conquer Web Applications
Do, Undo, and Redo
João Victor Voglerby João Victor VoglerJanuary 17, 2024
Last Updated on September 7, 2024

Sometimes I wonder how great would it be if we could simply undo things in life. Ate more than you should during Christmas and New Year’s? Having regrets about impulsively buying that expensive product we both know you’re not using more than once or twice? Or perhaps you got unlucky because a coworker is having a great week? No worries, just Ctrl + Z your way out of every situation!

While this would be a great feature to open a pull request in planet Earth’s repository, unfortunately, it is not possible in most situations. But do you know where this is possible? In the world of Software Development, and that’s exactly what we’re talking about today: The Command Pattern.

What is the Command Pattern?
Most definitions I read online explaining the Command design pattern are not inherently bad, but for me they only made sense after I already understood it in practice, which at that point it wasn’t helpful anymore.

For someone who’s being introduced to a new concept, saying that the Command Pattern "is a behavioral design pattern that turns a request into a stand-alone object that contains all information about the request" may sound abstract and confusing.

This definition from Refactoring.Guru is indeed correct, but let’s try an analogy.

Think of it this way: when you go eat at a restaurant, you don’t go straight to the kitchen and ask the cook to make your food, do you? So, instead of calling a method directly like kitchen.make_food('Steak'), we create an object that holds our command:

# Step 1 - Define a base interface for all Commands

class Command
def execute
raise NotImplementedError, "Subclasses must implement the execute method"
end
end

# Step 2 - Define the concrete Command class for ordering food

class OrderFoodCommand < Command
def initialize(kitchen, dish_name)
@kitchen = kitchen
@dish_name = dish_name
end

def execute
@kitchen.make_food(@dish_name)
end
end

# Step 3 - Instantiate the command object (waiter writes down our order)

order_steak_command = OrderFoodCommand.new(kitchen, 'Steak')

# Step 4 - Now the command can be triggered whenever appropriate.

# (waiter brings the order to the cooks, and they can decide what to do.

# Maybe it will be executed right away, or maybe placed in a queue if the kitchen is too busy? Who knows!)

order_steak_command.execute()
Don’t even begin to whine and complain about having to write more code for something that may not seem beneficial at first glance (in fact, the idea of instantiating new objects might raise concerns about memory usage).

Trust me on this and follow my commands: take a sip of coffee or water, fix your posture, and relax.

When Should You Use It?
Since commands are now objects, it means that they can be stored, and this unlocks many cool possibilities such as:

Schedule or postpone the execution of commands.
The same command can be invoked through different means. For instance, you can toggle on your home’s light switch yourself, or instead conveniently ask a virtual assistant to do so.
Keep track of the history of executed commands.
This is a particular well-known pattern in game development for multiple reasons, but a few come to mind right away:

Instead of hard-coding a button to a method like "player.jump()", we assign buttons to a button command. Doing so, facilitates remapping what action will be triggered by each button, as shown on this chapter of the book game programming patterns.

Commands like running or jumping, that during gameplay would normally be executed by pressing buttons, when in a cutscene, could instead be executed by an AI that takes control of your character.

Having a "move command" that receives a game actor (could be a player, an enemy, etc) as an argument and executes the move action on that actor makes our code more flexible since it can now be reused to move different game entities.

Despite being great for games, the Command Pattern has many other use cases. If you are Spiderman have been paying attention so far, the fact that we can track the history of executed commands should make your spider-sense tingle you think, because it unlocks an even cooler possibility!

The knowledge of which commands were executed, and their sequence gets us closer to be able undo and redo those commands. But just like uncle Ben Linus once said: "With great power comes great responsibility Talk is cheap. Show me the code".

Starting Point
Disclaimer: The lack of optimizations through memoization and other tricks of the trade was intentional for the sake of simplicity!

Our starting code is a basic todo list since this is an app that many of us have built or will build at some point, made using React and Typescript.

I also tried my best to abstract away as much clutter as possible so that, even if you’re unfamiliar with the technologies it should be easier to follow along. Let’s dive right in!

The app consists of a single page with an input field and an "Add" button that allows us to add new todo entries to our list. We can toggle the complete status of todos by clicking on them and delete todos by clicking on "Delete".

The logic for all three functionalities is encapsulated inside a custom hook called useTodos.ts, which is used by our App.tsx to display our todos list on the screen.

What it looks like
app demo

File structure
file structure

Todo.ts
todo type

useTodos.ts
code for useTodos hook

App.tsx
app code

Hands On
Just to recap, our goal here is to be able to undo and redo our actions, which currently are: add new todos, mark them as complete, and delete them.

And we can start our implementation by defining the "shape" of our command objects. In other words, a type or interface for every command to adhere to:

// src/types/Command.ts
export type Command = {
execute: () => void
}
Actually… this is almost right. If we want commands to be undone, they should also know how to undo themselves, so our type will be like this:

// src/types/Command.ts
export type Command = {
execute: () => void
undo: () => void
}
Now, before creating and executing commands, let’s think this through. We need to keep record of the list of commands that were executed. Doesn’t this sound a lot like defining a State?

We might as well create a Mediator we can pass our commands to, so it adds them to a command history state after executing them.

But wait! Besides the history, we also need another important piece of information. See, if we undo commands and erase them from the history, we wouldn’t be able to remember what we need to redo, duh!

The solution for this problem is to create a pointer state to track our current command’s index.

demo history pointer

A good practice to follow to have quality code is to separate concerns. In React, this idea can be translated to letting components be responsible for rendering the UI while logic gets isolated in custom hooks (like we’ve done for our Todo actions).

That being said, first I’ll show the implementation I’ve came up with for our useCommands hook and highlight some aspects of it afterwards.

import { useState } from 'react'

import { Command } from '../types/Command'

export const useCommands = () => {
const [commandHistory, setCommandHistory] = useState<Array<Command>>([])
const [historyPointer, setHistoryPointer] = useState<number>(-1)

const executeCommand = (command: Command) => {
command.execute()
setCommandHistory((prevCommands) => [...prevCommands.slice(0, historyPointer + 1), command])
setHistoryPointer((prevPointer) => prevPointer + 1)
}

const undoCommand = () => {
if (historyPointer < 0) return

    const lastCommand = commandHistory[historyPointer]
    setHistoryPointer((prevPointer) => prevPointer - 1)
    lastCommand.undo()

}

const redoCommand = () => {
if (historyPointer >= commandHistory.length - 1) return

    const nextCommand = commandHistory[historyPointer + 1]
    setHistoryPointer((prevPointer) => prevPointer + 1)
    nextCommand.execute()

}

return { executeCommand, undoCommand, redoCommand }
}
If you notice, Typescript really shines here because the hook does not need to know anything about the command it is executing; it just interacts with an interface (an object with execute() and undo() methods) and is oblivious to what each function actually do.

Another noteworthy aspect of executeCommand() is the use of slice to discard any commands beyond the current history pointer. If the user undo stuff and then, instead of redoing, takes a new action, we want this new action to mark the start of a fresh history. Doing so, we ensure that only the relevant portion of the history is alive.

Awesome! The good news is that the only thing left is to refactor useTodos to make it use the useCommands hook. And the great news is that we can do it in a way that doesn’t even break the rest of our app!

This is what we have currently:

// useTodos.ts

const addTodo = (todoText: string, completedStatus: boolean = false) => {
if (todoText.trim() !== '') {
setTodos([
...todos,
{
id: new Date().toISOString(),
text: todoText,
completed: completedStatus,
},
])
}
}
Let’s begin by defining the function signature of addTodoCommand(), shall we? It will have the same parameters as addTodo(), except it will instead return a Command object, like so:

// useTodos.ts

const addTodoCommand = (todoText: string, completedStatus: boolean = false): Command => {
return {
execute() {},

    undo() {},

}
}
The next step is to place our logic inside the execute() method of the returned object:

// useTodos.ts

const addTodoCommand = (todoText: string, completedStatus: boolean = false): Command => {
// I'll let you figure out on your own why we moved the id outside. Tip: closures
const todoId = new Date().toISOString()

return {
execute() {
setTodos([
...todos,
{
id: todoId,
text: todoText,
completed: completedStatus,
},
])
},

    undo() {},

}
}
So far, everything went ok since all we’ve done was move code around we already had written, but what about undo()? Do we have to use 200% of our brain to figure out ways of filtering the todos, retracing our steps and writing dozens of lines of code to do the exact opposite of our action?

I mean, you could if you wanted to, but there’s a stupid simple way to achieve our goal:

// useTodos.ts

const addTodoCommand = (todoText: string, completedStatus: boolean = false): Command => {

- const backupState = [...todos]
  const todoId = new Date().toISOString()

return {
execute() {
setTodos([
...todos,
{
id: todoId,
text: todoText,
completed: completedStatus,
},
])
},

    undo() {

-      setTodos(backupState)
      },
  }
  }
  That’s it. We take a snapshot of the exact state of the list when this Command is created, and keep this "picture" safely stored in a closure. Then, undo()‘s only job is to set the todos to be that snapshot state we saved. Simple enough, huh?

Keep in mind that, in general, it is safer to clone states instead of referencing them directly. The method you choose for cloning will depend on how complex your state might be. However, for this specific case the spread operator gets the job done.

"Uhh… We moved logic to addTodoCommand(), now what? Are you forgetting about addTodo()?"

Well, the only thing addTodoCommand does is return a Command object, that on its own will do absolutely nothing. Conveniently though, the executeCommand() function we created in the useCommands hook expected to receive… Exactly! A Command object as an argument. So let’s use it:

// useTodos.ts

const { executeCommand } = useCommands()

const addTodo = (todoText: string, completedStatus: boolean = false) => {
if (todoText.trim() === '') return // We can skip the execution if the todo is empty
executeCommand(addTodoCommand(todoText, completedStatus))
}
Since our entrypointApp.tsx was previously interacting with a function called addTodo() that expected the exact same arguments, it did not have to change a single line, and everything keeps working perfectly due to how we structured our code!

As for the undo and redo functions, we also don’t have to do anything special besides passing them forward in the return statement:

// useTodos.ts

const { executeCommand, undoCommand, redoCommand } = useCommands()
// ...
return {
todos,
addTodo,
toggleTodo,
deleteTodo,
undoCommand,
redoCommand,
}
And here is the fully refactored hook:

// useTodos.ts

import { useState } from 'react'

import { Command } from '../types/Command'
import { Todo } from '../types/Todo'
import { useCommands } from './useCommands'

export const useTodos = () => {
const [todos, setTodos] = useState<Array<Todo>>([])
const { executeCommand, undoCommand, redoCommand } = useCommands()

const addTodoCommand = (todoText: string, completedStatus: boolean = false): Command => {
const backupState = [...todos]
const todoId = new Date().toISOString()

    return {
      execute() {
        setTodos([
          ...todos,
          {
            id: todoId,
            text: todoText,
            completed: completedStatus,
          },
        ])
      },

      undo() {
        setTodos(backupState)
      },
    }

}

const toggleTodoCommand = (id: string): Command => {
const backupState = [...todos]

    return {
      execute() {
        setTodos(
          todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
        )
      },

      undo() {
        setTodos(backupState)
      },
    }

}

const deleteTodoCommand = (id: string): Command => {
const backupState = [...todos]

    return {
      execute() {
        setTodos(todos.filter((todo) => todo.id !== id))
      },

      undo() {
        setTodos(backupState)
      },
    }

}

const addTodo = (todoText: string, completedStatus: boolean = false) => {
if (todoText.trim() === '') return
executeCommand(addTodoCommand(todoText, completedStatus))
}

const toggleTodo = (id: string) => {
executeCommand(toggleTodoCommand(id))
}

const deleteTodo = (id: string) => {
executeCommand(deleteTodoCommand(id))
}

return {
todos,
addTodo,
toggleTodo,
deleteTodo,
undoCommand,
redoCommand,
}
}
Our App in Action
app demo

You’re free to use the undoCommand and redoCommand however you see fit. It can be something as simple as adding it to buttons:

<div>
  <button onClick={undoCommand}>Undo</button>
  <button onClick={redoCommand}>Redo</button>
</div>
But also assign a keyboard shortcut such as Ctrl + Z to call the function and trigger the same action. Maybe even automatically undo the user’s actions after a few seconds just to troll them (don’t be that person, but I’m definitely not stopping you either *wink*).

Closing Thoughts
There’s way more to the Command Pattern than what I was able to cover on this article alone, like error handling or the fact that memory could eventually become an issue if you keep creating an absurd number of command objects.

Of course, there are techniques that allow us to create some immutable commands once and reuse them across your app. Ultimately, you should weigh the pros and cons before choosing any technology or design pattern to add to your projects.

Supporting undo and redo in your app is not merely about having the feature for the sake of having it or because it is cool. It demonstrates your attention to your users experience as highlighted by the Nielsen’s third heuristic on user control and freedom, as it helps them recover from eventual mistakes.

You can check out the final version of the code on this repository, as well as the starter code on the main branch for you to practice by implementing everything yourself!

That’s it for today! I hope this post helped you somehow, if you have any suggestions or questions about something that wasn’t too clear? Don’t hesitate to reach out! If you need anything, your wish is my command.
