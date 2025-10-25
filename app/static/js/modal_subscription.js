// Добавляю ссылки на дивы с подписчиками/подписками
// div_subsribers = document.querySelector('[name="count_subscribers"]');
// parent_div_subsribers = div_subsribers.closest('.stat');

// div_subscriptions = document.querySelector('[name="count_subscriptions"]');
// parent_div_subscriptions = div_subscriptions.closest('.stat');


// Для страницы профиля и для простого index ЧТОБЫ НЕ ВЫСКАКИВАЛА ОШИБКА В КОНСОЛЕ
// if(!parent_div_subsribers){
//     parent_div_subsribers = div_subsribers.closest('.stat-item');
//     parent_div_subsribers.addEventListener('click', function(){
//         user_id = parent_div_subsribers.closest('.profile-container').id;
//         api_get = 'get_subsribers_list';
//         dsOpenSubscriptionsModal(user_id, api_get);
//     });

// }else{
//     parent_div_subsribers.addEventListener('click', function(){
//     user_id = parent_div_subsribers.closest('.user-profile-card').id;
//     api_get = 'get_subsribers_list';
//     dsOpenSubscriptionsModal(user_id, api_get);
//     });
// }



// if (!parent_div_subscriptions){
//     parent_div_subscriptions = div_subscriptions.closest('.stat-item');
//     parent_div_subscriptions.addEventListener('click', function(){
//         user_id = parent_div_subscriptions.closest('.profile-container').id;
//         api_get = 'get_subscriptions_list';
//         dsOpenSubscriptionsModal(user_id, api_get);
//     });

// }else{
//     parent_div_subscriptions.addEventListener('click', function(){
//     user_id = parent_div_subscriptions.closest('.user-profile-card').id;
//     api_get = 'get_subscriptions_list';
//     dsOpenSubscriptionsModal(user_id, api_get);
//     });
// }



// СВЕРХУ УДАЛИТЬ ЕСЛИ ВСЕ РАБОТАЕТ

// Добавляю ссылки на дивы с подписчиками/подписками
const divs_subsribers = document.querySelectorAll('[name="count_subscribers"]');
const divs_subscriptions = document.querySelectorAll('[name="count_subscriptions"]');

divs_subsribers.forEach(div_subsribers => {
    let parent_div_subsribers = div_subsribers.closest('.stat-item');
    // Это для страницы своего профиля
    if (parent_div_subsribers){
        parent_div_subsribers.addEventListener('click', function(){
            user_id = parent_div_subsribers.closest('.profile-container').id;
            api_get = 'get_subsribers_list';
            dsOpenSubscriptionsModal(user_id, api_get);
        }); 
        // Это для страниц профиля других пользователей и вкладки Люди
    }else{
        parent_div_subsribers = div_subsribers.closest('.stat');
        parent_div_subsribers.addEventListener('click', function(){
            user_id = parent_div_subsribers.closest('.user-profile-card').id;
            api_get = 'get_subsribers_list';
            dsOpenSubscriptionsModal(user_id, api_get);
        });
    }
});

divs_subscriptions.forEach(div_subscriptions => {
    let parent_div_subscriptions = div_subscriptions.closest('.stat-item');
    if(parent_div_subscriptions){
        parent_div_subscriptions.addEventListener('click', function(){
            user_id = parent_div_subscriptions.closest('.profile-container').id;
            api_get = 'get_subscriptions_list';
            dsOpenSubscriptionsModal(user_id, api_get);
        });
    }else{
        parent_div_subscriptions = div_subscriptions.closest('.stat');
        parent_div_subscriptions.addEventListener('click', function(){
            user_id = parent_div_subscriptions.closest('.user-profile-card').id;
            api_get = 'get_subscriptions_list';
            dsOpenSubscriptionsModal(user_id, api_get);
        });
    }
})










