# phpMyStreamOverlay
automated stream overlays for OBS using html 5 canvas, JavaScript and PHP

> this code is pre-alpha and not fully commented or structured

## To-DO
- TODO
	- [ ] overlay editor
		- allow drag of layer contents, hotkey for keeping on x and y axis
		- clipping paths and rects (add new fill path feature)
		- allow moving and zooming of current project with mouse wheel and hotkeys
		- canvas dimensions
		- save
		- allow move / duplicate / remove multiple layers at once
	- [ ] source tracking for text isnt smart enough to update long chained set references for text display
		- pair up with all head values found during getRealValue rather than intial source
	- [ ] Allow creation of more data sets like teams `data.sets.teams`
	- [ ] settings: delete tournament, export / import tournament
	- [ ] notifications
	- [ ] Documentation
- FUTURE
	- [ ] Webhook connect to source change for browser sources
	- [ ] Bracket system