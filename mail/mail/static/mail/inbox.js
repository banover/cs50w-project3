document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  //document.querySelector('#compose-form').onsubmit = send_mail;
  // Sending mail using compose form
  document.querySelector('#compose-form').onsubmit = send_mail;
  //document.querySelector('#compose-form').addEventListener('submit', send_mail);
  
  //document.querySelector('#compose-form').onsubmit = function() {
  //  send_mail();
  //}

  //document.querySelector('#compose-form').onsubmit = send_mail;

  // By default, load the inbox
  load_mailbox('inbox');

});


function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function send_mail() {  
  
  const form_recipients = document.querySelector('#compose-recipients').value;
  const form_subject = document.querySelector('#compose-subject').value;
  const form_body = document.querySelector('#compose-body').value;

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
  //localStorage.clear();
  //setTimeout(function(){ load_mailbox('sent'); }, 100)
  load_mailbox('sent');
  return false;
  //document.querySelector('#emails-view').style.display = 'block';
  //document.querySelector('#compose-view').style.display = 'none';
  //document.querySelector('#emails-view').innerHTML = 'fuck';
 

}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  if (mailbox === "sent"){
    fetch('/emails/${mailbox}')
    //fetch('/emails/mailbox') 위의 fetch mailbox 제대로 인식하게 하기..
    .then(response => response.json())
    .then(emails => {
      console.log(emails);
      document.querySelector('#emails-view').innerHTML = emails;
    });
  }
}  

  