"use strict";

/*
Класс Transaction наследуется от Entity и в основном пользуется его методами только для своего URL.
Управляет транзакциями пользователя. 
Имеет свойство URL со значением '/transaction'
*/
class Transaction extends Entity {
  static URL = "/transaction";
};


/*
/transaction:

Метод GET - account_id - вернет список транзакций по конкретному счету и success = true

Метод PUT - type, name, sum и account_id - вернет success = true, если в поле сумма было передано не число то вернет ошибку "Недопустимые символы в поле Сумма" и success = false

Метод DELETE - id - вернет success = true
*/
