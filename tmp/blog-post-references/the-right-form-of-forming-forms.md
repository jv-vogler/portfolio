Beginner / Posts
The Right Form of Forming Forms
How to provide a great user experience and validate forms on the frontend.
João Victor Voglerby João Victor VoglerAugust 16, 2023
Last Updated on March 14, 2024

Imagine you just got paid and can finally buy the laptop you have been dreaming about for months. Since it is expensive (and you are smart), it’s better to be safe rather than sorry and buy it from a trustworthy website. So far so good, the only problem is that when you click "Sign Up" in the one of the forms to create your account, this is what you see:

bad example 1

I mean, you really want the laptop, it is worth the effort. Just take a deep breath, drink some coffee, and push through.

You lost a chunk of your sanity, but managed to create your account, nice! At least, after that, the process of choosing the laptop and adding it to the shopping cart was surprisingly straightforward, phew! The only thing left is to click the big green checkout button. You stare at it. You start to sweat. You close your eyes, click it, brace for impact, and…

bad example 2

There is so much red that if you were a bull you’d be rushing at your screen. But wait, it gets worse. After submitting the checkout form you find out there was a problem, and you have to start all over. At this point, if you haven’t turned into the Joker already, you at least question if it’s actually worth it to buy the laptop instead of getting a new toaster or something.

Money pages
I hope I convinced you about how important forms are. After all, they are called "money pages" for good reason. It is how e-commerce sites sell their products, how SaaS (software as a service) companies collect payment for their service, and even how non-profit organizations raise money online.

That being said, one of the big reasons for abandonments during checkouts is due to poor form design. Making sure the user has a good experience in your form is not only a nice thing to do for someone else but also means you could get a raise.

The tips I’ll share today should be useful whether you are building your form using plain HTML, CSS, and JavaScript, or using a framework with libraries such as React alongside react-hook-form or formik.

Forms under the hood
But before we move any further, it never hurts to get a refresher on the building blocks of a form.

<form action="/submit_page" method="post">
  <div class="form-row">
    <label for="username">Username</label>
    <input name="username" id="username" type="text" />
  </div>

<button type="submit">Submit</button>

</form>
In this example, we have a form wrapping other elements. The div here serves just as a container for styling purposes. What we care about right now are the label and the input

There are two things worth noting here. We need to identify our form fields both for the user (client-side) and also for our backend that will receive the submitted data (server-side).

We should always use a label associated with an input through the for and id attributes. The label identifies what is expected of the user on that input field and has accessibility benefits that we get for free by associating them.

The name attribute could be seen as the "label" for our backend once we submit the form. It will be the key associated with the value of whatever was sent inside that input. It’s worth noting that the value of name doesn’t necessarily have to be the same as for and id.

Validation
Validation is all about expectations. It helps us make sure that the data we collect has the expected format. It also helps users know if what they’ve filled in is what was expected of them.

The backend of your application will (or at least should) take care of validating the data they receive on their end. However, this does not mean that on the front-end you are supposed to cross your arms and call it a day. One could argue that client-side validation is frail, and if someone wanted to be cheeky they could bypass your rules, and that’s true, but remember: our goal here is to provide the best user experience.

With that in mind, based on this great thread by Victor (@vponamariov) here are a few tips to enhance the user experience in forms:

Waste sorting
Don’t gather all trash (or errors in our case) and throw them in the same garbage can. Instead, put each one near its relevant context.

waste sorting example

Be positive
Nobody likes to hear just what they have done wrong. Give users a cookie when they behave and fill in the inputs correctly.

be positive example

Be proactive
It is good to give users feedback, but an even better idea is to help them avoid mistakes altogether. Take advantage of masks and use reasonably sized inputs.

be proactive example

Use icons. Use messages. Use icons and messages
Using icons is an effective way of helping colorblind users notice errors. Just make sure you don’t hide the error messages entirely behind the icons, help users work less.

use icons and messages example

Make it human-readable
Don’t be technical or vague unless you’re making a form to collect input from robots.

make it human-readable example

Don’t show errors all at once
Chances are your user is not a bull that will rush at the screen but just to be safe avoid overwhelming them with information.

don't show all errors example

Don’t disable the submit button
Allow users to click the submit button to see which inputs they might have scrolled past without filling in. If the submit button is blocked, they won’t know what to do next.

don't disable submit button example

Don’t use placeholders
Placeholders can harm the user experience in many different ways.

They can’t be automatically translated. If used in place of labels they can lock out assistive technology. They can hide important information when content is entered, and have even more problems.

You can read more about the issues of using placeholders here.

don't use placeholders example

Show password rules right away
Again, make users work less. Instead of having them click "Sign Up" to see the password requirements show the rules right away. Ideally, highlighting requirements as they are successfully filled.

show password rules example

Bonus tips:
Shorter labels are preferred as they are easier to scan.
Labels above the form controls are preferred.
Avoid multi-column form layouts if possible.
Help users avoid re-entering data by leveraging autofill.
The recommended tap target size of a button is at least 44px.
Use at least 1rem font-size for form controls.
Validation behavior
Okay, so now what? We already have a good idea about how to validate our forms, but when should we do it? There are a few ways you could go about the behavior of your validation, but one of them stands out the most.

Passive Mode 😶
Triggered just when the form is submitted.

Problem: If the user filled 10 inputs with incorrect data they would get 10 errors thrown all at once.

passive example

Aggressive Mode 😡
Triggered every time the user presses a key.

Problem: The user might not have finished inputting data but the error is already thrown.

aggressive example

Lazy Mode 😴
Triggered when the user leaves the input.

Problem: If the user made a mistake, then returned to the input and fixed it, it will still be red until they leave the input again, which could be misleading.

lazy example

Eager Mode 😡 + 😴 = 🤩
Our winner is the combination of the aggressive and lazy behaviors.

Solution: Starts lazy validating only when the user leaves the input. If the input is invalid it behaves aggressively (checking every key press) until the input is valid. Once the input is valid, it goes back to being lazy.

eager example

Wrapping up
That’s it! Although there is a lot more to say about forms and how to improve them, we covered their vital importance for most websites and learned a few tips on how to make dealing with them a more pleasant experience for our users.

I’ve made a small example so you can check out some code as well as play with each form behavior to see them in action: https://replit.com/@jv-vogler/Form-Validation

By the way, if you are interested in knowing more about State Machines you can also check out this awesome post by Jeferson!

Hopefully, with what we learned here someone, somewhere, around the world won’t have to go through the same pain you went while trying to buy the laptop.
