export const missingElmJson = (elmJsonPath: string) => `\
I was trying to find ${elmJsonPath}, but I couldn't.

It looks like you are starting a new Elm project. Very exciting!
Try running: \`elm init\`. It will help you get set up.\
`;

export const missingElmExecutable = (elmExecutablePath: string) => `\
I was trying to find ${elmExecutablePath}, but I couldn't.
Try running: \`npm install\`. It will help you fix the issue.

If the problem still persists, please open an issue at https://github.com/feedbackone/elmstronaut/issues\
`;
