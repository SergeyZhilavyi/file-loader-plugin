

function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (!bytes) {
      return '0 Byte';
    }
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  }

  
  const element = (tag, classes = [], content) => {
    
    const node = document.createElement(tag);

    
    if (classes.length) {
        
        node.classList.add(...classes);
    }

    
    if (content) {
        node.textContent = content;
    }

    return node;
  };

  
  function noop() { 

  }


export function upload(selector, options = {}) {
    let files = []; 
    const onUpload = options.onUpload ?? noop; 
    const input = document.querySelector(selector);
    const preview = element('div', ['preview']); 
    const upload = element('button', ['btn', 'primary'], 'Загрузить');
    // По-умолчанию нам нечего загружать и кнопка upload должна быть скрыта
    upload.style.display = 'none';


    
    const open = element('button', ['btn'], 'Открыть');

    
    if (options.multi) {
        input.setAttribute('multiple', true);
    }


    
    if (options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','));
    }


    input.insertAdjacentElement('afterend', preview);
    input.insertAdjacentElement('afterend', upload);
    input.insertAdjacentElement('afterend', open);


    const triggerInput = () => input.click();

    const changeHandler = event => {
        if (!event.target.files.length) { 
            return;
        }
        

        files = Array.from(event.target.files);

        preview.innerHTML = ''; // Обнуляем предыдущие результаты. Каждый раз работаем только с актуальными файлами

        upload.style.display = 'inline';
        files.forEach(file => {

            if (!file.type.match('image')){ // Если в файле нет изображения
                return;
            }

            //  Далее из  объекта file, создаём превью картинки

            const reader = new FileReader();

            reader.onload = ev => {

                const src = ev.target.result;

                // Отображаем превью картинки
                preview.insertAdjacentHTML('afterbegin', `
                <div class="preview-image">
                  <div class="preview-remove" data-name="${file.name}">&times;</div>  
                    <img src="${src}" alt="${file.name}" />
                      <div class="preview-info">
                         <span>${file.name}</span>
                         ${bytesToSize(file.size)}
                      </div>
                </div>
                `);
            };

            reader.readAsDataURL(file);
        });
        
    };

    // При нажатии на крестик данное событие будет срабатывать
    const removeHandler = event => {
        if (!event.target.dataset.name) {
            return;
        }

        const {name} = event.target.dataset;

        
        files = files.filter(file => file.name !== name);

        
        if (!files.length) {
            upload.style.display = 'none';
        }

    
        const block = preview.querySelector(`[data-name="${name}"]`).closest('.preview-image');

        block.classList.add('removing');

        // Элемент исчезает, но остаётся в DOM, зная, что анимация длится 300 мил/сек (см.в стилях), 
        // можем сделать следующее: после истечения данного таймаута, мы удаляем этот блок
        setTimeout(() => block.remove(), 300);
    };


    const clearPreview = el => {
        el.style.bottom = '4px'; 
        el.innerHTML = '<div class="preview-info-progress"></div>';
    };
    
    const uploadHandler = () => {
        
        preview.querySelectorAll('.preview-remove').forEach(e => e.remove()); 

        // Далее нам нужно изменить блок информации в нашей превьюшке, чтобы видеть прогресс загрузки
        const previewInfo = preview.querySelectorAll('.preview-info');
        
        previewInfo.forEach(clearPreview);
        onUpload(files, previewInfo);
    };


    
    open.addEventListener('click', triggerInput);
    input.addEventListener('change', changeHandler);
    preview.addEventListener('click', removeHandler);
    upload.addEventListener('click', uploadHandler);
}