document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);  
  
  // Sending mail using compose form
  document.querySelector('#compose-form').onsubmit = send_mail;
  //document.querySelector('#compose-form').addEventListener('submit', send_mail);

  // Viewing all emails
  document.querySelectorAll("button.onemail").forEach(function(mail) {
    mail.onclick = function() {
      //document.querySelector('#emails-view').innerHTML = "Fuck!";
      view_email(mail.dataset.id);
    }
  });

  //const mail_list = document.querySelectorAll('.onemail')
  //mail_list.forEach(function(mail) {
  //  mail.addEventListener('click', () => alert("button clicked")      
  //)});
  

  //document.querySelector('.onemail').onclick = view_email('.onemail'.id);

  // By default, load the inbox
  load_mailbox('inbox');

});


function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#read-emails-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function send_mail() {  
  
  // Setting the valriables for showing 
  const form_recipients = document.querySelector('#compose-recipients').value;
  const form_subject = document.querySelector('#compose-subject').value;
  const form_body = document.querySelector('#compose-body').value;

  // Sending request to send mail
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: form_recipients,
      subject: form_subject,
      body: form_body
    })
  })
  .then(response => response.json())
  .then(result => {
    console.log(result);    
  });
   
  // Direct to 'sent' mailbox
  // localstroage clear 생각해보기 이거 안하니까 'sent' mailbox로 가도 보낸 편지가 바로 안뜸 새로고침한번해줘야함
  load_mailbox('sent');
  return false; 

}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#read-emails-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
    
  // Sending request and recieved email datas from api
  fetch(`/emails/${mailbox}`) // `` 1key 옆에 있는 `로 해야 pass variable이 가능  
  .then(response => response.json())
  .then(emails => {
    console.log(emails);        
    
    // Making new html lines for mail view    
    emails.forEach(function(email){

      //let mail = "";      
      //mail += email.recipients + " " + email.subject + " " + email. timestamp + "<br>";
      let mail = email.recipients + " " + email.subject + " " + email. timestamp + "<br>";
      const onemail = document.createElement('div');
      onemail.innerHTML = mail;

      if (email.read === true){
        onemail.style.cssText = 'border-style: solid;border-width: 1px;background-color: gray;';
      }else {
        onemail.style.cssText = 'border-style: solid;border-width: 1px;';
      }
      
      onemail.addEventListener('click', function(){
        console.log('This onemail has been clicked!')
        console.log(email.read)
        view_email(email.id);
      });

      document.querySelector('#emails-view').append(onemail);
      //document.querySelector('#emails-view').appendChild(element);
    });
    
    // hint에 있는 code참고해서 console.log(emails)밑에서 부터 다시 작성하기, 애초에 버튼만들 때 eventlistener 달아놔야했음, contentload후에 적용은 안됨(이유 궁금)
  });

  return false;

}


function view_email(emails_id) {

  // Setting ones hided 
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#read-emails-view').style.display = 'block';

  document.querySelector('#read-emails-view').innerHTML = "";
  //let loggeduser = request.user;

  if (document.querySelector('#read-emails-view').innerHTML === ""){

    fetch(`/emails/${emails_id}`)
    .then(response => response.json())
    .then(mail => {
    console.log(mail);

    const viewmail = document.createElement('div');
    let content = "Sender : " + mail.sender + "<br>Recipients :" + mail.recipients 
                  + "<br>Subject : " + mail.subject + "<br>Timestamp : " + mail.timestamp + "<br>Body : " + mail.body;
    viewmail.innerHTML = content;
    console.log(viewmail)

    document.querySelector('#read-emails-view').append(viewmail);

    // 수령인과 로그인유저가 같으면 이라는 조건문 달기    
    //console.log(request.user);
    ///console.log(mail.recipients);

    fetch(`/emails/${emails_id}`,{
      method: 'PUT',
      body: JSON.stringify({
      read : true
      })
    })
    .then(response => response)
    .then(result => {
      console.log(result);
    });

    

    });

  }



  
  return false;
}
  