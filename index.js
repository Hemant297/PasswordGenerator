const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const PasswordDisplay=document.querySelector("[data-passwordDisplay]");
const copyMsg=document.querySelector("[data-copyMsg]");
const copyBtn=document.querySelector("[data-copy]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type='checkbox']");
const symbols='!@#~$%^&*(){[<>?/]}';

let password="";
let passwordLength=10;
let checkCount=0;
//set circle strength to grey
setindicator("#ccc");

handleslider();
function handleslider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength-min)*100/(max-min) ) + "% 100%"

}

function setindicator(color){
    indicator.style.backgroundColor=color;
    //shadow
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getrandominteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getrandominteger(0,9);
}

function generatelowercase(){
    return String.fromCharCode(getrandominteger(97,123));
}

function generateuppercase(){
    return String.fromCharCode(getrandominteger(65,91));
}

function generatesymbol(){
    const randnum=getrandominteger(0,symbols.length);
    // return symbols[randnum];
    return symbols.charAt(randnum);
}

function calcstrength(){
    let hasupper=false;
    let haslower=false;
    let hasnum=false;
    let hassymbol=false;
    if(uppercaseCheck.checked) hasupper=true;
    if(lowercaseCheck.checked) haslower=true;
    if(numbersCheck.checked) hasnum=true;
    if(symbolsCheck.checked) hassymbol=true;
    if(haslower && hasupper && (hasnum||hassymbol) && passwordLength>=8)
        setindicator("#0f0");
    else if((haslower || hasupper ) && (hasnum || hassymbol) && passwordLength>=8)
        setindicator("#ff0");
    else
        setindicator("#f00");
}

async function copycontent(){
    try{
    await navigator.clipboard.writeText(PasswordDisplay.value);
    copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }
    //to make copy vala span visible
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}


function shufflepassword(array){
    //fisher yates method
    for(let i=array.length-1;i>=0;i--){
        const j=Math.floor(Math.random() * (i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el) => {
        str+=el;
    });
    return str;
}


function handlecheckboxchange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });
    //special condition
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleslider();
    }
}


allCheckBox.forEach((checkbox) =>{
    checkbox.addEventListener('change',handlecheckboxchange);
})


inputSlider.addEventListener('input',(e) => {
    passwordLength=e.target.value;
    handleslider();
})


copyBtn.addEventListener('click',() =>{
    if(PasswordDisplay.value)
        copycontent();
})

generateBtn.addEventListener('click',() =>{
    //none of the checkbox is selected
    if(checkCount<=0) return;
    // if(passwordLength<checkCount){
    //     passwordLength=checkCount;
    //     handleslider();
    // }
    password="";
    // if(uppercaseCheck.checked){
    //     password+=generateuppercase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generatelowercase();
    // }
    // if(numbersCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generatesymbol();
    // }
    let funcarray=[];
    if(uppercaseCheck.checked)
        funcarray.push(generateuppercase);
    if(lowercaseCheck.checked)
        funcarray.push(generatelowercase);
    if(numbersCheck.checked)
        funcarray.push(generateRandomNumber);
    if(symbolsCheck.checked)
        funcarray.push(generatesymbol);
    
        //compulsary addition
    for(let i=0;i<funcarray.length;i++){
        password+=funcarray[i]();
    }

    //remaining addition
    for(let i=0;i<passwordLength-funcarray.length;i++){
        let randindex=getrandominteger(0,funcarray.length);
        password+=funcarray[randindex]();
    }

    //shuffle the password
    password=shufflepassword(Array.from(password));

    PasswordDisplay.value=password;
    calcstrength();
});
