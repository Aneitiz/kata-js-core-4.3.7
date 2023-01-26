"use strict";
const input = document.querySelector(".search-input");
const datalist = document.querySelector(".drop");
const checked = document.querySelector(".checked");
const debounce  = (fn, debounceTime) =>{
    let delay;
    return function(...rest){
        clearTimeout(delay)
        delay = setTimeout(() =>{
            fn.apply(this, rest)
        }, debounceTime)
    }
}

function creator (list, className, value){
    let item = document.createElement("li");
    item.classList.add(className);
    item.textContent = value;
    list.append(item);
    return item;
}

function createDropList(value, repo) {
    let dropElement = creator(datalist,'drop__item', value)
    dropElement.addEventListener('click', () =>{
        createSaveList(repo.name,repo.owner,repo.stargazers_count)
        clearDropList()
    })
}
function clearDropList () {
    let listElements = document.querySelectorAll('.drop__item');
    for (let item of listElements) {
        item.remove();
    }
}
function createSaveList(repName, userName, stars){
    let login = userName.login;
    let info = `Repositoty: ${repName}\nUser: ${login}\nStars: ${stars}`;
    let checkedItem = creator(checked, 'checked__item', info);
    let closeBtn = document.createElement('button');
    closeBtn.classList.add('close');
    closeBtn.textContent = 'X';
    checkedItem.append(closeBtn);
    closeBtn.addEventListener('click', () =>{
        checkedItem.remove()
    })
}

async function github(value){
    if(input.value !== ''){
        return await fetch(`https://api.github.com/search/repositories?q=${value}+in:name&sort=stars`)
        .then(response => response.json())
            .then(data => (data.items).slice(0,5))
            .catch((e) => {
                creator(dropList, 'drop__item', 'Sorry, request is unsuccsessful')
                console.log(e)
            });
    }

}


 async function dropList(value){
    let list = await github(value)
     if(input.value !== '' && list && list.length === 0){
         creator(datalist, 'drop__item', 'Sorry, there is no repos with that name, change your request, please')
     }else if (list && list.length !== 0) {
         for (let item of list) {
             createDropList(item.name, item);
         }
     }
 }

dropList = debounce(dropList, 300)


 input.addEventListener("keyup", () =>{
     clearDropList();
     dropList(input.value);
});