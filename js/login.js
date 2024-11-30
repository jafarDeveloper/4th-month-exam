const elForm = document.querySelector(".js-login-form");
const token = window.localStorage.getItem("token");
if(token){
    window.location.replace("client.html")
  }
  

const loginUser = async (user) => {
    try {
        const req = await fetch(`http://localhost:5000/user/login`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({

                "email": user.email,
                "password": user.password,

            })
        })
        let res = await req.json();
        console.log(res);
        
        if (res.token) {
            return { token: res.token }
        }
    } catch (error) {
        console.log(error)
    }
}
function validateForm(form) {
    let isValid = true;


    const emailField = form.querySelector(".js-login-email");
    const emailValue = emailField.value.trim();

    if (!emailValue || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailValue)) {
      emailField.classList.add("error");
      isValid = false;
    } else {
      emailField.classList.remove("error");
    }

    const passwordField = form.querySelector(".js-login-password");
    const passwordValue = passwordField.value.trim();

    if (!passwordValue ) {
      passwordField.classList.add("error");
      isValid = false;
    } else {
      passwordField.classList.remove("error");
     
    }

    return isValid;
  }

  
const handleSub = async (evt) => {
    evt.preventDefault();
    try {
        let formData = new FormData(evt.target);
        let formObject = Object.fromEntries(formData.entries());
       
         if (!validateForm(evt.target)) {
            return
         }
        
        let { token } = await loginUser(formObject);
        if (token) {
            window.localStorage.setItem("token", token);
         
            window.location.replace("client.html")
            
              
        }
    } catch (error) {
        alert(error.message)
    }
}

elForm.addEventListener("submit", handleSub)