const elForm = document.querySelector(".js-register-form");
const token = window.localStorage.getItem("token");
if(token){
  window.location.replace("client.html")
}

const registerUser = async (user) => {
  try{
    const req = await fetch(`http://localhost:5000/user/register`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        "user_name": user.user_name,
        "phone": user.phone,
        "email": user.user_email, 
        "password": user.user_password,
      })
    })
    let res = await req.json();
    if(res.token){
      return {token: res.token}
    }
  }catch(error){
    console.log(error)
  }
}

const handleSub = async (evt) => {
  evt.preventDefault();
  try{
    let formData = new FormData(evt.target);
    let formObject = Object.fromEntries(formData.entries());
    let type = Object.keys(formObject).some((key) => !formObject[key]);
    if(type) throw new Error("Ma'lumotlaringizni to'liq kiriting !");
    let { token } = await registerUser(formObject); 
    if(token){
      window.localStorage.setItem("token", token);
      window.location.replace("client.html");
    }
  }catch(error){
    alert(error.message)
  }
}

elForm.addEventListener("submit", handleSub)