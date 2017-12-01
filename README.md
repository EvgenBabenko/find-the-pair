# find-the-pair

Игра "Find the Pair".
Поле из карт, изначально они скрыты (перевернуты) для пользователя, каждая из карт представлена в двух экземплярах. Цель игрока зачистить поле от карт. При клике на карту она открывается игроку, при клике на вторую она также открывается и если изображения на обеих картах совпадают то они исчезают, в противном случае через таймаут возвращаются в начальное положение.

Функционал который реализован:
- выбор размера поля(6 на 6, 8 на 8, 10 на 10, 12 на 12)
- выбор цветовой схемы оформления

Игра написана на чистом JavaScript без сторонних модулей

TODO list
- таймер в игре
- возможность поставить игру на паузу
- систему начисление очков за прохождение игры(основываясь на времени игры и количестве попыток найти комбинацию)
- возможность сохранения результата(имя, дата, очки) игры в local storage
- визуализация результатов в таблице рекордов(для каждого размера поля должна быть своя вкладка)
- css анимацию в момент переворачивания, удаление карт(в любое другое место в приложение, где будете считать уместным)