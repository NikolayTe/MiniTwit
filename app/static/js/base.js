document.addEventListener('DOMContentLoaded', function() {
    const modalOverlay = document.getElementById('modalOverlay');
    const loginBtn = document.getElementById('loginBtn');
    const modalClose = document.getElementById('modalClose');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabs = document.querySelectorAll('.modal-tab');
    
    
    
    if(loginBtn){
        // Открытие модального окна
        loginBtn.addEventListener('click', function() {
            modalOverlay.style.display = 'flex';
        });
        
        // Закрытие модального окна
        modalClose.addEventListener('click', function() {
            modalOverlay.style.display = 'none';
        });
        
        // Закрытие при клике вне модального окна
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                modalOverlay.style.display = 'none';
            }
        });

        
        // Переключение между вкладками
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                if (this.dataset.tab === 'login') {
                    loginForm.style.display = 'block';
                    registerForm.style.display = 'none';
                } else {
                    loginForm.style.display = 'none';
                    registerForm.style.display = 'block';
                }
            });
        });
        // Обработка формы входа
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const user_data = {
                login: document.getElementById('loginEmail').value,
                password: document.getElementById('loginPassword').value
            }
            try {
                // Отправляем POST запрос
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user_data)
                });

                const result = await response.json();

                if (result.success) {
                    // Успешная авторизация
                    alert('Вход выполнен успешно!');
                    modalOverlay.style.display = 'none';
                    location.reload();

                } else {
                    // Ошибка от сервера
                    alert('Неверный логин или пароль' + result.message);
                }
            } catch (error) {
                console.error('Ошибка сети:', error);
                alert('Ошибка сети. Попробуйте позже.');
            } finally {
                // Восстанавливаем кнопку
                submitBtn.disabled = false;
                submitBtn.textContent = 'Зарегистрироваться';
            }

            modalOverlay.style.display = 'none';
        });
        
        // Обработка формы регистрации
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();


            const user_data = {
                name: document.getElementById('registerName').value,
                email: document.getElementById('registerEmail').value,
                username: document.getElementById('registerUsername').value,
                password: document.getElementById('registerPasswordConfirm').value
            }
            console.log(user_data)

            try {
                // Отправляем POST запрос
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user_data)
                });

                const result = await response.json();

                if (result.success) {
                    // Успешная регистрация
                    alert('Регистрация успешна!');
                    // modalOverlay.style.display = 'none';
                    document.getElementById('loginTab').click()

                } else {
                    // Ошибка от сервера
                    alert('Ошибка: ' + result.message);
                }
            } catch (error) {
                console.error('Ошибка сети:', error);
                alert('Ошибка сети. Попробуйте позже.');
            } finally {
                // Восстанавливаем кнопку
                submitBtn.disabled = false;
                submitBtn.textContent = 'Зарегистрироваться';
            }


            alert('Регистрация завершена! (Это демо)');
            modalOverlay.style.display = 'none';
        });
    }
    
     // Выход 
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn){
        
        logoutBtn.addEventListener('click', async function(){
            try {
                // Отправляем POST запрос
                const response = await fetch('/api/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify()
                });
                const result = await response.json();
                if (result.success) {
                    // Успешная авторизация
                    alert('Выход выполнен успешно!');
                    location.reload();
                } else {
                    // Ошибка от сервера
                    alert('Неизвестная ошибка' + result.message);
                }
            } catch (error) {
                console.error('Ошибка сети:', error);
                alert('Ошибка сети. Попробуйте позже.');
            }
        });
    }
    
    const currentPath = window.location.pathname;
    document.querySelectorAll('.menu-item').forEach(item => {
        // if (item.getAttribute('data-href') === currentPath)  {
        //     item.classList.add('active');
        // }
        // else{
        //     if (String(item.getAttribute('data-href')).includes('/user/') && currentPath.includes('/user/') ){
        //         item.classList.add('active');
        //     }
        //     else{
        //         item.classList.remove('active');
        //     }
            
        // }

        item.addEventListener('click', function() {

            const url = this.getAttribute('data-href');
            window.location.href = url;
            // if (url) {
            //     if (url === '/user/'){
            //         window.location.href = url + '1';
            //     }
            //     else{
            //         window.location.href = url;
            //     }
            // }
            console.log('item', item, 'this', this)
        })

    });

     // При загрузке страницы определяем активный пункт меню по URL
    // const currentPath = window.location.pathname;
    
    // menu_items = document.querySelectorAll('.menu-item')
    // page_name = document.querySelector('.section-title').dataset.name
    // menu_items.forEach(menu => {
    //     if (page_name === menu.name){
    //         menu.classList.add('active');
    //         console.log(menu)
    //     } else {
    //         menu.classList.remove('active')
    //     }
        
    // })
    

   



});
