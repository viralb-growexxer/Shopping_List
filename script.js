const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.querySelector('.filter');
const formBtn = itemForm.querySelector('button');
let isEditMode=false;

function displayItems(){
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach((item) => addItemToDOM(item));

    checkUI();
}

function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    // Validation
    if(newItem.trim() === '')
    {
        alert("Kindly enter an item");
        return;
    }

    // Check for edit mode
    if(isEditMode){
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode=false;
    }
    else{
        if(checkIfItemExists(newItem)){
            alert('That item already exists');
            return;
        }
    }

    // Create item DOM element
    addItemToDOM(newItem);

    // Add item to local storage
    addItemToStorage(newItem);
    checkUI();
    itemInput.value='';

    console.log("Success");
}

function addItemToDOM(item){

    // Creating a list item
    const newLi = document.createElement('li');
    
    const button = createButton('remove-item btn-link text-red');
    const icon = createIcon('fa-solid fa-xmark');
    
    newLi.appendChild(document.createTextNode(item));
    newLi.appendChild(button);
    button.appendChild(icon);
    itemList.appendChild(newLi);
}

function addItemToStorage(item){
    let itemsFromStorage = getItemsFromStorage();

    // Add new item to array
    itemsFromStorage.push(item);
    
    // Convert to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
    
    console.log(JSON.stringify(item));
}

function getItemsFromStorage(){

    let itemsFromStorage;

    if(localStorage.getItem('items') === null){
        itemsFromStorage = [];
    }
    else{
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

function createButton(classes)
{
    const btn = document.createElement('button');
    btn.className=classes;
    return btn;
}

function createIcon(classes)
{
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function onClickItem(e){

    if(e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement);
    }
    else{
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item){

    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}

function setItemToEdit(item){
    isEditMode=true;

    
    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));
    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"</i>    Update Item'
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;
}

function removeItem(item){
    
    if(confirm("Are you sure?")){
        // Remove from DOM
        item.remove();

        // Remove from Storage
        removeItemFromStorage(item.textContent);

        checkUI();
    }
}

function removeItemFromStorage(item){

    let itemsFromStorage = getItemsFromStorage();

    // Filter out the item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i!==item);

    // Re-set to localstorage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems(){
    // itemList.innerHTML='';

    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild);
    }

    // Clear from local storage
    localStorage.removeItem('items');
    checkUI();
}

function filterItems(e){
    const items = itemList.querySelectorAll('li');
    const text=e.target.value.toLowerCase();

    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();
        
        if(itemName.indexOf(text) != -1)
            item.style.display = 'flex';
        else
            item.style.display = 'none';
    });
}

function checkUI(){
    const items = itemList.querySelectorAll('li');

    if(items.length === 0){
        clearBtn.style.display='none';
        itemFilter.style.display='none';
    }
    else{
        clearBtn.style.display='block';
        itemFilter.style.display='block';
    }

    formBtn.innerHTML = '<i class=fa-solid fa-plus></i> Add Item';
    formBtn.style.backgroundColor = '#333';
}

function init(){
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);
    
    checkUI();
}
// Event Listeners

init();
