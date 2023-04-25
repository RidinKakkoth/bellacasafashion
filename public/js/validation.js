
//------form

var nameError= document.getElementById('name-error');
var phoneError= document.getElementById('phone-error');
var emailError= document.getElementById('email-error');
var passwordError= document.getElementById('password-error');
var submitError= document.getElementById('submit-error');

function validateName(){
  var name=document.getElementById('name').value;
  
    if(name.length==0)
    {
      nameError.innerHTML='field empty !!';
      return false;
    }
    if(!name.match(/^[A-Za-z]/))
    {
      nameError.innerHTML='invalid name';
      return false;
    }
    nameError.innerHTML= "<span style='color:green;'>valid</span>";
    return true;
  
}
function validateEmail()
{
  var mail=document.getElementById('email').value;
  if(mail.length==0)
    {
      emailError.innerHTML='field empty !!';
      return false;
    }
    if(!mail.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))
    {
      emailError.innerHTML='invalid email';
      return false;
    }
    emailError.innerHTML="<span style='color:green;'>valid</span>";
    return true;
  }


function validatePhone()
{
  var phone=document.getElementById('number').value;
  if(phone.length==0)
    {
      phoneError.innerHTML='field empty';
      return false;
    }
    if(!phone.match(/^\d{10}$/))
    {
      phoneError.innerHTML='invalid phone number';
      return false;
    }
    phoneError.innerHTML="<span style='color:green;'>valid</span>";
    return true;
  }

 

  function validatePassword(){
    var password=document.getElementById('password').value;
    if(password.length<=5)
      {
        passwordError.innerHTML='field empty !!';
        return false;
      }
      
      passwordError.innerHTML="<span style='color:green; '>valid</span>";
      return true;
    
  }

  function validateForm(){
  if(!validateName()|| !validateEmail()||!validatePhone()||!validatePassword())

  {
    return false;
  }
}