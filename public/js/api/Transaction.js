"use strict";

/*
Класс Transaction наследуется от Entity и в основном пользуется его методами только для своего URL.
Управляет транзакциями пользователя. 
Имеет свойство URL со значением '/transaction'
*/
class Transaction extends Entity {
  static URL = "/transaction";
};