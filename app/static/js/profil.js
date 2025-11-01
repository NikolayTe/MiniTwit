
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

// Смена аватарки
document.querySelector('.avatar-upload-btn').addEventListener('click', function() {
    // alert('Функция смены аватара будет реализована позже');

    const file_input = document.createElement('input');
    file_input.type = 'file';
    file_input.accept = '.png,.jpg,.jpeg,.gif';
    file_input.style.display = 'none';

    document.body.appendChild(file_input);
    file_input.click()

    file_input.addEventListener('change', function(){
        if(file_input.files && file_input.files[0] ){
            const file = file_input.files[0];
            upload_avatar(file);
        }

    })

    document.body.removeChild(file_input);


});


async function upload_avatar(file) {
    const form_data = new FormData();
    form_data.append('avatar', file);

    try{
        const response = await fetch('/upload/avatar', {
            method: 'POST',
            body: form_data
        });

        if (response.ok){
            const result = await response.json();
            let avatar = document.querySelector('.avatar-section').querySelector('.avatar');
            let avatar_img = avatar.querySelector('img');

            avatar_img.src = result.avatar_url
            // alert('Аватар успешно загружен!')

        }else{
            alert('Ошибка при загрузке аватарки: ' + response.status);
        }

    }catch (error){
        console.error('Ошибка:', error);
        alert('Произошла ошибка при загрузке аватарки');
    }
}