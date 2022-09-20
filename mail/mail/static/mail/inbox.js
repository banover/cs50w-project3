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
  //fetch('/emails/mailbox') 위의 fetch mailbox 제대로 인식하게 하기..
  .then(response => response.json())
  .then(emails => {

    console.log(emails);        
    
    // Making new html lines for mail view
    let mail = "";
    emails.forEach(function(email){

      if (email.read === "True"){
        mail += "<button class=\"onemail\" style=\"background-color: gray;\" data-id=\"" + email.id + "\">" + email.recipients + " " + email.subject + " " + email. timestamp + "</button><br>";
        //mail += "<div class=\"onemail\" data-id=\"" + email.id + "\" style=\"background-color: gray;\"><a href=\"\">" + email.recipients+ " " + email.subject + " " + email. timestamp + "</a></div><br>";
      }
      else{
        mail += "<button class=\"onemail\" data-id=\"" + email.id + "\">" + email.recipients + " " + email.subject + " " + email. timestamp + "</button><br>";
      }

      document.querySelector('#emails-view').innerHTML = mail;
    });
    // above document 명령문의 위치를 forEach안에 둘건가 밖에 둘건가 기능은 둘다 되는데, 다시 테스트하기
    // hint에 있는 code참고해서 console.log(emails)밑에서 부터 다시 작성하기, 애초에 버튼만들 때 eventlistener 달아놔야했음, contentload후에 적용은 안됨(이유 궁금)
  });

  return false;

}


function view_email(emails_id) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#read-emails-view').style.display = 'block';

  document.querySelector('#read-emails-view').innerHTML = `<p>Fuck!, ${emails_id}</p>`;
  
  return false;
}
  