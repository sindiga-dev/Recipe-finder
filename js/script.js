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
    //fetch meals from the API
    const searchMeal=async function(e){
        e.preventDefault();
        if(searchBox.value===''){
            alert('Please enter a search term');
            return;
        }
        const term=searchBox.value;
        const mealsArr=[];
        try{
            //search meal by name
            const mealData=await getJSON(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
            if(mealData.meal!==null){
                mealsArr.push(mealData);
            }
            //search by ingredient
            const mealData2 = await getJSON(
                `https://www.themealdb.com/api/json/v1/1/filter.php?i=${term}`
              );
              if (mealData2.meals !== null) mealsArr.push(mealData2);
              //search by category
              const mealData3 = await getJSON(
                `https://www.themealdb.com/api/json/v1/1/filter.php?c=${term}`
              );
              if (mealData3.meals !== null) mealsArr.push(mealData3);
              // API filter by area
                const mealData4 = await getJSON(
                    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${term}`
                );
                if (mealData4.meals !== null) mealsArr.push(mealData4);
            
                resultHeading.innerHTML = `<h2> Search results for '${term}'</h2>`;
                if (mealsArr.length === 0) {
                    resultHeading.innerHTML = `<p> No search results for '${term}'. Please try again!</p>`;
                    mealsEl.innerHTML = '';
                    if (term === 'desert')
                    resultHeading.innerHTML = `<p> No search results for '${term}'. Try "dessert"!`;
                    return;
                }else{
                    //add meal from DOM
                    displayMeals(mealsArr);
                }
                searchBox.value='';
            }catch(err){
                alert(err.message);
            }
        };

        //work with api format
        class recipeItem{
            constructor(ingredients, quantity){
                this.ingredient=this.ingredient;
                this.quantity=quantity;

            }
        }
    // add selected meal to DOM
    const addMealToDOM=function(meal){
        const ingredient=[];
        const measurements=[];
        const recipeData=[];

        for (let key in meal) {
            let word = key;
            if (word.includes('strIngredient') && meal[key] !== '') {
              ingredients.push(meal[key]);
            }
            if (word.includes('strMeasure') && meal[key] !== '') {
              measurements.push(meal[key]);
            }
          }
          for (let i = 0; i < ingredients.length; i++) {
            let j = new recipeItem(ingredients[i], measurements[i]);
            recipeData.push(j);
          }

          //add meal from dom
          singleMealEl.innerHTML = `
            <div class="single-meal">
                <h1>${meal.strMeal}</h1>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                <div class="single-meal-info">
                    ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                    ${meal.strCategory ? `<p><i>${meal.strArea}</i></p>` : ''}
                </div>
                <div class="main">
                    ${meal.strYoutube ? `<h3>This Recipe Has A YouTube Video! </h4>` : ''}
                    ${
                    meal.strYoutube
                    ? `<div class="link"><a href=${meal.strYoutube}>YouTube</a></div>`
                    : ''
                }
                     ${meal.strInstructions
                .split(';')
                .map((item) => `<p>${item}.</p>`)
                .join('')}
                    </div>
                        <h2>Ingredients</h2>
                    <ul>
                ${recipeData
                .map((item) => `<li>${item.ingredient}: ${item.quantity}</li>`)
                .join('')}
                </ul>
            </div>`;

            singleMealEl.scrollIntoView({ behavior: 'smooth' });
        };


        //EVENT LISTENERS
        //submit form on click
        submitBtn.addEventListener('click',searchMeal);
        //Get recipe click
        mealsEl.addEventListener('click', (e) => {
            let path = e.path || (e.composedPath && e.composedPath());
            const mealInfo = path.find((item) => {
              if (item.classList) {
                return item.classList.contains('meal-info');
              } else {
                false;
              }
            });
            if (mealInfo) {
              const mealID = mealInfo.getAttribute('data-mealid');
              getMealByID(mealID);
            }
          });



    