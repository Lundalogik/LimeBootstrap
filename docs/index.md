hero: Metadata enables hero teaser texts

# Introduction
Lime Bootstrap is made to make it easier, better and faster working with Actionpads in Lime CRM. The framework relies heavily on Knockout.js and Twitter Bootstrap, styled and adapted to Lime CRM. The framework is mainly used by simple configuration in combination with  many built in convinience functions but it is also very expandable through the use of custom components.

The framework is "opininated and convention over configuration", meaning there should be one and only one way to do things. If you find yourself writing lots of code to do something, or god forbid, needing to modify ANY file in the systems folder, you're propably doing it wrong. The framework is there to guide and help you.

These few steps can  act as a guide

1. The systems folder or `lbs.html` should never, ever be modified. You can achieve cool and smart functions without ever touching it.

3. Follow the design guidelines:
	1. The design should be flat, free from gradients and focused on content.
	2. The actionpad is very narrow (~250px), use the height and not the width of the actionpad.
	3. Use appropriate colors
	4. Use appropriate icons
	5. Don't "brand" the solution with customers logo and colors.

5. Keep ActionPad views free from advanced logic, use components for anything advanced

6. Contribute to a better framework, any improvements, errors or bugfixes will be committed to this git repository.


Happy coding!