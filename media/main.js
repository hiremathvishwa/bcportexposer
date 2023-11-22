console.log("log test")
const vscode = acquireVsCodeApi(); // Get the vscode API object

const submitBtnElement = document.getElementById('submitBtn');
const addPort = document.getElementById('addPort');

let enteredData = ''; // Initialize a variable to store user input

submitBtnElement.addEventListener('click', () => {
    console.log("clicked");
    const value = addPort.value;
    enteredData = value; // Store the user input
    vscode.postMessage({ command: 'addPort', value }); // Send the input to extension
});

document.addEventListener('click', (event) => {
    if (event.target && event.target.tagName === 'BUTTON' && event.target.textContent === 'X') {
      const listItem = event.target.closest('.list-item-container');
      if (listItem) {
        const port = listItem.querySelector('.port-name').textContent;
        removePort(port);
      }
    }
  });

  function removePort(port) {
    const message = {
      command: 'removePort',
      value: port,
    };
    vscode.postMessage(message);
  }

  function handleLinkClick(event, key, value) {
    event.preventDefault(); // Prevent the default behavior of opening the link
    vscode.postMessage({command:'handleLinkClick',key,value});
}