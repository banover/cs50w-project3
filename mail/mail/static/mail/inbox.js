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
  // localstroage clear ??????????????? ?????? ???????????? 'sent' mailbox??? ?????? ?????? ????????? ?????? ?????? ??????????????????????????????
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
  fetch(`/emails/${mailbox}`) // `` 1key ?????? ?????? `??? ?????? pass variable??? ??????  
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
        view_email(email.id, `${mailbox}`);
      });

      document.querySelector('#emails-view').append(onemail);

      //if (`${mailbox}` == "inbox"){
      //  const archive = document.createElement('button');
      //  archive.innerHTML = 'Archive';
      //  archive.addEventListener('click', function(){
      //    console.log(archive)
      //    fetch(`/emails/${email.id}`,{
      //      method: 'PUT',
      //      body: JSON.stringify({
      //      archived : true
      //      })
      //    })
      //  });

        //document.querySelector('#emails-view').append(archive);
      //}


      //document.querySelector('#emails-view').appendChild(element);
    });
    
    // hint??? ?????? code???????????? console.log(emails)????????? ?????? ?????? ????????????, ????????? ???????????? ??? eventlistener ??????????????????, contentload?????? ????????? ??????(?????? ??????)
  });

  return false;

}


function view_email(emails_id, mailbox) {

  // Setting ones hided 
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#read-emails-view').style.display = 'block';
  document.querySelector('#read-emails-view').innerHTML = "";  

  // Listing an email content
  if (document.querySelector('#read-emails-view').innerHTML === ""){

    fetch(`/emails/${emails_id}`)
    .then(response => response.json())
    .then(mail => {
      console.log(mail);

      // Presenting mail's header
      const viewmail = document.createElement('div');
      let content = "From : " + mail.sender + "<br>To : " + mail.recipients 
                    + "<br>Subject : " + mail.subject + "<br>Timestamp : " + mail.timestamp; //+ "<hr>Body : " + mail.body;
      viewmail.innerHTML = content;

      document.querySelector('#read-emails-view').append(viewmail);

      // Presenting archive button
      if (mailbox === 'inbox'){
        const archive = document.createElement('button');
        archive.innerHTML = 'Archive';
        archive.addEventListener('click', function(){
          console.log(archive)

          fetch(`/emails/${emails_id}`,{
            method: 'PUT',
            body: JSON.stringify({
            archived : true
            })
          })          
          load_mailbox('inbox');
        });
        document.querySelector('#read-emails-view').append(archive);

      }

      // Presenting reply button 
      if (mailbox === 'inbox' || mailbox === 'archive'){
        const reply = document.createElement('button');
        reply.innerHTML = 'reply';
        reply.addEventListener('click', function(){
          console.log(reply)          
          reply_compose_email(mail);
        });
        document.querySelector('#read-emails-view').append(reply);
      }

      // Presenting unarchive button
      if (mailbox === 'archive'){
        const unarchive = document.createElement('button');
        unarchive.innerHTML = 'unarchive';
        unarchive.addEventListener('click', function(){
          console.log(unarchive)

          fetch(`/emails/${emails_id}`, {
            method: 'PUT',
            body: JSON.stringify({
            archived : false
            })
          })
          
          load_mailbox('inbox');
        });

        document.querySelector('#read-emails-view').append(unarchive);
      }      

      // Presenting mail's body
      const viewbody = document.createElement('div');
      let body = "<hr>Body : " + mail.body;
      viewbody.innerHTML = body;
      console.log(viewmail)

      document.querySelector('#read-emails-view').append(viewbody);

      // Updating mail's read value to true
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

function reply_compose_email(mail) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#read-emails-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = `${mail.sender}`;
  document.querySelector('#compose-subject').value = "Re: " + `${mail.subject}`;
  document.querySelector('#compose-body').value = `${mail.timestamp}`+" "+`${mail.sender}`+ " wrote: "+`${mail.body}`;
}