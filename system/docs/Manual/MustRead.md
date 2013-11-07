The framework is "convention over configuration", meaning there should be one and only one way to do things. If you find yourself writing lots of code to do something, or god forbid, needing to modify ANY file in the systems folder, you're propably doing it wrong. Take a deep breath and ask for assistance.

If you want to use the framework I solemnly swear to the following conditions:

1. The systems folder should never, ever be modified. I can achieve cool and smart functions without ever touching it. 
2. lbs.html should neither be modified, exept from toggeling debug on and off  
3. I must unlearn what you have learned! The framework offers a completely different methology of working with ActionPads, I will embrase it. 
4. I won't ever copy and paste code from old actionpads. A rabbit will die if I even think of coping VBScript...
5. I wan't to contribute to a better framework, any improvements, errors or bugfixes will be commited to this git repository. 
6. I will follow the design guidlines:
	1. The design should be flat, free from gradients and focused on content.
	2. The actionpad is very narrow (~250px), use the height and not the width of the actionpad.
	3. Font should be dark blue on the deafult blue background. In any other case, white should be used. It white cannot be used, use a darker variant of the background color i.e dark green on green background
	4. Font awesome is used for all icons exept for the header icons, here we use Icon Experience's new M-icon set.
	5. Stick to default colors, don't "brand" the solution with customers logo and colors.
7. I will use `lbs.common.executeVBA()` to run any LIME function and `lbs.limeDataConnection` to access any LIME object when building apps
8. I won't include any scripts and styles in my views.  