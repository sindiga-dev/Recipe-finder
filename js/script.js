'use strict';
const searchBox=document.getElementById('search');
const submitBtn=document.getElementById('submit');
const randomBtn=document.getElementById('random');
const singleMealEL=document.getElementById('single-meal');
const resultHeading=document.getElementById('result-heading');
const mealsEl=document.getElementById('meals');
const getJSON=async function(url ,errorMsg='Something went wrong!'){
    return await fetch(url).then(res=>{
        if(!res.ok){
            resultHeading.innerHTML='<h2>There has been an error!</h2>';
            throw new Error(`${errorMsg}(${res.status})`);
        }
        return res.json();
    });
}


//add meals to the DOM
const addMeals=function(mealDataArr){
    const innerHTML=[];
    mealDataArr.forEach((mealData)=>{
        const string=mealData.meals.map( 
            (meal)=> 
            `<div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
                </div>
            </div>`
        )
        .join('');
        innerHTML.push(string);
            });
    mealsEl.innerHTML=innerHTML.join('');
        };
    