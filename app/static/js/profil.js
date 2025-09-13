
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.profile-form').addEventListener('submit', async function(e) { // Добавили async
        e.preventDefault();

        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        console.log('Собранные данные:', data);

        try {
            const response = await fetch(`/api/${data.id}/edit_profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    alert('Данные сохранены успешно!'); 
                }
                else {
                    alert(result.message); 
                }
                console.log('Результат:', result);

            } else {
                alert('Ошибка при сохранении: ' + response.status);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при отправке данных');
        }
    }); // Убрали лишнюю закрывающую скобку и alert
});



document.querySelector('.cancel-btn').addEventListener('click', function() {
    if (confirm('Отменить изменения?')) {
        window.location.reload();
    }
});
document.querySelector('.avatar-upload-btn').addEventListener('click', function() {
    alert('Функция смены аватара будет реализована позже');
});
