The JS Widget is getting quite bloated by the number of files we need to keep track, and there's a lot of weird separated files that were a result of integrating new features, schedule views, and testing environments together.

For example, the Morning and Afternoon schedule views have completely separate JS files and CSS files, despite carrying awfully similar functions, elements, features, and design properties - with only noticeable changes to the background colours of the labels, buttons, and schedule container to distinguish themselves as being 'Morning' or 'Afternoon'.

The END GOAL of the design of these schedule views is to have the 'Morning' schedule view and 'Afternoon' schedule view to be able to be switched over by clicking on the 'Morning Events' and 'Afternoon Events' tabs respectively. As a result, the Morning and Afternoon schedule views need to be combined, and that each schedule view 'state' - that is whether the user is looking at the 'Morning' schedule view or the 'Afternoon' schedule view - is determined by whether the 'Morning Events' tab or the 'Afternoon Events' tab is clicked or not.

By default, the first schedule view that the user should see when viewing the 'combined' schedule view for the first time is the 'Morning Events'.

What I must expect after completing this consolidation plan is that if I open 'widget-demo.html', everything is to be working as perfectly as it is right now. This means that the all the Event Panel designs are loaded correctly, the Thursday and Full-Day Schedule Views are loaded correctly (and toggleable to Afternoon and Morning, and vice versa), and that the Event Category filter dropdown works exactly as it is right now - including how it is designed, positioned, and laid out right now.

YOU MUST NOT INTEFERE WITH THE JS WIDGET'S UI / UX DESIGN. If you do I will be very angry at you.

Now, with all of that said, this is what you need to complete:
- Outline the steps and instructions in completing this consolidation work, without compromising, destroying, or changing the current designs and layout of the schedule views already in place. Read through the appropriate documentation found in 'docs' to figuring out the right functions, CSS classes, and files you need to edit, reference, and protect from making changes.

- Review the files in the 'tasks-obsolete' folder and fill in any gaps the above written documentation to ensure that proper checks and cautions are put in place to prevent any possibility of AI hallucinations, development errors, or mishandling of CSS or JS code from taking place at all during this plan.

Write the new instructions and tasks to accomplish this consolidation plan in 'tasks-drafts'
