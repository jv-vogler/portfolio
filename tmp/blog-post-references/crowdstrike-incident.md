The Day Github Almost CrowdStriked Us All (Again)
João Victor Voglerby João Victor VoglerAugust 15, 2024
In the world of tech startups, everyone aspires to become the next unicorn. Okay, maybe not this kind of unicorn:

If you have no idea what I’m talking about, it probably means you were either grabbing some coffee, perhaps taking a break or simply procrastinating. Whatever you were doing at the time, it was definitely not interacting with GitHub on August 14, 2024. Basically, all of GitHub’s services went down for a reasonable amount of time, leaving lots of people anxious given the recent CrowdStrike incident which took place earlier this year.

Not the First, Not the Last
It was 10:52 PM UTC on Sunday, October 21, 2018. Everything seemed to be going perfectly with a great week ahead to look forward to. Except, as you might already have guessed, a major incident happened during routine maintenance.

For the longest 43 seconds of some of GitHub’s employees’ lives, the situation looked dire until… the connection was restored! It would certainly have been a sweet ending for the story; however, this brief and seemingly insignificant outage triggered a chain of events resulting in 24 hours and 11 minutes of service degradation. Now, you try to imagine how many people didn’t sleep well that night when users were unable to log in to the platform, outdated files were being served, and many more problems kept arising for hours to come.

That being said, there have been other times when GitHub’s services were degraded, and you might not have even noticed due to: The Orchestrator.

The Orchestrator
Of course, when you have the huge task of maintaining a platform responsible for storing code worth billions of dollars, you need to be prepared for when things go south.

GitHub’s Orchestrator is a system that helps manage MySQL clusters, but more importantly, handles automated failover.

When the main server fails or has issues, Orchestrator steps in to promote one of the replicas to become the new primary. This ensures that the service can continue running smoothly with minimal downtime. The system is designed to detect failures, choose the best replica to promote, and make the necessary changes automatically, so the transition happens as quickly as possible.

The problem in 2018 started when GitHub experienced a network issue. Despite lasting less than a minute, it was enough to make the data centers on the East and West Coasts of the U.S. lose sync with each other, leading to a situation where data written on one coast wasn’t properly replicated to the other. The system’s Orchestrator, which manages database leadership, reacted by shifting database responsibilities to the West Coast data center.

Since each database had unique data that the other didn’t, this made it impossible to switch back to the East Coast data center without risking data loss and, as a result, GitHub had to keep operations running on the West Coast, even though the East Coast applications couldn’t handle the increased latency caused by this change. This decision caused significant service disruptions, but it was necessary to protect user data.

Back to 2024 and the Outcome
Fortunately for us (and for them), there was no data loss or corruption, and, apparently things are already back to normal. The issue was caused by a misconfiguration which disrupted traffic routing and led to critical services unexpectedly losing database connectivity. It was resolved by reverting the configuration change and restoring connectivity to their databases.

While we cannot predict every possible scenario (otherwise, bugs in the code would never exist), there were actual improvements to GitHub’s service status reports after the 2018 incident, especially since some users were unable to tell which services were down at the time.

Additionally, there were likely enhancements in infrastructure redundancy, the Orchestrator, and even the physical layout of their data centers.

And even though this time the damage was not as severe as in 2018, humans will always be error-prone and bound to face misfortune, it will happen. So, all we can do is learn from these experiences and work to reduce the chances of similar problems occurring in the future. After all, a pessimist is just an optimist with experience.
