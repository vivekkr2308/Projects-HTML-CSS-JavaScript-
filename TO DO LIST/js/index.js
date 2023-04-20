function recalculateIndex(doneDOM, pendingDOM) {
    Array.from(doneDOM.children).forEach((el, index) => {
        const itemName = el.innerText.split(".")[1].trim();
        el.childNodes[1].textContent = `${index + 1}. ${itemName}`;
    });
    Array.from(pendingDOM.children).forEach((el, index) => {
        const itemName = el.innerText.split(".")[1].trim();
        el.childNodes[1].textContent = `${index + 1}. ${itemName}`;
    });
}

function checkboxClickHandler(event) {
    const isChecked = event.target.checked;
    const listItemDOM = event.target.parentElement;
    const listDoneDOM = document.getElementsByClassName('js-done-list')[0];
    const listPendingDOM = document.getElementsByClassName('js-pending-list')[0];
    isChecked ? listDoneDOM.appendChild(listItemDOM) : listPendingDOM.appendChild(listItemDOM);
    recalculateIndex(listDoneDOM, listPendingDOM);
}

function getItemDOM(value, index) {
    const fragment = document.createDocumentFragment();
    const itemDOM = document.createElement('div'); // create element
    itemDOM.classList.add("td-list-item", "tds-display-flex", "td-vcenter"); // adds a class
    const textNode = document.createTextNode(`${index + 1}. ${value}`); // special text node
    const checkboxDOM = document.createElement('input');
    checkboxDOM.type = "checkbox";
    checkboxDOM.classList.add('td-checkbox');
    checkboxDOM.addEventListener('change', checkboxClickHandler);
    itemDOM.appendChild(checkboxDOM);
    itemDOM.appendChild(textNode); // appending
    fragment.appendChild(itemDOM);
    return fragment;
}

function addItemToPendingList(value) {
    const listRootDOM = document.getElementsByClassName('js-pending-list')[0];
    listRootDOM.appendChild(getItemDOM(value, listRootDOM.children.length));
}

function onBtnClickHandler(event){
    const inputFieldDOM = document.getElementsByClassName("js-input")[0];
    const value = inputFieldDOM.value;
    if (value === "") return;
    /**
     * add a new item in the pending list
     */
    inputFieldDOM.value = "";
    addItemToPendingList(value);
}

function bindEvents() {
    const addBtnDOM = document.getElementsByClassName("js-add-btn")[0];
    /** 
     * bind addBtn
    */
   addBtnDOM.addEventListener('click', onBtnClickHandler);
}

function preFillToDo(data) {
    const doneFragment = document.createDocumentFragment();
    const pendingFragment = document.createDocumentFragment();
    data.filter(item => item.completed).forEach((item, index) => {
        doneFragment.appendChild(getItemDOM(item.title, index));
    });
    data.filter(item => !item.completed).forEach((item, index) => {
        pendingFragment.appendChild(getItemDOM(item.title, index));
    });
    const listDoneDOM = document.getElementsByClassName('js-done-list')[0];
    const listPendingDOM = document.getElementsByClassName('js-pending-list')[0];
    listDoneDOM.appendChild(doneFragment);
    listPendingDOM.appendChild(pendingFragment);
}


async function getTodoData() {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos`);
        const jsonResponse = await response.json();
        preFillToDo(jsonResponse);
    }catch(e) {
    }
}
function main() {
    /**
     * 1. Bind to add button, adds item to pending list
     * 2. If user checks an item in pending list, then move it to done list
     */
    bindEvents();
    getTodoData();
}
window.addEventListener('DOMContentLoaded', main);
// RUN JS only after the whole page is loaded with complete HTML and CSS