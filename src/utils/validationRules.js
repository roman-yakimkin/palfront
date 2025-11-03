export const validationRules = {
  required: (value) => !!value || 'Обязательное поле',
  email: (value) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Неверный формат email'
  },
  username: (value) => {
    const pattern = /^[a-zA-Z0-9_]{3,20}$/
    return pattern.test(value) || 'От 3 до 20 символов, только буквы, цифры и _'
  },
  passwordLength: (value) => value?.length >= 6 || 'Пароль должен быть не короче 6 символов',
  passwordsMatch: (password, passwordConfirm) =>
    password === passwordConfirm || 'Пароли не совпадают',
}