// Данные подписок (в реальном приложении будут приходить с сервера)
const dsSubscriptionsData = [
    { id: 1, username: "Алексей Иванов", handle: "@alexey", avatar: null, isSubscribed: true },
    { id: 2, username: "Мария Петрова", handle: "@maria", avatar: null, isSubscribed: true },
    { id: 3, username: "Дмитрий Сидоров", handle: "@dmitry", avatar: null, isSubscribed: true },
    { id: 4, username: "Елена Козлова", handle: "@elena", avatar: null, isSubscribed: true },
    { id: 5, username: "Сергей Николаев", handle: "@sergey", avatar: null, isSubscribed: true }
];

async function dsLoadSubscriptions(user_id, api_get) {
    console.log('dsLoadSubscriptions', user_id)
    const list = document.getElementById('dsSubscriptionsList');
    // Красивый loading
    list.innerHTML = `
        <div class="ds-loading-spinner">
            <div class="ds-spinner"></div>
            <div class="ds-loading-text">Загружаем подписки...<br>Исскуственная задержка</div>
        </div>
    `;
    try {
        const response = await fetch(`/api/${api_get}/${user_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                console.log(result)

                console.log('result.subscribers_list', result.subscribers_list)
                const dsSubscriptionsData = result.subscribers_list
                
                if (dsSubscriptionsData.length === 0) {
                    list.innerHTML = '<div class="ds-empty-state">Пусто(</div>';
                    return;
                }
                list.innerHTML = dsSubscriptionsData.map(user => `
                    <div class="ds-subscription-item">
                        <a href="/user/${user.id}/profile_posts" class="ds-user-link">
                            <div class="ds-avatar">
                                ${user.avatar ? 
                                    `<img src="${user.avatar}" alt="${user.username}">` : 
                                    user.username.charAt(0)
                                }
                            </div>
                            <div class="ds-user-info">
                                <div class="ds-username">${user.username}</div>
                                <div class="ds-user-handle">@${user.handle}</div>
                            </div>
                        </a>
                        <button class="ds-subscribe-btn ${user.isSubscribed ? 'ds-subscribed' : ''}" 
                                onclick="dsToggleSubscription(this, ${user.id})">
                            ${user.isSubscribed ? 'Подписан' : 'Подписаться'}
                        </button>
                    </div>
                `).join('');
            }
            else {
                alert(result.message); 
            }
            console.log('Результат:', result);

        } else {
            alert('Ошибка при получении данных: ' + response.status);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при получении данных');
    }
  
}
async function dsToggleSubscription(button, userId) {
    // Здесь будет AJAX запрос к серверу
    const user = dsSubscriptionsData.find(u => u.id === userId);

    try {
        const response = await fetch(`/api/subscribe/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                if(result.subscribed){
                    button.classList.add('ds-subscribed');
                    button.textContent = 'Подписан';
                    console.log(`Подписались на пользователя ${userId}`);

                }else{
                    button.classList.remove('ds-subscribed');
                    button.textContent = 'Подписаться';
                    console.log(`Отписались от пользователя ${userId}`);
                }
            }
            
            else {
                alert(result.message); 
            }
            console.log('Результат:', result);

        } else {
            alert('Ошибка при подписке. Вы точно авторизованы? ' + response.status);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при подписке');
    }


}
function dsOpenSubscriptionsModal(user_id, api_get) {
    const modal = document.getElementById('dsSubscriptionsModal');
    if(api_get === 'get_subscriptions_list'){
        modal.querySelector('.ds-modal-title').textContent = 'Подписки';
    }else{
        modal.querySelector('.ds-modal-title').textContent = 'Подписчики'
    }

    modal.style.display = 'flex';
    dsLoadSubscriptions(user_id, api_get);
}
function dsCloseSubscriptionsModal() {
    const modal = document.getElementById('dsSubscriptionsModal');
    modal.style.display = 'none';
}
// Закрытие модального окна при клике на затемненную область
document.getElementById('dsSubscriptionsModal').addEventListener('click', function(e) {
    if (e.target === this) {
        dsCloseSubscriptionsModal();
    }
});
// Закрытие по ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        dsCloseSubscriptionsModal();
    }
});
// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Можно предзагрузить данные при необходимости
});