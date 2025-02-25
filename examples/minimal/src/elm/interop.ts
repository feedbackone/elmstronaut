window.onElmInit = (elmModuleName, app) => {
	if (elmModuleName === "Prompt") {
		handleInit(app);
	}
};

function handleInit(app: ElmApp) {
	app.ports?.fromElm.subscribe?.((message: string) => {
		if (message === "SHOW_PROMPT") {
			showPrompt(app);
		}
	});
}

function showPrompt(app: ElmApp) {
	const answer = window.prompt(
		"What is your favorite programming language? And why is it Elm?",
	);

	if (answer?.length) {
		app.ports?.fromJs.send?.(answer);
	}
}
