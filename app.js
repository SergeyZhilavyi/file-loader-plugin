import firebase from 'firebase/app';
import 'firebase/storage';
import {upload} from './upload';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBG-y9KWtslEj9LqDBcM38rWNKmscLEwRA",
    authDomain: "file-loader-plugin.firebaseapp.com",
    projectId: "file-loader-plugin",
    storageBucket: "file-loader-plugin.appspot.com",
    messagingSenderId: "143962428939",
    appId: "1:143962428939:web:e612e9694dfa67f19d990e"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Объект storage, который мы получаем из firebase
  const storage = firebase.storage();
  

upload('#file', {
    multi: true,
    accept: ['.png', '.jpg', '.jpeg', '.gif'],
    onUpload(files, blocks) {
        files.forEach((file, index) => {
           const ref = storage.ref(`images/${file.name}`);
           
          const task = ref.put(file);

          
          // Событие state_changed, следит за прогрессом загрузки этого файла
          task.on('state_changed', snapshot => {
            

            const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%';
            const block = blocks[index].querySelector('.preview-info-progress');
            block.textContent = percentage;
            block.style.width = percentage;
          }, error => {
              console.log(error);
          }, () => {
              
              task.snapshot.ref.getDownloadURL().then(url => {
                console.log('Download URL', url);
              });
          }); 
        });
    }
});

// Вторым параметром в функцию upload, мы передали объект с ключом multi
// и значением true, это позволит загружать несколько файлов

// В файле upload.js, в функцию upload, передали второй параметр options, который
// по-умолчанию будет пустым объектом (если мы ничего не передавали)

// В accept передаём название расширений, который доступны для загрузки

//---- В этом файле app.js, будет реализован код, позволяющий загружать данные на сервер
// но для этого нам необходимо в нужном месте обработать и вставить функцию onUpload()

// В параметр функции upload в options добавляем функцию onUpload()