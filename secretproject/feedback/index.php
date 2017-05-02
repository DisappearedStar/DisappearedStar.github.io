<?php
if (isset ($_POST['contactFF'])) {
  $to = "ivankalytyuk95@gmail.com";
  $from = $_POST['contactFF'];
  $subject = "Заполнена контактная форма с ".$_SERVER['HTTP_REFERER'];
  $message = "Имя: ".$_POST['nameFF']."\nEmail: ".$from."\nIP: ".$_SERVER['REMOTE_ADDR']."\nСообщение: ".$_POST['messageFF'];
  $boundary = md5(date('r', time()));
  $filesize = '';
  $headers = "MIME-Version: 1.0\r\n";
  $headers .= "From: " . $from . "\r\n";
  $headers .= "Reply-To: " . $from . "\r\n";
  $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";
  $message="
Content-Type: multipart/mixed; boundary=\"$boundary\"

--$boundary
Content-Type: text/plain; charset=\"utf-8\"
Content-Transfer-Encoding: 7bit

$message";
  for($i=0;$i<count($_FILES['fileFF']['name']);$i++) {
      if(is_uploaded_file($_FILES['fileFF']['tmp_name'][$i])) {
         $attachment = chunk_split(base64_encode(file_get_contents($_FILES['fileFF']['tmp_name'][$i])));
         $filename = $_FILES['fileFF']['name'][$i];
         $filetype = $_FILES['fileFF']['type'][$i];
         $filesize += $_FILES['fileFF']['size'][$i];
         $message.="

--$boundary
Content-Type: \"$filetype\"; name=\"$filename\"
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename=\"$filename\"

$attachment";
     }
   }
   $message.="
--$boundary--";

  if ($filesize < 10000000) {
    mail($to, $subject, $message, $headers);
    $output = '<script>alert("Ваше сообщение получено, спасибо!");</script>';
  } else {
    $output = '<script>alert("Извините, письмо не отправлено. Размер всех файлов превышает 10 МБ.");</script>';
  }
}
?>


<!DOCTYPE HTML>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>Полки - фидбек</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">
  <link rel="shortcut icon" href="../fav.ico" type="image/x-icon">
  <link href="https://fonts.googleapis.com/css?family=Cuprum" rel="stylesheet">
<style>
body{
  font-family: 'Cuprum', sans-serif;
}
#feedback-form {
  max-width: 550px;
  padding: 2%;
  border-radius: 3px;
  background: #f1f1f1;
}
#feedback-form label {
  float: left;
  display: block;
  clear: right;
}
#feedback-form .w100 {
  float: right;
  max-width: 400px;
  width: 97%;
  margin-bottom: 1em;
  padding: 1.5%;
}
#feedback-form .border {
  border-radius: 1px;
  border-width: 1px;
  border-style: solid;
  border-color: #C0C0C0 #D9D9D9 #D9D9D9;
  box-shadow: 0 1px 1px rgba(255,255,255,.5), 0 1px 1px rgba(0,0,0,.1) inset;
}
#feedback-form .border:focus {
  outline: none;
  border-color: #abd9f1 #bfe3f7 #bfe3f7;
}
#feedback-form .border:hover {
  border-color: #7eb4ea #97cdea #97cdea;
}
#feedback-form .border:focus::-moz-placeholder {
  color: transparent;
}
#feedback-form .border:focus::-webkit-input-placeholder {
  color: transparent;
}
#feedback-form .border:not(:focus):not(:hover):valid {
  opacity: .8;
}
#submitFF {
  padding: 2%;
  border: none;
  border-radius: 3px;
  box-shadow: 0 0 0 1px rgba(0,0,0,.2) inset;
  background: #669acc;
  color: #fff;
}
.submitFF {
  padding: 2%;
  border: none;
  border-radius: 3px;
  box-shadow: 0 0 0 1px rgba(0,0,0,.2) inset;
  background: #669acc;
  color: #fff;
  cursor:pointer;
}
#feedback-form br {
  height: 0;
  clear: both;
}
.submitFF:hover {
  background: #5c90c2;
}
.submitFF:focus {
  box-shadow: 0 1px 1px #fff, inset 0 1px 2px rgba(0,0,0,.8), inset 0 -1px 0 rgba(0,0,0,.05);
}
.noselect {
  -webkit-touch-callout: none;
    -webkit-user-select: none;
     -khtml-user-select: none;
       -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;                             
}
</style>
<?php echo $output; ?>
<form enctype="multipart/form-data" method="post" id="feedback-form">
<label for="nameFF">Имя:</label>
<input type="text" name="nameFF" id="nameFF" required placeholder="например, Иван Иванович Иванов" x-autocompletetype="name" class="w100 border">
<label for="contactFF">Email для связи:</label>
<input type="email" name="contactFF" id="contactFF" required placeholder="например, ivan@yandex.ru" x-autocompletetype="email" class="w100 border">
<label for="fileFF">Прикрепить фото:</label>
<input type="file" name="fileFF[]" multiple id="fileFF" class="w100">
<label for="messageFF">Сообщение:</label>
<textarea name="messageFF" id="messageFF" required rows="5" placeholder="Детали заявки…" class="w100 border"></textarea>
<br>
<input value="Отправить" type="submit" class="submitFF"><br><br>
<span onclick="document.location='../index.html'" class="submitFF noselect">Вернуться на Полки</span>
</form>