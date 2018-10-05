
export const setLang = (state, lang) => {
  state.lang = lang
  localStorage.setItem('lang', lang)
}
