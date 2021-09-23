/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.register(data, callback);
/*
    if (User.current()) {
      App.setState('user-logged');
    }
*/
//Получается App.setState('user-logged'); сделать только в функции User.register(), иначе срабатывает только со второго нажания на кнопку
    App.modals[this.element.closest(".modal").dataset.modalId].onClose();

  }
}